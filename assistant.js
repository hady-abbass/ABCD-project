(function () {
  if (document.getElementById("ai-fab")) return;

  function emergencyNum() {
    if (typeof emergencyNo === "function") return emergencyNo();
    if (typeof CONFIG !== "undefined" && CONFIG.emergencyNumber) return CONFIG.emergencyNumber;
    return "123";
  }

  function isAr(txt) {
    return /[\u0600-\u06FF]/.test(String(txt || ""));
  }

  function ytLink(id) {
    return "https:/" + "/www.youtube.com/watch?v=" + id;
  }

  const TOPICS = [
    {
      keys: ["صباع", "مقطوع", "بتر", "نزيف", "بينزف", "قطع", "جرح", "دم", "قماش", "شاش", "bleed", "cut", "wound", "amputat"],
      ytAr: "_ofcOGEsa7c",
      ytEn: "NxO5LvgqZe0",
      labelAr: "فيديو شرح إيقاف النزيف والجروح",
      labelEn: "Bleeding & Wound Care Video",
      stepsAr: [
        "1- اضغط فوراً ومباشرة على مكان النزيف بشاش معقم أو قماش نظيف بقوة ولمدة 10 دقائق متواصلة دون رفع يدك.",
        "2- إذا كان هناك جزء مفصول: لفه في شاش نظيف رطب داخل كيس مغلق، وضع الكيس في ماء بارد وثلج دون ملامسة الثلج مباشرة.",
        "3- ارفع الطرف المصاب فوق مستوى القلب إن أمكن، وإذا تشبّع الشاش ضع طبقة فوقه ولا تنزع الأول، واتصل بالإسعاف (" + emergencyNum() + ")."
      ],
      stepsEn: [
        "1- Apply firm, continuous direct pressure over the bleeding site with sterile gauze or clean cloth for 10 minutes.",
        "2- If a digit is amputated: wrap it in damp gauze inside a sealed bag, and place the bag in ice water (no direct ice contact).",
        "3- Elevate the limb above heart level, layer extra dressings if soaked, and call emergency services (" + emergencyNum() + ")."
      ]
    },
    {
      keys: ["اختناق", "شرق", "بلع", "مجرى الهواء", "choking", "heimlich", "airway"],
      ytAr: "81BXd2Gi6kg",
      ytEn: "HGBBu4zr8sM",
      labelAr: "فيديو شرح إسعاف الاختناق ومناورة هيمليك",
      labelEn: "Choking & Heimlich Maneuver Video",
      stepsAr: [
        "1- إذا كان المصاب يسعل بقوة شجّعه على السعال؛ أما إذا عجز عن الكلام أو التنفس فأمِله للأمام واضرب 5 ضربات قوية بين لوحي الكتف.",
        "2- نفّذ 5 ضغطات بطنية (مناورة هيمليك) فوق السرة وتحت عظمة القص للداخل ولأعلى.",
        "3- كرّر بالتبادل (5 ضربات ظهر + 5 ضغطات بطن) حتى يخرج الجسم الغريب، واطلب الإسعاف (" + emergencyNum() + ")."
      ],
      stepsEn: [
        "1- If coughing forcefully, encourage coughing. If unable to speak or breathe, lean them forward and give 5 firm back blows.",
        "2- Deliver 5 abdominal thrusts (Heimlich maneuver) just above the navel inward and upward.",
        "3- Alternate 5 back blows and 5 abdominal thrusts until cleared, and call EMS (" + emergencyNum() + ")."
      ]
    },
    {
      keys: ["إغماء", "اغماء", "مغمي", "فاقد", "غيبوبة", "الإفاقة", "unconscious", "unresponsive", "faint", "recovery"],
      ytAr: "6ZmWhzrfPPY",
      ytEn: "GmqXqwSV3bo",
      labelAr: "فيديو شرح وضعية الإفاقة وفقدان الوعي",
      labelEn: "Recovery Position Video Guide",
      stepsAr: [
        "1- هز كتفي المصاب ونادِه بصوت عالٍ؛ إذا لم يستجب اطلب الإسعاف (" + emergencyNum() + ") فوراً.",
        "2- أمل الرأس للخلف وارفع الذقن لفتح مجرى الهواء وافحص التنفس لمدة 10 ثوانٍ.",
        "3- إذا كان يتنفس طبيعياً اقلبه برفق على جانبه (وضعية الإفاقة) وراقب تنفسه حتى وصول الإسعاف."
      ],
      stepsEn: [
        "1- Tap shoulders and shout; if unresponsive, call emergency services (" + emergencyNum() + ") immediately.",
        "2- Tilt the head back and lift the chin to open the airway, checking breathing for 10 seconds.",
        "3- If breathing normally, roll onto their side into the recovery position and monitor breathing."
      ]
    },
    {
      keys: ["قلب", "نبض", "تنفس", "إنعاش", "توقف", "cpr", "cardiac", "pulse", "breathing"],
      ytAr: "JIFt-55TRGk",
      ytEn: "BQNNOh8c8ks",
      labelAr: "فيديو شرح الإنعاش القلبي الرئوي (CPR)",
      labelEn: "CPR Step-by-Step Video Guide",
      stepsAr: [
        "1- تأكد من عدم الاستجابة وغياب التنفس الطبيعي خلال 10 ثوانٍ، واطلب الإسعاف (" + emergencyNum() + ") فوراً.",
        "2- ضع كعب يدك في منتصف الصدر فوق اليد الأخرى واضغط 30 ضغطة قوية وسريعة بعمق 5–6 سم.",
        "3- أعطِ نفسين إنقاذيين بعد كل 30 ضغطة واستمر بلا توقف حتى وصول الإسعاف."
      ],
      stepsEn: [
        "1- Confirm unresponsiveness and no normal breathing within 10 seconds, and call EMS (" + emergencyNum() + ") immediately.",
        "2- Place heel of hand on center of chest and give 30 chest compressions 5–6 cm deep at 100–120/min.",
        "3- Give 2 rescue breaths after every 30 compressions and continue without stopping."
      ]
    },
    {
      keys: ["حرق", "حروق", "مية مغلية", "نار", "فقاعات", "burn", "burns", "scald"],
      ytAr: "HaC2oiBB7sI",
      ytEn: "6i7ov4vbxUc",
      labelAr: "فيديو شرح إسعاف الحروق",
      labelEn: "Thermal Burns Video Guide",
      stepsAr: [
        "1- أبعد المصاب عن مصدر الحرارة فوراً وبرّد مكان الحرق بماء جارٍ فاتر لمدة 20 دقيقة.",
        "2- انزع الخواتم والساعات والملابس غير الملتصقة برفق قبل التورم، ولا تفتح الفقاعات.",
        "3- غطِّ الحرق بشاش معقم غير لاصق ولا تضع ثلجاً أو معجون أسنان أو زبدة."
      ],
      stepsEn: [
        "1- Move away from heat immediately and cool the burn under cool running tap water for 20 minutes.",
        "2- Gently remove rings, watches, or non-stick clothing before swelling; never pop blisters.",
        "3- Cover loosely with sterile non-stick gauze; never apply ice, butter, or toothpaste."
      ]
    }
  ];

  function matchTopic(text, arabic) {
    const lower = String(text || "").toLowerCase();
    for (let i = 0; i < TOPICS.length; i++) {
      const item = TOPICS[i];
      if (item.keys.some(function (k) { return lower.includes(k); })) {
        return {
          lines: arabic ? item.stepsAr : item.stepsEn,
          ytUrl: ytLink(arabic ? item.ytAr : item.ytEn),
          ytText: arabic ? item.labelAr : item.labelEn
        };
      }
    }
    return {
      lines: arabic
        ? [
            "1- تأكد من أمان المكان حولك وحول المصاب قبل الاقتراب.",
            "2- افحص الوعي والتنفس ومجرى الهواء وأوقف أي نزيف ظاهر، واطلب الإسعاف (" + emergencyNum() + ") عند وجود خطر.",
            "3- أبقِ المصاب هادئاً وفي وضعية آمنة وراقب أي تغير في الأعراض."
          ]
        : [
            "1- Ensure the scene is safe before approaching.",
            "2- Check responsiveness, airway, breathing, and bleeding, and call EMS (" + emergencyNum() + ") for serious symptoms.",
            "3- Keep the person calm in a safe position and monitor for changes."
          ],
      ytUrl: ytLink(arabic ? "6ZmWhzrfPPY" : "GmqXqwSV3bo"),
      ytText: arabic ? "فيديو شرح التقييم الأولي ووضعية الإفاقة" : "Primary Assessment & Recovery Video"
    };
  }

  const chatHistory = [];

  async function askLiveAI(q) {
    const arabic = isAr(q);
    const sysPrompt = arabic
      ? "أنت مساعد إسعافات أولية عملي وذكي. أجب باللهجة المصرية الواضحة والمباشرة على سؤال المستخدم المحدد فقط في 3 إلى 5 نقاط مرقمة (1- 2- 3-) تشرح التصرف العملي خطوة بخطوة، ولا تكرر ردوداً عامة أو روابط، ولا تستخدم رموز ماركداون (* أو #)."
      : "You are a practical first-aid assistant. Answer the user's exact scenario directly in clear English using 3 to 5 numbered actionable steps (1- 2- 3-), without generic filler, URLs, or markdown symbols (* or #).";

    const recent = chatHistory.slice(-6);
    const messages = [{ role: "system", content: sysPrompt }].concat(recent, [{ role: "user", content: q }]);

    if (typeof CONFIG !== "undefined" && CONFIG.ai && CONFIG.ai.enabled && CONFIG.ai.endpoint) {
      const headers = { "Content-Type": "application/json" };
      const key = (CONFIG.ai.apiKey || "").trim();
      if (key && !key.startsWith("PASTE_")) {
        headers.Authorization = "Bearer " + key;
      }
      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 15000);
      try {
        const res = await fetch(CONFIG.ai.endpoint, {
          method: "POST",
          headers: headers,
          signal: controller.signal,
          body: JSON.stringify({
            model: CONFIG.ai.model,
            messages: messages,
            max_tokens: 700,
            temperature: 0.45
          })
        });
        if (!res.ok) throw new Error("HTTP_" + res.status);
        const data = await res.json();
        const content =
          data &&
          data.choices &&
          data.choices[0] &&
          data.choices[0].message &&
          data.choices[0].message.content;
        if (!content) throw new Error("EMPTY");
        return String(content);
      } finally {
        clearTimeout(timer);
      }
    }

    if (typeof callAI === "function") {
      return await callAI(messages);
    }

    throw new Error("NO_AI");
  }

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
    "position:fixed;bottom:86px;left:20px;z-index:9999;width:min(360px,calc(100vw - 40px));max-height:72vh;background:var(--card,#161b22);color:var(--text,#f0f6fc);border:1px solid var(--border,#30363d);border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,0.45);display:none;flex-direction:column;overflow:hidden;";

  panel.innerHTML = `
    <div style="padding:12px 14px;background:#0066CC;color:#fff;font-weight:700;display:flex;justify-content:space-between;align-items:center;gap:8px;">
      <span>🤖 مساعد الإسعافات الذكي</span>
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="ai-chat-clear" type="button" title="مسح المحادثة" style="background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:12px;padding:4px 8px;border-radius:6px;cursor:pointer;">مسح</button>
        <button id="ai-chat-close" type="button" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">✕</button>
      </div>
    </div>
    <div id="ai-chat-msgs" style="padding:12px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.65;min-height:180px;">
      <div style="background:rgba(0,102,204,0.15);padding:8px 10px;border-radius:10px;">أهلاً بك! اسألني عن أي حالة إسعافات أولية وسأعطيك الخطوات المناسبة وفيديو الشرح.</div>
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

  panel.querySelector("#ai-chat-clear").addEventListener("click", function () {
    chatHistory.length = 0;
    msgs.innerHTML = '<div style="background:rgba(0,102,204,0.15);padding:8px 10px;border-radius:10px;">تم مسح المحادثة. اكتب سؤالك الجديد الآن.</div>';
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    const arabic = isAr(q);

    const userBubble = document.createElement("div");
    userBubble.textContent = q;
    userBubble.style.cssText = "align-self:flex-end;background:#0066CC;color:#fff;padding:8px 10px;border-radius:10px;max-width:85%;";
    msgs.append(userBubble);

    const botBubble = document.createElement("div");
    botBubble.style.cssText = "align-self:flex-start;background:rgba(128,128,128,0.18);padding:10px 12px;border-radius:10px;max-width:92%;display:flex;flex-direction:column;gap:6px;";
    const loadingText = document.createElement("div");
    loadingText.textContent = arabic ? "جاري تحليل سؤالك..." : "Analyzing your question...";
    botBubble.append(loadingText);
    msgs.append(botBubble);
    msgs.scrollTop = msgs.scrollHeight;

    let finalLines = [];
    let rawReply = "";
    let usedAI = false;

    try {
      rawReply = await askLiveAI(q);
      const parsed = String(rawReply || "")
        .replace(/[*#_`~]/g, "")
        .split(/\r?\n/)
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return s && !/https?:\/\//i.test(s); });
      if (parsed.length >= 1) {
        finalLines = parsed;
        usedAI = true;
      }
    } catch (_) {
      usedAI = false;
    }

    const topicMatch = matchTopic(q + " " + rawReply, arabic);
    if (!usedAI || finalLines.length === 0) {
      finalLines = topicMatch.lines;
    }

    chatHistory.push({ role: "user", content: q });
    chatHistory.push({ role: "assistant", content: finalLines.join("\n") });

    botBubble.replaceChildren();
    finalLines.forEach(function (line) {
      const p = document.createElement("div");
      p.textContent = line;
      botBubble.append(p);
    });

    const link = document.createElement("a");
    link.href = topicMatch.ytUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "▶ " + topicMatch.ytText + " ↗";
    link.style.cssText = "color:#4da3ff;font-weight:700;text-decoration:underline;margin-top:4px;";
    botBubble.append(link);

    msgs.scrollTop = msgs.scrollHeight;
  });
})();
