const app = document.getElementById("app");
let lastCase = "";

const LOGO_SVG =
  '<svg class="logo" viewBox="0 0 48 48" aria-hidden="true">' +
  '<rect width="48" height="48" rx="12" fill="#ffffff"/>' +
  '<path d="M19 6h10v11h11v10H29v11H19V27H8V17h11z" fill="#0066CC"/>' +
  '<path d="M4 42h10l3-5 4 9 4-7 3 3h16" fill="none" stroke="#C62828" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";

function ytWatchUrl(id) {
  return "https:/" + "/www.youtube.com/watch?v=" + id;
}

function ytThumbUrl(id) {
  return "https:/" + "/i.ytimg.com/vi/" + id + "/hqdefault.jpg";
}

function safeGetLang() {
  if (typeof getLang === "function") {
    const l = getLang();
    if (l === "en" || l === "ar") return l;
  }
  return document.documentElement.lang === "en" ? "en" : "ar";
}

function safeSetLang(nextLang) {
  const valid = nextLang === "en" ? "en" : "ar";
  if (typeof setLang === "function") {
    setLang(valid);
  }
  try {
    localStorage.setItem("firstaid-lang", valid);
    localStorage.setItem("lang", valid);
  } catch (_) {}
  document.documentElement.lang = valid;
  document.documentElement.dir = valid === "ar" ? "rtl" : "ltr";
}

function safeEmergencyNo() {
  return typeof emergencyNo === "function" ? emergencyNo() : "123";
}

const I18N_FALLBACK = {
  ar: {
    siteTitle: "مدرب ABCDE للفرز الطارئ",
    navHome: "الرئيسية",
    navLib: "المكتبة",
    langBtn: "English",
    themeToDark: "داكن",
    themeToLight: "فاتح",
    sosBtn: "طوارئ",
    tagline: "تقييم سريع للحالات الطارئة خطوة بخطوة",
    purposeText: "أداة تدريبية تساعدك على ترتيب الأولويات حسب بروتوكول ABCDE حتى وصول الإسعاف.",
    caseTitle: "اوصف الحالة الطارئة",
    caseHelp: "اكتب الأعراض بوضوح أو اختر حالة جاهزة من الأعلى.",
    caseInputPlaceholder: "مثال: شخص سقط ولا يستجيب أو ينزف بشدة...",
    analyze: "حلّل الحالة",
    analyzing: "جاري تجهيز الخطوات التفصيلية...",
    emptyCase: "من فضلك اكتب وصف الحالة أولاً.",
    notice: "تنبيه: في الحالات المهددة للحياة اتصل فوراً برقم الطوارئ ",
    callNow: "اتصل بالإسعاف فوراً: ",
    disclaimer: "هذا الدليل للتدريب والتوعية ولا يغني عن الرعاية الطبية المتخصصة.",
    triage_immediate: "حالة حرجة — تدخل فوري (Immediate)",
    triage_urgent: "حالة عاجلة (Urgent)",
    triage_delayed: "حالة مستقرة نسبياً (Delayed)",
    triage_minor: "إصابة بسيطة (Minor)",
    abcdeA: "A — مجرى الهواء (Airway)",
    abcdeB: "B — التنفس (Breathing)",
    abcdeC: "C — الدورة الدموية (Circulation)",
    abcdeD: "D — الوعي والأعصاب (Disability)",
    abcdeE: "E — الفحص الشامل (Exposure)",
    checksTitle: "افحص (Check):",
    actionsTitle: "تصرّف (Action):",
    libTitle: "مكتبة الإسعافات الأولية",
    libSub: "اختر القسم ثم الحالة لعرض الخطوات التفصيلية بالصور الحقيقية وفيديو الشرح العملي لكل فئة عمرية.",
    backLib: "→ المكتبة",
    backSec: "→ رجوع"
  },
  en: {
    siteTitle: "ABCDE Triage Coach",
    navHome: "Home",
    navLib: "Library",
    langBtn: "العربية",
    themeToDark: "Dark",
    themeToLight: "Light",
    sosBtn: "Emergency",
    tagline: "Step-by-step emergency assessment and prioritization",
    purposeText: "A training guide to help you prioritize care using the ABCDE approach until emergency help arrives.",
    caseTitle: "Describe the Emergency",
    caseHelp: "Describe the symptoms clearly or select a quick case above.",
    caseInputPlaceholder: "Example: Someone collapsed and is unresponsive or bleeding heavily...",
    analyze: "Analyze Case",
    analyzing: "Preparing detailed step-by-step guidance...",
    emptyCase: "Please enter a case description first.",
    notice: "Warning: For life-threatening emergencies, immediately call emergency number ",
    callNow: "Call emergency services immediately: ",
    disclaimer: "This guide is for training and awareness and does not replace professional medical care.",
    triage_immediate: "Immediate — Life-Threatening",
    triage_urgent: "Urgent — Prompt Care Needed",
    triage_delayed: "Delayed — Stable for Now",
    triage_minor: "Minor — Basic Care",
    abcdeA: "A — Airway",
    abcdeB: "B — Breathing",
    abcdeC: "C — Circulation",
    abcdeD: "D — Disability (Neurological)",
    abcdeE: "E — Exposure & Environment",
    checksTitle: "Check:",
    actionsTitle: "Action:",
    libTitle: "First-Aid Library",
    libSub: "Select a section and condition to view step-by-step instructions and video tutorials.",
    backLib: "← Library",
    backSec: "← Back"
  }
};

function safeT(key) {
  const lang = safeGetLang();
  if (typeof t === "function") {
    const val = t(key, lang);
    if (typeof val === "string" && val.trim()) {
      const hasAr = /[\u0600-\u06FF]/.test(val);
      if ((lang === "en" && !hasAr) || (lang === "ar" && hasAr)) {
        return val;
      }
    }
  }
  const dict = I18N_FALLBACK[lang] || I18N_FALLBACK.ar;
  return dict[key] || I18N_FALLBACK.ar[key] || key;
}

