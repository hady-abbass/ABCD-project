// ai-feedback.js: detailed video-style step-by-step first-aid instructions + ABCDE analysis.

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

  const headers = { "Content-Type": "application/json" };
  if (hasDirectKey) headers.Authorization = "Bearer " + apiKey;
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: headers,
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

// خطوات عملية مفصلة لكل حالة (بنفس ترتيب وتفاصيل الفيديوهات التدريبية)
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
      summary: "السيطرة الفورية على النزيف بالضغط المباشر والمستمر تمنع الصدمة النزيفية وتنقذ حياة المصاب.",
      steps: [
        "أمّن نفسك والمكان: ارتدِ قفازات طبية إن توفرت أو استخدم كيساً بلاستيكياً نظيفاً كحاجز، واجعل المصاب يستلقي أو يجلس لتجنب سقوطه إذا شعر بدوخة.",
        "اكشف مكان الجرح: أبعد الملابس المحيطة بالجرح برفق لرؤية مصدر النزيف بوضوح والتأكد من عدم وجود زجاج أو جسم حاد مغروس.",
        "اضغط مباشرة وبقوة: ضع شاشاً معقماً أو قطعة قماش نظيفة سميكة فوق الجرح مباشرة، واضغط بكلتا يديك بوزن جسمك ضغطاً متواصلاً لمدة 10 دقائق كاملة دون رفع يدك.",
        "ارفع الطرف المصاب: إذا كان الجرح في الذراع أو الساق ولا يوجد اشتباه في كسر، ارفع الطرف المصاب فوق مستوى القلب أثناء استمرار الضغط.",
        "أضف طبقات ولا تنزع الشاش: إذا تشبّع الشاش بالدم، لا تنزعه أبداً حتى لا تفسد التجلط؛ ضع قطعة شاش أخرى فوقه وأكمل الضغط.",
        "ثبّت بضمادة ضاغطة: بعد توقف النزيف، لف رباطاً ضاغطاً بإحكام فوق الشاش مع التأكد من وجود نبض ودفء في أطراف الأصابع.",
        "تحذير مهم: إذا كان هناك جسم حاد مغروس داخل الجرح، لا تسحبه أبداً؛ ضع شاشاً حول حوافه واضغط من الجانبين فقط واطلب الإسعاف."
      ],
      C: {
        checks: ["حدد مصدر النزيف، افحص وجود جسم غريب مغروس، وراقب شحوب الجلد أو برودة الأطراف."],
        actions: ["اضغط بقوة مباشرة بشاش معقم لمدة 10 دقائق، ارفع الطرف المصاب، ولا تنزع الشاش المشبع بالدم."]
      }
    },
    en: {
      summary: "Immediate, firm direct pressure stops severe blood loss and prevents life-threatening shock.",
      steps: [
        "Ensure safety and protect yourself: Put on disposable gloves if available and have the injured person lie down to prevent fainting.",
        "Expose the wound: Gently remove or cut away clothing around the injury to see the exact bleeding point and check for embedded objects.",
        "Apply firm, continuous direct pressure: Place sterile gauze or a clean folded cloth directly over the wound and press down firmly with both hands for at least 10 uninterrupted minutes.",
        "Elevate the injured limb: If the bleeding is on an arm or leg and no fracture is suspected, raise it above heart level while maintaining pressure.",
        "Layer dressings—never remove the first cloth: If blood soaks through, place a fresh pad directly on top of the soaked one so you do not disturb clotting.",
        "Secure with a pressure bandage: Once bleeding slows, wrap a bandage firmly over the dressing while checking that fingers or toes stay warm.",
        "Embedded object warning: If glass or metal is stuck in the wound, do NOT pull it out; build padding around its edges and apply pressure on either side."
      ],
      C: {
        checks: ["Locate the bleeding source, check for embedded objects, and watch for pale, clammy skin."],
        actions: ["Apply firm direct pressure for 10 minutes, elevate the limb, and layer extra dressings instead of removing soaked ones."]
      }
    }
  },
  unresponsive: {
    keys: ["إغماء", "فاقد", "غيبوبة", "الإفاقة", "وقع", "unconscious", "unresponsive", "faint", "recovery"],
    ar: {
      summary: "المصاب فاقد للوعي لكنه يتنفس؛ وضعيته على جانبه (وضعية الإفاقة) تحمي مجرى الهواء من الانسداد باللسان أو القيء.",
      steps: [
        "افحص استجابة المصاب (AVPU): هز كتفيه برفق ونادِه بصوت عالٍ (هل تسمعني؟) — إذا لم يستجب لأي صوت أو لمس اطلب من شخص قريب الاتصال بالإسعاف فوراً.",
        "افتح مجرى الهواء: ضع يداً على جبهة المصاب وأصابع اليد الأخرى تحت ذقنه، وأمِل الرأس للخلف برفق لرفع اللسان بعيداً عن الحلق.",
        "افحص التنفس لمدة 10 ثوانٍ: قرّب أذنك وخدك من فم المصاب وأنفِه وانظر إلى صدره؛ اسمع صوت التنفس واشعر به وراقب ارتفاع الصدر.",
        "جهّز المصاب لوضعية الإفاقة: اجلس بجانبه، افرد ذراعه القريبة منك بزاوية قائمة مع جسمه وكف يده للأعلى.",
        "اثنِ الذراع والركبة البعيدة: اسحب ذراعه البعيدة وضع ظهر كفه على خده القريب منك، ثم اثنِ ركبته البعيدة بيدك الأخرى لتصبح قدمه مسطحة على الأرض.",
        "اقلبه برفق على جانبه: اسحب الركبة المثنية نحوك ليدور المصاب على جانبه بسلاسة مع تثبيت رأسه بيدك.",
        "ثبّت الرأس وراقب التنفس: أمل رأسه للخلف قليلاً ووجه فمه للأسفل لتصريف أي سوائل، غطِّه للحفاظ على حرارته، وافحص تنفسه كل دقيقة حتى وصول الإسعاف."
      ],
      A: {
        checks: ["تأكد أن الفم خالٍ من أي عوائق."],
        actions: ["أمل الرأس للخلف وارفع الذقن لفتح مجرى الهواء."]
      },
      D: {
        checks: ["اختبر الاستجابة بالصوت واللمس وتأكد من انتظام التنفس لمدة 10 ثوانٍ."],
        actions: ["ضع المصاب في وضعية الإفاقة على جانبه وراقب تنفسه كل دقيقة."]
      }
    },
    en: {
      summary: "When an unresponsive person is breathing normally, placing them in the recovery position keeps their airway open.",
      steps: [
        "Check responsiveness: Gently tap the shoulders and shout loudly. If there is no response, call emergency services immediately.",
        "Open the airway: Place one hand on the forehead and two fingers under the chin, gently tilting the head back.",
        "Check breathing for up to 10 seconds: Look for chest rise, listen for breath sounds, and feel for air on your cheek.",
        "Position the near arm: Kneel beside the person and place the arm closest to you at a right angle to their body with the palm facing up.",
        "Position the far arm and leg: Bring the far arm across their chest and hold the back of their hand against their near cheek, then bend the far knee up so the foot is flat on the floor.",
        "Roll onto their side: Pull the bent knee toward you to roll the person smoothly onto their side.",
        "Tilt the head and monitor: Tilt the head slightly back with the mouth angled downward so fluids can drain, keep them warm, and re-check breathing every minute."
      ],
      A: {
        checks: ["Ensure the mouth is clear."],
        actions: ["Tilt the head back and lift the chin to open the airway."]
      },
      D: {
        checks: ["Confirm unresponsiveness and normal breathing for 10 seconds."],
        actions: ["Place the person in the recovery position and check breathing every minute."]
      }
    }
  },
  cpr: {
    keys: ["قلب", "نبض", "تنفس", "إنعاش", "توقف", "cpr", "cardiac", "pulse", "breathing"],
    ar: {
      summary: "توقف التنفس وعدم الاستجابة يعني توقف القلب؛ كل ثانية تأخير تقلل فرص النجاة، ابدأ الإنعاش القلبي الرئوي (CPR) فوراً.",
      steps: [
        "تأكد من الأمان وافحص الاستجابة: هز كتفي المصاب ونادِه بصوت عالٍ — إذا لم يتحرك ولم يستجب اطلب الإسعاف فوراً واطلب إحضار جهاز الصدمات (AED) إن وُجد.",
        "افتح مجرى الهواء وافحص التنفس (10 ثوانٍ): أمل الرأس للخلف وارفع الذقن وراقب حركة الصدر؛ إذا لم يتنفس أو كان يلهث ببطء شديد فابدأ الضغطات الصدرية فوراً.",
        "ضع يديك في المكان الصحيح: ضع المصاب على ظهره فوق أرض صلبة، ضع كعب يدك في منتصف الصدر (النصف السفلي لعظمة القص بين الحلمتين) واشبك أصابع اليد الأخرى فوقها.",
        "ابدأ 30 ضغطة صدرية قوية وسريعة: اجعل ذراعيك مستقيمتين وكتفيك فوق يديك مباشرة، واضغط بوزن جسمك لأسفل بعمق 5 إلى 6 سم وبسرعة 100 إلى 120 ضغطة في الدقيقة (حوالي ضغطة كل نصف ثانية).",
        "اسمح للصدر بالعودة الكاملة: ارفع الضغط تماماً بين كل ضغطة وأخرى دون رفع يديك عن الصدر ليمتلئ القلب بالدم.",
        "أعطِ نفسين إنقاذيين: أمل الرأس للخلف، أغلق أنف المصاب بإصبعيك، ضع فمك بإحكام على فمه وانفخ برفق لمدة ثانية واحدة لكل نفس مع مراقبة ارتفاع الصدر.",
        "استمر بلا توقف: واصل دورات (30 ضغطة صدرية + نفسان) دون انقطاع حتى وصول الإسعاف أو عودة التنفس والحركة للمصاب."
      ],
      A: {
        checks: ["افتح مجرى الهواء بإمالة الرأس ورفع الذقن."],
        actions: ["أبقِ المصاب مستلقياً على ظهره على سطح صلب ومستوٍ."]
      },
      B: {
        checks: ["تأكد من غياب التنفس الطبيعي خلال 10 ثوانٍ."],
        actions: ["أعطِ نفسين إنقاذيين (ثانية لكل نفس) بعد كل 30 ضغطة صدرية."]
      },
      C: {
        checks: ["ابدأ الضغطات فوراً دون إضاعة وقت في البحث عن النبض."],
        actions: ["اضغط 30 ضغطة في منتصف الصدر بعمق 5–6 سم ومعدل 100–120 ضغطة/دقيقة."]
      }
    },
    en: {
      summary: "When a person is unresponsive and not breathing normally, start high-quality CPR immediately without delay.",
      steps: [
        "Check scene safety and responsiveness: Tap the shoulders and shout. If unresponsive, call emergency services and send someone for an AED.",
        "Open the airway and check breathing (max 10 seconds): Tilt the head back, lift the chin, and look for chest rise. If not breathing or only gasping, start CPR immediately.",
        "Position your hands: Place the person flat on their back on a firm surface. Put the heel of one hand on the center of the chest (lower half of the breastbone) and interlock your other hand on top.",
        "Deliver 30 chest compressions: Keep your arms straight and shoulders directly over your hands. Push hard and fast at a rate of 100–120 compressions per minute to a depth of 5–6 cm (2–2.4 inches).",
        "Allow full chest recoil: Let the chest rise completely between compressions without lifting your hands off the skin.",
        "Give 2 rescue breaths: Tilt the head back, pinch the nose shut, seal your mouth over theirs, and blow steadily for 1 second per breath until the chest rises.",
        "Continue cycles without interruption: Repeat 30 compressions and 2 breaths continuously until EMS arrives or the person shows signs of life."
      ],
      A: {
        checks: ["Open the airway with head-tilt, chin-lift."],
        actions: ["Keep the person flat on a firm surface."]
      },
      B: {
        checks: ["Confirm absence of normal breathing within 10 seconds."],
        actions: ["Deliver 2 rescue breaths (1 second each) after every 30 compressions."]
      },
      C: {
        checks: ["Begin compressions immediately if unresponsive and not breathing."],
        actions: ["Perform 30 chest compressions (5–6 cm deep at 100–120/min)."]
      }
    }
  },
  burns: {
    keys: ["حرق", "حروق", "مية مغلية", "نار", "فقاعات", "burn", "burns", "scald"],
    ar: {
      summary: "التبريد الفوري بالماء الجاري الفاتر لمدة 20 دقيقة يوقف احتراق طبقات الجلد العميقة ويقلل الألم والتندّب.",
      steps: [
        "أبعد المصاب عن مصدر الخطر: أطفئ اللهب أو افصل مصدر الكهرباء أو السائل الساخن فوراً مع الحفاظ على سلامتك.",
        "برّد الحرق بالماء الجاري 20 دقيقة: ضع المنطقة المحروقة تحت ماء صنبور جارٍ فاتر (معتدل البرودة) لمدة 20 دقيقة كاملة.",
        "انزع الإكسسوارات فوراً: اخلع الخواتم، الساعات، الأحزمة، أو الملابس الضيقة حول الحرق برفق قبل أن يبدأ الجلد في التورم.",
        "لا تنزع الملابس الملتصقة: إذا التصق القماش بالجلد المحروق، اتركه مكانه وقص حوله فقط.",
        "غطِّ الحرق بشاش نظيف غير لاصق: ضع شاشاً معقماً غير لاصق أو ورق تغليف بلاستيكي نظيف (Cling film) بشكل فضفاض دون لفّ ضاغط.",
        "ممنوعات قاطعة: لا تضع ثلجاً مباشراً، معجون أسنان، زبدة، زيتاً، بنّاً، أو كريمات غير طبية، ولا تفتح الفقاعات المائية أبداً.",
        "اطلب الرعاية الطبية: توجّه للمستشفى أو اتصل بالإسعاف إذا كان الحرق أكبر من كف اليد، أو في الوجه أو اليدين أو المفاصل، أو كان ناتجاً عن كهرباء أو مواد كيميائية."
      ],
      E: {
        checks: ["قيّم مساحة الحرق ومكانه وتأكد من ابتعاد المصاب عن مصدر الحرارة."],
        actions: ["برّد الحرق بماء جارٍ فاتر 20 دقيقة، انزع الخواتم، وغطِّه بشاش غير لاصق."]
      }
    },
    en: {
      summary: "Cooling a burn under cool running water for 20 minutes stops ongoing tissue damage and relieves pain.",
      steps: [
        "Ensure safety: Move the person away from the heat source, flame, or electrical hazard.",
        "Cool the burn for 20 minutes: Hold the burned area under cool (not ice-cold) running tap water for a full 20 minutes.",
        "Remove tight items early: Gently take off rings, watches, bracelets, or tight clothing near the burn before swelling develops.",
        "Do not peel stuck clothing: If fabric is stuck to the burn, leave it in place and cut around it.",
        "Cover loosely: Place sterile non-stick gauze or clean plastic cling film loosely over the burn without wrapping tightly.",
        "Never apply home remedies: Do NOT put ice, butter, oil, toothpaste, or creams on a burn, and never pop blisters.",
        "Seek urgent medical care: Go to a hospital or call EMS if the burn is larger than the person's palm, involves the face/hands/joints, or is electrical/chemical."
      ],
      E: {
        checks: ["Check the size, depth, and location of the burn."],
        actions: ["Cool under running tap water for 20 minutes, remove rings, and cover loosely with sterile dressing."]
      }
    }
  }
};

