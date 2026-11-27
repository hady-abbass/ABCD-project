(function () {
  if (document.getElementById("ai-fab")) return;

  const fab = document.createElement("button");
  fab.id = "ai-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", "AI First-Aid Assistant");
  fab.innerHTML = "💬";
  fab.style.cssText =
    "position:fixed;bottom:20px;left:20px;z-index:9999;width:56px;height:56px;border-radius:50%;border:none;background:#0066CC;color:#fff;font-size:26px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;";

  const panel = document.createElement("div");
  panel.id = "ai-chat-panel";
  panel.style.cssText =
    "position:fixed;bottom:86px;left:20px;z-index:9999;width:min(350px,calc(100vw - 40px));max-height:70vh;background:var(--card,#161b22);color:var(--text,#f0f6fc);border:1px solid var(--border,#30363d);border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,0.45);display:none;flex-direction:column;overflow:hidden;";

  panel.innerHTML = `
    <div style="padding:12px 14px;background:#0066CC;color:#fff;font-weight:700;display:flex;justify-content:space-between;align-items:center;">
      <span>🤖 مساعد الإسعافات الذكي</span>
      <button id="ai-chat-close" type="button" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">✕</button>
    </div>
    <div id="ai-chat-msgs" style="padding:12px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.6;min-height:180px;">
      <div style="background:rgba(0,102,204,0.15);padding:8px 10px;border-radius:10px;">أهلاً بك! اسألني عن أي حالة إسعافات أولية وسأعطيك الخطوات فوراً.</div>
    </div>
    <form id="ai-chat-form" style="display:flex;border-top:1px solid var(--border,#30363d);">
      <input id="ai-chat-input" type="text" placeholder="اكتب سؤالك هنا..." style="flex:1;padding:10px;border:none;background:transparent;color:inherit;outline:none;" />
      <button type="submit" style="padding:0 14px;background:#0066CC;color:#fff;border:none;cursor:pointer;font-weight:600;">إرسال</button>
    </form>
  `;

  document.body.append(fab, panel);

  fab.addEventListener("click", function () {
    panel.style.display = panel.style.display === "none" ? "flex" : "none";
  });

  panel.querySelector("#ai-chat-close").addEventListener("click", function () {
    panel.style.display = "none";
  });

  const msgs = panel.querySelector("#ai-chat-msgs");
  const form = panel.querySelector("#ai-chat-form");
  const input = panel.querySelector("#ai-chat-input");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = "";

    const userBubble = document.createElement("div");
    userBubble.textContent = q;
    userBubble.style.cssText = "align-self:flex-end;background:#0066CC;color:#fff;padding:8px 10px;border-radius:10px;max-width:85%;";
    msgs.append(userBubble);

    const botBubble = document.createElement("div");
    botBubble.textContent = "جاري الكتابة...";
    botBubble.style.cssText = "align-self:flex-start;background:rgba(128,128,128,0.18);padding:8px 10px;border-radius:10px;max-width:90%;white-space:pre-line;";
    msgs.append(botBubble);
    msgs.scrollTop = msgs.scrollHeight;

    try {
      const reply = typeof callAI === "function"
        ? await callAI([{ role: "user", content: q }])
        : "يرجى التأكد من تفعيل اتصال الذكاء الاصطناعي في config.js.";
      botBubble.textContent = reply;
    } catch (err) {
      botBubble.textContent = "تعذر الاتصال بالمساعد حالياً (" + err.message + ").";
    }
    msgs.scrollTop = msgs.scrollHeight;
  });
})();