const LIBRARY_TRANSLATIONS = {
  sections: {
    assess: {
      enTitle: "Primary Assessment",
      enIntro: "First steps on scene: make sure the area is safe, assess the person quickly, and identify immediate threats."
    },
    vitals: {
      enTitle: "Vital Signs",
      enIntro: "Key measurements that help assess a person's condition, though numbers alone never rule out serious illness."
    },
    emergencies: {
      enTitle: "Emergency Conditions",
      enIntro: "Time-critical emergencies requiring rapid action, with guidance across age groups."
    }
  },
  topics: {
    abcde: {
      enTitle: "ABCDE Primary Survey",
      enSummary: "Systematic A-B-C-D-E check to detect and treat life threats in order of urgency."
    },
    avpu: {
      enTitle: "AVPU Consciousness Scale",
      enSummary: "Quick neurological check: Alert, Voice, Pain, or Unresponsive."
    },
    breathing_rate: {
      enTitle: "Breathing Rate & Effort",
      enSummary: "Count breaths per minute and watch for labored breathing or chest retractions."
    },
    pulse_bp: {
      enTitle: "Pulse & Blood Pressure",
      enSummary: "Assess pulse rate, rhythm, and perfusion signs alongside blood pressure."
    },
    choking: {
      enTitle: "Choking & Airway Obstruction",
      enSummary: "Immediate response for partial or complete airway blockage in adults, children, and infants."
    },
    bleeding: {
      enTitle: "Severe Bleeding & Wounds",
      enSummary: "Direct pressure, wound dressing, and limb elevation to stop blood loss."
    },
    unconscious: {
      enTitle: "Unconsciousness & Recovery Position",
      enSummary: "Airway protection and recovery position for an unresponsive person who is breathing."
    },
    cpr: {
      enTitle: "Cardiopulmonary Resuscitation (CPR)",
      enSummary: "Chest compressions and rescue breaths when a person is unresponsive and not breathing normally."
    },
    burns: {
      enTitle: "Burns First Aid",
      enSummary: "Cool running water and safe dressing for thermal, electrical, or chemical burns."
    }
  }
};

function getSectionTitle(sec) {
  const lang = safeGetLang();
  if (lang === "en") {
    const map = LIBRARY_TRANSLATIONS.sections[sec.id];
    if (map && map.enTitle) return map.enTitle;
    if (sec.titleEn) return sec.titleEn;
  }
  return sec.title || "";
}

function getSectionIntro(sec) {
  const lang = safeGetLang();
  if (lang === "en") {
    const map = LIBRARY_TRANSLATIONS.sections[sec.id];
    if (map && map.enIntro) return map.enIntro;
    if (sec.introEn) return sec.introEn;
  }
  return sec.intro || sec.summary || "";
}

function getTopicTitle(tp) {
  const lang = safeGetLang();
  if (lang === "en") {
    const map = LIBRARY_TRANSLATIONS.topics[tp.id];
    if (map && map.enTitle) return map.enTitle;
    if (tp.titleEn) return tp.titleEn;
  }
  return tp.title || "";
}

function getTopicSummary(tp) {
  const lang = safeGetLang();
  if (lang === "en") {
    const map = LIBRARY_TRANSLATIONS.topics[tp.id];
    if (map && map.enSummary) return map.enSummary;
    if (tp.summaryEn) return tp.summaryEn;
  }
  return tp.summary || tp.intro || "";
}

