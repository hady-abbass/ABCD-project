// ai-feedback.js: always returns clear actionable "what to do" steps + matches input language.

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
    A: ABCDE_SECTION_SCHEMA,
    B: ABCDE_SECTION_SCHEMA,
    C: ABCDE_SECTION_SCHEMA,
    D: ABCDE_SECTION_SCHEMA,
    E: ABCDE_SECTION_SCHEMA,
    notes: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["triage", "summary", "A", "B", "C", "D", "E", "notes"]
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

  const headers = { "Content-Type": "application/json" };
  if (hasDirectKey) headers.Authorization = "Bearer " + apiKey;
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: cfg.model,
      messages: messages,
      max_tokens: Math.min(cfg.maxTokens || 1400, 1400),
      temperature: 0.3
    })
  });
  if (!res.ok) throw new Error("AI_HTTP_" + res.status);
  const data = await res.json();
  const choice = data.choices && data.choices[0];
  const text = (choice && choice.message && choice.message.content ? choice.message.content : "").trim();
  if (!text) throw new Error("AI_EMPTY_" + ((choice && choice.finish_reason) || "NONE"));
  return text;
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
      { temperature: 0.3, maxOutputTokens: 1400 },
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

// خطوات إسعافية جاهزة ومفصلة لكل حالة لضمان عدم ظهور الفيديو وحده أبداً
const CONDITION_GUIDES = {
  choking: {
    keys: ["اختناق", "شرق", "بلع", "مجرى الهواء", "choking", "heimlich", "airway"],
    ar: {
      summary: "انسداد مجرى الهواء حالة حرجة تتطلب تدخلاً فورياً لطرد الجسم الغريب.",
      A: {
        checks: ["اسأل المصاب: هل تختنق؟ ولاحظ عجزه عن الكلام أو السعال."],
        actions: [
          "قف خلف المصاب وأمِله للأمام، واضرب 5 ضربات قوية بكعب اليد بين لوحي الكتف.",
          "إذا لم يخرج الجسم الغريب: لف ذراعيك حول خصره، ضع قبضة يدك فوق السرة، واضغط 5 ضغطات سريعة للداخل ولأعلى (مناورة هيمليك).",
          "استمر بالتبادل (5 ضربات ظهر + 5 ضغطات بطن) حتى يخرج الجسم أو يصل الإسعاف.",
          "إذا فقد المصاب وعيه: أنزله برفق على الأرض وابدأ الإنعاش القلبي الرئوي (CPR) فوراً."
        ]
      }
    },
    en: {
      summary: "Airway obstruction requires immediate action to expel the trapped object.",
      A: {
        checks: ["Ask 'Are you choking?' and check if the person cannot speak, cough, or breathe."],
        actions: [
          "Stand behind the person, lean them forward, and give 5 sharp back blows between the shoulder blades.",
          "If still choking: wrap arms around their waist, place a fist just above the navel, and give 5 quick inward-and-upward abdominal thrusts.",
          "Alternate 5 back blows and 5 abdominal thrusts until the airway clears.",
          "If they become unresponsive, lower them to the ground and start CPR immediately."
        ]
      }
    }
  },
  bleeding: {
    keys: ["نزيف", "قطع", "جرح", "دم", "صباع", "bleeding", "cut", "wound", "circulation"],
    ar: {
      summary: "السيطرة السريعة على النزيف بالضغط المباشر تمنع الصدمة وتنقذ الحياة.",
      C: {
        checks: ["حدد مصدر النزيف وتأكد من عدم وجود جسم حاد مغروس داخل الجرح."],
        actions: [
          "اضغط بقوة مباشرة على الجرح باستخدام شاش معقم أو قطعة قماش نظيفة لمدة 10 دقائق متواصلة.",
          "ارفع الطرف المصاب فوق مستوى القلب إن أمكن لتقليل تدفق الدم.",
          "إذا تشبّع الشاش بالدم، لا تنزعه؛ ضع طبقة شاش أخرى فوقه واربطه بضمادة ضاغطة.",
          "إذا كان هناك جسم مغروس في الجرح، لا تسحبه واضغط حول حوافه فقط."
        ]
      }
    },
    en: {
      summary: "Immediate firm direct pressure is critical to stop severe blood loss.",
      C: {
        checks: ["Locate the bleeding source and check if any sharp object is embedded in the wound."],
        actions: [
          "Apply firm, continuous direct pressure over the wound with sterile gauze or a clean cloth for at least 10 minutes.",
          "Elevate the injured limb above heart level if no fracture is suspected.",
          "If blood soaks through, do NOT remove the first cloth; place another dressing on top and wrap firmly.",
          "If an object is embedded, leave it in place and apply pressure around the edges."
        ]
      }
    }
  },
  unresponsive: {
    keys: ["إغماء", "فاقد", "غيبوبة", "الإفاقة", "وقع", "unconscious", "unresponsive", "faint", "recovery"],
    ar: {
      summary: "المصاب فاقد للوعي لكنه يتنفس؛ الأولوية لحماية مجرى الهواء بوضعية الإفاقة.",
      A: {
        checks: ["تأكد أن مجرى الهواء مفتوح ولا يوجد شيء في الفم."],
        actions: ["أمل الرأس للخلف برفق وارفع الذقن لفتح مجرى الهواء ومنع رجوع اللسان."]
      },
      D: {
        checks: ["نادِ المصاب بصوت عالٍ وهز كتفيه برفق للتأكد من عدم الاستجابة، وراقب تنفسه لمدة 10 ثوانٍ."],
        actions: [
          "اقلب المصاب برفق على جانبه (وضعية الإفاقة) مع ثني الركبة العلوية لتثبيته.",
          "أمل رأسه للخلف قليلاً ووجه فمه للأسفل لتصريف أي سوائل ومنع الاختناق.",
          "راقب تنفسه كل دقيقة وغطِّه للحفاظ على دفء جسمه حتى وصول الإسعاف."
        ]
      }
    },
    en: {
      summary: "The person is unresponsive but breathing; protect the airway using the recovery position.",
      A: {
        checks: ["Ensure the mouth and airway are clear of obstructions."],
        actions: ["Gently tilt the head back and lift the chin to keep the airway open."]
      },
      D: {
        checks: ["Tap shoulders and shout to confirm unresponsiveness, and check normal breathing for 10 seconds."],
        actions: [
          "Roll the person onto their side into the recovery position, bending the top knee for stability.",
          "Tilt the head slightly back with the mouth angled downward so fluids can drain.",
          "Re-check breathing every minute and keep them warm until EMS arrives."
        ]
      }
    }
  },
  cpr: {
    keys: ["قلب", "نبض", "تنفس", "إنعاش", "توقف", "cpr", "cardiac", "pulse", "breathing"],
    ar: {
      summary: "توقف القلب والتنفس يتطلب بدء الإنعاش القلبي الرئوي (CPR) فوراً دون تأخير.",
      A: {
        checks: ["افحص استجابة المصاب وتأكد من فتح مجرى الهواء بإمالة الرأس ورفع الذقن."],
        actions: ["ضع المصاب مستلقياً على ظهره على سطح صلب ومستوٍ."]
      },
      B: {
        checks: ["راقب حركة الصدر لمدة 10 ثوانٍ للتأكد من غياب التنفس الطبيعي."],
        actions: ["بعد كل 30 ضغطة صدرية، أغلق أنف المصاب وأعطه نفسين إنقاذيين (ثانية لكل نفس) مع مراقبة ارتفاع الصدر."]
      },
      C: {
        checks: ["لا تُضِع وقتاً طويلاً في البحث عن النبض إذا لم يكن هناك تنفس طبيعي."],
        actions: [
          "ضع كعب يدك في منتصف الصدر (النصف السفلي لعظمة القص) واشبك اليد الأخرى فوقها.",
          "اضغط بقوة وبسرعة بمعدل 100 إلى 120 ضغطة في الدقيقة وبعمق 5 إلى 6 سم.",
          "استمر بدورات (30 ضغطة + نفسان) دون توقف حتى وصول الإسعاف أو عودة التنفس."
        ]
      }
    },
    en: {
      summary: "Cardiac arrest requires immediate, uninterrupted CPR until emergency services arrive.",
      A: {
        checks: ["Check responsiveness and open the airway using head-tilt, chin-lift."],
        actions: ["Lay the person flat on their back on a firm surface."]
      },
      B: {
        checks: ["Look, listen, and feel for normal breathing for no more than 10 seconds."],
        actions: ["After every 30 chest compressions, pinch the nose and give 2 rescue breaths (1 second each) watching the chest rise."]
      },
      C: {
        checks: ["Start compressions immediately if the person is unresponsive and not breathing normally."],
        actions: [
          "Place the heel of one hand on the center of the chest and interlock your other hand on top.",
          "Push hard and fast at 100–120 compressions per minute, 5–6 cm deep.",
          "Continue cycles of 30 compressions and 2 breaths until EMS takes over or the person breathes."
        ]
      }
    }
  },
  burns: {
    keys: ["حرق", "حروق", "مية مغلية", "نار", "فقاعات", "burn", "burns", "scald"],
    ar: {
      summary: "تبريد الحرق بالماء الجاري الفاتر فوراً يوقف تلف الأنسجة ويخفف الألم.",
      E: {
        checks: ["قيّم مساحة الحرق وتأكد من ابتعاد المصاب عن مصدر الحرارة أو الكهرباء."],
        actions: [
          "ضع مكان الحرق تحت ماء جارٍ فاتر (غير مثلج) لمدة 20 دقيقة كاملة.",
          "انزع الخواتم أو الساعات أو الملابس غير الملتصقة قبل حدوث تورم.",
          "غطِّ الحرق برفق بشاش معقم غير لاصق أو بلاستيك تغليف نظيف.",
          "تجنب تماماً وضع الثلج، معجون الأسنان، الزبدة، أو فتح الفقاعات."
        ]
      }
    },
    en: {
      summary: "Immediate cooling with cool running water stops tissue damage and eases pain.",
      E: {
        checks: ["Ensure the scene is safe and check the size and depth of the burn."],
        actions: [
          "Cool the burn under cool (not ice-cold) running tap water for 20 full minutes.",
          "Gently remove rings, watches, or loose clothing near the burn before swelling starts.",
          "Cover loosely with sterile non-stick gauze or clean plastic cling film.",
          "Never apply ice, butter, toothpaste, or pop blisters."
        ]
      }
    }
  }
};

