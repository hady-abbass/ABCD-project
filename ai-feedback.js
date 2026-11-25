// ai-feedback.js: sends the case to the AI and turns the answer into ABCDE steps.
// If the AI fails, a safe general plan is shown with the error code, so the problem can be found.

// Emergency number: uses config.js if it was changed, otherwise 123 (Egypt).
function emergencyNo() {
  const n = String(CONFIG.emergencyNumber || "").trim();
  return n && !n.startsWith("[") ? n : "123";
}

// The exact shape the AI must return. Gemini follows this schema, so the JSON stays valid.
const ABCDE_SECTION_SCHEMA = {
  type: "OBJECT",
  properties: {
    checks: { type: "ARRAY", items: { type: "STRING" } },
    actions: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["checks", "actions"]
};
const ABCDE_SCHEMA = {
  type: "OBJECT",
  properties: {
    triage: { type: "STRING", enum: ["immediate", "urgent", "delayed", "minor"] },
    summary: { type: "STRING" },
    A: ABCDE_SECTION_SCHEMA,
    B: ABCDE_SECTION_SCHEMA,
    C: ABCDE_SECTION_SCHEMA,
    D: ABCDE_SECTION_SCHEMA,
    E: ABCDE_SECTION_SCHEMA,
    notes: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["triage", "summary", "A", "B", "C", "D", "E", "notes"]
};

// Calls the AI. For Gemini it uses Google's own API, which works with the new AQ. keys.
// Other services (Groq, OpenRouter, your Cloudflare Worker) use the OpenAI format.
async function callAI(messages, options = {}) {
  const cfg = CONFIG.ai;
  const apiKey = (cfg.apiKey || "").trim();
  const hasDirectKey = apiKey !== "" && !apiKey.startsWith("PASTE_");
  const usesProxy = apiKey === ""; // empty key = your Worker holds the key
  if (!cfg.enabled || (!hasDirectKey && !usesProxy)) throw new Error("AI_DISABLED");

  if (cfg.endpoint.includes("generativelanguage.googleapis.com")) {
    if (!hasDirectKey) throw new Error("AI_DISABLED");
    return callGeminiNative(messages, apiKey, options.json === true);
  }

  const headers = { "Content-Type": "application/json" };
  if (hasDirectKey) headers.Authorization = `Bearer ${apiKey}`;
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: cfg.model,
      messages,
      max_tokens: Math.max(cfg.maxTokens || 0, 2000),
      temperature: cfg.temperature
    })
  });
  if (!res.ok) throw new Error(`AI_HTTP_${res.status}`);
  const data = await res.json();
  const choice = data.choices?.[0];
  const text = choice?.message?.content?.trim() ?? "";
  if (!text) throw new Error("AI_EMPTY_" + (choice?.finish_reason || "NONE"));
  return text;
}

// Remembers which model name worked, so later calls skip names that returned 404.
let workingModel = null;

// Gemini's native API. Keeps thinking minimal so answers come back fast.
async function callGeminiNative(messages, apiKey, wantJSON) {
  const cfg = CONFIG.ai;
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n");
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  const models = [...new Set([workingModel, "gemini-3.1-flash-lite", cfg.model, "gemini-3.6-flash"].filter(Boolean))];

  const makeBody = (model, withThinking) => {
    const generationConfig = {
      temperature: cfg.temperature,
      maxOutputTokens: Math.max(cfg.maxTokens || 0, 1500),
      ...(wantJSON ? { responseMimeType: "application/json", responseSchema: ABCDE_SCHEMA } : {})
    };
    if (withThinking) {
      generationConfig.thinkingConfig = model.startsWith("gemini-2.5")
        ? { thinkingBudget: 0 }
        : { thinkingLevel: "minimal" };
    }
    return JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig });
  };
  const send = (url, body, authHeaders) =>
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders }, body });

  let res = null;
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    let body = makeBody(model, true);
    res = await send(url, body, { "x-goog-api-key": apiKey });
    if (res.status === 400) {
      // This model may not accept the thinking setting, so retry without it.
      body = makeBody(model, false);
      res = await send(url, body, { "x-goog-api-key": apiKey });
    }
    if (res.status === 401 || res.status === 403) res = await send(url, body, { Authorization: `Bearer ${apiKey}` });
    if (res.status !== 404) {
      if (res.ok) workingModel = model;
      break; // 404 = this model name is not available, so try the next one
    }
  }
  if (!res.ok) throw new Error(`AI_HTTP_${res.status}`);

  const data = await res.json();
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts || []).map((p) => p.text || "").join("").trim();
  if (!text) throw new Error("AI_EMPTY_" + (cand?.finishReason || "NONE"));
  return text;
}

// Words that point to a dangerous case. Used only when the AI is not available.
const DANGER_WORDS = ["اختنق", "مختنق", "نزيف", "بينزف", "مش بيتنفس", "مش متنفس", "مش بيرد", "فاقد", "إغماء", "اغماء", "صدر", "choking", "choke", "bleed", "unconscious", "not breathing", "unresponsive", "chest pain", "stroke", "seizure", "fainted"];

