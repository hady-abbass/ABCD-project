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
}

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

function renderResult(a, userText) {
  const useAr = /[\u0600-\u06FF]/.test(userText);
  const box = make("section", "result");
  box.append(make("div", "triage triage-" + a.triage, safeT("triage_" + a.triage)));
  if (a.summary) box.append(make("p", "summary", a.summary));

  const matchedMedia = matchMediaForText(userText);
  if (matchedMedia) box.append(buildMediaCard(matchedMedia, useAr));

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
    analyzeBtn.disabled = true;
    statusMsg.textContent = safeT("analyzing");
    let analysis;
    if (typeof analyzeCase === "function") {
      analysis = await analyzeCase(text);
    } else {
      analysis = {
        triage: "urgent",
        summary: en ? "Follow the visual guide and ABCDE steps below." : "اتبع الدليل المصور وخطوات ABCDE بالأسفل.",
        A: { checks: [], actions: [] },
        B: { checks: [], actions: [] },
        C: { checks: [], actions: [] },
        D: { checks: [], actions: [] },
        E: { checks: [], actions: [] },
        notes: []
      };
    }
    analyzeBtn.disabled = false;
    statusMsg.textContent = "";
    result.replaceChildren(renderResult(analysis, text));
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  analyzeBtn.addEventListener("click", runAnalysis);

  const quickCases = [
    {
      id: "choking",
      media: MEDIA_MAP.choking,
      titleAr: "اختناق شخص بالغ",
      titleEn: "Adult Choking",
      promptAr: "شخص يمسك رقبته ومش قادر يتكلم أو يسعل بقوة بسبب الاختناق، أتصرف إزاي؟",
      promptEn: "An adult is clutching their throat and cannot speak or cough forcefully. What should I do?"
    },
    {
      id: "bleeding",
      media: MEDIA_MAP.bleeding,
      titleAr: "نزيف شديد في الطرف",
      titleEn: "Severe Limb Bleeding",
      promptAr: "جرح عميق والدم بينزف بغزارة، إزاي أوقف النزيف لحد وصول الإسعاف؟",
      promptEn: "Deep wound with heavy bleeding. How do I stop the bleeding until EMS arrives?"
    },
    {
      id: "unresponsive",
      media: MEDIA_MAP.unresponsive,
      titleAr: "فاقد الوعي ومتنفس",
      titleEn: "Unresponsive & Breathing",
      promptAr: "شخص واقع على الأرض ومش بيرد لكن بيتنفس عادي، أعمل إيه؟",
      promptEn: "Someone is unresponsive on the floor but breathing normally. What should I do?"
    },
    {
      id: "cpr",
      media: MEDIA_MAP.cpr,
      titleAr: "توقف التنفس والإنعاش (CPR)",
      titleEn: "Cardiac Arrest (CPR)",
      promptAr: "شخص سقط فجأة ولا يستجيب ولا يتنفس، كيف أبدأ الإنعاش القلبي الرئوي؟",
      promptEn: "Someone collapsed, is unresponsive and not breathing. How do I start CPR?"
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
      make("span", "case-hint", en ? "Click for instant steps & video" : "اضغط للتحليل الفوري والفيديو")
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
    make("h2", "", en ? "Choose an Emergency Case (Photo & Video):" : "اختر حالة طارئة سريعة (بالصورة والفيديو):"),
    examples,
    caseBox,
    safetyNotice(),
    result
  );
}

const AGE_LABELS = { child: "طفل", infant: "رضيع", elderly: "كبير السن" };

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
  const en = safeGetLang() === "en";
  if (typeof LIBRARY === "undefined") {
    render(make("h1", "", "المكتبة"), make("p", "", "ملف library.js غير محمّل."));
    return;
  }
  const grid = make("div", "grid");
  LIBRARY.forEach(function (sec) {
    const c = make("a", "card");
    c.href = "#section/" + sec.id;
    const coverMedia = SECTION_COVERS[sec.id] || MEDIA_MAP.cpr;
    const img = make("img", "card-cover");
    setSmartImage(img, coverMedia, sec.title);
    c.append(img, make("h2", "", sec.title), make("p", "", sec.intro));
    grid.append(c);
  });
  render(
    make("h1", "", en ? "First-Aid Library" : "مكتبة الإسعافات الأولية"),
    make("p", "muted", en ? "Select a section and condition for real-photo steps and video tutorials." : "اختر القسم ثم الحالة لعرض الخطوات بالصور الحقيقية وفيديو الشرح العملي لكل فئة عمرية."),
    safetyNotice(),
    grid
  );
}