function getConditionGuide(userText) {
  const lower = String(userText || "").toLowerCase();
  const isAr = isArabicText(userText);
  const keys = Object.keys(CONDITION_GUIDES);
  for (let i = 0; i < keys.length; i++) {
    const item = CONDITION_GUIDES[keys[i]];
    if (item.keys.some(function (k) { return lower.includes(k); })) {
      return isAr ? item.ar : item.en;
    }
  }
  return null;
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
  function sec(x) {
    return {
      checks: Array.isArray(x && x.checks) ? x.checks.map(String).filter(Boolean) : [],
      actions: Array.isArray(x && x.actions) ? x.actions.map(String).filter(Boolean) : []
    };
  }
  return {
    triage: ["immediate", "urgent", "delayed", "minor"].includes(d.triage) ? d.triage : "urgent",
    summary: String(d.summary || ""),
    A: sec(d.A), B: sec(d.B), C: sec(d.C), D: sec(d.D), E: sec(d.E),
    notes: Array.isArray(d.notes) ? d.notes.map(String).filter(Boolean) : []
  };
}

function hasAnySteps(result) {
  return ["A", "B", "C", "D", "E"].some(function (l) {
    return result[l] && (result[l].checks.length > 0 || result[l].actions.length > 0);
  });
}

function applyConditionStepsIfNeeded(result, userText) {
  const guide = getConditionGuide(userText);
  if (!guide) {
    if (!hasAnySteps(result)) {
      const langKey = isArabicText(userText) ? "ar" : "en";
      Object.assign(result, ABCDE_FALLBACK[langKey]);
    }
    return result;
  }
  if (!result.summary) result.summary = guide.summary;
  if (!hasAnySteps(result)) {
    ["A", "B", "C", "D", "E"].forEach(function (l) {
      if (guide[l]) {
        result[l] = {
          checks: (guide[l].checks || []).slice(),
          actions: (guide[l].actions || []).slice()
        };
      }
    });
  }
  return result;
}

