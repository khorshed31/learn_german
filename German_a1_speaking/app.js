/* app.js */
(() => {
  "use strict";

  const DATA_URL = "themes.json";
  const $ = (id) => document.getElementById(id);

  // --------------------------
  // State
  // --------------------------
  const state = {
    dataset: null,
    showPron: true,
    showEn: true,
    swapped: false,
    filteredThemeIds: null,
    themeId: null,
    cardIndex: 0,
    introLines: [],
    tone: "du", // ✅ du | sie | both

    exam: {
      active: false,
      phase: "none",
      queue: [],
      idx: 0,
      startAt: 0,
      phaseEndAt: 0,
      totalDuration: 0,
      ok: 0,
      total: 0,
      timer: null,
      threshold: 0.75
    }
  };

  // --------------------------
  // Utils
  // --------------------------
  function escapeHtml(str) {
    return (str ?? "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

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

  // --------------------------
  // Word-by-word correctness helpers (alignment)
  // --------------------------
  function tokenizeWords(text) {
    const raw = (text || "").trim();
    if (!raw) return { orig: [], norm: [] };

    const orig = raw.split(/\s+/).filter(Boolean);
    const norm = orig.map(w =>
      w.toLowerCase().replace(/[^a-z0-9äöüß]/gi, "").trim()
    );
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
          dp[i - 1][j] + 1,          // delete expected (missing)
          dp[i][j - 1] + 1,          // insert spoken (extra)
          dp[i - 1][j - 1] + sub     // substitute/match
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

  // --------------------------
  // Formal (Sie) auto generator (for common A1 patterns)
  // If you provide de_sie in JSON, that will be used instead.
  // --------------------------
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
      [/^Kommst du\b/i, "Kommen Sie"],
      [/^Wohnst du\b/i, "Wohnen Sie"],
      [/^Sprichst du\b/i, "Sprechen Sie"],
      [/^Machst du\b/i, "Machen Sie"],
      [/^Bist du\b/i, "Sind Sie"]
    ];

    let s = text;
    for (const [re, rep] of rules) {
      if (re.test(s)) {
        s = s.replace(re, rep);
        return s;
      }
    }

    // light pronoun/case replacements (best effort)
    s = s
      .replace(/\bdu\b/gi, "Sie")
      .replace(/\bdich\b/gi, "Sie")
      .replace(/\bdir\b/gi, "Ihnen")
      .replace(/\bdein\b/gi, "Ihr")
      .replace(/\bdeine\b/gi, "Ihre")
      .replace(/\bdeinen\b/gi, "Ihren")
      .replace(/\bdeinem\b/gi, "Ihrem")
      .replace(/\bdeiner\b/gi, "Ihrer")
      .replace(/\bdeines\b/gi, "Ihres");

    return s;
  }

  function getDuSie(obj) {
    // Supports:
    // - old: {de,en,pron}
    // - optional: de_sie, pron_sie
    // - optional nested: {du:{de,pron}, sie:{de,pron}, en}
    if (!obj) return { du: { de: "", pron: "" }, sie: { de: "", pron: "" }, en: "" };

    if (obj.du || obj.sie) {
      const du = obj.du || { de: obj.de || "", pron: obj.pron || "" };
      const sie = obj.sie || { de: obj.de_sie || autoFormalFromDu(du.de), pron: obj.pron_sie || du.pron || "" };
      return { du, sie, en: obj.en || "" };
    }

    const duDe = obj.de || "";
    const duPron = obj.pron || "";
    const sieDe = obj.de_sie || autoFormalFromDu(duDe);
    const siePron = obj.pron_sie || duPron;

    return {
      du: { de: duDe, pron: duPron },
      sie: { de: sieDe, pron: siePron },
      en: obj.en || ""
    };
  }

  function chooseTone(variants) {
    // returns main/alt + labels
    const du = variants.du?.de || "";
    const sie = variants.sie?.de || "";
    const duPron = variants.du?.pron || "";
    const siePron = variants.sie?.pron || "";
    const en = variants.en || "";

    if (state.tone === "sie") {
      return { main: sie || du, alt: du, mainLabel: "Sie", altLabel: "du", pronMain: siePron || duPron, pronAlt: duPron, en, showBoth: false };
    }
    if (state.tone === "both") {
      return { main: du, alt: sie, mainLabel: "du", altLabel: "Sie", pronMain: duPron, pronAlt: siePron, en, showBoth: true };
    }
    // default du
    return { main: du, alt: sie, mainLabel: "du", altLabel: "Sie", pronMain: duPron, pronAlt: siePron, en, showBoth: false };
  }

  function pickBestExpected(spoken, exp1, exp2) {
    const s1 = exp1 ? similarity(exp1, spoken) : 0;
    if (!exp2) return { expectedUsed: exp1 || "", sim: s1, which: "main" };
    const s2 = exp2 ? similarity(exp2, spoken) : 0;
    if (s2 > s1) return { expectedUsed: exp2, sim: s2, which: "alt" };
    return { expectedUsed: exp1, sim: s1, which: "main" };
  }

  // --------------------------
  // German spelling helper (same as before)
  // --------------------------
  const GERMAN_LETTER_NAMES = {
    A: "A", B: "Be", C: "Ce", D: "De", E: "E", F: "Ef", G: "Ge", H: "Ha",
    I: "I", J: "Jot", K: "Ka", L: "El", M: "Em", N: "En", O: "O", P: "Pe",
    Q: "Ku", R: "Er", S: "Es", T: "Te", U: "U", V: "Vau", W: "We", X: "Ix",
    Y: "Ypsilon", Z: "Zett",
    Ä: "Ä", Ö: "Ö", Ü: "Ü", ß: "Eszett"
  };

  const GERMAN_DIGITS = {
    "0": "null", "1": "eins", "2": "zwei", "3": "drei", "4": "vier",
    "5": "fünf", "6": "sechs", "7": "sieben", "8": "acht", "9": "neun"
  };

  const GERMAN_SYMBOLS = {
    " ": "Leerzeichen",
    "-": "Bindestrich",
    "_": "Unterstrich",
    ".": "Punkt",
    ",": "Komma",
    "@": "ät",
    "/": "Schrägstrich",
    "\\": "Backslash",
    "+": "Plus",
    "#": "Raute",
    ":": "Doppelpunkt"
  };

  function spellToTokens(input) {
    const raw = (input || "").trim();
    if (!raw) return { letters: [], names: [], speak: [], symbols: [] };

    const letters = [];
    const names = [];
    const speak = [];
    const symbols = [];

    for (const ch of raw) {
      const upper = ch.toLocaleUpperCase("de-DE");

      if (GERMAN_LETTER_NAMES[upper]) {
        letters.push(upper);
        names.push(GERMAN_LETTER_NAMES[upper]);
        speak.push(GERMAN_LETTER_NAMES[upper]);
        continue;
      }

      if (GERMAN_DIGITS[ch]) {
        letters.push(ch);
        names.push(GERMAN_DIGITS[ch]);
        speak.push(GERMAN_DIGITS[ch]);
        symbols.push(`${ch} → ${GERMAN_DIGITS[ch]}`);
        continue;
      }

      if (GERMAN_SYMBOLS[ch]) {
        letters.push(ch);
        names.push(GERMAN_SYMBOLS[ch]);
        speak.push(GERMAN_SYMBOLS[ch]);
        symbols.push(`${ch === " " ? "␠" : ch} → ${GERMAN_SYMBOLS[ch]}`);
        continue;
      }

      letters.push(ch);
      names.push(ch);
      speak.push(ch);
      symbols.push(`${ch} → (unknown)`);
    }

    return { letters, names, speak, symbols };
  }

  function renderSpelling() {
    const inputEl = $("spellInput");
    if (!inputEl) return;

    const { letters, names, speak, symbols } = spellToTokens(inputEl.value);

    $("spellLetters") && ($("spellLetters").textContent = letters.length ? letters.join(" - ") : "—");
    $("spellGermanNames") && ($("spellGermanNames").textContent = names.length ? names.join(" - ") : "—");
    $("spellSymbols") && ($("spellSymbols").textContent = symbols.length ? symbols.join(" • ") : "—");

    return speak;
  }

  // --------------------------
  // Status / animation helpers
  // --------------------------
  let activeLineEl = null;

  function clearActiveLine() {
    if (activeLineEl) {
      activeLineEl.classList.remove("active-speak", "active-listen");
      activeLineEl = null;
    }
  }

  function setActiveLine(lineEl, mode) {
    clearActiveLine();
    if (!lineEl) return;
    activeLineEl = lineEl;
    if (mode === "speaking") lineEl.classList.add("active-speak");
    if (mode === "listening") lineEl.classList.add("active-listen");
  }

  function setStatus(mode) {
    const anim = $("statusAnim");
    if (!anim) return;

    anim.classList.remove("speaking", "listening");
    if (mode === "speaking") anim.classList.add("speaking");
    if (mode === "listening") anim.classList.add("listening");

    $("statusText") && ($("statusText").textContent =
      mode === "speaking" ? "Speaking…" :
      mode === "listening" ? "Listening…" : "Idle"
    );
  }

  // --------------------------
  // Speech: TTS + ASR
  // --------------------------
  let voices = [];
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRecognize = !!SpeechRecognition;

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
    const uri = sel.value;
    return voices.find(v => v.voiceURI === uri) || null;
  }

  function stopSpeaking() {
    clearActiveLine();
    if (window.speechSynthesis) speechSynthesis.cancel();
    setStatus("idle");
  }

  function speak(text, lineEl = null) {
    stopSpeaking();
    if (!window.speechSynthesis) return;

    setStatus("speaking");
    setActiveLine(lineEl, "speaking");

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = parseFloat($("rate")?.value || "1");
    u.pitch = parseFloat($("pitch")?.value || "1");

    const v = getSelectedVoice();
    if (v) u.voice = v;

    u.onend = () => { clearActiveLine(); setStatus("idle"); };
    u.onerror = () => { clearActiveLine(); setStatus("idle"); };

    speechSynthesis.speak(u);
  }

  function speakSequence(texts) {
    stopSpeaking();
    if (!window.speechSynthesis || !texts?.length) return;

    setStatus("speaking");
    let i = 0;

    const next = () => {
      if (i >= texts.length) { setStatus("idle"); return; }
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

  function recognizeOnce({ expected, expectedAlt, lineEl, onInterim, onResult, onError }) {
    if (!canRecognize) {
      onError?.("Speech recognition not supported.");
      return;
    }

    stopSpeaking();
    setStatus("listening");
    setActiveLine(lineEl, "listening");

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
      const bestNow = pickBestExpected(combined, expected, expectedAlt);
      onInterim?.(combined, bestNow.expectedUsed);

      const last = e.results[e.results.length - 1];
      if (last && last.isFinal) {
        done = true;

        const best = pickBestExpected(combined, expected, expectedAlt);

        clearActiveLine();
        setStatus("idle");

        onResult?.({
          said: combined,
          sim: best.sim,
          expectedUsed: best.expectedUsed
        });

        try { rec.stop(); } catch {}
      }
    };

    rec.onerror = (e) => {
      if (done) return;
      done = true;
      clearActiveLine();
      setStatus("idle");
      onError?.(e.error || "Recognition error");
    };

    rec.onend = () => {
      clearActiveLine();
      setStatus("idle");
    };

    rec.start();
  }

  // --------------------------
  // Dataset helpers
  // --------------------------
  function themes() { return state.dataset?.themes || []; }

  function getThemeById(id) {
    return themes().find(t => t.id === id) || themes()[0];
  }

  function getTheme() { return getThemeById(state.themeId); }

  function getCard() {
    const t = getTheme();
    return t?.cards?.[state.cardIndex] || t?.cards?.[0];
  }

  function getVisibleThemes() {
    if (!state.filteredThemeIds) return themes();
    return themes().filter(t => state.filteredThemeIds.has(t.id));
  }

  // --------------------------
  // UI blocks (shows du/sie/both + result area)
  // --------------------------
  function lineBlock({ speaker, variants, disabledSpeak = false }) {
    const outId = "out_" + Math.random().toString(16).slice(2);
    const liveId = "live_" + Math.random().toString(16).slice(2);
    const resId  = "res_" + Math.random().toString(16).slice(2);

    const pick = chooseTone(variants);

    const mainText = pick.main || "";
    const altText  = pick.alt || "";
    const enText   = pick.en || "";

    const mainPron = pick.pronMain || "";
    const altPron  = pick.pronAlt || "";

    const showBoth = pick.showBoth && altText && altText !== mainText;

    const mainRow = `
      <div class="fw-semibold">
        ${escapeHtml(speaker)}:
        ${state.tone === "both" ? `<span class="badge text-bg-light text-muted pill me-1">${escapeHtml(pick.mainLabel)}</span>` : ""}
        ${escapeHtml(mainText)}
      </div>
      ${state.showPron && mainPron ? `<div class="text-muted tiny mt-1"><span class="mono">Pron:</span> ${escapeHtml(mainPron)}</div>` : ""}
    `;

    const altRow = showBoth ? `
      <div class="fw-semibold mt-2">
        ${escapeHtml(speaker)}:
        <span class="badge text-bg-light text-muted pill me-1">${escapeHtml(pick.altLabel)}</span>
        ${escapeHtml(altText)}
      </div>
      ${state.showPron && altPron ? `<div class="text-muted tiny mt-1"><span class="mono">Pron:</span> ${escapeHtml(altPron)}</div>` : ""}
    ` : "";

    const enHtml = state.showEn && enText
      ? `<div class="text-muted tiny mt-2"><span class="mono">EN:</span> ${escapeHtml(enText)}</div>` : "";

    // Buttons:
    // - Speak: if both -> speakSequence(main, alt)
    // - Rec: accept either -> expected=main, expectedAlt=alt
    return `
      <div class="line">
        <div class="d-flex justify-content-between gap-2 flex-wrap">
          <div>
            ${mainRow}
            ${altRow}
            ${enHtml}

            <div class="liveRow">
              <div class="wave" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <div class="liveTranscript" id="${liveId}"></div>
            </div>

            <div class="resultRow d-none" id="${resId}"></div>

            <div class="tiny text-muted mt-1 d-none" id="${outId}"></div>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm btn-pill"
              data-say="${escapeHtml(mainText)}"
              ${altText ? `data-say-alt="${escapeHtml(altText)}"` : ""}>
              🔊
            </button>

            <button class="btn btn-outline-success btn-sm btn-pill ${disabledSpeak ? "disabled" : ""}"
              data-rec="${escapeHtml(mainText)}"
              ${altText ? `data-rec-alt="${escapeHtml(altText)}"` : ""}
              data-out="${outId}"
              data-live="${liveId}"
              data-result="${resId}"
              ${disabledSpeak ? "disabled" : ""}>
              🎙️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------
  // Teil 1: Intro (no du/sie needed, but still uses same renderer)
  // --------------------------
  function buildIntro() {
    const name = $("fName")?.value.trim() || "…";
    const age = $("fAge")?.value.trim() || "…";
    const city = $("fCity")?.value.trim() || "…";
    const country = $("fCountry")?.value.trim() || "…";
    const lang = $("fLang")?.value.trim() || "…";
    const job = $("fJob")?.value.trim() || "…";
    const jobEn = $("fJobEn")?.value.trim() || "(English meaning)";
    const hobby = $("fHobby")?.value.trim() || "…";
    const hobbyEn = $("fHobbyEn")?.value.trim() || "(English meaning)";

    const lines = [
      { de: `Hallo! Ich heiße ${name}.`, en: `Hello! My name is ${name}.`, pron: `HAH-loh! ikh HAI-suh ${name}.` },
      { de: `Ich bin ${age} Jahre alt.`, en: `I am ${age} years old.`, pron: `ikh bin ${age} YAH-ruh alt.` },
      { de: `Ich komme aus ${country}.`, en: `I am from ${country}.`, pron: `ikh KOH-muh owss ${country}.` },
      { de: `Ich wohne in ${city}.`, en: `I live in ${city}.`, pron: `ikh VOH-nuh in ${city}.` },
      { de: `Ich spreche ${lang}.`, en: `I speak ${lang}.`, pron: `ikh SHPRE-khuh ${lang}.` },
      { de: `${job}`, en: `${jobEn}`, pron: `(slow) ${job}` },
      { de: `In meiner Freizeit: ${hobby}`, en: `In my free time: ${hobbyEn}`, pron: `in MAI-ner FRAI-tsait: ${hobby}` },
      { de: `Danke!`, en: `Thank you!`, pron: `DAN-kuh!` }
    ];

    state.introLines = lines;

    const introEl = $("introLines");
    if (introEl) {
      introEl.innerHTML = lines.map(x => {
        const v = {
          du: { de: x.de, pron: x.pron },
          sie: { de: x.de, pron: x.pron },
          en: x.en
        };
        return lineBlock({ speaker: "You", variants: v });
      }).join("");
    }

    return lines.map(x => x.de);
  }

  // --------------------------
  // Cards UI
  // --------------------------
  function fillThemeSelect() {
    const sel = $("themeSelect");
    if (!sel) return;

    sel.innerHTML = "";
    const list = getVisibleThemes();
    if (!list.length) return;

    if (!list.find(t => t.id === state.themeId)) {
      state.themeId = list[0].id;
    }

    list.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.title;
      sel.appendChild(opt);
    });

    sel.value = state.themeId;
  }

  function fillCardSelect() {
    const t = getTheme();
    const sel = $("cardSelect");
    if (!sel) return;

    sel.innerHTML = "";
    const cards = t?.cards || [];

    cards.forEach((c, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = c.title;
      sel.appendChild(opt);
    });

    state.cardIndex = Math.min(state.cardIndex, Math.max(0, cards.length - 1));
    sel.value = String(state.cardIndex);

    $("themeTitle") && ($("themeTitle").textContent = t?.title || "—");
    $("themeDesc") && ($("themeDesc").textContent = t?.desc || "—");
    $("themeCount") && ($("themeCount").textContent = String(cards.length));
  }

  function renderCard() {
    const t = getTheme();
    const card = getCard();
    if (!t || !card) return;

    $("themeTitle") && ($("themeTitle").textContent = t.title);
    $("themeDesc") && ($("themeDesc").textContent = t.desc);
    $("themeCount") && ($("themeCount").textContent = String(t.cards.length));

    const A = state.swapped ? "Person B" : "Person A";
    const B = state.swapped ? "Person A" : "Person B";

    const parts = (card.items || []).map((it, i) => {
      const qV = getDuSie(it.q);
      const aV = getDuSie(it.a);

      return `
        <div class="mutedbox p-3 mb-3">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="fw-semibold">Q${i + 1}</div>
            <span class="badge text-bg-light text-muted pill">Style: ${escapeHtml(state.tone)}</span>
          </div>
          <div class="mt-2">
            ${lineBlock({ speaker: A, variants: qV })}
            ${lineBlock({ speaker: B, variants: aV })}
          </div>
        </div>
      `;
    }).join("");

    const area = $("qaCardArea");
    if (area) {
      area.innerHTML = `
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div>
            <div class="fw-semibold">${escapeHtml(card.title)}</div>
            <div class="text-muted tiny">Click 🔊 then 🎙️. (du / Sie / both)</div>
          </div>
          <span class="badge text-bg-light text-muted pill">3 Questions</span>
        </div>
        ${parts}
      `;
    }
  }

  function listenCurrentCard() {
    const card = getCard();
    const lines = [];

    (card.items || []).forEach(it => {
      const qV = getDuSie(it.q);
      const aV = getDuSie(it.a);

      if (state.tone === "sie") {
        lines.push(qV.sie.de || qV.du.de);
        lines.push(aV.sie.de || aV.du.de);
      } else if (state.tone === "both") {
        lines.push(qV.du.de, qV.sie.de || qV.du.de);
        lines.push(aV.du.de, aV.sie.de || aV.du.de);
      } else {
        lines.push(qV.du.de);
        lines.push(aV.du.de);
      }
    });

    speakSequence(lines.filter(Boolean));
  }

  function randomCard() {
    const allThemes = themes();
    const t = allThemes[Math.floor(Math.random() * allThemes.length)];
    state.themeId = t.id;
    state.cardIndex = Math.floor(Math.random() * t.cards.length);

    $("themeSearch") && ($("themeSearch").value = "");
    state.filteredThemeIds = null;

    fillThemeSelect();
    fillCardSelect();
    renderCard();
  }

  // --------------------------
  // Exam
  // --------------------------
  function examResetUI() {
    const ex = state.exam;
    ex.active = false;
    ex.phase = "none";
    ex.queue = [];
    ex.idx = 0;
    ex.ok = 0;
    ex.total = 0;
    ex.startAt = 0;
    ex.phaseEndAt = 0;
    ex.totalDuration = 0;

    clearInterval(ex.timer);
    ex.timer = null;

    $("examPhase") && ($("examPhase").textContent = "Not started");
    $("examTimeLeft") && ($("examTimeLeft").textContent = "—");
    $("examOk") && ($("examOk").textContent = "0");
    $("examTotal") && ($("examTotal").textContent = "0");
    $("examBar") && ($("examBar").style.width = "0%");
    $("examFeedback") && ($("examFeedback").textContent = "");
  }

  function pickRandomThemeAndCard(excludeIds = new Set()) {
    const pool = themes().filter(t => !excludeIds.has(t.id));
    const t = pool[Math.floor(Math.random() * pool.length)];
    const c = t.cards[Math.floor(Math.random() * t.cards.length)];
    return { theme: t, card: c };
  }

  function examBuildQueue() {
    const ex = state.exam;
    const t1 = Math.max(15, parseInt($("examT1")?.value || "45", 10));
    const t2 = Math.max(30, parseInt($("examT2")?.value || "90", 10));
    const t3 = Math.max(30, parseInt($("examT3")?.value || "60", 10));
    ex.totalDuration = (t1 + t2 + t3) * 1000;

    const thresholdPct = Math.min(95, Math.max(50, parseInt($("examThreshold")?.value || "75", 10)));
    ex.threshold = thresholdPct / 100;

    if (!state.introLines.length) buildIntro();

    const introQueue = state.introLines.map(x => ({
      phaseLabel: "Teil 1",
      promptV: { du: { de: x.de, pron: x.pron }, sie: { de: x.de, pron: x.pron }, en: x.en },
      partnerV: null,
      helper: "",
      themeTitle: "",
      cardTitle: ""
    }));

    // Teil 2: random or current theme/card (avoid 'bitten')
    let t2Theme, t2Card;
    if ($("examPick")?.value === "current") {
      t2Theme = getTheme();
      t2Card = getCard();
    } else {
      const pick = pickRandomThemeAndCard(new Set(["bitten"]));
      t2Theme = pick.theme;
      t2Card = pick.card;
    }

    const teil2Queue = [];
    (t2Card.items || []).forEach((it, i) => {
      teil2Queue.push({
        phaseLabel: "Teil 2",
        helper: `Q${i + 1}`,
        themeTitle: t2Theme.title,
        cardTitle: t2Card.title,
        partnerV: getDuSie(it.q),
        promptV: getDuSie(it.a)
      });
    });

    // Teil 3: always from 'bitten'
    const bittenTheme = getThemeById("bitten");
    const bittenCard = bittenTheme.cards[Math.floor(Math.random() * bittenTheme.cards.length)];
    const teil3Queue = [];
    (bittenCard.items || []).forEach((it, i) => {
      teil3Queue.push({
        phaseLabel: "Teil 3",
        helper: `Request ${i + 1}`,
        themeTitle: bittenTheme.title,
        cardTitle: bittenCard.title,
        partnerV: getDuSie(it.q),
        promptV: getDuSie(it.a)
      });
    });

    ex.queue = [...introQueue, ...teil2Queue, ...teil3Queue];
  }

  function examCurrentItem() {
    const ex = state.exam;
    for (let i = ex.idx; i < ex.queue.length; i++) {
      if (ex.queue[i].phaseLabel === ex.phase) {
        ex.idx = i;
        return ex.queue[i];
      }
    }
    return null;
  }

  function examRenderStep() {
    const item = examCurrentItem();
    const examArea = $("examArea");
    if (!examArea) return;

    if (!item) {
      examArea.innerHTML = `<div class="mutedbox p-3"><div class="fw-semibold">No more items ✅</div></div>`;
      return;
    }

    const header = item.phaseLabel !== "Teil 1"
      ? `<div class="tiny text-muted mb-2"><b>${escapeHtml(item.themeTitle)}</b> • ${escapeHtml(item.cardTitle)} • ${escapeHtml(item.helper)}</div>`
      : `<div class="tiny text-muted mb-2">Speak your intro line.</div>`;

    const partnerBlock = item.partnerV ? `
      <div class="mutedbox p-3 mb-3">
        <div class="fw-semibold">Partner line (listen)</div>
        ${lineBlock({ speaker: "Partner", variants: item.partnerV, disabledSpeak: true })}
      </div>
    ` : "";

    examArea.innerHTML = `
      ${header}
      ${partnerBlock}
      <div class="mutedbox p-3">
        <div class="fw-semibold">Your line</div>
        ${lineBlock({ speaker: "You", variants: item.promptV })}
        <div class="tiny text-muted mt-2">Tip: 🔊 then 🎙️.</div>
      </div>
    `;

    $("examFeedback") && ($("examFeedback").textContent = "");
  }

  function examStart() {
    examResetUI();
    examBuildQueue();

    const ex = state.exam;
    ex.active = true;
    ex.startAt = Date.now();
    ex.phase = "Teil 1";
    $("examPhase") && ($("examPhase").textContent = "Teil 1 • Intro");

    const t1 = Math.max(15, parseInt($("examT1")?.value || "45", 10));
    ex.phaseEndAt = ex.startAt + t1 * 1000;

    examRenderStep();

    clearInterval(ex.timer);
    ex.timer = setInterval(() => {
      if (!ex.active) return;
      const now = Date.now();

      if (now >= ex.phaseEndAt) {
        if (ex.phase === "Teil 1") {
          ex.phase = "Teil 2";
          $("examPhase") && ($("examPhase").textContent = "Teil 2 • Info");
          const t2 = Math.max(30, parseInt($("examT2")?.value || "90", 10));
          ex.phaseEndAt = now + t2 * 1000;
          examRenderStep();
        } else if (ex.phase === "Teil 2") {
          ex.phase = "Teil 3";
          $("examPhase") && ($("examPhase").textContent = "Teil 3 • Requests");
          const t3 = Math.max(30, parseInt($("examT3")?.value || "60", 10));
          ex.phaseEndAt = now + t3 * 1000;
          examRenderStep();
        } else {
          examFinish("Time finished.");
          return;
        }
      }

      const left = Math.max(0, Math.ceil((ex.phaseEndAt - now) / 1000));
      $("examTimeLeft") && ($("examTimeLeft").textContent = left + "s");

      const elapsed = now - ex.startAt;
      const pct = Math.max(0, Math.min(100, Math.round((elapsed / ex.totalDuration) * 100)));
      $("examBar") && ($("examBar").style.width = pct + "%");
    }, 200);
  }

  function examFinish(reason) {
    const ex = state.exam;
    ex.active = false;
    clearInterval(ex.timer);
    ex.timer = null;

    $("examPhase") && ($("examPhase").textContent = "Finished");
    $("examTimeLeft") && ($("examTimeLeft").textContent = "0s");
    $("examBar") && ($("examBar").style.width = "100%");

    const examArea = $("examArea");
    if (examArea) {
      examArea.innerHTML = `
        <div class="mutedbox p-3">
          <div class="fw-semibold">Finished ✅</div>
          <div class="text-muted tiny">${escapeHtml(reason)}</div>
          <hr class="my-2">
          <div class="d-flex justify-content-between">
            <div>Score</div>
            <div><b>${ex.ok}</b> / ${ex.total}</div>
          </div>
        </div>
      `;
    }
  }

  function examListen() {
    const item = examCurrentItem();
    if (!item) return;

    const seq = [];

    if (item.partnerV) {
      const p = chooseTone(item.partnerV);
      if (state.tone === "both") seq.push(p.main, p.alt || p.main);
      else seq.push(p.main);
    }

    const u = chooseTone(item.promptV);
    if (state.tone === "both") seq.push(u.main, u.alt || u.main);
    else seq.push(u.main);

    speakSequence(seq.filter(Boolean));
  }

  function examSpeak() {
    const ex = state.exam;
    const item = examCurrentItem();
    if (!item) return;

    if (!canRecognize) {
      $("examFeedback") && ($("examFeedback").textContent = "🎙️ Not supported here. Use Chrome/Edge + https/localhost.");
      return;
    }

    $("examFeedback") && ($("examFeedback").textContent = "Listening… speak now.");

    const youLine = $("examArea")?.querySelector(".mutedbox:last-child .line") || null;
    const liveEl = youLine ? youLine.querySelector(".liveTranscript") : null;
    const resultEl = youLine ? youLine.querySelector(".resultRow") : null;

    const pick = chooseTone(item.promptV);
    const expectedMain = pick.main || "";
    const expectedAlt = pick.alt || "";

    recognizeOnce({
      expected: expectedMain,
      expectedAlt: expectedAlt,
      lineEl: youLine,

      onInterim: (txt, bestExpected) => {
        if (liveEl) liveEl.innerHTML = renderLiveWordsHTML(txt, bestExpected);
      },

      onResult: ({ said, sim, expectedUsed }) => {
        ex.total++;
        const pct = Math.round(sim * 100);
        const ok = sim >= ex.threshold;
        if (ok) ex.ok++;

        $("examOk") && ($("examOk").textContent = String(ex.ok));
        $("examTotal") && ($("examTotal").textContent = String(ex.total));

        if (resultEl) {
          resultEl.classList.remove("d-none");
          resultEl.innerHTML = `<div class="tiny text-muted mb-1">Result</div>` + renderLiveWordsHTML(said, expectedUsed);
        }
        if (liveEl) liveEl.innerHTML = "";

        $("examFeedback") && ($("examFeedback").textContent =
          `Similarity: ${pct}% • ${ok ? "✅ OK" : "❗Try again"}`
        );

        ex.idx++;
        examRenderStep();
      },

      onError: (msg) => {
        $("examFeedback") && ($("examFeedback").textContent = `Error: ${msg}`);
        if (liveEl) liveEl.innerHTML = "";
      }
    });
  }

  function examNext() {
    state.exam.idx++;
    examRenderStep();
  }

  // --------------------------
  // ONE Event delegation (buttons inside lines + umlaut insert)
  // --------------------------
  document.addEventListener("click", (e) => {
    // Insert umlaut/ß
    const insBtn = e.target.closest("[data-insert]");
    if (insBtn) {
      const ch = insBtn.getAttribute("data-insert");
      const inputEl = $("spellInput");
      if (inputEl) {
        const start = inputEl.selectionStart ?? inputEl.value.length;
        const end = inputEl.selectionEnd ?? inputEl.value.length;
        inputEl.value = inputEl.value.slice(0, start) + ch + inputEl.value.slice(end);
        inputEl.setSelectionRange(start + ch.length, start + ch.length);
        inputEl.focus();
        renderSpelling();
      }
      return;
    }

    // Clear spelling
    if (e.target.closest("#btnClearSpell")) {
      const inputEl = $("spellInput");
      if (inputEl) {
        inputEl.value = "";
        inputEl.focus();
        renderSpelling();
      }
      return;
    }

    // Speak
    const sayBtn = e.target.closest("[data-say]");
    if (sayBtn) {
      const main = sayBtn.getAttribute("data-say") || "";
      const alt = sayBtn.getAttribute("data-say-alt") || "";
      const lineEl = sayBtn.closest(".line");
      if (state.tone === "both" && alt && alt !== main) speakSequence([main, alt].filter(Boolean));
      else speak(main, lineEl);
      return;
    }

    // Record (with live + final color result)
    const recBtn = e.target.closest("[data-rec]");
    if (recBtn && !recBtn.disabled) {
      const expected = recBtn.getAttribute("data-rec") || "";
      const expectedAlt = recBtn.getAttribute("data-rec-alt") || "";
      const outId = recBtn.getAttribute("data-out");
      const liveId = recBtn.getAttribute("data-live");
      const resId = recBtn.getAttribute("data-result");

      const outEl = outId ? document.getElementById(outId) : null;
      const liveEl = liveId ? document.getElementById(liveId) : null;
      const resEl = resId ? document.getElementById(resId) : null;
      const lineEl = recBtn.closest(".line");

      if (!outEl || !liveEl || !resEl) return;

      if (!canRecognize) {
        outEl.classList.remove("d-none");
        outEl.textContent = "🎙️ Not supported. Use Chrome/Edge + https/localhost.";
        return;
      }

      outEl.classList.remove("d-none");
      outEl.textContent = "Listening… speak now.";
      liveEl.innerHTML = "";
      resEl.classList.add("d-none");
      resEl.innerHTML = "";

      recognizeOnce({
        expected,
        expectedAlt,
        lineEl,

        onInterim: (txt, bestExpected) => {
          liveEl.innerHTML = renderLiveWordsHTML(txt, bestExpected);
        },

        onResult: ({ said, sim, expectedUsed }) => {
          const pct = Math.round(sim * 100);
          outEl.textContent = `Similarity: ${pct}%`;

          resEl.classList.remove("d-none");
          resEl.innerHTML = `<div class="tiny text-muted mb-1">Result</div>` + renderLiveWordsHTML(said, expectedUsed);

          liveEl.innerHTML = "";
        },

        onError: (msg) => {
          outEl.textContent = `Error: ${msg}`;
          liveEl.innerHTML = "";
        }
      });
    }
  });

  // --------------------------
  // Init
  // --------------------------
  async function init() {
    $("btnTheme")?.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const btn = $("btnTheme");
      if (btn) btn.textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
    });

    $("btnStop")?.addEventListener("click", stopSpeaking);

    if (window.speechSynthesis) {
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    if (!canRecognize) $("supportNote")?.classList.remove("d-none");

    // Tone selector (du/sie/both)
    $("styleSelect")?.addEventListener("change", () => {
      state.tone = $("styleSelect").value;
      buildIntro();
      renderCard();
      // If exam not active, reset UI
      if (!state.exam.active) examResetUI();
      else examRenderStep();
    });

    // Toggles
    $("togglePron")?.addEventListener("change", () => {
      state.showPron = $("togglePron").checked;
      buildIntro();
      renderCard();
      if (state.exam.active) examRenderStep();
    });

    $("toggleEn")?.addEventListener("change", () => {
      state.showEn = $("toggleEn").checked;
      buildIntro();
      renderCard();
      if (state.exam.active) examRenderStep();
    });

    // Intro buttons
    $("btnGenerateIntro")?.addEventListener("click", buildIntro);
    $("btnIntroListenAll")?.addEventListener("click", () => speakSequence(buildIntro()));

    // Cards buttons
    $("btnSwapRoles")?.addEventListener("click", () => {
      state.swapped = !state.swapped;
      renderCard();
    });
    $("btnCardListenAll")?.addEventListener("click", listenCurrentCard);
    $("btnRandomCard")?.addEventListener("click", randomCard);

    // Exam buttons
    $("btnStartExam")?.addEventListener("click", examStart);
    $("btnEndExam")?.addEventListener("click", () => examFinish("Stopped by user."));
    $("btnExamListen")?.addEventListener("click", examListen);
    $("btnExamSpeak")?.addEventListener("click", examSpeak);
    $("btnExamNext")?.addEventListener("click", examNext);

    // Spelling helper
    $("btnSpellMake")?.addEventListener("click", renderSpelling);
    $("btnSpellSpeak")?.addEventListener("click", () => {
      const tokens = renderSpelling();
      if (tokens?.length) speakSequence(tokens);
    });
    $("spellInput")?.addEventListener("input", renderSpelling);

    setStatus("idle");
    $("statusText") && ($("statusText").textContent = "Loading…");

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (${res.status})`);
      state.dataset = await res.json();

      state.themeId = themes()[0]?.id || null;
      state.cardIndex = 0;

      // Search filter
      $("themeSearch")?.addEventListener("input", () => {
        const q = $("themeSearch").value.trim().toLowerCase();
        if (!q) {
          state.filteredThemeIds = null;
        } else {
          const set = new Set();
          themes().forEach(t => {
            const hay = (t.title + " " + t.desc + " " + t.id).toLowerCase();
            if (hay.includes(q)) set.add(t.id);
          });
          state.filteredThemeIds = set.size ? set : new Set([themes()[0]?.id]);
        }
        fillThemeSelect();
        state.cardIndex = 0;
        fillCardSelect();
        renderCard();
      });

      $("themeSelect")?.addEventListener("change", () => {
        state.themeId = $("themeSelect").value;
        state.cardIndex = 0;
        fillCardSelect();
        renderCard();
      });

      $("cardSelect")?.addEventListener("change", () => {
        state.cardIndex = parseInt($("cardSelect").value, 10) || 0;
        renderCard();
      });

      // first render
      fillThemeSelect();
      fillCardSelect();
      renderCard();
      buildIntro();
      renderSpelling();
      examResetUI();

      $("styleSelect") && ($("styleSelect").value = state.tone);

      $("statusText") && ($("statusText").textContent = "Idle");
    } catch (err) {
      console.error(err);
      $("statusText") && ($("statusText").textContent = "Error loading JSON");
      const area = $("qaCardArea");
      if (area) {
        area.innerHTML = `<div class="alert alert-danger tiny mb-0">
          Could not load <b>${escapeHtml(DATA_URL)}</b>.  
          Run a local server (VS Code Live Server / python -m http.server).
        </div>`;
      }
    }
  }

  window.addEventListener("load", init);
})();