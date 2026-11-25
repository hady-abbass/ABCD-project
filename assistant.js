// assistant.js: floating help button and chat panel. Text comes from i18n.js (data-i18n attributes).
// Uses CONFIG (config.js) and callAI (ai-feedback.js). The chat is kept only for this page visit.

const FIRST_AID_SYSTEM_PROMPT = `You are "First Aid Helper", an educational assistant on a first-aid training website.
- Answer ONLY questions about first aid, basic emergency care, and when to call emergency services.
- For off-topic questions, politely say you only help with first aid.
- Reply in the language the user writes in (Arabic or English). Use short numbered steps and simple words.
- For life-threatening situations (no breathing, unconscious, severe bleeding, chest pain, stroke signs, choking that doesn't clear), tell the user to call the local emergency number at once: ${emergencyNo()}.
- Never diagnose, never give medication doses, and never say you replace a doctor or certified first-aid training.
- Keep answers under about 150 words.`;

(function () {
  const chatHistory = []; // this page visit only, nothing is stored
  const MAX_HISTORY = 12; // the last 12 messages are sent to the AI
  let busy = false;

  // Floating button
  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "assistant-fab";
  fab.setAttribute("aria-expanded", "false");
  fab.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span data-i18n="assistOpen"></span>`;

  // Chat panel
  const panel = document.createElement("section");
  panel.className = "assistant-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("data-i18n-attr", "aria-label:assistOpen");
  panel.innerHTML = `
    <header class="assistant-head">
      <strong data-i18n="assistOpen"></strong>
      <button type="button" class="assistant-close" data-i18n-attr="aria-label:assistClose">×</button>
    </header>
    <div class="assistant-log" aria-live="polite"></div>
    <form class="assistant-form">
      <input class="assistant-input" type="text" maxlength="500" required data-i18n-attr="placeholder:assistPlaceholder">
      <button class="assistant-send" type="submit" data-i18n="assistSend"></button>
    </form>
    <p class="assistant-note"><span data-i18n="assistEmergency"></span>${emergencyNo()}</p>`;

  const log = panel.querySelector(".assistant-log");
  const form = panel.querySelector(".assistant-form");
  const input = panel.querySelector(".assistant-input");
  const sendBtn = panel.querySelector(".assistant-send");

  // key (optional) marks the message text as translatable; applyLang() will refresh it.
  function addMessage(role, text, key) {
    const div = document.createElement("div");
    div.className = `assistant-msg ${role}`;
    div.textContent = text; // textContent: AI output is never rendered as HTML
    if (key) div.dataset.i18n = key;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function setReply(div, text) {
    delete div.dataset.i18n; // an AI answer must not be replaced by a translated label
    div.textContent = text;
  }

  function togglePanel(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  }

  fab.addEventListener("click", () => togglePanel(panel.hidden));
  panel.querySelector(".assistant-close").addEventListener("click", () => {
    togglePanel(false);
    fab.focus();
  });

  addMessage("bot", t("assistWelcome"), "assistWelcome");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (busy) return;
    const question = input.value.trim();
    if (!question) return;

    busy = true;
    sendBtn.disabled = true;
    input.value = "";
    addMessage("user", question);
    const pending = addMessage("bot", t("assistThinking"), "assistThinking");
    chatHistory.push({ role: "user", content: question });

    try {
      const messages = [
        { role: "system", content: FIRST_AID_SYSTEM_PROMPT },
        ...chatHistory.slice(-MAX_HISTORY)
      ];
      const answer = await callAI(messages);
      chatHistory.push({ role: "assistant", content: answer });
      setReply(pending, answer || t("assistError"));
    } catch (err) {
      console.warn("Assistant error:", err.message);
      chatHistory.pop(); // drop the question that got no answer
      setReply(pending, err.message === "AI_DISABLED" ? t("assistSetup") : t("assistError") + " [" + err.message + "]");
    } finally {
      busy = false;
      sendBtn.disabled = false;
      log.scrollTop = log.scrollHeight;
    }
  });

  document.body.append(fab, panel);
})();