// General safe plan, used when the AI is not available. Same shape as the AI answer.
const ABCDE_FALLBACK = {
  ar: {
    A: { checks: ["هل فيه حاجة في الفم أو الحلق بتسد الهوا؟"], actions: ["لو مش بيتكلم ولا بيسعل بقوة: اتصل بالإسعاف، واعمل 5 ضربات ظهر و5 ضغطات بطن بالتبادل."] },
    B: { checks: ["هل بيتنفس؟ شوف الصدر بيطلع وينزل.", "هل التنفس سريع أو بصعوبة؟"], actions: ["لو مش بيتنفس: اتصل بالإسعاف وابدأ الإنعاش القلبي الرئوي فورًا.", "لو بيتنفس: خليه في وضع مريح."] },
    C: { checks: ["هل فيه نزيف؟ فين؟", "هل الجلد بارد أو شاحب؟"], actions: ["اضغط على النزيف بقماشة نظيفة بقوة وباستمرار."] },
    D: { checks: ["هل الشخص واعي ويرد على الكلام؟"], actions: ["لو مش واعي وبيتنفس: حطه في وضعية الإفاقة (على جنبه)."] },
    E: { checks: ["هل فيه إصابات تانية؟", "هل جسمه بارد أو سخن جدًا؟"], actions: ["غطّيه لو برد، ومتحركوش لو في شك في إصابة الرقبة أو الضهر."] }
  },
  en: {
    A: { checks: ["Is anything in the mouth or throat blocking the airway?"], actions: ["If they cannot speak or cough forcefully: call an ambulance, then give 5 back blows and 5 abdominal thrusts alternately."] },
    B: { checks: ["Are they breathing? Watch the chest rise and fall.", "Is breathing fast or difficult?"], actions: ["If not breathing: call an ambulance and start CPR immediately.", "If breathing: keep them comfortable."] },
    C: { checks: ["Is there bleeding? Where?", "Is the skin cold or pale?"], actions: ["Press firmly and continuously on any bleeding with a clean cloth."] },
    D: { checks: ["Is the person awake and responding to speech?"], actions: ["If unresponsive but breathing: place them in the recovery position (on their side)."] },
    E: { checks: ["Are there other injuries?", "Is the body very cold or very hot?"], actions: ["Cover them if cold. Do not move them if a neck or back injury is possible."] }
  }
};

// Reads the JSON object in the AI answer. Removes code fences and trailing commas if they are there.
function parseJSON(text) {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("BAD_JSON");
  return JSON.parse(cleaned.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1"));
}

// Makes sure every field exists and has the right type before the page uses it.
function normalize(d) {
  const sec = (x) => ({
    checks: Array.isArray(x?.checks) ? x.checks.map(String) : [],
    actions: Array.isArray(x?.actions) ? x.actions.map(String) : []
  });
  return {
    triage: ["immediate", "urgent", "delayed", "minor"].includes(d.triage) ? d.triage : "urgent",
    summary: String(d.summary || ""),
    A: sec(d.A), B: sec(d.B), C: sec(d.C), D: sec(d.D), E: sec(d.E),
    notes: Array.isArray(d.notes) ? d.notes.map(String) : []
  };
}

// General plan with the error code, so the page is never empty.
function fallbackAnalysis(userText, code) {
  const lower = userText.toLowerCase();
  const danger = DANGER_WORDS.some((w) => lower.includes(w));
  return {
    ...ABCDE_FALLBACK[getLang()],
    triage: danger ? "immediate" : "urgent",
    summary: t(danger ? "fallbackDanger" : "fallbackSafe"),
    notes: [t("aiOff") + " [" + code + "]"]
  };
}

// Main entry: returns a result the page can show, from the AI or from the fallback.
async function analyzeCase(userText) {
  const started = Date.now();
  const replyIn = getLang() === "ar" ? "simple Arabic (Egyptian dialect is fine)" : "simple English";
  const knowledge = SCENARIOS.map((s) => `- ${s.title}: ${s.keyPoint}`).join("\n");
  try {
    const raw = await callAI([
      {
        role: "system",
        content: `You are an emergency first-aid assistant on a training website. Follow the ABCDE order (Airway, Breathing, Circulation, Disability, Exposure) and use the knowledge base below plus standard first-aid principles. Reply with ONLY a JSON object, no markdown and no extra text, with these keys: "triage" (one of "immediate", "urgent", "delayed", "minor"), "summary" (1-2 short sentences), "A", "B", "C", "D", "E" (each an object with "checks" and "actions" arrays of short strings), and "notes" (array of short strings). Write every string in ${replyIn}. If the case could be life-threatening, set triage to "immediate" and tell the user to call the emergency number ${emergencyNo()}. Never diagnose and never give medication doses. Keep it short: at most 2 checks and 2 actions per section, each under 15 words, one-sentence summary, at most 1 note. Use ONLY the facts written in the user's description. Do not invent injuries, amputations, or symptoms that are not written there. A cut (جرح) is not an amputation unless the text clearly says a body part was completely cut off. A shallow cut with light bleeding that stops with pressure is triage \"minor\": give first-aid steps only, and do not tell them to call an ambulance. Call an ambulance only for real danger signs: heavy or uncontrolled bleeding, no breathing, unresponsive, chest pain, severe breathing difficulty, or a major injury.\n\nKnowledge base:\n${knowledge}`
      },
      { role: "user", content: userText }
    ], { json: true });
    const result = normalize(parseJSON(raw));
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    result.notes.push((getLang() === "ar" ? "وقت الرد: " : "Response time: ") + secs + "s");
    return result;
  } catch (err) {
    console.warn("AI analysis unavailable:", err.message);
    return fallbackAnalysis(userText, err.message);
  }
}
