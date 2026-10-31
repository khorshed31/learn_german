/* card_generator.js */
(() => {
  "use strict";

  const DATA_URL = "themes.json";
  const LS_KEY = "a1_custom_cards_v1";
  const $ = (id) => document.getElementById(id);

  // -----------------------------
  // Small helpers
  // -----------------------------
  function escapeHtml(str) {
    return (str ?? "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function slugId(s) {
    return (s || "card").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  function uniq(arr) {
    return Array.from(new Set((arr || []).filter(Boolean)));
  }

  // -----------------------------
  // Topic Bank (A1 coverage)
  // -----------------------------
  const TOPIC_BANK = {
    all: { label: "All (A1)", topics: [] }, // filled later
    food: {
      label: "Food",
      topics: [
        "Fisch","Brot","Reis","Nudeln","Suppe","Salat","Käse","Fleisch","Gemüse","Obst",
        "Apfel","Banane","Tomate","Kartoffel","Ei","Butter","Joghurt","Pizza","Sandwich","Schokolade"
      ]
    },
    drinks: {
      label: "Drinks",
      topics: ["Wasser","Kaffee","Tee","Milch","Saft","Cola","Mineralwasser","Orangensaft","Kakao","Limonade"]
    },
    shopping: {
      label: "Shopping",
      topics: ["Supermarkt","Markt","Preis","Kasse","Rechnung","Tasche","Rabatt","Geld","Karte zahlen","bar zahlen","Quittung","Angebot"]
    },
    clothes: {
      label: "Clothes",
      topics: ["T-Shirt","Hose","Jacke","Pullover","Kleid","Rock","Schuhe","Socken","Tasche","Mütze","Größe S","Größe M","Größe L","schwarz","blau","rot"]
    },
    home: {
      label: "Home",
      topics: ["Wohnung","Haus","Zimmer","Küche","Bad","Schlafzimmer","Wohnzimmer","Balkon","Garten","Fenster","Tür","Tisch","Stuhl","Bett","Sofa"]
    },
    family: {
      label: "Family",
      topics: ["Mutter","Vater","Schwester","Bruder","Kind","Ehemann","Ehefrau","Oma","Opa","Familie","Eltern","Cousin","Freund","Freundin"]
    },
    city_places: {
      label: "City & Places",
      topics: ["Bahnhof","Flughafen","Hotel","Restaurant","Café","Bank","Post","Schule","Universität","Büro","Apotheke","Krankenhaus","Park","Museum","Kino"]
    },
    transport: {
      label: "Transport",
      topics: ["Bus","Zug","U-Bahn","Taxi","Fahrkarte","Haltestelle","Abfahrt","Ankunft","Gleis","Fahrplan","Ticket","Rückfahrt"]
    },
    time_days: {
      label: "Time & Days",
      topics: ["heute","morgen","gestern","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag","Uhr","Uhrzeit","Datum","früh","spät"]
    },
    weather: {
      label: "Weather",
      topics: ["Sonne","Regen","Schnee","windig","kalt","warm","heiß","bewölkt","Nebel","Wetterbericht","Frühling","Sommer","Herbst","Winter"]
    },
    health: {
      label: "Health",
      topics: ["Kopfschmerzen","Bauchschmerzen","Husten","Fieber","Erkältung","Arzt","Termin","Apotheke","Tabletten","Medikament","Ruhe","krank","gesund"]
    },
    hobbies: {
      label: "Hobbies",
      topics: ["Fußball","Kino","Musik","Lesen","Schwimmen","Kochen","Spazieren","Tanzen","Fahrrad fahren","Reisen","Fernsehen","Sport"]
    },
    work_school: {
      label: "Work & School",
      topics: ["Unterricht","Hausaufgaben","Prüfung","Pause","Lehrer","Student","Kollege","Meeting","Arbeit","Schule","lernen","schreiben","sprechen"]
    }
  };

  function buildAllTopics() {
    const all = [];
    Object.keys(TOPIC_BANK).forEach(k => {
      if (k === "all") return;
      all.push(...(TOPIC_BANK[k].topics || []));
    });
    TOPIC_BANK.all.topics = uniq(all).sort((a,b)=>a.localeCompare(b));
  }

  function getTopicsByType(typeKey) {
    const t = TOPIC_BANK[typeKey];
    if (!t) return TOPIC_BANK.all.topics;
    return (t.topics || []);
  }

  // -----------------------------
  // TTS (Speak)
  // -----------------------------
  let voices = [];
  let activeBlock = null;

  function setActiveBlock(el, cls) {
    if (activeBlock) activeBlock.classList.remove("activeSpeak", "activeListen");
    activeBlock = el;
    if (activeBlock && cls) activeBlock.classList.add(cls);
  }
  function clearActiveBlock() {
    if (activeBlock) activeBlock.classList.remove("activeSpeak", "activeListen");
    activeBlock = null;
  }

  function loadVoices() {
    voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const deVoices = voices.filter(v => (v.lang || "").toLowerCase().startsWith("de"));
    const sel = $("voiceSelect");
    if (!sel) return;

    sel.innerHTML = "";
    const list = deVoices.length ? deVoices : voices;
    list.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      sel.appendChild(opt);
    });

    const preferred = deVoices[0] || list[0];
    if (preferred) sel.value = preferred.voiceURI;
  }

  function getSelectedVoice() {
    const sel = $("voiceSelect");
    if (!sel) return null;
    return voices.find(v => v.voiceURI === sel.value) || null;
  }

  function stopSpeaking() {
    clearActiveBlock();
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  function speak(text, blockEl = null) {
    stopSpeaking();
    if (!window.speechSynthesis || !text) return;

    setActiveBlock(blockEl, "activeSpeak");

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = parseFloat($("rate")?.value || "1");
    u.pitch = parseFloat($("pitch")?.value || "1");

    const v = getSelectedVoice();
    if (v) u.voice = v;

    u.onend = () => clearActiveBlock();
    u.onerror = () => clearActiveBlock();

    speechSynthesis.speak(u);
  }

  function speakSequence(texts, blockEl = null) {
    stopSpeaking();
    if (!window.speechSynthesis || !texts?.length) return;

    setActiveBlock(blockEl, "activeSpeak");
    let i = 0;

    const next = () => {
      if (i >= texts.length) { clearActiveBlock(); return; }
      const u = new SpeechSynthesisUtterance(texts[i]);
      u.lang = "de-DE";
      u.rate = parseFloat($("rate")?.value || "1");
      u.pitch = parseFloat($("pitch")?.value || "1");
      const v = getSelectedVoice();
      if (v) u.voice = v;
      u.onend = () => { i++; next(); };
      u.onerror = () => { i++; next(); };
      speechSynthesis.speak(u);
    };
    next();
  }

  // -----------------------------
  // Speech Recognition (Speak & Check)
  // -----------------------------
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRecognize = !!SpeechRecognition;

  function normalizeText(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[.,!?;:()„“"']/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function similarity(a, b) {
    a = normalizeText(a); b = normalizeText(b);
    if (!a && !b) return 1;
    if (!a || !b) return 0;

    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    const dist = dp[m][n];
    return 1 - dist / Math.max(m, n);
  }

  function tokenizeWords(text) {
    const raw = (text || "").trim();
    if (!raw) return { orig: [], norm: [] };
    const orig = raw.split(/\s+/).filter(Boolean);
    const norm = orig.map(w => w.toLowerCase().replace(/[^a-z0-9äöüß]/gi, "").trim());
    return { orig, norm };
  }

  function alignWords(expectedText, spokenText) {
    const E = tokenizeWords(expectedText);
    const S = tokenizeWords(spokenText);

    const e = E.norm, s = S.norm;
    const m = e.length, n = s.length;

    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const sub = (e[i - 1] === s[j - 1]) ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + sub
        );
      }
    }

    const status = Array(n).fill("extra");
    const missing = [];
    let i = m, j = n;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0) {
        const sub = (e[i - 1] === s[j - 1]) ? 0 : 1;
        if (dp[i][j] === dp[i - 1][j - 1] + sub) {
          status[j - 1] = sub === 0 ? "ok" : "bad";
          i--; j--;
          continue;
        }
      }
      if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
        missing.push(E.orig[i - 1]);
        i--;
        continue;
      }
      if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
        status[j - 1] = "extra";
        j--;
        continue;
      }
      if (i > 0) { missing.push(E.orig[i - 1]); i--; }
      else if (j > 0) { status[j - 1] = "extra"; j--; }
    }

    missing.reverse();
    return { spokenOrig: S.orig, status, missing };
  }

  function renderLiveWordsHTML(spokenText, expectedText) {
    const spoken = (spokenText || "").trim();
    if (!spoken) return "";

    if (!expectedText) {
      const words = spoken.split(/\s+/).filter(Boolean);
      return words.map((w, i) => {
        const cls = i === words.length - 1 ? "liveWord last" : "liveWord";
        return `<span class="${cls}">${escapeHtml(w)}</span>`;
      }).join("");
    }

    const { spokenOrig, status, missing } = alignWords(expectedText, spokenText);

    const spokenHtml = spokenOrig.map((w, i) => {
      const st = status[i] || "extra";
      const last = (i === spokenOrig.length - 1) ? " last" : "";
      return `<span class="liveWord ${st}${last}">${escapeHtml(w)}</span>`;
    }).join("");

    const missingHtml = missing.length
      ? `<div class="tiny text-muted mt-2">Missing: ${
          missing.map(w => `<span class="liveWord miss">${escapeHtml(w)}</span>`).join(" ")
        }</div>`
      : "";

    return `<div>${spokenHtml}</div>${missingHtml}`;
  }

  function bestExpected(spoken, exp1, exp2) {
    const s1 = exp1 ? similarity(exp1, spoken) : 0;
    const s2 = exp2 ? similarity(exp2, spoken) : 0;
    if (s2 > s1) return { expectedUsed: exp2, sim: s2 };
    return { expectedUsed: exp1 || exp2 || "", sim: s1 || s2 };
  }

  function recognizeOnce({ expected, expectedAlt, blockEl, onInterim, onDone, onError }) {
    if (!canRecognize) {
      onError?.("Speech recognition not supported.");
      return;
    }

    stopSpeaking();
    setActiveBlock(blockEl, "activeListen");

    const rec = new SpeechRecognition();
    rec.lang = "de-DE";
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    let done = false;

    rec.onresult = (e) => {
      if (done) return;

      let finalText = "";
      let interimText = "";

      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0]?.transcript || "";
        if (r.isFinal) finalText += " " + t;
        else interimText += " " + t;
      }

      const combined = (finalText + " " + interimText).trim();
      const best = bestExpected(combined, expected, expectedAlt);

      onInterim?.(combined, best.expectedUsed);

      const last = e.results[e.results.length - 1];
      if (last && last.isFinal) {
        done = true;
        clearActiveBlock();
        onDone?.({ said: combined, sim: best.sim, expectedUsed: best.expectedUsed });
        try { rec.stop(); } catch {}
      }
    };

    rec.onerror = (e) => {
      if (done) return;
      done = true;
      clearActiveBlock();
      onError?.(e.error || "Recognition error");
    };

    rec.onend = () => clearActiveBlock();

    rec.start();
  }

  // -----------------------------
  // Formal converter (basic)
  // -----------------------------
  function autoFormalFromDu(text) {
    if (!text) return text;

    const rules = [
      [/^Wie heißt du\?$/i, "Wie heißen Sie?"],
      [/^Woher kommst du\?$/i, "Woher kommen Sie?"],
      [/^Wo wohnst du\?$/i, "Wo wohnen Sie?"],
      [/^Wie alt bist du\?$/i, "Wie alt sind Sie?"],
      [/^Welche Sprachen sprichst du\?$/i, "Welche Sprachen sprechen Sie?"],
      [/^Was machst du\?$/i, "Was machen Sie?"],
      [/^Hast du\b/i, "Haben Sie"],
      [/^Kannst du\b/i, "Können Sie"],
      [/^Wohnst du\b/i, "Wohnen Sie"],
      [/^Sprichst du\b/i, "Sprechen Sie"],
      [/^Machst du\b/i, "Machen Sie"],
      [/^Bist du\b/i, "Sind Sie"]
    ];
    for (const [re, rep] of rules) if (re.test(text)) return text.replace(re, rep);

    return text
      .replace(/\bdu\b/gi, "Sie")
      .replace(/\bdich\b/gi, "Sie")
      .replace(/\bdir\b/gi, "Ihnen")
      .replace(/\bdein\b/gi, "Ihr")
      .replace(/\bdeine\b/gi, "Ihre")
      .replace(/\bdeinen\b/gi, "Ihren")
      .replace(/\bdeinem\b/gi, "Ihrem")
      .replace(/\bdeiner\b/gi, "Ihrer")
      .replace(/\bdeines\b/gi, "Ihres");
  }

  // -----------------------------
  // Theme fields + templates
  // -----------------------------
  const THEME_FIELDS = {
    kennenlernen: [
      { key:"name", label:"Name", ph:"Khorshed" },
      { key:"country", label:"Country (DE)", ph:"Bangladesch" },
      { key:"city", label:"City", ph:"Dhaka" }
    ],
    familie: [
      { key:"member", label:"Family member", ph:"Bruder" },
      { key:"mother", label:"Mother name", ph:"Sara" },
      { key:"count", label:"How many people", ph:"vier" }
    ],
    wohnen: [
      { key:"homeType", label:"Wohnung / Haus", ph:"Wohnung" },
      { key:"rooms", label:"Number of rooms (DE)", ph:"zwei" },
      { key:"feature", label:"Feature (Balkon/Garten)", ph:"Balkon" }
    ],
    alltag: [
      { key:"time1", label:"Time (DE)", ph:"sieben Uhr" },
      { key:"day", label:"Day (DE)", ph:"Samstag" },
      { key:"time2", label:"Time (DE)", ph:"vier Uhr" }
    ],
    essen: [
      { key:"drink", label:"Drink (DE)", ph:"Kaffee" },
      { key:"food", label:"Food (DE)", ph:"Suppe" },
      { key:"extra", label:"Extra (DE)", ph:"Rechnung" }
    ],
    einkaufen: [
      { key:"item", label:"Item (DE)", ph:"Äpfel" },
      { key:"price", label:"Price (DE)", ph:"zehn Euro" },
      { key:"pay", label:"Pay (DE)", ph:"mit Karte" }
    ],
    kleidung: [
      { key:"item", label:"Clothing item (DE)", ph:"T-Shirt" },
      { key:"size", label:"Size", ph:"M" },
      { key:"color", label:"Color (DE)", ph:"schwarz" }
    ],
    weg: [
      { key:"place", label:"Destination (DE)", ph:"Bahnhof" },
      { key:"dir1", label:"Direction 1 (DE)", ph:"geradeaus" },
      { key:"dir2", label:"Direction 2 (DE)", ph:"dann links" }
    ],
    reisen: [
      { key:"ticket", label:"Ticket type (DE)", ph:"hin und zurück" },
      { key:"price", label:"Price (DE)", ph:"zwölf Euro" },
      { key:"time", label:"Departure time (DE)", ph:"neun Uhr" }
    ],
    wetter: [
      { key:"weather", label:"Weather (DE)", ph:"kalt und windig" },
      { key:"season", label:"Season (DE)", ph:"Sommer" },
      { key:"plan", label:"Plan (DE)", ph:"spazieren gehen" }
    ],
    gesundheit: [
      { key:"symptom", label:"Symptom (DE)", ph:"Kopfschmerzen" },
      { key:"when", label:"When (DE)", ph:"heute" },
      { key:"time", label:"Time (DE)", ph:"drei Uhr" }
    ],
    freizeit: [
      { key:"hobby", label:"Hobby (DE)", ph:"Fußball" },
      { key:"place", label:"Place (DE)", ph:"Kino" },
      { key:"day", label:"Day (DE)", ph:"Sonntag" }
    ],
    telefon: [
      { key:"person", label:"Person name", ph:"Khorshed" },
      { key:"thing", label:"Thing (Nachricht/E-Mail)", ph:"Nachricht" },
      { key:"time", label:"Time (DE)", ph:"später" }
    ],
    termine: [
      { key:"time", label:"Time (DE)", ph:"vier Uhr" },
      { key:"place", label:"Place (DE)", ph:"vor dem Café" },
      { key:"day", label:"Day (DE)", ph:"Freitag" }
    ],
    bitten: [
      { key:"request", label:"Request 1 (DE)", ph:"das Fenster öffnen" },
      { key:"request2", label:"Request 2 (DE)", ph:"die Tür schließen" },
      { key:"request3", label:"Request 3 (DE)", ph:"mir helfen" }
    ]
  };

  const TEMPLATES = {
    kennenlernen: (v) => ([
      { q:{de:"Wie heißt du?", en:"What is your name?"}, a:{de:`Ich heiße ${v.name}.`, en:`My name is ${v.name}.`} },
      { q:{de:"Woher kommst du?", en:"Where are you from?"}, a:{de:`Ich komme aus ${v.country}.`, en:`I am from ${v.country}.`} },
      { q:{de:"Wo wohnst du?", en:"Where do you live?"}, a:{de:`Ich wohne in ${v.city}.`, en:`I live in ${v.city}.`} }
    ]),
    familie: (v) => ([
      { q:{de:"Hast du Geschwister?", en:"Do you have siblings?"}, a:{de:`Ja, ich habe einen ${v.member}.`, en:`Yes, I have a ${v.member}.`} },
      { q:{de:"Wie heißt deine Mutter?", en:"What is your mother’s name?"}, a:{de:`Meine Mutter heißt ${v.mother}.`, en:`My mother’s name is ${v.mother}.`} },
      { q:{de:"Wie viele Personen seid ihr?", en:"How many people are in your family?"}, a:{de:`Wir sind ${v.count} Personen.`, en:`We are ${v.count} people.`} }
    ]),
    wohnen: (v) => ([
      { q:{de:"Wohnst du in einer Wohnung oder in einem Haus?", en:"Do you live in an apartment or a house?"}, a:{de:`Ich wohne in einer ${v.homeType}.`, en:`I live in a ${v.homeType}.`} },
      { q:{de:"Wie viele Zimmer hast du?", en:"How many rooms do you have?"}, a:{de:`Ich habe ${v.rooms} Zimmer.`, en:`I have ${v.rooms} rooms.`} },
      { q:{de:`Hast du einen ${v.feature}?`, en:`Do you have a ${v.feature}?`}, a:{de:`Nein, ich habe keinen ${v.feature}.`, en:`No, I don’t have a ${v.feature}.`} }
    ]),
    alltag: (v) => ([
      { q:{de:"Wann stehst du auf?", en:"When do you get up?"}, a:{de:`Ich stehe um ${v.time1} auf.`, en:`I get up at ${v.time1}.`} },
      { q:{de:`Hast du am ${v.day} Zeit?`, en:`Do you have time on ${v.day}?`}, a:{de:`Ja, um ${v.time2}.`, en:`Yes, at ${v.time2}.`} },
      { q:{de:"Wann beginnt der Unterricht?", en:"When does class start?"}, a:{de:"Der Unterricht beginnt um neun Uhr.", en:"Class starts at 9 o’clock."} }
    ]),
    essen: (v) => ([
      { q:{de:"Was möchtest du trinken?", en:"What would you like to drink?"}, a:{de:`Ich möchte einen ${v.drink}, bitte.`, en:`I’d like a ${v.drink}, please.`} },
      { q:{de:"Was möchtest du essen?", en:"What would you like to eat?"}, a:{de:`Ich möchte eine ${v.food}.`, en:`I’d like a ${v.food}.`} },
      { q:{de:`Die ${v.extra}, bitte.`, en:`The ${v.extra}, please.`}, a:{de:"Ja, sofort.", en:"Yes, right away."} }
    ]),
    einkaufen: (v) => ([
      { q:{de:"Was kostet das?", en:"How much does that cost?"}, a:{de:`Das kostet ${v.price}.`, en:`That costs ${v.price}.`} },
      { q:{de:`Wo finde ich ${v.item}?`, en:`Where can I find ${v.item}?`}, a:{de:"Das ist dort.", en:"It is there."} },
      { q:{de:"Kann ich mit Karte zahlen?", en:"Can I pay by card?"}, a:{de:`Ja, ${v.pay}.`, en:`Yes, ${v.pay}.`} }
    ]),
    kleidung: (v) => ([
      { q:{de:`Hast du ein ${v.item}?`, en:`Do you have a ${v.item}?`}, a:{de:"Ja, bitte.", en:"Yes, please."} },
      { q:{de:"Welche Größe brauchst du?", en:"What size do you need?"}, a:{de:`Ich brauche Größe ${v.size}.`, en:`I need size ${v.size}.`} },
      { q:{de:"Welche Farbe möchtest du?", en:"Which color do you want?"}, a:{de:`Ich möchte ${v.color}.`, en:`I want ${v.color}.`} }
    ]),
    weg: (v) => ([
      { q:{de:`Entschuldigung, wo ist der ${v.place}?`, en:`Excuse me, where is the ${v.place}?`}, a:{de:`Gehen Sie ${v.dir1} und ${v.dir2}.`, en:`Go ${v.dir1} and then ${v.dir2}.`} },
      { q:{de:"Ist es weit?", en:"Is it far?"}, a:{de:"Nein, nur fünf Minuten.", en:"No, only five minutes."} },
      { q:{de:"Können Sie das wiederholen?", en:"Can you repeat that?"}, a:{de:"Ja, natürlich.", en:"Yes, of course."} }
    ]),
    reisen: (v) => ([
      { q:{de:"Ich brauche eine Fahrkarte.", en:"I need a ticket."}, a:{de:`Einmal oder ${v.ticket}?`, en:`One-way or ${v.ticket}?`} },
      { q:{de:"Wie viel kostet das Ticket?", en:"How much is the ticket?"}, a:{de:`Das Ticket kostet ${v.price}.`, en:`The ticket costs ${v.price}.`} },
      { q:{de:"Wann fährt der Zug?", en:"When does the train leave?"}, a:{de:`Der Zug fährt um ${v.time}.`, en:`The train leaves at ${v.time}.`} }
    ]),
    wetter: (v) => ([
      { q:{de:"Wie ist das Wetter heute?", en:"How is the weather today?"}, a:{de:`Es ist ${v.weather}.`, en:`It is ${v.weather}.`} },
      { q:{de:"Welche Jahreszeit magst du?", en:"Which season do you like?"}, a:{de:`Ich mag den ${v.season}.`, en:`I like ${v.season}.`} },
      { q:{de:"Was machst du heute?", en:"What are you doing today?"}, a:{de:`Ich möchte ${v.plan}.`, en:`I want to ${v.plan}.`} }
    ]),
    gesundheit: (v) => ([
      { q:{de:"Wie geht es dir?", en:"How are you?"}, a:{de:"Mir geht es nicht gut.", en:"I am not well."} },
      { q:{de:"Was tut weh?", en:"What hurts?"}, a:{de:`Ich habe ${v.symptom}.`, en:`I have ${v.symptom}.`} },
      { q:{de:"Wann haben Sie Zeit?", en:"When do you have time?"}, a:{de:`${v.when}, um ${v.time}.`, en:`${v.when}, at ${v.time}.`} }
    ]),
    freizeit: (v) => ([
      { q:{de:"Was machst du in deiner Freizeit?", en:"What do you do in your free time?"}, a:{de:`Ich spiele gern ${v.hobby}.`, en:`I like playing ${v.hobby}.`} },
      { q:{de:`Gehst du gern ins ${v.place}?`, en:`Do you like going to the ${v.place}?`}, a:{de:"Ja, sehr gern.", en:"Yes, very much."} },
      { q:{de:"Hast du am Wochenende Zeit?", en:"Do you have time on the weekend?"}, a:{de:`Ja, am ${v.day}.`, en:`Yes, on ${v.day}.`} }
    ]),
    telefon: (v) => ([
      { q:{de:`Kann ich bitte ${v.person} sprechen?`, en:`May I speak to ${v.person}, please?`}, a:{de:"Ja, einen Moment bitte.", en:"Yes, one moment please."} },
      { q:{de:`Kannst du mir eine ${v.thing} schicken?`, en:`Can you send me a ${v.thing}?`}, a:{de:`Ja, ich schicke dir eine ${v.thing}.`, en:`Yes, I will send you a ${v.thing}.`} },
      { q:{de:"Rufst du mich später an?", en:"Will you call me later?"}, a:{de:`Ja, ich rufe dich ${v.time} an.`, en:`Yes, I’ll call you ${v.time}.`} }
    ]),
    termine: (v) => ([
      { q:{de:"Wann treffen wir uns?", en:"When do we meet?"}, a:{de:`Wir treffen uns um ${v.time}.`, en:`We meet at ${v.time}.`} },
      { q:{de:"Wo treffen wir uns?", en:"Where do we meet?"}, a:{de:`Wir treffen uns ${v.place}.`, en:`We meet ${v.place}.`} },
      { q:{de:"Können wir den Termin verschieben?", en:"Can we postpone the appointment?"}, a:{de:`Ja, am ${v.day}.`, en:`Yes, on ${v.day}.`} }
    ]),
    bitten: (v) => ([
      { q:{de:`Können Sie bitte ${v.request}?`, en:`Can you please ${v.request}?`}, a:{de:"Ja, sofort.", en:"Yes, right away."} },
      { q:{de:`Können Sie bitte ${v.request2}?`, en:`Can you please ${v.request2}?`}, a:{de:"Ja, natürlich.", en:"Yes, of course."} },
      { q:{de:`Können Sie mir bitte ${v.request3}?`, en:`Can you please ${v.request3}?`}, a:{de:"Ja, gern.", en:"Yes, gladly."} }
    ])
  };

  // -----------------------------
  // App data
  // -----------------------------
  let DATA = null;
  let currentCard = null;

  function getThemeById(id) {
    return (DATA?.themes || []).find(t => t.id === id);
  }

  function getValuesFromFields(themeId) {
    const schema = THEME_FIELDS[themeId] || [];
    const out = {};
    schema.forEach(f => {
      out[f.key] = ($(`f_${f.key}`)?.value || "").trim() || f.ph;
    });
    return out;
  }

  function renderFields(themeId) {
    const area = $("fieldsArea");
    if (!area) return;
    const schema = THEME_FIELDS[themeId] || [];
    area.innerHTML = schema.map(f => `
      <label class="tiny text-muted mt-2">${escapeHtml(f.label)}</label>
      <input class="form-control form-control-sm" id="f_${f.key}" placeholder="${escapeHtml(f.ph)}">
    `).join("");
  }

  function randomFill(themeId) {
    const schema = THEME_FIELDS[themeId] || [];
    schema.forEach(f => {
      const el = $(`f_${f.key}`);
      if (el) el.value = f.ph;
    });
  }

  // -----------------------------
  // Topic UI
  // -----------------------------
  function fillTopicTypes() {
    const sel = $("topicTypeSelect");
    if (!sel) return;

    const keys = Object.keys(TOPIC_BANK);
    sel.innerHTML = keys.map(k => `<option value="${escapeHtml(k)}">${escapeHtml(TOPIC_BANK[k].label)}</option>`).join("");
    sel.value = "all";
  }

  function refreshTopicOptions() {
    const typeKey = $("topicTypeSelect")?.value || "all";
    const topics = getTopicsByType(typeKey);

    const sel = $("topicSelect");
    const dl = $("topicDatalist");
    const count = $("topicCount");

    if (count) count.textContent = topics.length ? `${topics.length} topics` : "";

    if (sel) {
      const opts = [`<option value="">— No topic —</option>`].concat(
        topics.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`)
      );
      sel.innerHTML = opts.join("");
    }

    if (dl) {
      dl.innerHTML = topics.map(t => `<option value="${escapeHtml(t)}"></option>`).join("");
    }

    // keep custom if typed
    const custom = ($("topicCustom")?.value || "").trim();
    if (!custom) {
      // set custom to selected option for convenience
      const v = (sel?.value || "").trim();
      if (v) $("topicCustom").value = v;
    }
  }

  function getSelectedTopic() {
    const custom = ($("topicCustom")?.value || "").trim();
    if (custom) return custom;
    return ($("topicSelect")?.value || "").trim();
  }

  function getSelectedTopicType() {
    return ($("topicTypeSelect")?.value || "all").trim();
  }

  // -----------------------------
  // Topic-based Q&A (by type) + theme mix
  // -----------------------------
  function topicQAsByType(topicType, topic) {
    const t = topic;

    switch (topicType) {
      case "food":
        return [
          { q:{de:`Magst du ${t}?`, en:`Do you like ${t}?`}, a:{de:`Ja, ich mag ${t}.`, en:`Yes, I like ${t}.`} },
          { q:{de:`Isst du gern ${t}?`, en:`Do you like eating ${t}?`}, a:{de:`Ja, ich esse gern ${t}.`, en:`Yes, I like eating ${t}.`} }
        ];
      case "drinks":
        return [
          { q:{de:`Trinkst du gern ${t}?`, en:`Do you like drinking ${t}?`}, a:{de:`Ja, ich trinke gern ${t}.`, en:`Yes, I like drinking ${t}.`} },
          { q:{de:`Möchtest du ${t}, bitte?`, en:`Would you like ${t}, please?`}, a:{de:`Ja, bitte.`, en:`Yes, please.`} }
        ];
      case "shopping":
        return [
          { q:{de:`Wo kann ich ${t} kaufen?`, en:`Where can I buy ${t}?`}, a:{de:`Im Supermarkt.`, en:`In the supermarket.`} },
          { q:{de:`Wie viel kostet das?`, en:`How much does it cost?`}, a:{de:`Das kostet zehn Euro.`, en:`It costs ten euros.`} }
        ];
      case "clothes":
        return [
          { q:{de:`Ich suche ${t}. Hast du ${t}?`, en:`I’m looking for ${t}. Do you have it?`}, a:{de:`Ja, bitte.`, en:`Yes, please.`} },
          { q:{de:`Welche Größe brauchst du?`, en:`What size do you need?`}, a:{de:`Ich brauche Größe M.`, en:`I need size M.`} }
        ];
      case "home":
        return [
          { q:{de:`Hast du ${t}?`, en:`Do you have ${t}?`}, a:{de:`Ja, ich habe ${t}.`, en:`Yes, I have ${t}.`} },
          { q:{de:`Wo ist ${t}?`, en:`Where is ${t}?`}, a:{de:`Es ist dort.`, en:`It is there.`} }
        ];
      case "family":
        return [
          { q:{de:`Wer ist das? (${t})`, en:`Who is that? (${t})`}, a:{de:`Das ist mein/meine ${t}.`, en:`That is my ${t}.`} },
          { q:{de:`Hast du eine große Familie?`, en:`Do you have a big family?`}, a:{de:`Ja, meine Familie ist groß.`, en:`Yes, my family is big.`} }
        ];
      case "city_places":
        return [
          { q:{de:`Wo ist der/die ${t}?`, en:`Where is the ${t}?`}, a:{de:`Dort drüben.`, en:`Over there.`} },
          { q:{de:`Gehst du gern zum/zur ${t}?`, en:`Do you like going to the ${t}?`}, a:{de:`Ja, sehr gern.`, en:`Yes, very much.`} }
        ];
      case "transport":
        return [
          { q:{de:`Wann fährt der ${t}?`, en:`When does the ${t} leave?`}, a:{de:`Um neun Uhr.`, en:`At 9 o’clock.`} },
          { q:{de:`Ich brauche eine Fahrkarte.`, en:`I need a ticket.`}, a:{de:`Ja, bitte.`, en:`Yes, please.`} }
        ];
      case "time_days":
        return [
          { q:{de:`Hast du ${t} Zeit?`, en:`Do you have time ${t}?`}, a:{de:`Ja, ich habe Zeit.`, en:`Yes, I have time.`} },
          { q:{de:`Wie spät ist es?`, en:`What time is it?`}, a:{de:`Es ist sieben Uhr.`, en:`It is seven o’clock.`} }
        ];
      case "weather":
        return [
          { q:{de:`Wie ist das Wetter?`, en:`How is the weather?`}, a:{de:`Es ist ${t}.`, en:`It is ${t}.`} },
          { q:{de:`Magst du ${t}?`, en:`Do you like ${t}?`}, a:{de:`Ja, ich mag ${t}.`, en:`Yes, I like ${t}.`} }
        ];
      case "health":
        return [
          { q:{de:`Was tut weh?`, en:`What hurts?`}, a:{de:`Ich habe ${t}.`, en:`I have ${t}.`} },
          { q:{de:`Gehst du zum Arzt?`, en:`Are you going to the doctor?`}, a:{de:`Ja, ich habe einen Termin.`, en:`Yes, I have an appointment.`} }
        ];
      case "hobbies":
        return [
          { q:{de:`Was machst du gern?`, en:`What do you like doing?`}, a:{de:`Ich mache gern ${t}.`, en:`I like doing ${t}.`} },
          { q:{de:`Hast du am Wochenende Zeit?`, en:`Do you have time on the weekend?`}, a:{de:`Ja, am Samstag.`, en:`Yes, on Saturday.`} }
        ];
      case "work_school":
        return [
          { q:{de:`Hast du heute ${t}?`, en:`Do you have ${t} today?`}, a:{de:`Ja, heute.`, en:`Yes, today.`} },
          { q:{de:`Wann beginnt der Unterricht?`, en:`When does class start?`}, a:{de:`Um neun Uhr.`, en:`At 9 o’clock.`} }
        ];
      default:
        return [
          { q:{de:`Magst du ${t}?`, en:`Do you like ${t}?`}, a:{de:`Ja, ich mag ${t}.`, en:`Yes, I like ${t}.`} },
          { q:{de:`Was ist das?`, en:`What is that?`}, a:{de:`Das ist ${t}.`, en:`That is ${t}.`} }
        ];
    }
  }

  function topicMixQAs(themeId, topicType, topic) {
    const t = topic;

    // Theme-specific combos (nice A1)
    if (themeId === "familie") {
      return [
        { q:{de:`Isst deine Familie gern ${t}?`, en:`Does your family like ${t}?`}, a:{de:`Ja, meine Familie mag ${t}.`, en:`Yes, my family likes ${t}.`} },
        { q:{de:`Wer in deiner Familie mag ${t}?`, en:`Who in your family likes ${t}?`}, a:{de:`Meine Mutter mag ${t}.`, en:`My mother likes ${t}.`} }
      ];
    }

    if (themeId === "einkaufen") {
      return [
        { q:{de:`Ich möchte ${t}. Wo finde ich ${t}?`, en:`I want ${t}. Where can I find it?`}, a:{de:`Dort drüben.`, en:`Over there.`} },
        { q:{de:`Was kostet ${t}?`, en:`How much does ${t} cost?`}, a:{de:`Das kostet zehn Euro.`, en:`It costs ten euros.`} }
      ];
    }

    if (themeId === "essen") {
      return [
        { q:{de:`Ich möchte ${t}, bitte.`, en:`I would like ${t}, please.`}, a:{de:`Ja, gern.`, en:`Yes, gladly.`} },
        { q:{de:`Schmeckt ${t} gut?`, en:`Does ${t} taste good?`}, a:{de:`Ja, ${t} schmeckt gut.`, en:`Yes, ${t} tastes good.`} }
      ];
    }

    if (themeId === "weg" || themeId === "reisen") {
      return [
        { q:{de:`Entschuldigung, wo ist ${t}?`, en:`Excuse me, where is ${t}?`}, a:{de:`Gehen Sie geradeaus.`, en:`Go straight.`} },
        { q:{de:`Ist ${t} weit?`, en:`Is ${t} far?`}, a:{de:`Nein, nur fünf Minuten.`, en:`No, only five minutes.`} }
      ];
    }

    // Otherwise: use type-based generic topic QAs
    return topicQAsByType(topicType, topic);
  }

  function buildCard(themeId, title, values, topicType = "all", topic = "") {
    const theme = getThemeById(themeId);
    const tpl = TEMPLATES[themeId] || TEMPLATES.kennenlernen;

    const themeItemsRaw = tpl(values); // usually 3
    const topicItemsRaw = topic ? topicMixQAs(themeId, topicType, topic) : [];

    // 4 items total: theme1 + theme2 + topic1 + theme3
    const mixedRaw = topic
      ? [themeItemsRaw[0], themeItemsRaw[1], topicItemsRaw[0], themeItemsRaw[2]].filter(Boolean)
      : themeItemsRaw.slice(0);

    const finalTitle = title
      ? title
      : (topic
        ? `Custom • ${theme?.title || themeId} + ${topic}`
        : `Custom • ${theme?.title || themeId}`);

    const baseId = slugId(`${themeId}_${topicType}_${topic || ""}_${finalTitle}`);

    const items = mixedRaw.slice(0, 4).map((it) => {
      const qDu = it.q.de;
      const aDu = it.a.de;
      return {
        q: { de: qDu, de_sie: autoFormalFromDu(qDu), en: it.q.en, pron: "", pron_sie: "" },
        a: { de: aDu, de_sie: autoFormalFromDu(aDu), en: it.a.en, pron: "", pron_sie: "" }
      };
    });

    return { id: baseId, title: finalTitle, items };
  }

  function updateJsonOut() {
    if (!currentCard) return;
    const out = $("jsonOut");
    if (!out) return;
    out.value = JSON.stringify(currentCard, null, 2);
  }

  // -----------------------------
  // Editor + Practice
  // -----------------------------
  function renderEditor(card) {
    const preview = $("previewArea");
    if (!preview) return;
    const tone = $("styleSelect")?.value || "du";

    const pickPreview = (obj) => {
      const du = obj.de || "";
      const sie = obj.de_sie || autoFormalFromDu(du);
      if (tone === "sie") return sie;
      if (tone === "du") return du;
      return `${du}\n(Sie) ${sie}`;
    };

    const editorBlock = (idx, side, obj, label) => {
      const du = obj.de || "";
      const sie = obj.de_sie || autoFormalFromDu(du);

      return `
        <div class="qaBlock mb-2">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="fw-semibold">${escapeHtml(label)}</div>
            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-outline-primary btn-sm btn-pill"
                data-speak="${escapeHtml(tone === "sie" ? sie : du)}">🔊 Speak</button>
              <button class="btn btn-outline-secondary btn-sm btn-pill"
                data-speak-both="${escapeHtml(du)}"
                data-speak-both2="${escapeHtml(sie)}">🔊 du+Sie</button>
            </div>
          </div>

          <div class="row g-2 mt-2">
            <div class="col-12">
              <label class="tiny text-muted">German (du)</label>
              <input class="form-control form-control-sm"
                data-edit="1" data-idx="${idx}" data-side="${side}" data-key="de"
                value="${escapeHtml(du)}">
            </div>

            <div class="col-12">
              <label class="tiny text-muted">German (Sie)</label>
              <input class="form-control form-control-sm"
                data-edit="1" data-idx="${idx}" data-side="${side}" data-key="de_sie"
                value="${escapeHtml(sie)}">
            </div>

            <div class="col-md-6">
              <label class="tiny text-muted">Pron (du)</label>
              <input class="form-control form-control-sm"
                data-edit="1" data-idx="${idx}" data-side="${side}" data-key="pron"
                placeholder="optional" value="${escapeHtml(obj.pron || "")}">
            </div>

            <div class="col-md-6">
              <label class="tiny text-muted">Pron (Sie)</label>
              <input class="form-control form-control-sm"
                data-edit="1" data-idx="${idx}" data-side="${side}" data-key="pron_sie"
                placeholder="optional" value="${escapeHtml(obj.pron_sie || "")}">
            </div>

            <div class="col-12">
              <label class="tiny text-muted">English</label>
              <input class="form-control form-control-sm"
                data-edit="1" data-idx="${idx}" data-side="${side}" data-key="en"
                value="${escapeHtml(obj.en || "")}">
            </div>
          </div>

          <div class="text-muted tiny mt-2">
            Preview: <span class="mono">${escapeHtml(pickPreview(obj))}</span>
          </div>
        </div>
      `;
    };

    preview.innerHTML = `
      <div class="mutedbox p-3 mb-3">
        <div class="fw-semibold">${escapeHtml(card.title)}</div>
        <div class="text-muted tiny">Edit fields below. Practice is shown under “Final Practice”.</div>
      </div>
      ${(card.items || []).map((it, idx) => `
        <div class="mutedbox p-3 mb-3">
          <div class="fw-semibold">Q${idx + 1}</div>
          <div class="mt-2">
            ${editorBlock(idx, "q", it.q, "Question")}
            ${editorBlock(idx, "a", it.a, "Answer")}
          </div>
        </div>
      `).join("")}
    `;
  }

  function renderPractice(card) {
    const tone = $("styleSelect")?.value || "du";
    const area = $("practiceArea");
    if (!area) return;

    const pick = (obj) => {
      const du = obj.de || "";
      const sie = obj.de_sie || autoFormalFromDu(du);
      if (tone === "du") return { show: du, expected: du, expectedAlt: sie, label: "du" };
      if (tone === "sie") return { show: sie, expected: sie, expectedAlt: du, label: "Sie" };
      return { show: `${du}  |  ${sie}`, expected: du, expectedAlt: sie, label: "du+Sie" };
    };

    const lineBlock = (idx, side, obj, who) => {
      const p = pick(obj);
      const uid = `${side}_${idx}_${Math.random().toString(16).slice(2)}`;

      return `
        <div class="qaBlock mb-2" data-qa>
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="fw-semibold">${escapeHtml(who)} <span class="badge text-bg-light text-muted pill">${escapeHtml(p.label)}</span></div>
            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-outline-primary btn-sm btn-pill"
                data-speak="${escapeHtml(p.expected)}">🔊 Speak</button>
              <button class="btn btn-outline-secondary btn-sm btn-pill"
                data-speak-both="${escapeHtml(p.expected)}"
                data-speak-both2="${escapeHtml(p.expectedAlt)}">🔊 du+Sie</button>
              <button class="btn btn-outline-success btn-sm btn-pill"
                data-check="1"
                data-expected="${escapeHtml(p.expected)}"
                data-expected-alt="${escapeHtml(p.expectedAlt)}"
                data-live-id="live_${uid}"
                data-res-id="res_${uid}"
                data-msg-id="msg_${uid}">
                🎙️ Speak & Check
              </button>
            </div>
          </div>

          <div class="mt-2"><b>DE:</b> ${escapeHtml(p.show)}</div>
          <div class="text-muted tiny mt-1"><b>EN:</b> ${escapeHtml(obj.en || "")}</div>

          <div class="liveRow">
            <div class="wave" aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <div class="liveTranscript" id="live_${uid}"></div>
          </div>

          <div class="resultRow d-none" id="res_${uid}"></div>
          <div class="tiny text-muted mt-2" id="msg_${uid}"></div>
        </div>
      `;
    };

    area.innerHTML = (card.items || []).map((it, idx) => `
      <div class="mutedbox p-3 mb-3">
        <div class="fw-semibold">Q${idx + 1}</div>
        <div class="mt-2">
          ${lineBlock(idx, "q", it.q, "Question")}
          ${lineBlock(idx, "a", it.a, "Answer")}
        </div>
      </div>
    `).join("") || `<div class="mutedbox p-3 tiny text-muted">No items.</div>`;
  }

  function renderAll(card) {
    updateJsonOut();
    renderEditor(card);
    renderPractice(card);
  }

  // -----------------------------
  // Copy / Download JSON
  // -----------------------------
  function copyJSON() {
    const txt = $("jsonOut")?.value || "";
    if (!txt) return;
    navigator.clipboard?.writeText(txt);
  }

  function downloadJSON() {
    const txt = $("jsonOut")?.value || "";
    if (!txt) return;
    const blob = new Blob([txt], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (currentCard?.id || "card") + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // -----------------------------
  // My Cards (LocalStorage)
  // -----------------------------
  function readMyCards() {
    try {
      const arr = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function writeMyCards(arr) {
    localStorage.setItem(LS_KEY, JSON.stringify(arr || []));
  }
  function makeSavedId() {
    return (crypto?.randomUUID?.() || (`id_${Date.now()}_${Math.random().toString(16).slice(2)}`));
  }
  function formatDate(iso) {
    try { return new Date(iso).toLocaleString(); } catch { return iso || ""; }
  }
  function downloadBlobJson(obj, filename) {
    const txt = JSON.stringify(obj, null, 2);
    const blob = new Blob([txt], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function renderMyCardsList() {
    const list = $("myCardsList");
    const count = $("myCardsCount");
    if (!list) return;

    const arr = readMyCards();
    if (count) count.textContent = String(arr.length);

    if (!arr.length) {
      list.innerHTML = `<div class="mutedbox p-3 tiny text-muted">No saved cards yet.</div>`;
      return;
    }

    list.innerHTML = arr.slice().reverse().map((row) => {
      const savedId = row.savedId || "";
      const themeTitle = getThemeById(row.themeId)?.title || row.themeId || "Theme";
      const title = row.card?.title || "(Untitled)";
      const when = formatDate(row.savedAt);

      return `
        <div class="qaBlock mb-2">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <div>
              <div class="fw-semibold">${escapeHtml(title)}</div>
              <div class="text-muted tiny">${escapeHtml(themeTitle)} • ${escapeHtml(when)}</div>
            </div>

            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-outline-dark btn-sm btn-pill" type="button" data-my-load="${escapeHtml(savedId)}">Load</button>
              <button class="btn btn-outline-secondary btn-sm btn-pill" type="button" data-my-download="${escapeHtml(savedId)}">JSON</button>
              <button class="btn btn-outline-danger btn-sm btn-pill" type="button" data-my-delete="${escapeHtml(savedId)}">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function saveToLocal() {
    if (!currentCard) return;
    const themeId = $("themeSelect")?.value || "kennenlernen";
    const arr = readMyCards();

    arr.push({
      savedId: makeSavedId(),
      themeId,
      card: currentCard,
      savedAt: new Date().toISOString()
    });

    writeMyCards(arr);
    $("saveMsg").textContent = `Saved ✅ (${arr.length} cards in My Cards)`;
    renderMyCardsList();
  }

  function clearLocal() {
    localStorage.removeItem(LS_KEY);
    $("saveMsg").textContent = "Cleared ✅";
    renderMyCardsList();
  }

  function loadSavedCard(savedId) {
    const arr = readMyCards();
    const row = arr.find(x => (x.savedId || "") === savedId);
    if (!row?.card) return;

    if ($("themeSelect") && row.themeId) {
      $("themeSelect").value = row.themeId;
      renderFields(row.themeId);
    }

    currentCard = row.card;
    $("saveMsg").textContent = `Loaded ✅`;
    renderAll(currentCard);
  }

  function deleteSavedCard(savedId) {
    const arr = readMyCards().filter(x => (x.savedId || "") !== savedId);
    writeMyCards(arr);
    $("saveMsg").textContent = "Deleted ✅";
    renderMyCardsList();
  }

  function exportMyCardsJson() {
    const arr = readMyCards();
    downloadBlobJson({ version: 1, exportedAt: new Date().toISOString(), cards: arr }, "my_cards.json");
  }

  function exportSingleSavedCard(savedId) {
    const arr = readMyCards();
    const row = arr.find(x => (x.savedId || "") === savedId);
    if (!row?.card) return;
    downloadBlobJson(row.card, (row.card?.id || "card") + ".json");
  }

  async function importMyCardsFromFile(file) {
    const text = await file.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { alert("Invalid JSON file."); return; }

    const incoming = Array.isArray(parsed) ? parsed : (parsed?.cards || []);
    if (!Array.isArray(incoming)) { alert("Expected an array or { cards: [...] }"); return; }

    const existing = readMyCards();
    const normalized = incoming.map((x) => {
      if (x?.card && x?.savedAt) {
        return {
          savedId: x.savedId || makeSavedId(),
          themeId: x.themeId || "kennenlernen",
          card: x.card,
          savedAt: x.savedAt || new Date().toISOString()
        };
      }
      if (x?.items && x?.title) {
        return {
          savedId: makeSavedId(),
          themeId: "kennenlernen",
          card: x,
          savedAt: new Date().toISOString()
        };
      }
      return null;
    }).filter(Boolean);

    writeMyCards(existing.concat(normalized));
    $("saveMsg").textContent = `Imported ✅ (+${normalized.length})`;
    renderMyCardsList();
  }

  function speakWholeCard() {
    if (!currentCard) return;
    const tone = $("styleSelect")?.value || "du";
    const lines = [];

    currentCard.items.forEach(it => {
      const qDu = it.q.de, qSie = it.q.de_sie || autoFormalFromDu(qDu);
      const aDu = it.a.de, aSie = it.a.de_sie || autoFormalFromDu(aDu);

      if (tone === "sie") lines.push(qSie, aSie);
      else if (tone === "both") lines.push(qDu, qSie, aDu, aSie);
      else lines.push(qDu, aDu);
    });

    speakSequence(lines.filter(Boolean));
  }

  // -----------------------------
  // Events
  // -----------------------------
  document.addEventListener("input", (e) => {
    const el = e.target.closest("[data-edit]");
    if (!el || !currentCard) return;

    const idx = parseInt(el.getAttribute("data-idx"), 10);
    const side = el.getAttribute("data-side");
    const key = el.getAttribute("data-key");

    if (!currentCard.items?.[idx]?.[side]) return;
    currentCard.items[idx][side][key] = el.value;

    if (key === "de" && !currentCard.items[idx][side].de_sie) {
      currentCard.items[idx][side].de_sie = autoFormalFromDu(el.value);
    }

    updateJsonOut();
    renderPractice(currentCard);
  });

  document.addEventListener("click", (e) => {
    // My Cards
    const loadBtn = e.target.closest("[data-my-load]");
    if (loadBtn) { loadSavedCard(loadBtn.getAttribute("data-my-load")); return; }

    const delBtn = e.target.closest("[data-my-delete]");
    if (delBtn) { deleteSavedCard(delBtn.getAttribute("data-my-delete")); return; }

    const dlBtn = e.target.closest("[data-my-download]");
    if (dlBtn) { exportSingleSavedCard(dlBtn.getAttribute("data-my-download")); return; }

    // Speak
    const sayBtn = e.target.closest("[data-speak]");
    if (sayBtn) {
      const text = sayBtn.getAttribute("data-speak") || "";
      const block = sayBtn.closest(".qaBlock");
      speak(text, block);
      return;
    }

    // Speak both
    const bothBtn = e.target.closest("[data-speak-both]");
    if (bothBtn) {
      const t1 = bothBtn.getAttribute("data-speak-both") || "";
      const t2 = bothBtn.getAttribute("data-speak-both2") || "";
      const block = bothBtn.closest(".qaBlock");
      speakSequence([t1, t2].filter(Boolean), block);
      return;
    }

    // Speak & Check
    const checkBtn = e.target.closest("[data-check]");
    if (checkBtn) {
      if (!canRecognize) { $("supportNote")?.classList.remove("d-none"); return; }

      const expected = checkBtn.getAttribute("data-expected") || "";
      const expectedAlt = checkBtn.getAttribute("data-expected-alt") || "";

      const liveEl = document.getElementById(checkBtn.getAttribute("data-live-id"));
      const resEl = document.getElementById(checkBtn.getAttribute("data-res-id"));
      const msgEl = document.getElementById(checkBtn.getAttribute("data-msg-id"));
      const block = checkBtn.closest(".qaBlock");
      if (!liveEl || !resEl || !msgEl || !block) return;

      liveEl.innerHTML = "";
      resEl.classList.add("d-none");
      resEl.innerHTML = "";
      msgEl.textContent = "Listening… speak now.";

      recognizeOnce({
        expected,
        expectedAlt,
        blockEl: block,
        onInterim: (txt, bestExp) => { liveEl.innerHTML = renderLiveWordsHTML(txt, bestExp); },
        onDone: ({ said, sim, expectedUsed }) => {
          const pct = Math.round(sim * 100);
          msgEl.textContent = `Similarity: ${pct}%`;
          resEl.classList.remove("d-none");
          resEl.innerHTML = `<div class="tiny text-muted mb-1">Result</div>` + renderLiveWordsHTML(said, expectedUsed);
          liveEl.innerHTML = "";
        },
        onError: (msg) => { msgEl.textContent = `Error: ${msg}`; liveEl.innerHTML = ""; }
      });
      return;
    }
  });

  // -----------------------------
  // Init
  // -----------------------------
  async function init() {
    buildAllTopics();
    fillTopicTypes();
    refreshTopicOptions();

    $("btnTheme")?.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      $("btnTheme").textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
    });

    $("btnStop")?.addEventListener("click", stopSpeaking);
    $("btnSpeakAll")?.addEventListener("click", speakWholeCard);

    if (window.speechSynthesis) {
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    if (!canRecognize) $("supportNote")?.classList.remove("d-none");

    $("btnExportMyCards")?.addEventListener("click", exportMyCardsJson);
    $("btnImportMyCards")?.addEventListener("click", () => $("importMyCardsFile")?.click());
    $("importMyCardsFile")?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await importMyCardsFromFile(file);
      e.target.value = "";
    });

    // topic type change → refresh topics
    $("topicTypeSelect")?.addEventListener("change", () => {
      // clear selects (optional)
      $("topicSelect").value = "";
      // keep custom if user typed
      refreshTopicOptions();
    });

    // topic select change → set input
    $("topicSelect")?.addEventListener("change", () => {
      const v = ($("topicSelect").value || "").trim();
      if (v) $("topicCustom").value = v;
    });

    // If user types custom, keep select empty
    $("topicCustom")?.addEventListener("input", () => {
      const v = ($("topicCustom").value || "").trim();
      if (v) $("topicSelect").value = "";
    });

    // load dataset
    try {
      const res = await fetch(DATA_URL, { cache:"no-store" });
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (${res.status})`);
      DATA = await res.json();
    } catch (err) {
      console.error(err);
      $("previewArea").innerHTML = `<div class="alert alert-danger tiny mb-0">
        Could not load <b>${escapeHtml(DATA_URL)}</b>. Run local server (Live Server / python -m http.server).
      </div>`;
      DATA = { themes: [] }; // allow UI to work
    }

    // fill theme select
    const sel = $("themeSelect");
    const themes = (DATA.themes || []);
    sel.innerHTML = themes.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.title)}</option>`).join("");

    // fallback theme if json empty
    sel.value = themes[0]?.id || "kennenlernen";

    renderFields(sel.value);
    randomFill(sel.value);

    renderMyCardsList();

    sel.addEventListener("change", () => {
      renderFields(sel.value);
      randomFill(sel.value);
      $("saveMsg").textContent = "";
      currentCard = null;
      $("previewArea").innerHTML = `<div class="mutedbox p-3 tiny text-muted">Fill fields and Generate.</div>`;
      $("practiceArea").innerHTML = `<div class="mutedbox p-3 tiny text-muted">Generate a card to practice.</div>`;
      $("jsonOut").value = "";
    });

    $("styleSelect")?.addEventListener("change", () => {
      if (currentCard) {
        renderEditor(currentCard);
        renderPractice(currentCard);
      }
    });

    $("btnGenerate")?.addEventListener("click", () => {
      const themeId = $("themeSelect").value;
      const topicType = getSelectedTopicType();
      const topic = getSelectedTopic();
      const values = getValuesFromFields(themeId);

      const autoTitle = topic
        ? `Custom • ${getThemeById(themeId)?.title || themeId} + ${topic}`
        : `Custom • ${getThemeById(themeId)?.title || themeId}`;

      const title = ($("cardTitle").value || "").trim() || autoTitle;

      currentCard = buildCard(themeId, title, values, topicType, topic);
      $("saveMsg").textContent = "";
      renderAll(currentCard);
    });

    $("btnRandomFill")?.addEventListener("click", () => randomFill($("themeSelect").value));
    $("btnCopyJson")?.addEventListener("click", copyJSON);
    $("btnDownloadJson")?.addEventListener("click", downloadJSON);
    $("btnSaveLocal")?.addEventListener("click", saveToLocal);
    $("btnClearLocal")?.addEventListener("click", clearLocal);
  }

  window.addEventListener("load", init);
})();