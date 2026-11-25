// i18n.js: Arabic and English text, the language switch, and English versions of the training cases.
// To change a sentence on the page, edit it in TEXT below. Scores stay in scenarios.js.

const LANG_KEY = "firstaid-lang";

const TEXT = {
  ar: {
    siteTitle: "مدرب ABCDE للفرز الطارئ",
    tagline: "تدريب عملي على تقييم الحالة ABCDE واتخاذ القرار بسرعة",
    purposeText: "بنساعد طلاب الطب والتمريض والمسعفين والمتطوعين، وأي حد عايز يتعلم، يتدربوا إزاي يقيّموا الحالة الطارئة خطوة بخطوة، ويعرفوا امتى المريض محتاج إسعاف فورًا.",
    sosBtn: "اتصل بالإسعاف",
    caseTitle: "اوصف الحالة اللي قدامك",
    caseHelp: "اكتب إيه اللي حصل وإيه اللي شايفه: العمر تقريبًا، هل الشخص واعي، بيتنفس ولا لأ، وفين الإصابة لو فيه. وهنرتب لك الخطوات بطريقة ABCDE.",
    caseInputPlaceholder: "مثال: راجل حوالي 60 سنة وقع فجأة، مش بيرد، وبيتنفس بصعوبة...",
    analyze: "حلّل الحالة",
    examplesTitle: "أو جرّب حالة جاهزة:",
    emptyCase: "اكتب وصف الحالة الأول.",
    analyzing: "جاري تحليل الحالة...",
    fallbackDanger: "وصفك فيه علامات خطر. اتصل بالإسعاف فورًا، واعمل الخطوات دي.",
    fallbackSafe: "اتبع الخطوات دي بالترتيب، ولو الحالة اتدهورت اتصل بالإسعاف فورًا.",
    aiOff: "المساعد الذكي مش متوصّل دلوقتي، فالتحليل ده عام. اتأكد من مفتاح config.js ومن تشغيل السيرفر.",
    triage_immediate: "حالة طارئة: اتصل بالإسعاف فورًا",
    triage_urgent: "حالة عاجلة: محتاجة تقييم طبي في أقرب وقت",
    triage_delayed: "حالة غير عاجلة: متابعة وتقييم طبي",
    triage_minor: "حالة بسيطة: إسعافات أولية ومتابعة",
    abcdeA: "A: الهواء (Airway)",
    abcdeB: "B: التنفس (Breathing)",
    abcdeC: "C: الدورة الدموية (Circulation)",
    abcdeD: "D: الوعي (Disability)",
    abcdeE: "E: الفحص العام (Exposure)",
    checksTitle: "افحص:",
    actionsTitle: "اعمل:",
    callNow: "في أي شك اتصل بالإسعاف على: ",
    disclaimer: "ده تدريب وإرشاد عام، وليس تشخيصًا طبيًا. الحالة الحقيقية محتاجة متخصص.",
    langBtn: "English",
    navHome: "الرئيسية",
    navRef: "بطاقات سريعة",
    navLib: "المكتبة",
    notice: "تنبيه: هذا تدريب محاكاة. في الحالة الحقيقية اتصل بالإسعاف فورًا على: ",
    footerLabel: "تنبيه:",
    footerText: "هذا موقع تدريب محاكاة وليس بديلًا عن دورة معتمدة. في الحالة الحقيقية اتصل بالإسعاف فورًا على:",
    footerSources: "المصادر: الصليب الأحمر الأمريكي، والإرشادات المشتركة لـ AHA والصليب الأحمر لسنة 2024، وNHS، وHarvard Health. التفاصيل في تعليقات ملف scenarios.js.",
    introTitle: "تدريب الفرز والتقييم الأولي في الطوارئ",
    introText: "اتدرب خطوة بخطوة على حالات طوارئ افتراضية، واختار القرار الصح في كل خطوة. في النهاية هتاخد تحليل لأدائك.",
    start: "ابدأ التدريب",
    chooseCase: "اختار حالة",
    notStarted: "لم تبدأ بعد",
    best: "أفضل نتيجة: {p}%",
    stepOf: "الخطوة {i} من {n}",
    next: "التالي",
    seeResult: "عرض النتيجة",
    score2: "صح",
    score1: "صح جزئيًا",
    score0: "غلط",
    resultTitle: "نتيجتك: {p}%",
    points: "{g} من {m} نقطة",
    triageEmergency: "التصنيف الصحيح: حالة طارئة، اتصل بالإسعاف فورًا.",
    triageMinor: "التصنيف الصحيح: حالة بسيطة، تكفيها الإسعافات الأولية والمتابعة.",
    hintRepeat: "كرر السيناريو. محتاج 85% أو أكتر عشان تفتح حالات أصعب.",
    hintNext: "ممتاز! جرّب الآن حالات مستوى {l}.",
    hintTop: "ممتاز! حالات المستوى الأعلى قادمة قريبًا.",
    retry: "أعد السيناريو",
    debriefTitle: "تحليل أدائك",
    debriefLoading: "جاري تحليل أدائك...",
    goodTitle: "أحسنت في:",
    missTitle: "راجع:",
    keyPoint: "النقطة الأهم:",
    refTitle: "بطاقات سريعة",
    refIntro: "مراجعة سريعة للخطوات الأساسية، ومش بديل عن دورة معتمدة.",
    print: "اطبع البطاقات",
    refCards: [
      ["اختناق (واعي ومش قادر يتكلم)", "5 ضربات بين لوح الكتف، وبعدها 5 ضغطات بطن. كرر لحد ما الانسداد يتفك."],
      ["نزيف شديد", "ضغط مباشر وقوي بقماشة نظيفة. ولو من طرف (إيد أو رجل) وانت متدرب، استخدم عصبة (توركيه)."],
      ["فاقد الوعي ومتنفس", "حطه في وضعية الإفاقة (على جنبه)، واتصل بالإسعاف، وراقب تنفسه باستمرار."],
      ["فاقد الوعي ومش بيتنفس", "اتصل بالإسعاف فورًا، وابدأ الإنعاش القلبي الرئوي (CPR)."]
    ],
    levelNames: { "مبتدئ": "مبتدئ", "متوسط": "متوسط", "متقدم": "متقدم" },
    assistOpen: "مساعد الإسعافات",
    assistClose: "إغلاق",
    assistPlaceholder: "اسأل سؤال في الإسعافات الأولية…",
    assistSend: "إرسال",
    assistThinking: "بفكر…",
    assistError: "حصلت مشكلة في الرد، جرّب تاني.",
    assistSetup: "المساعد الذكي لسه مش متوصّل. ضيف المفتاح في config.js.",
    assistWelcome: "اسألني أي سؤال في الإسعافات الأولية، مثلاً: أعمل إيه مع حرق بسيط؟",
    assistEmergency: "في الحالات الطارئة اتصل على: ",
    themeToDark: "داكن",
    themeToLight: "فاتح"
  },
  en: {
    siteTitle: "ABCDE Triage Coach",
    tagline: "Hands-on ABCDE assessment and fast triage training",
    purposeText: "We help medical and nursing students, first responders, volunteers, and anyone who wants to learn how to assess an emergency step by step and know when a person needs an ambulance right away.",
    sosBtn: "Call ambulance",
    caseTitle: "Describe the case in front of you",
    caseHelp: "Write what happened and what you see: approximate age, whether the person is responsive, whether they are breathing, and where the injury is if any. We will organize the steps using the ABCDE approach.",
    caseInputPlaceholder: "Example: a man around 60 suddenly collapsed, does not respond, and is breathing with difficulty...",
    analyze: "Analyze the case",
    examplesTitle: "Or try a ready case:",
    emptyCase: "Please describe the case first.",
    analyzing: "Analyzing the case...",
    fallbackDanger: "Your description has warning signs. Call an ambulance immediately and follow these steps.",
    fallbackSafe: "Follow these steps in order, and if the person gets worse, call an ambulance immediately.",
    aiOff: "The AI helper is not connected right now, so this analysis is general. Check the key in config.js and that the local server is running.",
    triage_immediate: "Emergency: call an ambulance immediately",
    triage_urgent: "Urgent: needs medical assessment as soon as possible",
    triage_delayed: "Non-urgent: monitor and seek medical assessment",
    triage_minor: "Minor: first aid and follow-up",
    abcdeA: "A: Airway",
    abcdeB: "B: Breathing",
    abcdeC: "C: Circulation",
    abcdeD: "D: Disability (level of consciousness)",
    abcdeE: "E: Exposure (other injuries, temperature)",
    checksTitle: "Check:",
    actionsTitle: "Do:",
    callNow: "If in doubt, call an ambulance on: ",
    disclaimer: "This is general training guidance, not a medical diagnosis. A real case needs a professional.",
    langBtn: "العربية",
    navHome: "Home",
    navRef: "Quick cards",
    navLib: "Library",
    notice: "Note: this is a training simulation. In a real emergency, call an ambulance immediately on: ",
    footerLabel: "Note:",
    footerText: "This is a training simulator, not a replacement for a certified course. In a real emergency call an ambulance immediately on:",
    footerSources: "Sources: American Red Cross, the 2024 AHA and American Red Cross first-aid guidelines, NHS, and Harvard Health. Details are in the comments of scenarios.js.",
    introTitle: "Emergency triage and assessment training",
    introText: "Practice step by step on virtual emergencies. Choose the right action at each step, then get an analysis of your performance.",
    start: "Start training",
    chooseCase: "Choose a case",
    notStarted: "Not started yet",
    best: "Best score: {p}%",
    stepOf: "Step {i} of {n}",
    next: "Next",
    seeResult: "See result",
    score2: "Correct",
    score1: "Partly correct",
    score0: "Incorrect",
    resultTitle: "Your score: {p}%",
    points: "{g} of {m} points",
    triageEmergency: "Correct triage: an emergency. Call an ambulance immediately.",
    triageMinor: "Correct triage: a minor case. First aid and follow-up are enough.",
    hintRepeat: "Repeat the scenario. You need 85% or more to unlock harder cases.",
    hintNext: "Excellent! Try {l} cases now.",
    hintTop: "Excellent! Higher-level cases are coming soon.",
    retry: "Retry scenario",
    debriefTitle: "Your performance review",
    debriefLoading: "Analyzing your performance...",
    goodTitle: "Well done on:",
    missTitle: "Review:",
    keyPoint: "Key point:",
    refTitle: "Quick cards",
    refIntro: "A quick review of the core steps. It does not replace a certified course.",
    print: "Print cards",
    refCards: [
      ["Choking (conscious, cannot speak)", "5 back blows between the shoulder blades, then 5 abdominal thrusts. Repeat until the blockage clears."],
      ["Severe bleeding", "Firm, direct pressure with a clean cloth. If it is from a limb and you are trained, use a tourniquet."],
      ["Unresponsive but breathing", "Place them in the recovery position (on their side), call an ambulance, and keep checking their breathing."],
      ["Unresponsive and not breathing", "Call an ambulance immediately and start CPR."]
    ],
    levelNames: { "مبتدئ": "Beginner", "متوسط": "Intermediate", "متقدم": "Advanced" },
    assistOpen: "First Aid Helper",
    assistClose: "Close",
    assistPlaceholder: "Ask a first-aid question…",
    assistSend: "Send",
    assistThinking: "Thinking…",
    assistError: "Couldn't get an answer. Please try again.",
    assistSetup: "The AI helper is not connected yet. Add your key in config.js.",
    assistWelcome: "Ask me any first-aid question, e.g. “What do I do for a minor burn?”",
    assistEmergency: "In a real emergency call: ",
    themeToDark: "Dark",
    themeToLight: "Light"
  }
};