const MEDIA_MAP = {
  choking: {
    srcs: ["images/choking.webp", "images/1000_F_233179021_W3oUrTc4MTjTZZvC1KMANt3Z9jEqZUew.webp", ytThumbUrl("HGBBu4zr8sM")],
    ytAr: "81BXd2Gi6kg",
    ytEn: "HGBBu4zr8sM",
    titleAr: "فيديو توضيحي: إسعاف الاختناق (مناورة هيمليك)",
    titleEn: "Video Guide: Choking First Aid (Heimlich)",
    descAr: "شاهد التطبيق العملي للضربات الظهرية والضغطات البطنية بالترتيب الصحيح.",
    descEn: "Watch the practical demonstration of back blows and abdominal thrusts.",
    keys: ["اختناق", "شرق", "بلع", "مجرى الهواء", "choking", "heimlich", "airway"],
    summaryAr: "انسداد مجرى الهواء حالة حرجة تهدد الحياة خلال دقائق وتحتاج لتدخّل فوري لطرد الجسم الغريب.",
    summaryEn: "Complete airway obstruction is life-threatening and requires immediate back blows and abdominal thrusts.",
    stepsAr: [
      "قيّم الحالة بسرعة: اسأل المصاب (هل تختنق؟) — إذا كان يسعل بقوة شجّعه على الاستمرار في السعال، أما إذا عجز عن الكلام أو التنفس أو أمسك رقبته فابدأ التدخل فوراً.",
      "وجّه 5 ضربات ظهرية قوية: قف بجانب المصاب وخلفه قليلاً، اسند صدره بيد واحدة وأمِله للأمام، ثم اضرب 5 ضربات حادة بكعب يدك الأخرى في منتصف الظهر بين لوحي الكتف.",
      "افحص الفم بعد كل ضربة: انظر إذا خرج الجسم الغريب أم لا قبل الانتقال للخطوة التالية.",
      "نفّذ 5 ضغطات بطنية (مناورة هيمليك): قف خلف المصاب ولف ذراعيك حول خصره، أغلق قبضة يدك وضع جهة الإبهام فوق السرة وتحت عظمة القص مباشرة.",
      "اسحب بقوة للداخل ولأعلى: أمسك قبضتك بيدك الأخرى واضغط 5 ضغطات سريعة وحادة للداخل ولأعلى كأنك ترفع المصاب.",
      "استمر بالتبادل: كرّر دورة (5 ضربات ظهر + 5 ضغطات بطن) بالتناوب حتى يخرج الجسم الغريب أو يصل الإسعاف.",
      "إذا فقد المصاب وعيه: أنزله برفق على الأرض، اطلب الإسعاف فوراً، وابدأ الإنعاش القلبي الرئوي (30 ضغطة صدرية ثم افحص الفم قبل إعطاء النفسين)."
    ],
    stepsEn: [
      "Assess severity immediately: Ask 'Are you choking?' If they can cough forcefully, encourage coughing. If they cannot speak, cough, or breathe, intervene right away.",
      "Deliver 5 sharp back blows: Stand to the side and slightly behind the person, support their chest with one hand, lean them forward, and strike firmly between the shoulder blades with the heel of your hand.",
      "Check if the object cleared after each blow before moving to abdominal thrusts.",
      "Perform 5 abdominal thrusts (Heimlich maneuver): Stand behind the person, wrap your arms around their waist, make a fist with one hand, and place the thumb side just above the navel and well below the breastbone.",
      "Pull sharply inward and upward: Grasp your fist with your other hand and deliver 5 quick inward-and-upward thrusts.",
      "Alternate continuously: Repeat cycles of 5 back blows and 5 abdominal thrusts until the object is expelled.",
      "If the person becomes unresponsive: Lower them safely to the floor, call EMS immediately, and start CPR (30 chest compressions, checking the mouth before rescue breaths)."
    ]
  },
  bleeding: {
    srcs: ["images/bleeding.jpg", "images/pexels-rdne-6520110.jpg", ytThumbUrl("NxO5LvgqZe0")],
    ytAr: "_ofcOGEsa7c",
    ytEn: "NxO5LvgqZe0",
    titleAr: "فيديو توضيحي: إيقاف النزيف وتضميد الجروح",
    titleEn: "Video Guide: Bleeding Control & Dressing",
    descAr: "شاهد طريقة الضغط المباشر بالشاش المعقم ولف الضمادة الضاغطة.",
    descEn: "Watch how to apply firm direct pressure and wrap a pressure bandage.",
    keys: ["نزيف", "بينزف", "قطع", "جرح", "دم", "صباع", "bleeding", "bleed", "cut", "wound", "circulation"],
    summaryAr: "السيطرة الفورية على النزيف بالضغط المباشر والمستمر تمنع الصدمة النزيفية وتنقذ حياة المصاب.",
    summaryEn: "Immediate, firm direct pressure stops severe blood loss and prevents life-threatening shock.",
    stepsAr: [
      "أمّن نفسك والمكان: ارتدِ قفازات طبية إن توفرت أو استخدم كيساً بلاستيكياً نظيفاً كحاجز، واجعل المصاب يستلقي أو يجلس لتجنب سقوطه إذا شعر بدوخة.",
      "اكشف مكان الجرح: أبعد الملابس المحيطة بالجرح برفق لرؤية مصدر النزيف بوضوح والتأكد من عدم وجود زجاج أو جسم حاد مغروس.",
      "اضغط مباشرة وبقوة: ضع شاشاً معقماً أو قطعة قماش نظيفة سميكة فوق الجرح مباشرة، واضغط بكلتا يديك بوزن جسمك ضغطاً متواصلاً لمدة 10 دقائق كاملة دون رفع يدك.",
      "ارفع الطرف المصاب: إذا كان الجرح في الذراع أو الساق ولا يوجد اشتباه في كسر، ارفع الطرف المصاب فوق مستوى القلب أثناء استمرار الضغط.",
      "أضف طبقات ولا تنزع الشاش: إذا تشبّع الشاش بالدم، لا تنزعه أبداً حتى لا تفسد التجلط؛ ضع قطعة شاش أخرى فوقه وأكمل الضغط.",
      "ثبّت بضمادة ضاغطة: بعد توقف النزيف، لف رباطاً ضاغطاً بإحكام فوق الشاش مع التأكد من وجود نبض ودفء في أطراف الأصابع.",
      "تحذير مهم: إذا كان هناك جسم حاد مغروس داخل الجرح، لا تسحبه أبداً؛ ضع شاشاً حول حوافه واضغط من الجانبين فقط واطلب الإسعاف."
    ],
    stepsEn: [
      "Ensure safety and protect yourself: Put on disposable gloves if available and have the injured person lie down to prevent fainting.",
      "Expose the wound: Gently remove or cut away clothing around the injury to see the exact bleeding point and check for embedded objects.",
      "Apply firm, continuous direct pressure: Place sterile gauze or a clean folded cloth directly over the wound and press down firmly with both hands for at least 10 uninterrupted minutes.",
      "Elevate the injured limb: If the bleeding is on an arm or leg and no fracture is suspected, raise it above heart level while maintaining pressure.",
      "Layer dressings—never remove the first cloth: If blood soaks through, place a fresh pad directly on top of the soaked one so you do not disturb clotting.",
      "Secure with a pressure bandage: Once bleeding slows, wrap a bandage firmly over the dressing while checking that fingers or toes stay warm.",
      "Embedded object warning: If glass or metal is stuck in the wound, do NOT pull it out; build padding around its edges and apply pressure on either side."
    ]
  },
  unresponsive: {
    srcs: ["images/recovery.jpg", "images/pexels-mikhail-nilov-8942737.jpg", ytThumbUrl("GmqXqwSV3bo")],
    ytAr: "6ZmWhzrfPPY",
    ytEn: "GmqXqwSV3bo",
    titleAr: "فيديو توضيحي: فقدان الوعي ووضعية الإفاقة",
    titleEn: "Video Guide: Unresponsive & Recovery Position",
    descAr: "شاهد خطوات قلب المصاب على جانبه وتأمين مجرى الهواء خطوة بخطوة.",
    descEn: "Watch how to safely roll an unresponsive breathing person onto their side.",
    keys: ["إغماء", "اغماء", "مغمي", "مغمى", "فاقد", "غيبوبة", "الإفاقة", "unconscious", "unresponsive", "faint", "passed out", "recovery"],
    summaryAr: "المصاب فاقد للوعي لكنه يتنفس؛ وضعيته على جانبه (وضعية الإفاقة) تحمي مجرى الهواء من الانسداد باللسان أو القيء.",
    summaryEn: "When an unresponsive person is breathing normally, placing them in the recovery position keeps their airway open.",
    stepsAr: [
      "افحص استجابة المصاب (AVPU): هز كتفيه برفق ونادِه بصوت عالٍ (هل تسمعني؟) — إذا لم يستجب لأي صوت أو لمس اطلب من شخص قريب الاتصال بالإسعاف فوراً.",
      "افتح مجرى الهواء: ضع يداً على جبهة المصاب وأصابع اليد الأخرى تحت ذقنه، وأمِل الرأس للخلف برفق لرفع اللسان بعيداً عن الحلق.",
      "افحص التنفس لمدة 10 ثوانٍ: قرّب أذنك وخدك من فم المصاب وأنفِه وانظر إلى صدره؛ اسمع صوت التنفس واشعر به وراقب ارتفاع الصدر.",
      "جهّز المصاب لوضعية الإفاقة: اجلس بجانبه، افرد ذراعه القريبة منك بزاوية قائمة مع جسمه وكف يده للأعلى.",
      "اثنِ الذراع والركبة البعيدة: اسحب ذراعه البعيدة وضع ظهر كفه على خده القريب منك، ثم اثنِ ركبته البعيدة بيدك الأخرى لتصبح قدمه مسطحة على الأرض.",
      "اقلبه برفق على جانبه: اسحب الركبة المثنية نحوك ليدور المصاب على جانبه بسلاسة مع تثبيت رأسه بيدك.",
      "ثبّت الرأس وراقب التنفس: أمل رأسه للخلف قليلاً ووجه فمه للأسفل لتصريف أي سوائل، غطِّه للحفاظ على حرارته، وافحص تنفسه كل دقيقة حتى وصول الإسعاف."
    ],
    stepsEn: [
      "Check responsiveness: Gently tap the shoulders and shout loudly. If there is no response, call emergency services immediately.",
      "Open the airway: Place one hand on the forehead and two fingers under the chin, gently tilting the head back.",
      "Check breathing for up to 10 seconds: Look for chest rise, listen for breath sounds, and feel for air on your cheek.",
      "Position the near arm: Kneel beside the person and place the arm closest to you at a right angle to their body with the palm facing up.",
      "Position the far arm and leg: Bring the far arm across their chest and hold the back of their hand against their near cheek, then bend the far knee up so the foot is flat on the floor.",
      "Roll onto their side: Pull the bent knee toward you to roll the person smoothly onto their side.",
      "Tilt the head and monitor: Tilt the head slightly back with the mouth angled downward so fluids can drain, keep them warm, and re-check breathing every minute."
    ]
  },
  cpr: {
    srcs: ["images/cpr.jpg", "images/pexels-tahir-33029223.jpg", ytThumbUrl("BQNNOh8c8ks")],
    ytAr: "JIFt-55TRGk",
    ytEn: "BQNNOh8c8ks",
    titleAr: "فيديو توضيحي: الإنعاش القلبي الرئوي (CPR)",
    titleEn: "Video Guide: Cardiopulmonary Resuscitation (CPR)",
    descAr: "شاهد موضع اليدين الصحيح ومعدل الضغطات الصدرية (30 ضغطة + نفسين).",
    descEn: "Watch proper hand placement and chest compression rhythm (30:2).",
    keys: ["قلب", "نبض", "تنفس", "إنعاش", "توقف", "cpr", "cardiac", "pulse", "breathing"],
    summaryAr: "توقف التنفس وعدم الاستجابة يعني توقف القلب؛ كل ثانية تأخير تقلل فرص النجاة، ابدأ الإنعاش القلبي الرئوي (CPR) فوراً.",
    summaryEn: "When a person is unresponsive and not breathing normally, start high-quality CPR immediately without delay.",
    stepsAr: [
      "تأكد من الأمان وافحص الاستجابة: هز كتفي المصاب ونادِه بصوت عالٍ — إذا لم يتحرك ولم يستجب اطلب الإسعاف فوراً واطلب إحضار جهاز الصدمات (AED) إن وُجد.",
      "افتح مجرى الهواء وافحص التنفس (10 ثوانٍ): أمل الرأس للخلف وارفع الذقن وراقب حركة الصدر؛ إذا لم يتنفس أو كان يلهث ببطء شديد فابدأ الضغطات الصدرية فوراً.",
      "ضع يديك في المكان الصحيح: ضع المصاب على ظهره فوق أرض صلبة، ضع كعب يدك في منتصف الصدر (النصف السفلي لعظمة القص بين الحلمتين) واشبك أصابع اليد الأخرى فوقها.",
      "ابدأ 30 ضغطة صدرية قوية وسريعة: اجعل ذراعيك مستقيمتين وكتفيك فوق يديك مباشرة، واضغط بوزن جسمك لأسفل بعمق 5 إلى 6 سم وبسرعة 100 إلى 120 ضغطة في الدقيقة (حوالي ضغطة كل نصف ثانية).",
      "اسمح للصدر بالعودة الكاملة: ارفع الضغط تماماً بين كل ضغطة وأخرى دون رفع يديك عن الصدر ليمتلئ القلب بالدم.",
      "أعطِ نفسين إنقاذيين: أمل الرأس للخلف، أغلق أنف المصاب بإصبعيك، ضع فمك بإحكام على فمه وانفخ برفق لمدة ثانية واحدة لكل نفس مع مراقبة ارتفاع الصدر.",
      "استمر بلا توقف: واصل دورات (30 ضغطة صدرية + نفسان) دون انقطاع حتى وصول الإسعاف أو عودة التنفس والحركة للمصاب."
    ],
    stepsEn: [
      "Check scene safety and responsiveness: Tap the shoulders and shout. If unresponsive, call emergency services and send someone for an AED.",
      "Open the airway and check breathing (max 10 seconds): Tilt the head back, lift the chin, and look for chest rise. If not breathing or only gasping, start CPR immediately.",
      "Position your hands: Place the person flat on their back on a firm surface. Put the heel of one hand on the center of the chest (lower half of the breastbone) and interlock your other hand on top.",
      "Deliver 30 chest compressions: Keep your arms straight and shoulders directly over your hands. Push hard and fast at a rate of 100–120 compressions per minute to a depth of 5–6 cm (2–2.4 inches).",
      "Allow full chest recoil: Let the chest rise completely between compressions without lifting your hands off the skin.",
      "Give 2 rescue breaths: Tilt the head back, pinch the nose shut, seal your mouth over theirs, and blow steadily for 1 second per breath until the chest rises.",
      "Continue cycles without interruption: Repeat 30 compressions and 2 breaths continuously until EMS arrives or the person shows signs of life."
    ]
  },
  burns: {
    srcs: ["images/burns.jpg", ytThumbUrl("6i7ov4vbxUc")],
    ytAr: "HaC2oiBB7sI",
    ytEn: "6i7ov4vbxUc",
    titleAr: "فيديو توضيحي: إسعاف الحروق الحرارية",
    titleEn: "Video Guide: Thermal Burns First Aid",
    descAr: "شاهد طريقة تبريد الحرق بالماء الجاري وتغطيته بشكل آمن.",
    descEn: "Watch how to cool a burn under running water and cover it safely.",
    keys: ["حرق", "حروق", "مية مغلية", "نار", "فقاعات", "burn", "burns", "scald"],
    summaryAr: "التبريد الفوري بالماء الجاري الفاتر لمدة 20 دقيقة يوقف احتراق طبقات الجلد العميقة ويقلل الألم والتندّب.",
    summaryEn: "Cooling a burn under cool running water for 20 minutes stops ongoing tissue damage and relieves pain.",
    stepsAr: [
      "أبعد المصاب عن مصدر الخطر: أطفئ اللهب أو افصل مصدر الكهرباء أو السائل الساخن فوراً مع الحفاظ على سلامتك.",
      "برّد الحرق بالماء الجاري 20 دقيقة: ضع المنطقة المحروقة تحت ماء صنبور جارٍ فاتر (معتدل البرودة) لمدة 20 دقيقة كاملة.",
      "انزع الإكسسوارات فوراً: اخلع الخواتم، الساعات، الأحزمة، أو الملابس الضيقة حول الحرق برفق قبل أن يبدأ الجلد في التورم.",
      "لا تنزع الملابس الملتصقة: إذا التصق القماش بالجلد المحروق، اتركه مكانه وقص حوله فقط.",
      "غطِّ الحرق بشاش نظيف غير لاصق: ضع شاشاً معقماً غير لاصق أو ورق تغليف بلاستيكي نظيف (Cling film) بشكل فضفاض دون لفّ ضاغط.",
      "ممنوعات قاطعة: لا تضع ثلجاً مباشراً، معجون أسنان، زبدة، زيتاً، بنّاً، أو كريمات غير طبية، ولا تفتح الفقاعات المائية أبداً.",
      "اطلب الرعاية الطبية: توجّه للمستشفى أو اتصل بالإسعاف إذا كان الحرق أكبر من كف اليد، أو في الوجه أو اليدين أو المفاصل، أو كان ناتجاً عن كهرباء أو مواد كيميائية."
    ],
    stepsEn: [
      "Ensure safety: Move the person away from the heat source, flame, or electrical hazard.",
      "Cool the burn for 20 minutes: Hold the burned area under cool (not ice-cold) running tap water for a full 20 minutes.",
      "Remove tight items early: Gently take off rings, watches, bracelets, or tight clothing near the burn before swelling develops.",
      "Do not peel stuck clothing: If fabric is stuck to the burn, leave it in place and cut around it.",
      "Cover loosely: Place sterile non-stick gauze or clean plastic cling film loosely over the burn without wrapping tightly.",
      "Never apply home remedies: Do NOT put ice, butter, oil, toothpaste, or creams on a burn, and never pop blisters.",
      "Seek urgent medical care: Go to a hospital or call EMS if the burn is larger than the person's palm, involves the face/hands/joints, or is electrical/chemical."
    ]
  }
};

