// ai-feedback.js: detailed video-style step-by-step first-aid instructions + 8s timeout + ABCDE analysis.

function emergencyNo() {
  const n = typeof CONFIG !== "undefined" ? String(CONFIG.emergencyNumber || "").trim() : "123";
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
    steps: { type: "ARRAY", items: { type: "STRING" } },
    A: ABCDE_SECTION_SCHEMA,
    B: ABCDE_SECTION_SCHEMA,
    C: ABCDE_SECTION_SCHEMA,
    D: ABCDE_SECTION_SCHEMA,
    E: ABCDE_SECTION_SCHEMA,
    notes: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["triage", "summary", "steps", "A", "B", "C", "D", "E", "notes"]
};

async function callAI(messages, options) {
  const cfg = CONFIG.ai;
  const apiKey = (cfg.apiKey || "").trim();
  const hasDirectKey = apiKey !== "" && !apiKey.startsWith("PASTE_");
  const usesProxy = apiKey === "";
  if (!cfg.enabled || (!hasDirectKey && !usesProxy)) throw new Error("AI_DISABLED");

  if (cfg.endpoint.includes("generativelanguage.googleapis.com")) {
    if (!hasDirectKey) throw new Error("AI_DISABLED");
    return callGeminiNative(messages, apiKey, options && options.json === true);
  }

  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, 8000);

  try {
    const headers = { "Content-Type": "application/json" };
    if (hasDirectKey) headers.Authorization = "Bearer " + apiKey;
    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers: headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: cfg.model,
        messages: messages,
        max_tokens: Math.min(cfg.maxTokens || 1800, 1800),
        temperature: 0.3
      })
    });
    if (!res.ok) throw new Error("AI_HTTP_" + res.status);
    const data = await res.json();
    const choice = data.choices && data.choices[0];
    const text = (choice && choice.message && choice.message.content ? choice.message.content : "").trim();
    if (!text) throw new Error("AI_EMPTY_" + ((choice && choice.finish_reason) || "NONE"));
    return text;
  } finally {
    clearTimeout(timer);
  }
}

let workingModel = null;

async function callGeminiNative(messages, apiKey, wantJSON) {
  const cfg = CONFIG.ai;
  const system = messages.filter(function (m) { return m.role === "system"; }).map(function (m) { return m.content; }).join("\n");
  const contents = messages
    .filter(function (m) { return m.role !== "system"; })
    .map(function (m) { return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }; });
  const models = [workingModel, "gemini-3.1-flash-lite", cfg.model, "gemini-3.6-flash"].filter(Boolean);

  function makeBody(model, withThinking) {
    const generationConfig = Object.assign(
      { temperature: 0.3, maxOutputTokens: 1800 },
      wantJSON ? { responseMimeType: "application/json", responseSchema: ABCDE_SCHEMA } : {}
    );
    if (withThinking) {
      generationConfig.thinkingConfig = model.startsWith("gemini-2.5")
        ? { thinkingBudget: 0 }
        : { thinkingLevel: "minimal" };
    }
    return JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: contents, generationConfig: generationConfig });
  }

  function send(url, body, authHeaders) {
    return fetch(url, { method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, authHeaders), body: body });
  }

  let res = null;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const url = "https:/" + "/generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent";
    let body = makeBody(model, true);
    res = await send(url, body, { "x-goog-api-key": apiKey });
    if (res.status === 400) {
      body = makeBody(model, false);
      res = await send(url, body, { "x-goog-api-key": apiKey });
    }
    if (res.status === 401 || res.status === 403) res = await send(url, body, { Authorization: "Bearer " + apiKey });
    if (res.status !== 404) {
      if (res.ok) workingModel = model;
      break;
    }
  }
  if (!res || !res.ok) throw new Error("AI_HTTP_" + (res ? res.status : "ERR"));

  const data = await res.json();
  const cand = data.candidates && data.candidates[0];
  const text = ((cand && cand.content && cand.content.parts) || []).map(function (p) { return p.text || ""; }).join("").trim();
  if (!text) throw new Error("AI_EMPTY_" + ((cand && cand.finishReason) || "NONE"));
  return text;
}

