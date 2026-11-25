// scenarios.js: the training cases. Edit the text here to change or add cases.
//
// Scores: 2 = correct, 1 = partly correct, 0 = incorrect.
// Add a case: copy one block below, change the text, and give it a new id.
//
// Sources used for this file (from American Red Cross, AHA/Red Cross guidelines, NHS, Harvard Health):
// - Choking: American Red Cross "Choking: Clearing the Airway" (redcross.org; copy hosted by GVSU)
//   and the 2024 AHA + American Red Cross first-aid guidelines, summarized on MedlinePlus (medlineplus.gov/ency/article/000049.htm)
// - Bleeding: American Red Cross "Life-Threatening Bleeding" pages (redcross.org) and
//   "How to Apply a Tourniquet" (redcross.org/take-a-class/resources/articles/how-to-apply-a-tourniquet)
// - Unresponsive but breathing: NHS recovery position (nhs.uk/conditions/first-aid/recovery-position/),
//   Harvard Health recovery position (do not use it with back or neck injury), and
//   American Red Cross "Unresponsive & Breathing Person" (redcross.org)
// - Minor cut: general wound-care advice. NOT verified in this build. Check the American Red Cross wound care page.

const SCENARIOS = [
  {
    id: "choking",
    title: "اختناق شخص بالغ",
    level: "مبتدئ",
    triage: "immediate",
    setting: "مطعم. رجل بيمسك رقبته، ومش قادر يتكلم أو يسعل بقوة.",
    keyPoint: "لو الشخص مش قادر يتكلم أو يسعل بقوة، اطلب الإسعاف وابدأ 5 ضربات ظهر بالتبادل مع 5 ضغطات بطن. متسحبش الشيء بصباعك إلا لو شايفه.",
    steps: [
      {
        question: "الشخص مش قادر يتكلم أو يسعل بقوة. أول خطوة؟",
        options: [
          { text: "أتأكد: لو مش قادر يتكلم أو يسعل بقوة، أتصرف فورًا", score: 2, feedback: "صح. عدم القدرة على الكلام أو السعال القوي معناها إن الهوا مش بيوصل كويس." },
          { text: "أديله ميه يشربها", score: 0, feedback: "غلط. الشرب مع انسداد الهوا ممكن يزود الخطورة." },
          { text: "أستنى دقيقة وأشوف", score: 0, feedback: "غلط. الانتظار بيخلي الهوا يقل بسرعة." }
        ]
      },
      {
        question: "الانسداد كامل والشخص بيفقد الوعي تدريجيًا. أعمل إيه؟",
        options: [
          { text: "أطلب الإسعاف، وأعمل 5 ضربات بين لوح الكتف، وبعدها 5 ضغطات بطن، وأكرر", score: 2, feedback: "صح. ده التسلسل المعتمد للشخص الواعي المختنق." },
          { text: "أدخل صباعي في بقه وأسحب أي حاجة", score: 0, feedback: "غلط. متعملش كده إلا لو شايف الشيء، عشان ممكن تدفعه لجوه أكتر." },
          { text: "أسيبه واقف لحد ما الإسعاف يوصل", score: 0, feedback: "غلط. لازم تبدأ المساعدة فورًا." }
        ]
      }
    ]
  },
  {
    id: "bleeding",
    title: "نزيف شديد في الرجل",
    level: "مبتدئ",
    triage: "immediate",
    setting: "حادثة دراجة. جرح عميق في الفخذ، والدم بيسيح بكمية كبيرة.",
    keyPoint: "أول حاجة هي الضغط المباشر والقوي على الجرح بقماشة نظيفة. ولو النزيف من طرف (إيد أو رجل) ومش بيقف، استخدم عصبة (توركيه) لو انت متدرب عليها. ومتفكش الضماد عشان تشوف الجرح، حط ضماد جديد فوقه.",
    steps: [
      {
        question: "الدم بيسيح بكمية كبيرة. أول خطوة؟",
        options: [
          { text: "أحط ضغط قوي ومباشر على الجرح بقماشة نظيفة", score: 2, feedback: "صح. الضغط المباشر هو أول خطوة لوقف النزيف." },
          { text: "أغسل الجرح بالمية الأول", score: 1, feedback: "صح جزئيًا. التنظيف مهم بعدين، لكن وقف النزيف أولًا." },
          { text: "أرفع الرجل وأسيبها عشان الدم يتجلط لوحده", score: 0, feedback: "غلط. النزيف الشديد مش هيقف لوحده." }
        ]
      },
      {
        question: "بعد الضغط الدم لسه بيخرج، ومعاك عصبة (توركيه) وانت متدرب عليها. أعمل إيه؟",
        options: [
          { text: "أركّب العصبة فوق الجرح، وأكمل الضغط، وأطلب الإسعاف", score: 2, feedback: "صح. العصبة بتتطبق على الطرف للنزيف اللي بيهدد الحياة." },
          { text: "أحط شاش جديد فوق القماشة وأكمل الضغط", score: 1, feedback: "صح جزئيًا. الشاش الجديد مفيد، لكن النزيف الشديد من الطرف محتاج عصبة." },
          { text: "أفك الضغط كل دقيقة عشان أشوف الجرح", score: 0, feedback: "غلط. فك الضغط بيخلي النزيف يرجع." }
        ]
      }
    ]
  },
  {
    id: "unresponsive",
    title: "فاقد الوعي ومتنفس",
    level: "متوسط",
    triage: "immediate",
    setting: "لقيت شخص واقع على الأرض. بتناديه بصوت عالي وبتهزه بلطف، ومش بيرد. صدره بيطلع وينزل عادي.",
    keyPoint: "لو الشخص فاقد الوعي ومتنفس عادي، اطلب الإسعاف وحطه في وضعية الإفاقة (على جنبه) عشان مجرى الهوا يفضل مفتوح. ولو وقف التنفس، ابدأ الإنعاش القلبي الرئوي فورًا.",
    steps: [
      {
        question: "أول خطوة؟",
        options: [
          { text: "أتأكد من الأمان، وأناديه بصوت عالي وأهزه بلطف، ولو مردش أطلب الإسعاف", score: 2, feedback: "صح. التأكد من الوعي والتنفس، وطلب الإسعاف، هو الترتيب الصح." },
          { text: "أديله ميه يشربها", score: 0, feedback: "غلط. فاقد الوعي ممكن يختنق بالميه." },
          { text: "أسنده يقعد عشان يتنفس أحسن", score: 0, feedback: "غلط. تحريك الشخص بدون داعي ممكن يضر، خصوصًا لو في إصابة في الرقبة أو الضهر." }
        ]
      },
      {
        question: "بيتنفس عادي، ومفيش إصابة واضحة في الرقبة أو الضهر. أحطه في إيه؟",
        options: [
          { text: "وضعية الإفاقة: على جنبه، ورجله العلوية مثنية، ورأسه مايلة لورا شوية", score: 2, feedback: "صح. الوضعية دي بتفضل مجرى الهوا مفتوح، وبتخلي أي سوائل تنزل برا الفم." },
          { text: "أسيبه على ضهره زي ما هو", score: 0, feedback: "غلط. على ضهره اللسان ممكن يسد مجرى الهوا." },
          { text: "أقلبه على بطنه", score: 0, feedback: "غلط. دي مش وضعية الإفاقة، وممكن تصعّب التنفس." }
        ]
      }
    ]
  },
  {
    id: "minor-cut",
    title: "جرح بسيط في الصباع",
    level: "مبتدئ",
    triage: "minor",
    setting: "جرحت صباعك بسكينة الأكل. الجرح سطحي والنزيف خفيف.",
    keyPoint: "الجرح البسيط بيتعالج بغسيله بمية نظيفة والضغط عليه بقماشة نظيفة لحد ما ينزف بس. ولو الجرح عميق، أو النزيف مش بيقف، اطلب مساعدة طبية.",
    steps: [
      {
        question: "أعمل إيه أول حاجة؟",
        options: [
          { text: "أغسله بمية نظيفة، وأضغط عليه بقماشة نظيفة لحد ما النزيف يقف", score: 2, feedback: "صح. ده علاج الجرح البسيط." },
          { text: "أربط الصباع بشد قوي بشريط", score: 0, feedback: "غلط. الربط الشديد ممكن يقطع الدورة الدموية في الصباع." },
          { text: "أسيبه من غير ما أعمل حاجة", score: 1, feedback: "صح جزئيًا. الجرح مش خطر، لكن الغسيل والضغط أحسن." }
        ]
      }
    ]
  }
];
