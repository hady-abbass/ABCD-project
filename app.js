// app.js: crash-proof UI, permanent ABCDE cards, real photos, YouTube links, and library.

const app = document.getElementById("app");
let lastCase = "";

const LOGO_SVG = `<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#ffffff"/><path d="M19 6h10v11h11v10H29v11H19V27H8V17h11z" fill="#0066CC"/><path d="M4 42h10l3-5 4 9 4-7 3 3h16" fill="none" stroke="#C62828" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const YT_WATCH_BASE = ["https:/", "www.youtube.com/watch?v="].join("/");
const YT_IMG_BASE = ["https:/", "i.ytimg.com/vi/"].join("/");
const ytWatchUrl = (id) => YT_WATCH_BASE + id;
const ytThumbUrl = (id) => YT_IMG_BASE + id + "/hqdefault.jpg";

// دوال حماية تمنع توقف الصفحة إذا حدث خطأ في أي ملف خارجي
const safeGetLang = () => (typeof getLang === "function" ? getLang() : "ar");
const safeEmergencyNo = () => (typeof emergencyNo === "function" ? emergencyNo() : "123");
const safeT = (key) => {
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
    analyzing: "جاري تحليل الحالة...",
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
};

const MEDIA_MAP = {
  choking: {
    srcs: ["images/choking.webp", "images/1000_F_233179021_W3oUrTc4MTjTZZvC1KMANt3Z9jEqZUew.webp", ytThumbUrl("HGBBu4zr8sM")],
    ytAr: "81BXd2Gi6kg",
    ytEn: "HGBBu4zr8sM",
    titleAr: "إسعاف الاختناق (مناورة هيمليك والضربات الظهرية)",
    titleEn: "Choking First Aid (Back Blows & Heimlich)",
    descAr: "5 ضربات بين لوحي الكتف بالتبادل مع 5 ضغطات بطنية أعلى السرة.",
    descEn: "Alternate 5 firm back blows with 5 inward-and-upward abdominal thrusts.",
    keys: ["اختناق", "شرق", "بلع", "مجرى الهواء", "choking", "heimlich", "airway"]
  },
  bleeding: {
    srcs: ["images/bleeding.jpg", "images/pexels-rdne-6520110.jpg", ytThumbUrl("NxO5LvgqZe0")],
    ytAr: "_ofcOGEsa7c",
    ytEn: "NxO5LvgqZe0",
    titleAr: "إيقاف النزيف وتضميد الجروح",
    titleEn: "Bleeding Control & Wound Dressing",
    descAr: "اضغط مباشرة بشاش معقم بقوة وارفع الطرف المصاب فوق مستوى القلب.",
    descEn: "Apply firm direct pressure with sterile gauze and elevate the injured limb.",
    keys: ["نزيف", "قطع", "جرح", "دم", "صباع", "bleeding", "cut", "wound", "circulation"]
  },
  unresponsive: {
    srcs: ["images/recovery.jpg", "images/pexels-mikhail-nilov-8942737.jpg", ytThumbUrl("GmqXqwSV3bo")],
    ytAr: "6ZmWhzrfPPY",
    ytEn: "GmqXqwSV3bo",
    titleAr: "فقدان الوعي ووضعية الإفاقة",
    titleEn: "Unresponsive & Recovery Position",
    descAr: "تأكد من التنفس، اقلب المصاب على جانبه لفتح مجرى الهواء، واطلب الإسعاف.",
    descEn: "Check breathing, roll onto side to keep airway open, and call EMS.",
    keys: ["إغماء", "فاقد", "غيبوبة", "الإفاقة", "وقع", "unconscious", "unresponsive", "faint", "recovery"]
  },
  cpr: {
    srcs: ["images/cpr.jpg", "images/pexels-tahir-33029223.jpg", ytThumbUrl("BQNNOh8c8ks")],
    ytAr: "JIFt-55TRGk",
    ytEn: "BQNNOh8c8ks",
    titleAr: "الإنعاش القلبي الرئوي (CPR)",
    titleEn: "Cardiopulmonary Resuscitation (CPR)",
    descAr: "30 ضغطة في منتصف الصدر بعمق 5-6 سم تليها نفسان إنقاذيان.",
    descEn: "30 chest compressions (5–6 cm deep at 100–120/min) followed by 2 rescue breaths.",
    keys: ["قلب", "نبض", "تنفس", "إنعاش", "توقف", "cpr", "cardiac", "pulse", "breathing"]
  },
  burns: {
    srcs: ["images/burns.jpg", ytThumbUrl("6i7ov4vbxUc")],
    ytAr: "HaC2oiBB7sI",
    ytEn: "6i7ov4vbxUc",
    titleAr: "إسعاف الحروق الحرارية",
    titleEn: "Thermal Burns First Aid",
    descAr: "برّد الحرق بماء جارٍ فاتر 20 دقيقة وغطِّه بشاش نظيف غير لاصق.",
    descEn: "Cool under running tap water for 20 minutes and cover loosely with sterile dressing.",
    keys: ["حرق", "حروق", "مية مغلية", "نار", "فقاعات", "burn", "burns", "scald"]
  }
};

const LIBRARY_GALLERY_KEYS = ["choking", "bleeding", "unresponsive", "cpr"];

function setSmartImage(img, media, altText) {
  let index = 0;
  img.alt = altText;
  img.src = media.srcs[0];
  img.onerror = () => {
    index += 1;
    if (index < media.srcs.length) img.src = media.srcs[index];
    else img.onerror = null;
  };
}

function matchMediaForText(text) {
  const lower = String(text || "").toLowerCase();
  for (const key of Object.keys(MEDIA_MAP)) {
    if (MEDIA_MAP[key].keys.some((k) => lower.includes(k))) return MEDIA_MAP[key];
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
  items.forEach((item) => ul.append(make("li", "", item)));
  return ul;
}

function render(...nodes) {
  app.replaceChildren(...nodes);
  window.scrollTo(0, 0);
}

function safetyNotice() {
  return make("p", "notice", safeT("notice") + safeEmergencyNo());
}

function hero() {
  const box = make("section", "hero");
  const logo = make("div", "hero-logo");
  logo.innerHTML = LOGO_SVG;
  box.append(logo, make("h1", "hero-title", safeT("siteTitle")), make("p", "tagline", safeT("tagline")), make("p", "purpose", safeT("purposeText")));
  return box;
}

function abcdeOverviewSection() {
  const en = safeGetLang() === "en";
  const wrap = make("section", "abcde-overview");
  const heading = make("h2", "abcde-overview-title", en ? "Primary Survey Steps (ABCDE — Always Check in Order):" : "خطوات التقييم الأولي الثابتة (ABCDE — افحص بهذا الترتيب دائماً):");

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
  items.forEach((it) => {
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
