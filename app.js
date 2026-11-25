// app.js: home (describe a case and get the ABCDE plan), quick reference, language switch, dark mode.
// Text: i18n.js. Case knowledge: scenarios.js. AI and fallback: ai-feedback.js.

const app = document.getElementById("app");
let lastCase = ""; // kept when the language changes

// Project logo (also in index.html) and simple drawings for each case.
const LOGO_SVG = `<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#ffffff"/><path d="M19 6h10v11h11v10H29v11H19V27H8V17h11z" fill="#0066CC"/><path d="M4 42h10l3-5 4 9 4-7 3 3h16" fill="none" stroke="#C62828" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_ATTRS = `viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
const CASE_ICONS = {
  choking: `<svg ${ICON_ATTRS}><circle cx="32" cy="18" r="8"/><path d="M20 58c0-12 5-20 12-20s12 8 12 20"/><path d="M26 34l6 5 6-5"/></svg>`,
  bleeding: `<svg ${ICON_ATTRS}><path d="M24 6h16v22l-2 4v26H26V32l-2-4z"/><path d="M32 40c-4 5-6 8-6 10a6 6 0 0 0 12 0c0-2-2-5-6-10z" fill="#C62828" stroke="none"/></svg>`,
  unresponsive: `<svg ${ICON_ATTRS}><circle cx="12" cy="30" r="6"/><rect x="20" y="28" width="30" height="8" rx="4"/><path d="M50 32l8 4"/><path d="M6 48h52"/></svg>`,
  "minor-cut": `<svg ${ICON_ATTRS}><path d="M24 56V16a4 4 0 0 1 8 0v30"/><rect x="20" y="26" width="16" height="10" rx="2"/></svg>`
};

