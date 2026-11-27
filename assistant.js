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
      keys: ["صباع", "مقطوع", "بتر", "نزيف", "بينزف", "قطع", "جرح", "دم", "bleed", "cut", "wound", "amputat"],
      ytAr: "_ofcOGEsa7c",
      ytEn: "NxO5LvgqZe0",
      labelAr: "فيديو شرح إيقاف النزيف والجروح",
      labelEn: "Bleeding & Wound Care Video",
      stepsAr: [
        "1- اضغط فوراً ومباشرة على مكان النزيف بشاش معقم أو قطعة قماش نظيفة بقوة ولمدة 10 دقائق متواصلة دون رفع يدك.",
        "2- إذا كان هناك جزء مفصول (مثل طرف إصبع): لف الجزء المفصول في شاش نظيف رطب وضعه داخل كيس بلاستيكي مغلق، ثم ضع الكيس داخل وعاء به ماء بارد وثلج (لا تلمس الثلج للجزء مباشرة ولا تغسله بالماء).",
        "3- ارفع الطرف المصاب فوق مستوى القلب إذا لم يكن هناك ألم شديد يشير لكسر.",
        "4- إذا تشبّع الشاش بالدم ضع طبقة شاش أخرى فوقه ولا تنزع الأول، واتصل بالإسعاف (" + emergencyNum() + ") فوراً."
      ],
      stepsEn: [
        "1- Apply firm, continuous direct pressure over the bleeding site with sterile gauze or a clean cloth for at least 10 minutes without lifting your hand.",
        "2- If a fingertip/digit is amputated: wrap it in clean damp gauze inside a sealed plastic bag, then place that bag in a container of ice water (never put ice directly on the tissue or wash it).",
        "3- Elevate the injured limb above heart level if no fracture is suspected.",
        "4- Layer extra dressings on top if blood soaks through (do not remove the first) and call emergency services (" + emergencyNum() + ") immediately."
      ]
    },
    {
      keys: ["اختناق", "شرق", "بلع", "مجرى الهواء", "choking", "heimlich", "airway"],
      ytAr: "81BXd2Gi6kg",
      ytEn: "HGBBu4zr8sM",
      labelAr: "فيديو شرح إسعاف الاختناق ومناورة هيمليك",
      labelEn: "Choking & Heimlich Maneuver Video",
      stepsAr: [
        "1- اسأل المصاب: هل تختنق؟ إذا كان يقدر يتكلم أو يسعل بقوة شجّعه يكمل سعال.",
        "2- إذا لم يقدر يتكلم أو يتنفس: أمِله للأمام واضرب 5 ضربات قوية بين لوحي الكتف بكعب اليد.",
        "3- إذا لم يخرج الجسم الغريب: لف ذراعيك حول خصره، ضع قبضة يدك فوق السرة، واضغط 5 ضغطات للداخل ولأعلى.",
        "4- كرّر بالتبادل (5 ضربات ظهر + 5 ضغطات بطن) حتى يخرج الجسم الغريب، واطلب الإسعاف (" + emergencyNum() + ") فوراً."
      ],
      stepsEn: [
        "1- Ask 'Are you choking?' If they can speak or cough forcefully, encourage them to keep coughing.",
        "2- If they cannot speak or breathe: lean them forward and deliver 5 firm back blows between the shoulder blades.",
        "3- If still obstructed: wrap arms around their waist, place a fist just above the navel, and give 5 inward-and-upward thrusts.",
        "4- Alternate 5 back blows and 5 abdominal thrusts until cleared, and call emergency services (" + emergencyNum() + ")."
      ]
    },
    {
      keys: ["إغماء", "فاقد", "غيبوبة", "الإفاقة", "وقع", "unconscious", "unresponsive", "faint", "recovery"],
      ytAr: "6ZmWhzrfPPY",
      ytEn: "GmqXqwSV3bo",
      labelAr: "فيديو شرح وضعية الإفاقة وفقدان الوعي",
      labelEn: "Recovery Position Video Guide",
      stepsAr: [
        "1- هز كتفي المصاب ونادِه بصوت عالٍ؛ إذا لم يستجب اطلب الإسعاف (" + emergencyNum() + ") فوراً.",
        "2- أمل الرأس للخلف وارفع الذقن لفتح مجرى الهواء، وراقب التنفس لمدة 10 ثوانٍ.",
        "3- إذا كان يتنفس بشكل طبيعي: اقلبه برفق على جانبه (وضعية الإفاقة) مع ثني الركبة العلوية لتثبيته.",
        "4- أبقِ رأسه مائلاً للخلف قليلاً وفمه للأسفل لتصريف أي سوائل، وراقب تنفسه حتى وصول الإسعاف."
      ],
      stepsEn: [
        "1- Tap shoulders and shout; if unresponsive, call emergency services (" + emergencyNum() + ") immediately.",
        "2- Tilt the head back and lift the chin to open the airway, checking normal breathing for 10 seconds.",
        "3- If breathing normally: roll onto their side into the recovery position, bending the top knee for stability.",
        "4- Keep the head slightly tilted back with mouth angled downward to drain fluids and monitor breathing until EMS arrives."
      ]
    },
    {
      keys: ["قلب", "نبض", "تنفس", "إنعاش", "توقف", "cpr", "cardiac", "pulse", "breathing"],
      ytAr: "JIFt-55TRGk",
      ytEn: "BQNNOh8c8ks",
      labelAr: "فيديو شرح الإنعاش القلبي الرئوي (CPR)",
      labelEn: "CPR Step-by-Step Video Guide",
      stepsAr: [
        "1- تأكد من عدم استجابة المصاب وغياب التنفس الطبيعي خلال 10 ثوانٍ، واطلب الإسعاف (" + emergencyNum() + ") فوراً.",
        "2- ضع المصاب على ظهره فوق سطح صلب، وضع كعب يدك في منتصف الصدر فوق اليد الأخرى.",
        "3- اضغط بقوة وسرعة 30 ضغطة بعمق 5–6 سم وبمعدل 100–120 ضغطة في الدقيقة.",
        "4- أعطِ نفسين إنقاذيين (ثانية لكل نفس) بعد كل 30 ضغطة، واستمر دون توقف حتى وصول الإسعاف."
      ],
      stepsEn: [
        "1- Confirm unresponsiveness and absence of normal breathing within 10 seconds, and call EMS (" + emergencyNum() + ") immediately.",
        "2- Place the person flat on their back on a firm surface with the heel of one hand on the center of the chest and the other on top.",
        "3- Give 30 chest compressions 5–6 cm deep at 100–120 compressions per minute.",
        "4- Deliver 2 rescue breaths (1 second each) after every 30 compressions and continue without stopping until EMS arrives."
      ]
    },
    {
      keys: ["حرق", "حروق", "مية مغلية", "نار", "فقاعات", "burn", "burns", "scald"],
      ytAr: "HaC2oiBB7sI",
      ytEn: "6i7ov4vbxUc",
      labelAr: "فيديو شرح إسعاف الحروق",
      labelEn: "Thermal Burns Video Guide",
      stepsAr: [
        "1- أبعد المصاب عن مصدر الحرارة أو النار فوراً وافصل الكهرباء إن وُجدت.",
        "2- ضع مكان الحرق تحت ماء جارٍ فاتر (غير مثلج) لمدة 20 دقيقة كاملة.",
        "3- انزع الخواتم أو الساعات أو الملابس غير الملتصقة برفق قبل حدوث تورم، ولا تفتح الفقاعات.",
        "4- غطِّ الحرق بشاش معقم غير لاصق، ولا تضع ثلجاً أو معجون أسنان أو زبدة، واطلب الرعاية الطبية إذا كان كبيراً أو عميقاً."
      ],
      stepsEn: [
        "1- Move the person away from heat, flame, or electrical hazards immediately.",
        "2- Cool the burn under cool (not ice-cold) running tap water for 20 full minutes.",
        "3- Gently remove rings, watches, or non-stick clothing before swelling starts, and do not pop blisters.",
        "4- Cover loosely with sterile non-stick gauze; never use ice, butter, or toothpaste, and seek medical care for large or deep burns."
      ]
    }
  ];

  function buildSmartReply(q) {
    const lower = String(q || "").toLowerCase();
    const arabic = isAr(q);
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
            "2- افحص الوعي والتنفس (مجرى الهواء والتنفس والنزيف) واطلب الإسعاف (" + emergencyNum() + ") في الحالات الخطيرة.",
            "3- أبقِ المصاب هادئاً وفي وضعية مريحة وآمنة وراقب أي تغير في الأعراض."
          ]
        : [
            "1- Make sure the scene is safe before approaching.",
            "2- Check responsiveness, breathing, and bleeding, and call emergency services (" + emergencyNum() + ") for serious emergencies.",
            "3- Keep the person calm in a safe, comfortable position and monitor for changes."
          ],
      ytUrl: ytLink(arabic ? "6ZmWhzrfPPY" : "GmqXqwSV3bo"),
      ytText: arabic ? "فيديو شرح التقييم الأولي ووضعية الإفاقة" : "Primary Assessment & Recovery Video"
    };
  }

  // استدعاء مباشر للـ endpoint في CONFIG لتفادي أي تعارض في callAI
  async function askDirectAI(q) {
    if (typeof CONFIG === "undefined" || !CONFIG.ai || !CONFIG.ai.enabled || !CONFIG.ai.endpoint) {
      throw new Error("NO_ENDPOINT");
    }
    const headers = { "Content-Type": "application/json" };
    const key = (CONFIG.ai.apiKey || "").trim();
    if (key && !key.startsWith("PASTE_")) {
      headers.Authorization = "Bearer " + key;
    }
    const sysPrompt = isAr(q)
      ? "أنت مساعد إسعافات أولية ذكي. أجب باللهجة المصرية الواضحة في 3 إلى 4 نقاط مرقمة (1- 2- 3-) تشرح ماذا يفعل المسعف بالضبط، بدون رموز ماركداون (* أو #)."
      : "You are a first-aid assistant. Reply in clear English in 3 to 4 numbered steps (1- 2- 3-) explaining what to do, without markdown symbols (* or #).";

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 12000);
    try {
      const res = await fetch(CONFIG.ai.endpoint, {
        method: "POST",
        headers: headers,
        signal: controller.signal,
        body: JSON.stringify({
          model: CONFIG.ai.model,
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: q }
          ],
          max_tokens: 800,
          temperature: 0.3
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
      return String(content)
        .replace(/[*#_`~]/g, "")
        .split(/\r?\n/)
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    } finally {
      clearTimeout(timer);
    }
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
    <div style="padding:12px 14px;background:#0066CC;color:#fff;font-weight:700;display:flex;justify-content:space-between;align-items:center;">
      <span>🤖 مساعد الإسعافات الذكي</span>
      <button id="ai-chat-close" type="button" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">✕</button>
    </div>
    <div id="ai-chat-msgs" style="padding:12px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.65;min-height:180px;">
      <div style="background:rgba(0,102,204,0.15);padding:8px 10px;border-radius:10px;">أهلاً بك! اسألني عن أي حالة إسعافات أولية وسأعطيك الخطوات وفيديو الشرح فوراً.</div>
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
    botBubble.style.cssText = "align-self:flex-start;background:rgba(128,128,128,0.18);padding:10px 12px;border-radius:10px;max-width:92%;display:flex;flex-direction:column;gap:6px;";
    const loadingText = document.createElement("div");
    loadingText.textContent = isAr(q) ? "جاري الاتصال بالمساعد الذكي..." : "Connecting to AI assistant...";
    botBubble.append(loadingText);
    msgs.append(botBubble);
    msgs.scrollTop = msgs.scrollHeight;

    const built = buildSmartReply(q);
    let finalLines = built.lines;
    let usedAI = false;

    try {
      const aiLines = await askDirectAI(q);
      if (aiLines && aiLines.length >= 2) {
        finalLines = aiLines;
        usedAI = true;
      }
    } catch (_) {
      finalLines = built.lines;
    }

    botBubble.replaceChildren();
    finalLines.forEach(function (line) {
      const p = document.createElement("div");
      p.textContent = line;
      botBubble.append(p);
    });

    const link = document.createElement("a");
    link.href = built.ytUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "▶ " + built.ytText + " ↗";
    link.style.cssText = "color:#4da3ff;font-weight:700;text-decoration:underline;margin-top:4px;";
    botBubble.append(link);

    const tag = document.createElement("div");
    tag.textContent = usedAI
      ? (isAr(q) ? "رد مباشر عبر AI" : "Live AI response")
      : (isAr(q) ? "دليل إسعافي فوري" : "Instant first-aid guide");
    tag.style.cssText = "font-size:11px;opacity:0.7;margin-top:2px;";
    botBubble.append(tag);

    msgs.scrollTop = msgs.scrollHeight;
  });
})();
