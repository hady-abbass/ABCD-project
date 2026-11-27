// ai-feedback.js: concise problem-specific ABCDE analysis + input-language detection.

function emergencyNo() {
  const n = String(CONFIG.emergencyNumber || "").trim();
  return n && !n.startsWith("[") ? n : "123";
}

function isArabicText(text) {
  return /[\u0600-\u06FF]/.test(String(text || ""));
}

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

async function callAI(messages, options = {}) {
  const cfg = CONFIG.ai;
  const apiKey = (cfg.apiKey || "").trim();
  const hasDirectKey = apiKey !== "" && !apiKey.startsWith("PASTE_");
  const usesProxy = apiKey === "";
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
      max_tokens: Math.min(cfg.maxTokens || 1200, 1200),
      temperature: 0.3
    })
  });
  if (!res.ok) throw new Error(`AI_HTTP_${res.status}`);
  const data = await res.json();
  const choice = data.choices?.[0];
  const text = choice?.message?.content?.trim() ?? "";
  if (!text) throw new Error("AI_EMPTY_" + (choice?.finish_reason || "NONE"));
  return text;
}

let workingModel = null;

async function callGeminiNative(messages, apiKey, wantJSON) {
  const cfg = CONFIG.ai;
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n");
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  const models = [...new Set([workingModel, "gemini-3.1-flash-lite", cfg.model, "gemini-3.6-flash"].filter(Boolean))];

  const makeBody = (model, withThinking) => {
    const generationConfig = {
      temperature: 0.3,
      maxOutputTokens: 1200,
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
      body = makeBody(model, false);
      res = await send(url, body, { "x-goog-api-key": apiKey });
    }
    if (res.status === 401 || res.status === 403) res = await send(url, body, { Authorization: `Bearer ${apiKey}` });
    if (res.status !== 404) {
      if (res.ok) workingModel = model;
      break;
    }
  }
  if (!res.ok) throw new Error(`AI_HTTP_${res.status}`);

  const data = await res.json();
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts || []).map((p) => p.text || "").join("").trim();
  if (!text) throw new Error("AI_EMPTY_" + (cand?.finishReason || "NONE"));
  return text;
}

const DANGER_WORDS = ["اختنق", "مختنق", "نزيف", "بينزف", "مش بيتنفس", "مش متنفس", "مش بيرد", "فاقد", "إغماء", "اغماء", "صدر", "choking", "choke", "bleed", "unconscious", "not breathing", "unresponsive", "chest pain", "stroke", "seizure", "fainted"];

const ABCDE_FALLBACK = {
  ar: {
    A: { checks: ["تأكد أن مجرى الهواء مفتوح."], actions: ["لو مختنق: 5 ضربات ظهر و5 ضغطات بطن."] },
    B: { checks: ["راقب حركة الصدر والتنفس."], actions: ["لو لا يتنفس: ابدأ الإنعاش القلبي CPR فوراً."] },
    C: { checks: ["ابحث عن أي نزيف ظاهر."], actions: ["اضغط بقوة على الجرح بقماشة نظيفة."] },
    D: { checks: ["اختبر استجابة المصاب لصوتك."], actions: ["لو فاقد الوعي ويتنفس: ضعه في وضعية الإفاقة."] },
    E: { checks: ["تفقد الإصابات الأخرى."], actions: ["غطّ المصاب لتدفئته ولا تحركه إذا شكت بإصابة عمود فقري."] }
  },
  en: {
    A: { checks: ["Ensure the airway is clear."], actions: ["If choking: alternate 5 back blows and 5 abdominal thrusts."] },
    B: { checks: ["Watch chest rise and breathing."], actions: ["If not breathing: start CPR immediately."] },
    C: { checks: ["Check for visible bleeding."], actions: ["Apply firm direct pressure with a clean cloth."] },
    D: { checks: ["Check responsiveness to voice."], actions: ["If unresponsive but breathing: place in recovery position."] },
    E: { checks: ["Check for other injuries."], actions: ["Keep warm and avoid moving if spine injury is suspected."] }
  }
};

function parseJSON(text) {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("BAD_JSON");
  return JSON.parse(cleaned.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1"));
}

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

function fallbackAnalysis(userText, code) {
  const lower = userText.toLowerCase();
  const danger = DANGER_WORDS.some((w) => lower.includes(w));
  const langKey = isArabicText(userText) ? "ar" : "en";
  return {
    ...ABCDE_FALLBACK[langKey],
    triage: danger ? "immediate" : "urgent",
    summary: t(danger ? "fallbackDanger" : "fallbackSafe"),
    notes: [t("aiOff") + " [" + code + "]"]
  };
}

async function analyzeCase(userText) {
  const started = Date.now();
  const inputIsAr = isArabicText(userText);
  const replyIn = inputIsAr ? "clear, concise Egyptian Arabic ONLY" : "clear, concise English ONLY";
  const knowledge = SCENARIOS.map((s) => `- ${s.title}: ${s.keyPoint}`).join("\n");

  try {
    const raw = await callAI([
      {
        role: "system",
        content: `You are an emergency first-aid assistant. Reply with ONLY a valid JSON object (no markdown) with keys: "triage" ("immediate"|"urgent"|"delayed"|"minor"), "summary" (1 concise sentence), "A", "B", "C", "D", "E" (each having "checks" and "actions" arrays), and "notes" (array).
CRITICAL RULES:
1. Write ALL string values strictly in ${replyIn}. Ignore UI language; match the user's input language.
2. Keep the answer STRICTLY concise and focused ONLY on the exact problem described by the user. Do NOT add generic filler or unrelated steps. Put empty arrays [] for ABCDE letters not directly relevant, or 1 ultra-short point (max 12 words) per check/action.
3. Call emergency number ${emergencyNo()} ONLY if life-threatening (heavy bleeding, choking, unresponsive, no breathing, chest pain).
4. Never invent symptoms or injuries not stated in the user's text.

Knowledge base:\n${knowledge}`
      },
      { role: "user", content: userText }
    ], { json: true });

    const result = normalize(parseJSON(raw));
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    result.notes.push((inputIsAr ? "وقت الرد: " : "Response time: ") + secs + "s");
    return result;
  } catch (err) {
    console.warn("AI analysis unavailable:", err.message);
    return fallbackAnalysis(userText, err.message);
  }
}