const LIBRARY_GALLERY_KEYS = ["choking", "bleeding", "unresponsive", "cpr"];

function setSmartImage(img, media, altText) {
  let index = 0;
  img.alt = altText;
  img.src = media.srcs[0];
  img.onerror = function () {
    index += 1;
    if (index < media.srcs.length) {
      img.src = media.srcs[index];
    } else {
      img.onerror = null;
    }
  };
}

function matchMediaForText(text) {
  const lower = String(text || "").toLowerCase();
  const keys = Object.keys(MEDIA_MAP);
  for (let i = 0; i < keys.length; i++) {
    const item = MEDIA_MAP[keys[i]];
    if (item.keys.some(function (k) { return lower.includes(k); })) {
      return item;
    }
  }
  return null;
}

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function listOf(items) {
  const ul = make("ul");
  items.forEach(function (item) {
    ul.append(make("li", "", item));
  });
  return ul;
}

function orderedListOf(items) {
  const ol = make("ol");
  ol.style.cssText = "margin:8px 0 0;padding-inline-start:24px;display:flex;flex-direction:column;gap:8px;line-height:1.75;";
  items.forEach(function (item) {
    ol.append(make("li", "", item));
  });
  return ol;
}

function render() {
  if (!app) return;
  app.replaceChildren.apply(app, arguments);
  window.scrollTo(0, 0);
}