function getDetailedGuide(userText) {
  const lower = String(userText || "").toLowerCase();
  const isAr = isArabicText(userText);
  const keys = Object.keys(DETAILED_GUIDES);
  for (let i = 0; i < keys.length; i++) {
    const item = DETAILED_GUIDES[keys[i]];
    if (item.keys.some(function (k) { return lower.includes(k); })) {
      return isAr ? item.ar : item.en;
    }
  }
  return null;
}

const DANGER_WORDS = ["اختنق", "مختنق", "نزيف", "بينزف", "مش بيتنفس", "مش متنفس", "مش بيرد", "فاقد", "إغماء", "اغماء", "صدر", "choking", "choke", "bleed", "unconscious", "not breathing", "unresponsive", "chest pain", "stroke", "seizure", "fainted"];

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
    steps: Array.isArray(d.steps) ? d.steps.map(String).filter(Boolean) : [],
    A: sec(d.A), B: sec(d.B), C: sec(d.C), D: sec(d.D), E: sec(d.E),
    notes: Array.isArray(d.notes) ? d.notes.map(String).filter(Boolean) : []
  };
}

function enrichWithDetailedSteps(result, userText) {
  const guide = getDetailedGuide(userText);
  if (guide) {
    if (!result.summary) result.summary = guide.summary;
    if (!result.steps || result.steps.length < 4) {
      result.steps = guide.steps.slice();
    }
    ["A", "B", "C", "D", "E"].forEach(function (l) {
      if (guide[l] && (!result[l] || (!result[l].checks.length && !result[l].actions.length))) {
        result[l] = {
          checks: (guide[l].checks || []).slice(),
          actions: (guide[l].actions || []).slice()
        };
      }
    });
  } else if (!result.steps || !result.steps.length) {
    const collected = [];
    ["A", "B", "C", "D", "E"].forEach(function (l) {
      if (result[l] && result[l].actions) {
        result[l].actions.forEach(function (act) { collected.push(act); });
      }
    });
    result.steps = collected;
  }
  return result;
}

