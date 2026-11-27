// app.js: permanent ABCDE overview, auto-analyzing real-photo cards, fixed YouTube links, and photo-rich library.

const app = document.getElementById("app");
let lastCase = "";

const LOGO_SVG = `<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#ffffff"/><path d="M19 6h10v11h11v10H29v11H19V27H8V17h11z" fill="#0066CC"/><path d="M4 42h10l3-5 4 9 4-7 3 3h16" fill="none" stroke="#C62828" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// بناء روابط يوتيوب بشكل آمن يمنع تشوهها عند النسخ واللصق
const YT_WATCH_BASE = ["https:/", "www.youtube.com/watch?v="].join("/");
const YT_IMG_BASE = ["https:/", "i.ytimg.com/vi/"].join("/");

function ytWatchUrl(videoId) {
  return YT_WATCH_BASE + videoId;
}

function ytThumbUrl(videoId) {
  return YT_IMG_BASE + videoId + "/hqdefault.jpg";
}

// ربط الحالات بصورك الحقيقية (سواء بالاسم المختصر أو الاسم الأصلي المرفوع) وفيديوهات يوتيوب
const MEDIA_MAP = {
  choking: {
    srcs: [
      "images/choking.webp",
      "images/1000_F_233179021_W3oUrTc4MTjTZZvC1KMANt3Z9jEqZUew.webp",
      ytThumbUrl("HGBBu4zr8sM")
    ],
    ytAr: "81BXd2Gi6kg",
    ytEn: "HGBBu4zr8sM",
    titleAr: "إسعاف الاختناق (مناورة هيمليك والضربات الظهرية)",
    titleEn: "Choking First Aid (Back Blows & Heimlich)",
    descAr: "5 ضربات بين لوحي الكتف بالتبادل مع 5 ضغطات بطنية أعلى السرة.",
    descEn: "Alternate 5 firm back blows with 5 inward-and-upward abdominal thrusts.",
    keys: ["اختناق", "شرق", "بلع", "مجرى الهواء", "choking", "heimlich", "airway"]
  },
  bleeding: {
    srcs: [
      "images/bleeding.jpg",
      "images/pexels-rdne-6520110.jpg",
      ytThumbUrl("NxO5LvgqZe0")
    ],
    ytAr: "_ofcOGEsa7c",
    ytEn: "NxO5LvgqZe0",
    titleAr: "إيقاف النزيف وتضميد الجروح",
    titleEn: "Bleeding Control & Wound Dressing",
    descAr: "اضغط مباشرة بشاش معقم بقوة وارفع الطرف المصاب فوق مستوى القلب.",
    descEn: "Apply firm direct pressure with sterile gauze and elevate the injured limb.",
    keys: ["نزيف", "قطع", "جرح", "دم", "صباع", "bleeding", "cut", "wound", "circulation"]
  },
  unresponsive: {
    srcs: [
      "images/recovery.jpg",
      "images/pexels-mikhail-nilov-8942737.jpg",
      ytThumbUrl("GmqXqwSV3bo")
    ],
    ytAr: "6ZmWhzrfPPY",
    ytEn: "GmqXqwSV3bo",
    titleAr: "فقدان الوعي ووضعية الإفاقة",
    titleEn: "Unresponsive & Recovery Position",
    descAr: "تأكد من التنفس، اقلب المصاب على جانبه لفتح مجرى الهواء، واطلب الإسعاف.",
    descEn: "Check breathing, roll onto side to keep airway open, and call EMS.",
    keys: ["إغماء", "فاقد", "غيبوبة", "الإفاقة", "وقع", "unconscious", "unresponsive", "faint", "recovery"]
  },
  cpr: {
    srcs: [
      "images/cpr.jpg",
      "images/pexels-tahir-33029223.jpg",
      ytThumbUrl("BQNNOh8c8ks")
    ],
    ytAr: "JIFt-55TRGk",
    ytEn: "BQNNOh8c8ks",
    titleAr: "الإنعاش القلبي الرئوي (CPR)",
    titleEn: "Cardiopulmonary Resuscitation (CPR)",
    descAr: "30 ضغطة في منتصف الصدر بعمق 5-6 سم تليها نفسان إنقاذيان.",
    descEn: "30 chest compressions (5–6 cm deep at 100–120/min) followed by 2 rescue breaths.",
    keys: ["قلب", "نبض", "تنفس", "إنعاش", "توقف", "cpr", "cardiac", "pulse", "breathing"]
  },
  burns: {
    srcs: [
      "images/burns.jpg",
      ytThumbUrl("6i7ov4vbxUc")
    ],
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

// تحميل الصورة مع تجربة كل المسارات المحتملة تلقائياً
function setSmartImage(img, media, altText) {
  let index = 0;
  img.alt = altText;
  img.src = media.srcs[0];
  img.onerror = () => {
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
  for (const key of Object.keys(MEDIA_MAP)) {
    if (MEDIA_MAP[key].keys.some((k) => lower.includes(k))) {
      return MEDIA_MAP[key];
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
  items.forEach((item) => ul.append(make("li", "", item)));
  return ul;
}

function render(...nodes) {
  app.replaceChildren(...nodes);
  window.scrollTo(0, 0);
}

function safetyNotice() {
  return make("p", "notice", t("notice") + emergencyNo());
}

function hero() {
  const box = make("section", "hero");
  const logo = make("div", "hero-logo");
  logo.innerHTML = LOGO_SVG;
  box.append(logo, make("h1", "hero-title", t("siteTitle")), make("p", "tagline", t("tagline")), make("p", "purpose", t("purposeText")));
  return box;
}

// خطوات ABCDE الثابتة في أول الصفحة
function abcdeOverviewSection() {
  const en = getLang() === "en";
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

function localCase(raw) {
  const en = EN_SCENARIOS[raw.id];
  return getLang() === "en" && en
    ? { title: en.title, setting: en.setting }
    : { title: raw.title, setting: raw.setting };
}

function renderResult(a, userText) {
  const useAr = /[\u0600-\u06FF]/.test(userText);
  const box = make("section", "result");
  box.append(make("div", "triage triage-" + a.triage, t("triage_" + a.triage)));
  if (a.summary) box.append(make("p", "summary", a.summary));

  const matchedMedia = matchMediaForText(userText);
  if (matchedMedia) {
    box.append(buildMediaCard(matchedMedia, useAr));
  }

  ["A", "B", "C", "D", "E"].forEach((letter) => {
    const sec = a[letter];
    if (!sec || (!sec.checks.length && !sec.actions.length)) return;
    const card = make("section", "abcde");
    card.append(make("h2", "", t("abcde" + letter)));
    if (sec.checks.length) card.append(make("h3", "", t("checksTitle")), listOf(sec.checks));
    if (sec.actions.length) card.append(make("h3", "", t("actionsTitle")), listOf(sec.actions));
    box.append(card);
  });

  if (a.notes.length) box.append(listOf(a.notes));
  if (a.triage === "immediate" || a.triage === "urgent") {
    box.append(make("p", "notice", t("callNow") + emergencyNo()));
  }
  box.append(make("p", "muted", t("disclaimer")));
  return box;
}

function showHome() {
  const en = getLang() === "en";
  const input = make("textarea", "case-input");
  input.rows = 4;
  input.value = lastCase;
  input.placeholder = t("caseInputPlaceholder");
  input.setAttribute("aria-label", t("caseTitle"));

  const analyzeBtn = make("button", "btn", t("analyze"));
  analyzeBtn.type = "button";
  const statusMsg = make("p", "muted");
  const quickPreview = make("div");
  const result = make("div");

  async function runAnalysis() {
    const text = input.value.trim();
    if (!text) {
      statusMsg.textContent = t("emptyCase");
      return;
    }
    lastCase = text;
    quickPreview.replaceChildren();
    analyzeBtn.disabled = true;
    statusMsg.textContent = t("analyzing");
    const analysis = await analyzeCase(text);
    analyzeBtn.disabled = false;
    statusMsg.textContent = "";
    result.replaceChildren(renderResult(analysis, text));
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  analyzeBtn.addEventListener("click", runAnalysis);

  const examples = make("div", "examples");
  const quickCases = [
    { id: "choking", media: MEDIA_MAP.choking, raw: SCENARIOS.find((s) => s.id === "choking") },
    { id: "bleeding", media: MEDIA_MAP.bleeding, raw: SCENARIOS.find((s) => s.id === "bleeding") },
    { id: "unresponsive", media: MEDIA_MAP.unresponsive, raw: SCENARIOS.find((s) => s.id === "unresponsive") },
    {
      id: "cpr",
      media: MEDIA_MAP.cpr,
      raw: {
        id: "cpr",
        title: "توقف التنفس والإنعاش (CPR)",
        setting: "شخص سقط فجأة ولا يستجيب ولا يتنفس، كيف أبدأ الإنعاش القلبي الرئوي؟"
      }
    }
  ];

  const cardButtons = quickCases.map((item) => {
    const c = item.id === "cpr"
      ? (en
          ? { title: "Cardiac Arrest (CPR)", setting: "Someone collapsed, is unresponsive and not breathing. How do I start CPR?" }
          : { title: item.raw.title, setting: item.raw.setting })
      : localCase(item.raw);

    const b = make("button", "case-card");
    b.type = "button";
    const img = make("img", "case-thumb");
    setSmartImage(img, item.media, c.title);

    const body = make("div", "case-card-body");
    body.append(
      make("span", "case-name", c.title),
      make("span", "case-hint", en ? "Click for instant steps & video" : "اضغط للتحليل الفوري والفيديو")
    );
    b.append(img, body);

    b.addEventListener("click", () => {
      cardButtons.forEach((btn) => btn.classList.remove("active"));
      b.classList.add("active");
      input.value = c.setting;
      lastCase = c.setting;
      runAnalysis();
    });
    examples.append(b);
    return b;
  });

  const caseBox = make("section", "case-box-wrapper");
  caseBox.append(
    make("h2", "", t("caseTitle")),
    make("p", "muted", t("caseHelp")),
    input,
    analyzeBtn,
    statusMsg,
    quickPreview
  );

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

// ----- المكتبة: صور حقيقية + فيديوهات يوتيوب -----
const AGE_LABELS = { child: "طفل", infant: "رضيع", elderly: "كبير السن" };

function findTopic(id) {
  for (const sec of LIBRARY) {
    const topic = sec.topics.find((tp) => tp.id === id);
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
  const en = getLang() === "en";
  const grid = make("div", "grid");
  LIBRARY.forEach((sec) => {
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
  const sec = LIBRARY.find((s) => s.id === id);
  if (!sec) return showLibrary();
  const grid = make("div", "grid");
  sec.topics.forEach((tp) => {
    const c = make("a", "card");
    c.href = "#topic/" + tp.id;
    const mediaKey = tp.gallery !== undefined ? LIBRARY_GALLERY_KEYS[tp.gallery] : "unresponsive";
    const media = MEDIA_MAP[mediaKey] || MEDIA_MAP.cpr;
    const img = make("img", "card-cover");
    setSmartImage(img, media, tp.title);
    c.append(img, make("h2", "", tp.title), make("p", "", tp.summary));
    grid.append(c);
  });
  const back = make("a", "back", getLang() === "en" ? "← Library" : "→ المكتبة");
  back.href = "#library";
  render(back, make("h1", "", sec.title), make("p", "", sec.intro), grid, safetyNotice());
}

function showTopic(id) {
  const topic = findTopic(id);
  if (!topic) return showLibrary();
  const en = getLang() === "en";
  const back = make("a", "back", en ? "← Back" : "→ رجوع");
  back.href = "#section/" + topic.section;
  const tabsRow = make("div");
  tabsRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:12px 0";
  const body = make("div");

  const tabs = [{ key: "adult", label: "البالغ", title: topic.title, steps: topic.steps, note: topic.note, art: topic.gallery }];
  Object.keys(topic.ages || {}).forEach((key) => tabs.push({ key, label: AGE_LABELS[key], ...topic.ages[key] }));

  const buttons = tabs.map((tab) => {
    const btn = make("button", "chip", tab.label);
    btn.type = "button";
    btn.addEventListener("click", () => show(tab, btn));
    tabsRow.append(btn);
    return btn;
  });

  const show = (tab, active) => {
    buttons.forEach((b) => { b.style.background = ""; b.style.color = ""; });
    active.style.background = "var(--blue)";
    active.style.color = "var(--on-blue)";
    body.replaceChildren();

    const mediaKey = tab.art !== undefined && tab.art !== null ? LIBRARY_GALLERY_KEYS[tab.art] : (topic.id === "abcde" || topic.id === "avpu" ? "unresponsive" : "cpr");
    const media = MEDIA_MAP[mediaKey];
    if (media) {
      body.append(buildMediaCard(media, !en));
    }

    body.append(make("h2", "", tab.title), listOf(tab.steps));
    if (tab.note) body.append(make("p", "notice", tab.note));
  };
  show(tabs[0], buttons[0