function safetyNotice() {
  return make("p", "notice", safeT("notice") + safeEmergencyNo());
}

function hero() {
  const box = make("section", "hero");
  const logo = make("div", "hero-logo");
  logo.innerHTML = LOGO_SVG;
  box.append(
    logo,
    make("h1", "hero-title", safeT("siteTitle")),
    make("p", "tagline", safeT("tagline")),
    make("p", "purpose", safeT("purposeText"))
  );
  return box;
}

function abcdeOverviewSection() {
  const en = safeGetLang() === "en";
  const wrap = make("section", "abcde-overview");
  const heading = make(
    "h2",
    "abcde-overview-title",
    en ? "Primary Survey Steps (ABCDE — Always Check in Order):" : "خطوات التقييم الأولي الثابتة (ABCDE — افحص بهذا الترتيب دائماً):"
  );

  const items = en
    ? [
        { l: "A", name: "Airway", desc: "Ensure airway is open and clear of obstruction." },
        { l: "B", name: "Breathing", desc: "Look, listen, and feel for normal breathing." },
        { l: "C", name: "Circulation", desc: "Control severe bleeding and check pulse/skin." },
        { l: "D", name: "Disability", desc: "Check consciousness level (AVPU) and pupils." },
        { l: "E", name: "Exposure", desc: "Inspect for hidden injuries and prevent heat loss." }
      ]
    : [
        { l: "A", name: "مجرى الهواء (Airway)", desc: "تأكد أن مجرى الهواء مفتوح ولا يوجد انسداد." },
        { l: "B", name: "التنفس (Breathing)", desc: "راقب حركة الصدر واسمع صوت التنفس الطبيعي." },
        { l: "C", name: "الدورة الدموية (Circulation)", desc: "أوقف أي نزيف حاد وافحص النبض ولون الجلد." },
        { l: "D", name: "الوعي (Disability)", desc: "قيّم درجة الوعي والاستجابة (AVPU)." },
        { l: "E", name: "الفحص الشامل (Exposure)", desc: "ابحث عن إصابات أخرى وحافظ على دفء المصاب." }
      ];

  const strip = make("div", "abcde-strip");
  items.forEach(function (it) {
    const card = make("div", "abcde-pill-card");
    card.append(make("span", "abcde-letter-badge", it.l), make("strong", "", it.name), make("span", "", it.desc));
    strip.append(card);
  });

  wrap.append(heading, strip);
  return wrap;
}