function fallbackAnalysis(userText) {
  const lower = userText.toLowerCase();
  const danger = DANGER_WORDS.some(function (w) { return lower.includes(w); });
  const isAr = isArabicText(userText);
  const base = {
    triage: danger ? "immediate" : "urgent",
    summary: "",
    steps: isAr
      ? [
          "تأكد من أمان المكان حولك وحول المصاب قبل الاقتراب.",
          "افحص استجابة المصاب بالصوت واللمس وراقب تنفسه لمدة 10 ثوانٍ.",
          "إذا كان لا يتنفس: ابدأ الإنعاش القلبي الرئوي (30 ضغطة في منتصف الصدر + نفسان) فوراً.",
          "إذا كان هناك نزيف: اضغط بقوة مباشرة على الجرح بشاش أو قماشة نظيفة لمدة 10 دقائق.",
          "اتصل بالإسعاف على " + emergencyNo() + " وابقَ بجانب المصاب لمراقبة حالته."
        ]
      : [
          "Ensure the scene is safe before approaching the injured person.",
          "Check responsiveness by shouting and tapping shoulders, and check breathing for 10 seconds.",
          "If not breathing normally: start CPR (30 chest compressions + 2 breaths) immediately.",
          "If bleeding heavily: apply firm direct pressure with a clean cloth for 10 minutes.",
          "Call emergency services (" + emergencyNo() + ") and stay with the person."
        ],
    A: { checks: [], actions: [] },
    B: { checks: [], actions: [] },
    C: { checks: [], actions: [] },
    D: { checks: [], actions: [] },
    E: { checks: [], actions: [] },
    notes: []
  };
  return enrichWithDetailedSteps(base, userText);
}