const DETAILED_GUIDES = {
  choking: {
    keys: ["اختناق", "شرق", "بلع", "مجرى الهواء", "choking", "heimlich", "airway"],
    ar: {
      summary: "انسداد مجرى الهواء حالة حرجة تهدد الحياة خلال دقائق وتحتاج لتدخّل فوري لطرد الجسم الغريب.",
      steps: [
        "قيّم الحالة بسرعة: اسأل المصاب (هل تختنق؟) — إذا كان يسعل بقوة شجّعه على الاستمرار في السعال، أما إذا عجز عن الكلام أو التنفس أو أمسك رقبته فابدأ التدخل فوراً.",
        "وجّه 5 ضربات ظهرية قوية: قف بجانب المصاب وخلفه قليلاً، اسند صدره بيد واحدة وأمِله للأمام، ثم اضرب 5 ضربات حادة بكعب يدك الأخرى في منتصف الظهر بين لوحي الكتف.",
        "افحص الفم بعد كل ضربة: انظر إذا خرج الجسم الغريب أم لا قبل الانتقال للخطوة التالية.",
        "نفّذ 5 ضغطات بطنية (مناورة هيمليك): قف خلف المصاب ولف ذراعيك حول خصره، أغلق قبضة يدك وضع جهة الإبهام فوق السرة وتحت عظمة القص مباشرة.",
        "اسحب بقوة للداخل ولأعلى: أمسك قبضتك بيدك الأخرى واضغط 5 ضغطات سريعة وحادة للداخل ولأعلى كأنك ترفع المصاب.",
        "استمر بالتبادل: كرّر دورة (5 ضربات ظهر + 5 ضغطات بطن) بالتناوب حتى يخرج الجسم الغريب أو يصل الإسعاف.",
        "إذا فقد المصاب وعيه: أنزله برفق على الأرض، اطلب الإسعاف فوراً، وابدأ الإنعاش القلبي الرئوي (30 ضغطة صدرية ثم افحص الفم قبل إعطاء النفسين)."
      ],
      A: {
        checks: ["تأكد من قدرة المصاب على الكلام أو السعال أو التنفس، وافحص الفم عند سقوطه."],
        actions: ["بادل بين 5 ضربات بين لوحي الكتف و5 ضغطات بطنية أعلى السرة (مناورة هيمليك)."]
      }
    },
    en: {
      summary: "Complete airway obstruction is life-threatening and requires immediate back blows and abdominal thrusts.",
      steps: [
        "Assess severity immediately: Ask 'Are you choking?' If they can cough forcefully, encourage coughing. If they cannot speak, cough, or breathe, intervene right away.",
        "Deliver 5 sharp back blows: Stand to the side and slightly behind the person, support their chest with one hand, lean them forward, and strike firmly between the shoulder blades with the heel of your hand.",
        "Check if the object cleared after each blow before moving to abdominal thrusts.",
        "Perform 5 abdominal thrusts (Heimlich maneuver): Stand behind the person, wrap your arms around their waist, make a fist with one hand, and place the thumb side just above the navel and well below the breastbone.",
        "Pull sharply inward and upward: Grasp your fist with your other hand and deliver 5 quick inward-and-upward thrusts.",
        "Alternate continuously: Repeat cycles of 5 back blows and 5 abdominal thrusts until the object is expelled.",
        "If the person becomes unresponsive: Lower them safely to the floor, call EMS immediately, and start CPR (30 chest compressions, checking the mouth before rescue breaths)."
      ],
      A: {
        checks: ["Check if the person can speak or cough, and inspect the mouth if they collapse."],
        actions: ["Alternate 5 firm back blows with 5 inward-and-upward abdominal thrusts."]
      }
    }
  },
  bleeding: {
    keys: ["نزيف", "قطع", "جرح", "دم", "صباع", "bleeding", "cut", "wound", "circulation"],
    ar: {
      summary: "السيطرة الفورية على النزيف بالضغط المباشر والم