function buildMediaCard(media, useArabic) {
  const card = make("div", "media-guide-card");
  const img = make("img");
  setSmartImage(img, media, useArabic ? media.titleAr : media.titleEn);

  const info = make("div", "media-guide-info");
  info.append(
    make("h3", "", useArabic ? media.titleAr : media.titleEn),
    make("p", "", useArabic ? media.descAr : media.descEn)
  );

  const ytLink = make("a", "btn btn-yt", useArabic ? "▶ شاهد الشرح العملي على يوتيوب ↗" : "▶ Watch Video Tutorial on YouTube ↗");
  ytLink.href = ytWatchUrl(useArabic ? media.ytAr : media.ytEn);
  ytLink.target = "_blank";
  ytLink.rel = "noopener noreferrer";
  info.append(ytLink);

  card.append(img, info);
  return card;
}

function ensureCompleteSteps(analysis, userText) {
  const lang = safeGetLang();
  const useAr = lang === "ar";
  const matched = matchMediaForText(userText);
  const out = Object.assign(
    {
      triage: "urgent",
      summary: "",
      steps: [],
      A: { checks: [], actions: [] },
      B: { checks: [], actions: [] },
      C: { checks: [], actions: [] },
      D: { checks: [], actions: [] },
      E: { checks: [], actions: [] },
      notes: []
    },
    analysis || {}
  );

  if (!Array.isArray(out.steps) || out.steps.length === 0) {
    if (matched) {
      out.steps = (useAr ? matched.stepsAr : matched.stepsEn).slice();
    } else {
      out.steps = useAr
        ? [
            "أمّن المكان حول المصاب وتأكد من سلامتك قبل الاقتراب.",
            "تحقق من درجة الوعي والكلام والحركة، واطلب الإسعاف (" + safeEmergencyNo() + ") فوراً لأي أعراض عصبية أو مفاجئة.",
            "راقب التنفس جيداً؛ إذا كان المصاب فاقداً للوعي ويتنفس فاجعله في وضعية الإفاقة، وإذا توقف التنفس فابدأ الإنعاش القلبي الرئوي (30 ضغطة + نفسان).",
            "إذا وُجد نزيف ظاهر، اضغط مباشرة على مكان النزيف بقماش نظيف أو شاش ولا تترك المصاب بمفرده حتى وصول الإسعاف."
          ]
        : [
            "Ensure the scene is safe before approaching the person.",
            "Check responsiveness, speech, and limb movement, and call emergency services (" + safeEmergencyNo() + ") immediately for sudden or neurological symptoms.",
            "Monitor breathing closely; place an unresponsive breathing person in the recovery position, or start CPR (30 compressions + 2 breaths) if not breathing.",
            "If bleeding is present, apply direct pressure with a clean cloth and stay with the person until EMS arrives."
          ];
    }
  }

  if (!out.summary || !String(out.summary).trim()) {
    if (matched) {
      out.summary = useAr ? matched.summaryAr : matched.summaryEn;
    }
  }

  return out;
}

function renderResult(rawAnalysis, userText) {
  const useAr = safeGetLang() === "ar";
  const a = ensureCompleteSteps(rawAnalysis, userText);
  const box = make("section", "result");
  box.append(make("div", "triage triage-" + a.triage, safeT("triage_" + a.triage)));
  if (a.summary) box.append(make("p", "summary", a.summary));

  if (a.steps && a.steps.length) {
    const stepsCard = make("section", "abcde");
    stepsCard.style.borderWidth = "2px";
    stepsCard.style.borderColor = "var(--blue-text)";
    stepsCard.append(
      make("h2", "", useAr ? "الخطوات التفصيلية للتعامل مع الحالة (تعمل إيه بالترتيب):" : "Detailed Step-by-Step Action Guide (What to Do):"),
      orderedListOf(a.steps)
    );
    box.append(stepsCard);
  }

  const matchedMedia = matchMediaForText(userText);
  if (matchedMedia) {
    box.append(buildMediaCard(matchedMedia, useAr));
  }

  ["A", "B", "C", "D", "E"].forEach(function (letter) {
    const sec = a[letter];
    if (!sec || (!sec.checks.length && !sec.actions.length)) return;
    const card = make("section", "abcde");
    card.append(make("h2", "", safeT("abcde" + letter)));
    if (sec.checks.length) card.append(make("h3", "", safeT("checksTitle")), listOf(sec.checks));
    if (sec.actions.length) card.append(make("h3", "", safeT("actionsTitle")), listOf(sec.actions));
    box.append(card);
  });

  if (a.notes && a.notes.length) box.append(listOf(a.notes));
  if (a.triage === "immediate" || a.triage === "urgent") {
    box.append(make("p", "notice", safeT("callNow") + safeEmergencyNo()));
  }
  box.append(make("p", "muted", safeT("disclaimer")));
  return box;
}