async function analyzeCase(userText) {
  const started = Date.now();
  const inputIsAr = isArabicText(userText);
  const replyIn = inputIsAr ? "clear, detailed Egyptian Arabic ONLY" : "clear, detailed English ONLY";
  const knowledge = typeof SCENARIOS !== "undefined"
    ? SCENARIOS.map(function (s) { return "- " + s.title + ": " + s.keyPoint; }).join("\n")
    : "";

  try {
    const raw = await callAI([
      {
        role: "system",
        content: "You are an expert first-aid trainer. Reply with ONLY a valid JSON object (no markdown) with keys: \"triage\" (\"immediate\"|\"urgent\"|\"delayed\"|\"minor\"), \"summary\" (1-2 clear sentences), \"steps\" (array of 6 to 7 detailed, practical step-by-step instructions explaining exact technique, hand placement, timing, and warnings just like a practical training video), \"A\", \"B\", \"C\", \"D\", \"E\" (each having \"checks\" and \"actions\" arrays), and \"notes\" (array).\n" +
          "CRITICAL RULES:\n" +
          "1. Write ALL text strictly in " + replyIn + ". Match the user's input language.\n" +
          "2. The \"steps\" array MUST contain 6 to 7 thorough, actionable step-by-step instructions answering 'what to do in detail' so the user can follow them step by step without even needing to leave the page.\n" +
          "3. Also fill the relevant ABCDE sections clearly.\n" +
          "4. Call emergency number " + emergencyNo() + " if life-threatening.\n\n" +
          "Knowledge base:\n" + knowledge
      },
      { role: "user", content: userText }
    ], { json: true });

    const result = enrichWithDetailedSteps(normalize(parseJSON(raw)), userText);
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    result.notes.push((inputIsAr ? "وقت التحليل: " : "Response time: ") + secs + "s");
    return result;
  } catch (err) {
    console.warn("AI analysis fallback:", err.message);
    return fallbackAnalysis(userText);
  }
}