// English versions of the cases. Same order as scenarios.js, so the scores there still apply.
const EN_SCENARIOS = {
  choking: {
    title: "Adult choking",
    setting: "A restaurant. A man is holding his throat and cannot speak or cough forcefully.",
    keyPoint: "If the person cannot speak or cough forcefully, call an ambulance and give 5 back blows alternating with 5 abdominal thrusts. Do not sweep the mouth with your finger unless you can see the object.",
    steps: [
      {
        question: "The person cannot speak or cough forcefully. What is your first step?",
        options: [
          { text: "Confirm: if they cannot speak or cough forcefully, act immediately", feedback: "Correct. Being unable to speak or cough forcefully means air is not getting through well." },
          { text: "Give them water to drink", feedback: "Incorrect. Drinking while the airway is blocked can make things worse." },
          { text: "Wait a minute and see", feedback: "Incorrect. Waiting lets the air supply drop quickly." }
        ]
      },
      {
        question: "The blockage is complete and the person is gradually losing consciousness. What do you do?",
        options: [
          { text: "Call an ambulance, give 5 back blows between the shoulder blades, then 5 abdominal thrusts, and repeat", feedback: "Correct. This is the standard sequence for a conscious choking adult." },
          { text: "Put my finger in their mouth and sweep out anything", feedback: "Incorrect. Only do this if you can see the object, or you may push it deeper." },
          { text: "Leave them standing until the ambulance arrives", feedback: "Incorrect. You must start help immediately." }
        ]
      }
    ]
  },
  bleeding: {
    title: "Severe leg bleeding",
    setting: "A bicycle accident. A deep cut on the thigh, with heavy bleeding.",
    keyPoint: "First, apply firm, direct pressure on the wound with a clean cloth. If bleeding from a limb does not stop, use a tourniquet if you are trained. Do not remove the dressing to look at the wound. Add a new dressing on top.",
    steps: [
      {
        question: "Blood is flowing heavily. What is your first step?",
        options: [
          { text: "Apply firm, direct pressure on the wound with a clean cloth", feedback: "Correct. Direct pressure is the first step to stop bleeding." },
          { text: "Wash the wound with water first", feedback: "Partly correct. Cleaning matters later, but stopping the bleeding comes first." },
          { text: "Raise the leg and leave it so the blood clots on its own", feedback: "Incorrect. Severe bleeding will not stop on its own." }
        ]
      },
      {
        question: "Pressure has been applied but blood is still flowing, and you are trained to use a tourniquet. What do you do?",
        options: [
          { text: "Apply the tourniquet above the wound, keep pressing, and call an ambulance", feedback: "Correct. A tourniquet is used on a limb for bleeding that threatens life." },
          { text: "Put a new gauze pad on top of the cloth and keep pressing", feedback: "Partly correct. A new pad helps, but a limb bleed that does not stop needs a tourniquet." },
          { text: "Unwrap the dressing every minute to check the wound", feedback: "Incorrect. Removing the pressure lets the bleeding start again." }
        ]
      }
    ]
  },
  unresponsive: {
    title: "Unresponsive but breathing",
    setting: "You find a man lying on the floor. He does not respond when you call loudly or gently shake him. His chest is rising and falling normally.",
    keyPoint: "If the person is unresponsive but breathing normally, call an ambulance and place them in the recovery position (on their side) to keep the airway open. If breathing stops, start CPR immediately.",
    steps: [
      {
        question: "What is your first step?",
        options: [
          { text: "Make sure the area is safe, call loudly and shake gently, and if there is no response call an ambulance", feedback: "Correct. Checking responsiveness and breathing, then calling for help, is the right order." },
          { text: "Give them water to drink", feedback: "Incorrect. An unresponsive person can choke on water." },
          { text: "Help them sit up so they can breathe better", feedback: "Incorrect. Moving someone unnecessarily can cause harm, especially with a possible neck or back injury." }
        ]
      },
      {
        question: "They are breathing normally, with no obvious neck or back injury. What position do you place them in?",
        options: [
          { text: "Recovery position: on their side, top leg bent, head tilted back slightly", feedback: "Correct. This keeps the airway open and lets fluids drain out of the mouth." },
          { text: "Leave them on their back as they are", feedback: "Incorrect. On their back, the tongue can block the airway." },
          { text: "Turn them onto their stomach", feedback: "Incorrect. That is not the recovery position and can make breathing harder." }
        ]
      }
    ]
  },
  "minor-cut": {
    title: "Minor finger cut",
    setting: "You cut your finger with a kitchen knife. The cut is shallow and the bleeding is light.",
    keyPoint: "A minor cut is treated by washing it with clean water and applying light pressure with a clean cloth until the bleeding stops. If the cut is deep or the bleeding does not stop, get medical help.",
    steps: [
      {
        question: "What do you do first?",
        options: [
          { text: "Wash it with clean water, then press a clean cloth on it until the bleeding stops", feedback: "Correct. This is how to treat a minor cut." },
          { text: "Tie the finger tightly with a strip", feedback: "Incorrect. Tying tightly can cut off blood flow to the finger." },
          { text: "Leave it without doing anything", feedback: "Partly correct. It is not dangerous, but washing and pressing is better." }
        ]
      }
    ]
  }
};

function getLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "ar" || saved === "en") return saved;
  } catch (err) {
    // Storage blocked: fall back to the browser language below.
  }
  return (navigator.language || "ar").toLowerCase().startsWith("ar") ? "ar" : "en";
}

function setLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (err) {
    console.warn("Language not saved:", err.message);
  }
}

// Returns the text for a key in the current language. Use {name} placeholders with vars.
function t(key, vars) {
  let str = TEXT[getLang()][key] ?? TEXT.ar[key] ?? key;
  if (vars) {
    for (const name in vars) str = str.replace("{" + name + "}", vars[name]);
  }
  return str;
}

function levelLabel(level) {
  return TEXT[getLang()].levelNames[level] || level;
}

// Fills every element with data-i18n (text) or data-i18n-attr="attribute:key", and sets the direction.
function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = t("siteTitle");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const [attr, key] = el.dataset.i18nAttr.split(":");
    el.setAttribute(attr, t(key));
  });
}