function showHome() {
  const en = safeGetLang() === "en";
  const input = make("textarea", "case-input");
  input.rows = 4;
  input.value = lastCase;
  input.placeholder = safeT("caseInputPlaceholder");
  input.setAttribute("aria-label", safeT("caseTitle"));

  const analyzeBtn = make("button", "btn", safeT("analyze"));
  analyzeBtn.type = "button";
  const statusMsg = make("p", "muted");
  const result = make("div");

  async function runAnalysis() {
    const text = input.value.trim();
    if (!text) {
      statusMsg.textContent = safeT("emptyCase");
      return;
    }
    lastCase = text;

    result.replaceChildren(renderResult(null, text));
    result.scrollIntoView({ behavior: "smooth", block: "start" });

    if (typeof analyzeCase === "function") {
      analyzeBtn.disabled = true;
      statusMsg.textContent = safeT("analyzing");
      try {
        const analysis = await analyzeCase(text);
        result.replaceChildren(renderResult(analysis, text));
      } catch (e) {
        console.warn("AI update skipped:", e.message);
      }
      analyzeBtn.disabled = false;
      statusMsg.textContent = "";
    }
  }

  analyzeBtn.addEventListener("click", runAnalysis);

  const quickCases = [
    {
      id: "choking",
      media: MEDIA_MAP.choking,
      titleAr: "اختناق شخص بالغ",
      titleEn: "Adult Choking",
      promptAr: "شخص يمسك رقبته ومش قادر يتكلم أو يسعل بقوة بسبب الاختناق، أتصرف إزاي بالتفصيل؟",
      promptEn: "An adult is clutching their throat and cannot speak or cough forcefully. What should I do step by step?"
    },
    {
      id: "bleeding",
      media: MEDIA_MAP.bleeding,
      titleAr: "نزيف شديد في الطرف",
      titleEn: "Severe Limb Bleeding",
      promptAr: "جرح عميق والدم بينزف بغزارة، إزاي أوقف النزيف بالتفصيل لحد وصول الإسعاف؟",
      promptEn: "Deep wound with heavy bleeding. How do I stop the bleeding step by step until EMS arrives?"
    },
    {
      id: "unresponsive",
      media: MEDIA_MAP.unresponsive,
      titleAr: "فاقد الوعي ومتنفس",
      titleEn: "Unresponsive & Breathing",
      promptAr: "شخص واقع على الأرض ومش بيرد لكن بيتنفس عادي، أعمل إيه بالتفصيل؟",
      promptEn: "Someone is unresponsive on the floor but breathing normally. What should I do step by step?"
    },
    {
      id: "cpr",
      media: MEDIA_MAP.cpr,
      titleAr: "توقف التنفس والإنعاش (CPR)",
      titleEn: "Cardiac Arrest (CPR)",
      promptAr: "شخص سقط فجأة ولا يستجيب ولا يتنفس، كيف أبدأ الإنعاش القلبي الرئوي بالتفصيل؟",
      promptEn: "Someone collapsed, is unresponsive and not breathing. How do I perform CPR step by step?"
    }
  ];

  const examples = make("div", "examples");
  const cardButtons = quickCases.map(function (item) {
    const b = make("button", "case-card");
    b.type = "button";
    const img = make("img", "case-thumb");
    setSmartImage(img, item.media, en ? item.titleEn : item.titleAr);

    const body = make("div", "case-card-body");
    body.append(
      make("span", "case-name", en ? item.titleEn : item.titleAr),
      make("span", "case-hint", en ? "Click for detailed steps & video" : "اضغط للخطوات التفصيلية والفيديو")
    );
    b.append(img, body);

    b.addEventListener("click", function () {
      cardButtons.forEach(function (btn) { btn.classList.remove("active"); });
      b.classList.add("active");
      const prompt = en ? item.promptEn : item.promptAr;
      input.value = prompt;
      lastCase = prompt;
      runAnalysis();
    });
    examples.append(b);
    return b;
  });

  const caseBox = make("section", "case-box-wrapper");
  caseBox.append(make("h2", "", safeT("caseTitle")), make("p", "muted", safeT("caseHelp")), input, analyzeBtn, statusMsg);

  render(
    hero(),
    abcdeOverviewSection(),
    make("h2", "", en ? "Choose an Emergency Case (Detailed Steps & Video):" : "اختر حالة طارئة سريعة (بالخطوات التفصيلية والفيديو):"),
    examples,
    caseBox,
    safetyNotice(),
    result
  );
}

const AGE_LABELS = {
  adult: { ar: "البالغ", en: "Adult" },
  child: { ar: "طفل", en: "Child" },
  infant: { ar: "رضيع", en: "Infant" },
  elderly: { ar: "كبير السن", en: "Elderly" }
};

function findTopic(id) {
  if (typeof LIBRARY === "undefined") return null;
  for (let i = 0; i < LIBRARY.length; i++) {
    const topic = LIBRARY[i].topics.find(function (tp) { return tp.id === id; });
    if (topic) return topic;
  }
  return null;
}

const SECTION_COVERS = {
  assess: MEDIA_MAP.unresponsive,
  vitals: MEDIA_MAP.cpr,
  emergencies: MEDIA_MAP.bleeding
};

