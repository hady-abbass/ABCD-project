const app = document.getElementById("app");
let lastCase = "";

const LOGO_SVG = '<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#ffffff"/><path d="M19 6h10v11h11v10H29v11H19V27H8V17h11z" fill="#0066CC"/><path d="M4 42h10l3-5 4 9 4-7 3 3h16" fill="none" stroke="#C62828" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function ytWatchUrl(id) {
  return "https:/" + "/www.youtube.com/watch?v=" + id;
}

function ytThumbUrl(id) {
  return "https:/" + "/i.ytimg.com/vi/" + id + "/hqdefault.jpg";
}

function safeGetLang() {
  return typeof getLang === "function" ? getLang() : "ar";
}

function safeEmergencyNo() {
  return typeof emergencyNo === "function" ? emergencyNo() : "123";
}

function safeT(key) {
  if (typeof t === "function") {
    const val = t(key);
    if (val) return val;
  }
  const fallback = {
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
    actionsTitle: "تصرّف (Action):"
  };
  return fallback[key] || key;
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

function currentAppLang() {
  if (typeof getLang === "function") return getLang();
  return document.documentElement.lang === "en" ? "en" : "ar";
}

function isArabicStr(str) {
  return /[\u0600-\u06FF]/.test(String(str || ""));
}

const PHRASE_EN_MAP = {
  "التقييم الأولي": "Primary Assessment",
  "خطوات ABCDE": "ABCDE Steps",
  "مجرى الهواء": "Airway",
  "التنفس": "Breathing",
  "الدورة الدموية": "Circulation",
  "الوعي": "Disability",
  "الفحص الشامل": "Exposure",
  "الاختناق": "Choking",
  "النزيف": "Bleeding",
  "الجروح": "Wounds",
  "الحروق": "Burns",
  "الإغماء": "Fainting / Unconsciousness",
  "فقدان الوعي": "Loss of Consciousness",
  "وضعية الإفاقة": "Recovery Position",
  "الإنعاش القلبي الرئوي": "Cardiopulmonary Resuscitation (CPR)",
  "تأكد أن مجرى الهواء مفتوح ولا يوجد انسداد.": "Ensure the airway is open and clear of any obstruction.",
  "راقب حركة الصدر واسمع صوت التنفس الطبيعي.": "Watch chest movement and listen/feel for normal breathing.",
  "أوقف أي نزيف حاد وافحص النبض ولون الجلد.": "Control severe bleeding and check pulse and skin color.",
  "قيّم درجة الوعي والاستجابة (AVPU).": "Assess consciousness and responsiveness (AVPU).",
  "ابحث عن إصابات أخرى وحافظ على دفء المصاب.": "Check for other injuries and keep the person warm."
};

function translateFallbackToEn(text) {
  const clean = String(text || "").trim();
  if (!clean) return "";
  if (PHRASE_EN_MAP[clean]) return PHRASE_EN_MAP[clean];
  return clean;
}

function translateFallbackToAr(text) {
  const clean = String(text || "").trim();
  if (!clean) return "";
  const entries = Object.entries(PHRASE_EN_MAP);
  for (let i = 0; i < entries.length; i++) {
    if (entries[i][1].toLowerCase() === clean.toLowerCase()) {
      return entries[i][0];
    }
  }
  return clean;
}

function pickLangText(val, targetLang) {
  const lang = targetLang || currentAppLang();
  if (val && typeof val === "object" && !Array.isArray(val)) {
    return String(val[lang] || val.ar || val.en || "");
  }
  const str = String(val || "");
  if (!str) return "";
  if (lang === "en" && isArabicStr(str)) {
    return translateFallbackToEn(str);
  }
  if (lang === "ar" && !isArabicStr(str)) {
    return translateFallbackToAr(str);
  }
  return str;
}

function pickLangList(listVal, targetLang) {
  const lang = targetLang || currentAppLang();
  if (!listVal) return [];
  if (Array.isArray(listVal)) {
    return listVal.map(function (item) { return pickLangText(item, lang); }).filter(Boolean);
  }
  if (typeof listVal === "object") {
    const arr = listVal[lang] || listVal.ar || listVal.en || [];
    return Array.isArray(arr) ? arr.map(function (item) { return pickLangText(item, lang); }).filter(Boolean) : [];
  }
  return [];
}

function applyDocumentDirection(lang) {
  const activeLang = lang || currentAppLang();
  document.documentElement.lang = activeLang;
  document.documentElement.dir = activeLang === "ar" ? "rtl" : "ltr";
}

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