function fallbackAnalysis(userText, code) {
  const lower = userText.toLowerCase();
  const danger = DANGER_WORDS.some(function (w) { return lower.includes(w); });
  const langKey = isArabicText(userText) ? "ar" : "en";
  const base = {
    triage: danger ? "immediate" : "urgent",
    summary: "",
    A: { checks: [], actions: [] },
    B: { checks: [], actions: [] },
    C: { checks: [], actions: [] },
    D: { checks: [], actions: [] },
    E: { checks: [], actions: [] },
    notes: []
  };
  applyConditionStepsIfNeeded(base, userText);
  if (!base.summary && typeof t === "function") {
    base.summary = t(danger ? "fallbackDanger" : "fallbackSafe");
  }
  return base;
}

async function analyzeCase(userText) {
  const started = Date.now();
  const inputIsAr = isArabicText(userText);
  const replyIn = inputIsAr ? "clear, practical Egyptian Arabic ONLY" : "clear, practical English ONLY";
  const knowledge = typeof SCENARIOS !== "undefined"
    ? SCENARIOS.map(function (s) { return "- " + s.title + ": " + s.keyPoint; }).join("\n")
    : "";

  try {
    const raw = await callAI([
      {
        role: "system",
        content: "You are an emergency first-aid instructor. Reply with ONLY a valid JSON object (no markdown) with keys: \"triage\" (\"immediate\"|\"urgent\"|\"delayed\"|\"minor\"), \"summary\" (1-2 clear sentences stating the immediate priority), \"A\", \"B\", \"C\", \"D\", \"E\" (each having \"checks\" and \"actions\" arrays), and \"notes\" (array).\n" +
          "CRITICAL RULES:\n" +
          "1. Write ALL string values strictly in " + replyIn + ". Match the user's input language.\n" +
          "2. ALWAYS answer 'what to do' clearly: fill the relevant ABCDE letter(s) with 3 to 4 concrete, step-by-step 'actions' telling the rescuer exactly how to act right now. NEVER leave all ABCDE arrays empty!\n" +
          "3. Keep steps focused directly on the user's exact problem without unrelated filler.\n" +
          "4. Call emergency number " + emergencyNo() + " if life-threatening.\n\n" +
          "Knowledge base:\n" + knowledge
      },
      { role: "user", content: userText }
    ], { json: true });

    const result = applyConditionStepsIfNeeded(normalize(parseJSON(raw)), userText);
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    result.notes.push((inputIsAr ? "وقت التحليل: " : "Response time: ") + secs + "s");
    return result;
  } catch (err) {
    console.warn("AI analysis fallback:", err.message);
    return fallbackAnalysis(userText, err.message);
  }
}