function showSection(id) {
  if (typeof LIBRARY === "undefined") return showLibrary();
  const sec = LIBRARY.find(function (s) { return s.id === id; });
  if (!sec) return showLibrary();
  const grid = make("div", "grid");
  sec.topics.forEach(function (tp) {
    const c = make("a", "card");
    c.href = "#topic/" + tp.id;
    const mediaKey = tp.gallery !== undefined ? LIBRARY_GALLERY_KEYS[tp.gallery] : "unresponsive";
    const media = MEDIA_MAP[mediaKey] || MEDIA_MAP.cpr;
    const img = make("img", "card-cover");
    setSmartImage(img, media, tp.title);
    c.append(img, make("h2", "", tp.title), make("p", "", tp.summary));
    grid.append(c);
  });
  const back = make("a", "back", safeGetLang() === "en" ? "← Library" : "→ المكتبة");
  back.href = "#library";
  render(back, make("h1", "", sec.title), make("p", "", sec.intro), grid, safetyNotice());
}

function showTopic(id) {
  const topic = findTopic(id);
  if (!topic) return showLibrary();
  const en = safeGetLang() === "en";
  const back = make("a", "back", en ? "← Back" : "→ رجوع");
  back.href = "#section/" + topic.section;
  const tabsRow = make("div");
  tabsRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:12px 0";
  const body = make("div");

  const tabs = [{ key: "adult", label: "البالغ", title: topic.title, steps: topic.steps, note: topic.note, art: topic.gallery }];
  Object.keys(topic.ages || {}).forEach(function (key) {
    tabs.push(Object.assign({ key: key, label: AGE_LABELS[key] }, topic.ages[key]));
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

    const mediaKey = tab.art !== undefined && tab.art !== null ? LIBRARY_GALLERY_KEYS[tab.art] : (topic.id === "abcde" || topic.id === "avpu" ? "unresponsive" : "cpr");
    const media = MEDIA_MAP[mediaKey];
    if (media) body.append(buildMediaCard(media, !en));

    body.append(make("h2", "", tab.title), listOf(tab.steps));
    if (tab.note) body.append(make("p", "notice", tab.note));
  }
  show(tabs[0], buttons[0]);

  render(back, make("h1", "", topic.title), make("p", "", topic.summary), tabsRow, body, safetyNotice());
}

function route() {
  try {
    const parts = location.hash.replace("#", "").split("/");
    const page = parts[0];
    const id = parts[1];
    if (page === "library" || page === "reference") showLibrary();
    else if (page === "section") showSection(id);
    else if (page === "topic") showTopic(id);
    else showHome();
  } catch (err) {
    console.error("Route error:", err);
    if (app) app.textContent = "حدث خطأ أثناء تحميل الصفحة: " + err.message;
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
    const emEl = document.getElementById("emergency-number");
    const sosEl = document.getElementById("sos");
    const sosNumEl = document.getElementById("sos-num");
    if (emEl) emEl.textContent = safeEmergencyNo();
    if (sosEl) sosEl.href = "tel:" + safeEmergencyNo();
    if (sosNumEl) sosNumEl.textContent = safeEmergencyNo();

    if (typeof applyLang === "function") {
      applyLang();
    } else {
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        el.textContent = safeT(el.getAttribute("data-i18n"));
      });
    }

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
        if (typeof setLang === "function") setLang(safeGetLang() === "ar" ? "en" : "ar");
        if (typeof applyLang === "function") applyLang();
        applyTheme();
        route();
      });
    }

    applyTheme(getTheme());
    window.addEventListener("hashchange", route);
    route();
  } catch (err) {
    if (app) app.textContent = "خطأ في تشغيل التطبيق: " + err.message;
  }
}

initApp();