// Step drawings for each case, with a short caption per step (same order as refCards in i18n.js).
const ART_ATTRS = `viewBox="0 0 160 110" width="160" height="110" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
const CASE_STEPS = [
  {
    art: [
      `<svg ${ART_ATTRS}><circle cx="80" cy="22" r="10"/><path d="M80 32v40M80 40l-14 8 10 4M80 40l14 8-10 4M80 72l-8 30M80 72l8 30"/></svg>`,
      `<svg ${ART_ATTRS}><circle cx="46" cy="40" r="10"/><path d="M54 48l38 26M92 74l10 26M92 74l22 16"/><path d="M118 20l-22 16"/><path d="M92 34l4 6 6-4"/></svg>`,
      `<svg ${ART_ATTRS}><circle cx="62" cy="20" r="9"/><path d="M62 29v42M62 40l-28 4"/><circle cx="108" cy="30" r="9"/><path d="M108 39v36M108 50l-22 16M108 75l-8 22M108 75l8 22"/><rect x="72" y="60" width="12" height="10" rx="3"/></svg>`
    ],
    ar: ["اتأكد إنه مش قادر يتكلم أو يسعل بقوة", "5 ضربات بكعب إيدك بين لوح الكتف", "5 ضغطات بطن: إيدك فوق السرة، وتدفع لجوه ولفوق"],
    en: ["Check: cannot speak or cough forcefully", "5 back blows with the heel of your hand between the shoulder blades", "5 abdominal thrusts: fist above the navel, push in and up"]
  },
  {
    art: [
      `<svg ${ART_ATTRS}><path d="M18 70h124a14 14 0 0 1 0 28H18z"/><rect x="58" y="10" width="34" height="18" rx="8"/><path d="M75 28v24"/><path d="M68 44l7 8 7-8"/><path d="M75 74c-3 4-5 6-5 8a5 5 0 0 0 10 0c0-2-2-4-5-8z" fill="currentColor" stroke="none"/></svg>`,
      `<svg ${ART_ATTRS}><path d="M18 70h124a14 14 0 0 1 0 28H18z"/><rect x="60" y="48" width="38" height="8" rx="2"/><rect x="62" y="56" width="34" height="8" rx="2"/><path d="M79 30v12"/><path d="M73 36l6 6 6-6"/></svg>`,
      `<svg ${ART_ATTRS}><path d="M18 70h124a14 14 0 0 1 0 28H18z"/><rect x="30" y="58" width="14" height="24" rx="2"/><path d="M37 58l-12-14"/><path d="M26 40h22"/></svg>`
    ],
    ar: ["اضغط بقوة ومباشرة على الجرح بقماشة نظيفة", "لو الدم غرق الضماد، حط ضماد جديد فوقه ومتفكش القديم", "لو طرف بينزف ومش بيقف، وانت متدرب: عصبة فوق الجرح"],
    en: ["Press firmly and directly on the wound with a clean cloth", "If blood soaks through, add a new pad on top. Do not remove the old one", "If a limb keeps bleeding and you are trained: tourniquet above the wound"]
  },
  {
    art: [
      `<svg ${ART_ATTRS}><circle cx="40" cy="72" r="9"/><path d="M52 76h84"/><path d="M136 76l14 2"/><path d="M28 50v-10M28 40l-4 4M28 40l4 4"/></svg>`,
      `<svg ${ART_ATTRS}><circle cx="36" cy="66" r="9"/><path d="M48 72l70 6"/><path d="M40 74l-8 14M40 74l10 2"/><path d="M118 78l18-22 10 4"/></svg>`,
      `<svg ${ART_ATTRS}><circle cx="40" cy="64" r="9"/><path d="M52 72l66 6"/><path d="M118 78l16-18 12 6"/><path d="M20 46q8-6 16 0"/><path d="M28 40l-6 6"/></svg>`
    ],
    ar: ["ناديه بصوت عالي وهز كتفه بلطف", "حط إيده القريبة تحت خده، ورجله البعيدة مثنية", "اقلبه على جنبه، ورأسه مايلة لورا شوية"],
    en: ["Call loudly and gently shake the shoulder", "Place the near arm under the cheek and bend the far leg", "Roll onto the side, head tilted back slightly"]
  },
  {
    art: [
      `<svg ${ART_ATTRS}><circle cx="24" cy="74" r="8"/><path d="M34 78h112"/><path d="M92 14h22M103 14v36"/><path d="M96 44h14v8H96z"/></svg>`,
      `<svg ${ART_ATTRS}><circle cx="24" cy="74" r="8"/><path d="M34 78h112"/><path d="M103 14v22"/><path d="M95 30l8 8 8-8"/><path d="M90 62h26M90 68h26" stroke-dasharray="3 3"/></svg>`
    ],
    ar: ["إيدين على وسط الصدر، واحدة فوق التانية", "اضغط 5 إلى 6 سم بسرعة 100 إلى 120 ضغطة في الدقيقة"],
    en: ["Hands in the center of the chest, one on top of the other", "Push 5 to 6 cm at 100 to 120 compressions per minute"]
  }
];

// Hero: project name, logo, and the purpose of the project.
function hero() {
  const box = make("section", "hero");
  const logo = make("div", "hero-logo");
  logo.innerHTML = LOGO_SVG;
  box.append(logo, make("h1", "hero-title", t("siteTitle")), make("p", "tagline", t("tagline")), make("p", "purpose", t("purposeText")));
  return box;
}

// A case as a clickable card with its drawing.
function caseCard(c, id) {
  const b = make("button", "case-card");
  b.type = "button";
  const icon = make("span", "case-icon");
  icon.innerHTML = CASE_ICONS[id] || "";
  b.append(icon, make("span", "case-name", c.title));
  return b;
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

// Title and description of a built-in case in the current language.
function localCase(raw) {
  const en = EN_SCENARIOS[raw.id];
  return getLang() === "en" && en
    ? { title: en.title, setting: en.setting }
    : { title: raw.title, setting: raw.setting };
}

// Shows the ABCDE plan. Every string is shown as plain text, never as HTML.
function renderResult(a) {
  const box = make("section", "result");
  box.append(make("div", "triage triage-" + a.triage, t("triage_" + a.triage)));
  if (a.summary) box.append(make("p", "summary", a.summary));
  ["A", "B", "C", "D", "E"].forEach((letter) => {
    const sec = a[letter];
    const card = make("section", "abcde");
    card.append(make("h2", "", t("abcde" + letter)));
    if (sec.checks.length) card.append(make("h3", "", t("checksTitle")), listOf(sec.checks));
    if (sec.actions.length) card.append(make("h3", "", t("actionsTitle")), listOf(sec.actions));
    box.append(card);
  });
  if (a.notes.length) box.append(listOf(a.notes));
  box.append(make("p", "notice", t("callNow") + emergencyNo()), make("p", "muted", t("disclaimer")));
  return box;
}

function showHome() {
  const input = make("textarea", "case-input");
  input.rows = 5;
  input.value = lastCase;
  input.placeholder = t("caseInputPlaceholder");
  input.setAttribute("aria-label", t("caseTitle"));

  const analyzeBtn = make("button", "btn", t("analyze"));
  analyzeBtn.type = "button";
  const statusMsg = make("p", "muted");
  const result = make("div");

  analyzeBtn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) {
      statusMsg.textContent = t("emptyCase");
      return;
    }
    lastCase = text;
    analyzeBtn.disabled = true;
    statusMsg.textContent = t("analyzing");
    const analysis = await analyzeCase(text);
    analyzeBtn.disabled = false;
    statusMsg.textContent = "";
    result.replaceChildren(renderResult(analysis));
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const examples = make("div", "examples");
  SCENARIOS.forEach((raw) => {
    const c = localCase(raw);
    const chip = caseCard(c, raw.id);
    chip.addEventListener("click", () => {
      input.value = c.setting;
      lastCase = c.setting;
      input.focus();
    });
    examples.append(chip);
  });

  render(
    hero(),
    make("h2", "", t("caseTitle")),
    make("p", "", t("caseHelp")),
    safetyNotice(),
    input,
    analyzeBtn,
    statusMsg,
    make("p", "muted", t("examplesTitle")),
    examples,
    result
  );
}

const IMG_NAMES = ["choking", "bleeding", "breathing", "cpr"];

function showReference() {
  const blocks = t("refCards").map(([title, text], i) => {
    const step = CASE_STEPS[i];
    const card = make("article", "card");
    card.append(make("h2", "", title), make("p", "", text));
    const row = make("div");
    row.style.cssText = "display:flex;flex-wrap:wrap;gap:12px;margin-top:12px";
    step.art.forEach((svg, n) => {
      const fig = make("figure");
      fig.style.cssText = "margin:0;width:170px;text-align:center";
      const pic = make("div");
      pic.style.color = "var(--blue-text)";
      const caption = step[getLang()][n];
      const img = make("img");
      img.alt = caption;
      img.onerror = () => { pic.innerHTML = svg; }; // no photo yet: show the drawing instead
      img.src = `images/${IMG_NAMES[i]}-${n + 1}.jpg`;
      img.style.cssText = "width:170px;height:120px;object-fit:cover;border-radius:8px";
      pic.append(img);
      fig.append(pic, make("figcaption", "", caption));
      row.append(fig);
    });
    card.append(row);
    return card;
  });
  const printBtn = make("button", "btn btn-outline", t("print"));
  printBtn.type = "button";
  printBtn.addEventListener("click", () => window.print());
  render(...blocks, printBtn, safetyNotice());
}

// ----- Library: sections, topics, and advice for each age group -----
const AGE_LABELS = { child: "طفل", infant: "رضيع", elderly: "كبير السن" };

function findTopic(id) {
  for (const sec of LIBRARY) {
    const topic = sec.topics.find((tp) => tp.id === id);
    if (topic) return topic;
  }
  return null;
}

// Photos for a case, with the drawing as the fallback when a photo is not there yet.
function stepFigures(idx) {
  const row = make("div");
  row.style.cssText = "display:flex;flex-wrap:wrap;gap:12px;margin:12px 0";
  CASE_STEPS[idx].art.forEach((svg, n) => {
    const fig = make("figure");
    fig.style.cssText = "margin:0;width:170px;text-align:center";
    const pic = make("div");
    pic.style.color = "var(--blue-text)";
    const caption = CASE_STEPS[idx][getLang()][n];
    const img = make("img");
    img.alt = caption;
    img.onerror = () => { pic.innerHTML = svg; };
    img.src = `images/${IMG_NAMES[idx]}-${n + 1}.jpg`;
    img.style.cssText = "width:170px;height:120px;object-fit:cover;border-radius:8px";
    pic.append(img);
    fig.append(pic, make("figcaption", "", caption));
    row.append(fig);
  });
  return row;
}

// Each section has its own colour and icon, so the cards are easy to tell apart.
const SECTION_STYLE = {
  assess: { color: "#0066CC", icon: `<path d="M9 4h6v3H9z"/><rect x="5" y="6" width="14" height="16" rx="2"/><path d="M9 14l2 2 4-4"/>` },
  vitals: { color: "#C62828", icon: `<path d="M3 12h4l2-5 3 10 2-5h7"/>` },
  emergencies: { color: "#B45309", icon: `<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>` }
};

function sectionBadge(id) {
  const st = SECTION_STYLE[id] || SECTION_STYLE.assess;
  const wrap = make("span");
  wrap.style.cssText = `display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:14px;background:${st.color};color:#fff;margin-bottom:8px`;
  wrap.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${st.icon}</svg>`;
  return wrap;
}

function paintCard(c, id) {
  const color = (SECTION_STYLE[id] || SECTION_STYLE.assess).color;
  c.style.border = "2px solid " + color;
  c.style.background = color + "1F";
  c.style.boxShadow = "0 2px 10px " + color + "40";
}

function showLibrary() {
  const grid = make("div", "grid");
  LIBRARY.forEach((sec) => {
    const c = make("a", "card");
    c.href = "#section/" + sec.id;
    paintCard(c, sec.id);
    c.append(sectionBadge(sec.id), make("h2", "", sec.title), make("p", "", sec.intro));
    grid.append(c);
  });
  render(make("h1", "", "مكتبة الإسعافات"), make("p", "", "اختار القسم، وبعدين الحالة، وهتلاقي شرح لكل عمر."), safetyNotice(), grid);
}

function showSection(id) {
  const sec = LIBRARY.find((s) => s.id === id);
  if (!sec) return showLibrary();
  const grid = make("div", "grid");
  sec.topics.forEach((tp) => {
    const c = make("a", "card");
    c.href = "#topic/" + tp.id;
    paintCard(c, sec.id);
    c.append(sectionBadge(sec.id), make("h2", "", tp.title), make("p", "", tp.summary));
    grid.append(c);
  });
  const back = make("a", "back", "المكتبة");
  back.href = "#library";
  render(back, make("h1", "", sec.title), make("p", "", sec.intro), grid, safetyNotice());
}

function showTopic(id) {
  const topic = findTopic(id);
  if (!topic) return showLibrary();
  const back = make("a", "back", "رجوع");
  back.href = "#section/" + topic.section;
  const tabsRow = make("div");
  tabsRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:12px 0";
  const body = make("div");

  // Adult is the main text. Child, infant and older adult come from topic.ages.
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
    if (tab.art !== undefined && tab.art !== null) body.append(stepFigures(tab.art));
    body.append(make("h2", "", tab.title), listOf(tab.steps));
    if (tab.note) body.append(make("p", "notice", tab.note));
  };
  show(tabs[0], buttons[0]);

  render(back, make("h1", "", topic.title), make("p", "", topic.summary), tabsRow, body, safetyNotice());
}

function route() {
  const [page, id] = location.hash.replace("#", "").split("/");
  if (page === "library" || page === "reference") showLibrary();
  else if (page === "section") showSection(id);
  else if (page === "topic") showTopic(id);
  else showHome();
}

// Dark mode: light by default, and the choice is saved like the language.
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
  document.getElementById("theme-toggle").textContent = t(current === "dark" ? "themeToLight" : "themeToDark");
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (err) {
    console.warn("Theme not saved:", err.message);
  }
  applyTheme(next);
});

// Language button: switch, refresh the fixed text, and redraw the current screen.
document.getElementById("lang-toggle").addEventListener("click", () => {
  setLang(getLang() === "ar" ? "en" : "ar");
  applyLang();
  applyTheme();
  route();
});

document.getElementById("emergency-number").textContent = emergencyNo();
document.getElementById("sos").href = "tel:" + emergencyNo();
document.getElementById("sos-num").textContent = emergencyNo();
applyLang();
applyTheme(getTheme());
window.addEventListener("hashchange", route);
route();