function showLibrary() {
  if (typeof LIBRARY === "undefined") {
    render(make("h1", "", safeT("libTitle")), make("p", "", safeGetLang() === "en" ? "Library data is not loaded." : "ملف library.js غير محمّل."));
    return;
  }
  const grid = make("div", "grid");
  LIBRARY.forEach(function (sec) {
    const c = make("a", "card");
    c.href = "#section/" + sec.id;
    const coverMedia = SECTION_COVERS[sec.id] || MEDIA_MAP.cpr;
    const titleText = getSectionTitle(sec);
    const introText = getSectionIntro(sec);
    const img = make("img", "card-cover");
    setSmartImage(img, coverMedia, titleText);
    c.append(img, make("h2", "", titleText), make("p", "", introText));
    grid.append(c);
  });
  render(
    make("h1", "", safeT("libTitle")),
    make("p", "muted", safeT("libSub")),
    safetyNotice(),
    grid
  );
}

function showSection(id) {
  if (typeof LIBRARY === "undefined") return showLibrary();
  const sec = LIBRARY.find(function (s) { return s.id === id; });
  if (!sec) return showLibrary();
  const secTitle = getSectionTitle(sec);
  const secIntro = getSectionIntro(sec);
  const grid = make("div", "grid");
  (sec.topics || []).forEach(function (tp) {
    const c = make("a", "card");
    c.href = "#topic/" + tp.id;
    const mediaKey = tp.gallery !== undefined ? LIBRARY_GALLERY_KEYS[tp.gallery] : "unresponsive";
    const media = MEDIA_MAP[mediaKey] || MEDIA_MAP.cpr;
    const tTitle = getTopicTitle(tp);
    const tSummary = getTopicSummary(tp);
    const img = make("img", "card-cover");
    setSmartImage(img, media, tTitle);
    c.append(img, make("h2", "", tTitle), make("p", "", tSummary));
    grid.append(c);
  });
  const back = make("a", "back", safeT("backLib"));
  back.href = "#library";
  render(back, make("h1", "", secTitle), make("p", "", secIntro), grid, safetyNotice());
}

function showTopic(id) {
  const topic = findTopic(id);
  if (!topic) return showLibrary();
  const lang = safeGetLang();
  const en = lang === "en";
  const back = make("a", "back", safeT("backSec"));
  back.href = "#section/" + topic.section;
  const tabsRow = make("div");
  tabsRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:12px 0";
  const body = make("div");

  const tabs = [{
    key: "adult",
    label: AGE_LABELS.adult[lang] || "البالغ",
    title: getTopicTitle(topic),
    steps: topic.steps,
    note: topic.note,
    art: topic.gallery
  }];

  Object.keys(topic.ages || {}).forEach(function (key) {
    const ageObj = topic.ages[key] || {};
    const ageLabel = AGE_LABELS[key] ? AGE_LABELS[key][lang] : key;
    tabs.push(Object.assign({
      key: key,
      label: ageLabel,
      title: en && ageObj.titleEn ? ageObj.titleEn : (ageObj.title || getTopicTitle(topic))
    }, ageObj));
  });

  const buttons = tabs.map(function (tab) {
    const btn = make("button", "chip", tab.label);
    btn.type = "button";
    btn.addEventListener("click", function () { show(tab, btn); });
    tabsRow.append(btn);
    return btn;
  });

  function show(tab, active) {
    buttons.forEach(function (b) { b.style.background = ""; b.style.color = ""; });
    active.style.background = "var(--blue)";
    active.style.color = "var(--on-blue)";
    body.replaceChildren();

    const stepList = en && Array.isArray(tab.stepsEn) && tab.stepsEn.length ? tab.stepsEn : (tab.steps || []);
    const noteText = en && tab.noteEn ? tab.noteEn : tab.note;

    body.append(make("h2", "", tab.title), orderedListOf(stepList));
    if (noteText) body.append(make("p", "notice", noteText));

    const mediaKey = tab.art !== undefined && tab.art !== null
      ? LIBRARY_GALLERY_KEYS[tab.art]
      : (topic.id === "abcde" || topic.id === "avpu" ? "unresponsive" : "cpr");
    const media = MEDIA_MAP[mediaKey];
    if (media) body.append(buildMediaCard(media, !en));
  }
  show(tabs[0], buttons[0]);

  render(back, make("h1", "", getTopicTitle(topic)), make("p", "", getTopicSummary(topic)), tabsRow, body, safetyNotice());
}

function syncChromeTexts() {
  const lang = safeGetLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  const emEl = document.getElementById("emergency-number");
  const sosEl = document.getElementById("sos");
  const sosNumEl = document.getElementById("sos-num");
  if (emEl) emEl.textContent = safeEmergencyNo();
  if (sosEl) sosEl.href = "tel:" + safeEmergencyNo();
  if (sosNumEl) sosNumEl.textContent = safeEmergencyNo();

  if (typeof applyLang === "function") {
    applyLang();
  }
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const k = el.getAttribute("data-i18n");
    if (k) el.textContent = safeT(k);
  });

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.textContent = safeT("langBtn");
  }
  applyTheme();
}

function route() {
  try {
    syncChromeTexts();
    const parts = location.hash.replace("#", "").split("/");
    const page = parts[0];
    const id = parts[1];
    if (page === "library" || page === "reference") showLibrary();
    else if (page === "section") showSection(id);
    else if (page === "topic") showTopic(id);
    else showHome();
  } catch (err) {
    console.error("Route error:", err);
    if (app) app.textContent = (safeGetLang() === "en" ? "Error loading page: " : "حدث خطأ أثناء تحميل الصفحة: ") + err.message;
  }
}

const THEME_KEY = "firstaid-theme";

function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch (err) {
    return "light";
  }
}

function applyTheme(theme) {
  const current = theme || document.documentElement.dataset.theme || getTheme();
  document.documentElement.dataset.theme = current;
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) toggleBtn.textContent = safeT(current === "dark" ? "themeToLight" : "themeToDark");
}

function initApp() {
  try {
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        applyTheme(next);
      });
    }

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        const nextLang = safeGetLang() === "ar" ? "en" : "ar";
        safeSetLang(nextLang);
        route();
      });
    }

    applyTheme(getTheme());
    syncChromeTexts();
    window.addEventListener("hashchange", route);
    route();
  } catch (err) {
    if (app) app.textContent = "خطأ في تشغيل التطبيق: " + err.message;
  }
}

initApp();
