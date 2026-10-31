/* duo_exam.js */
(() => {
  "use strict";

  const DATA_URL = "themes.json";
  const $ = (id) => document.getElementById(id);

  // ----------------------------
  // State
  // ----------------------------
  const state = {
    dataset: null,
    showPron: true,
    showEn: true,
    // Selected duo cards:
    duo: {
      A: null, // {theme, card}
      B: null
    },
    // Conversation steps (Teil 2 style):
    steps: [],
    idx: 0,
    // Exam timer
    exam: {
      active: false,
      startAt: 0,
      endAt: 0,
      totalMs: 0,
      timer: null,
      ok: 0,
      total: 0
    }
  };

  // ----------------------------
  // HTML helpers
  // ----------------------------
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

  // ----------------------------
  // Status animations + active line
  // ----------------------------
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
    anim.classList.remove("speaking", "listening");
    if (mode === "speaking") anim.classList.add("speaking");
    if (mode === "listening") anim.classList.add("listening");
    $("statusText").textContent =
      mode === "speaking" ? "Speaking…" :
      mode === "listening" ? "Listening…" : "Idle";
  }

  // ----------------------------
  // Speech: TTS + ASR
  // ----------------------------
  let voices = [];
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRecognize = !!SpeechRecognition;

  function loadVoices() {
    voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const deVoices = voices.filter(v => (v.lang || "").toLowerCase().startsWith("de"));
    const sel = $("voiceSelect");
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
    const uri = $("voiceSelect").value;
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
    u.rate = parseFloat($("rate").value);
    u.pitch = parseFloat($("pitch").value);
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
      u.rate = parseFloat($("rate").value);
      u.pitch = parseFloat($("pitch").value);
      const v = getSelectedVoice();
      if (v) u.voice = v;
      u.onend = () => { i++; next(); };
      u.onerror = () => { i++; next(); };
      speechSynthesis.speak(u);
    };
    next();
  }

  function recognizeOnce({ expected, lineEl, onResult, onError }) {
    if (!canRecognize) {
      onError?.("Speech recognition not supported.");
      return;
    }

    stopSpeaking();
    setStatus("listening");
    setActiveLine(lineEl, "listening");

    const rec = new SpeechRecognition();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const said = e.results[0][0].transcript;
      const sim = similarity(expected, said);
      clearActiveLine();
      setStatus("idle");
      onResult?.({ said, sim });
    };

    rec.onerror = (e) => {
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

  // ----------------------------
  // Dataset helpers
  // ----------------------------
  function themes() {
    return state.dataset?.themes || [];
  }

  // Teil 2 only (exclude requests theme + anything marked part=3)
  function teil2ThemesPool() {
    return themes().filter(t => (t.part === 2) && t.id !== "bitten" && (t.cards?.length));
  }

  function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pickRandomCardFromTeil2(excludeThemeId = null) {
    const pool = teil2ThemesPool().filter(t => t.id !== excludeThemeId);
    const theme = randomPick(pool);
    const card = randomPick(theme.cards);
    return { theme, card };
  }

  // ----------------------------
  // Build two-person conversation from 2 cards
  // Round 1: A asks (Card A) -> B answers
  // Round 2: B asks (Card B) -> A answers
  // ----------------------------
  function buildDuoConversation(duoA, duoB) {
    const steps = [];

    // helper
    const pushLine = (speaker, obj, role) => {
      steps.push({
        speaker,
        role, // "A" or "B"
        de: obj.de,
        en: obj.en,
        pron: obj.pron
      });
    };

    // Round 1: Card A
    (duoA.card.items || []).forEach((it, i) => {
      pushLine("Person A (ask)", it.q, "A");
      pushLine("Person B (answer)", it.a, "B");
    });

    // Round 2: Card B
    (duoB.card.items || []).forEach((it, i) => {
      pushLine("Person B (ask)", it.q, "B");
      pushLine("Person A (answer)", it.a, "A");
    });

    return steps;
  }

  function cardInfoText(duo) {
    return `${duo.theme.title} • ${duo.card.title}`;
  }

  // ----------------------------
  // Render line card
  // ----------------------------
  function lineHTML(line, extraOutId = null) {
    const pronHtml = state.showPron && line.pron
      ? `<div class="text-muted tiny mt-1"><span class="mono">Pron:</span> ${escapeHtml(line.pron)}</div>` : "";
    const enHtml = state.showEn && line.en
      ? `<div class="text-muted tiny mt-1"><span class="mono">EN:</span> ${escapeHtml(line.en)}</div>` : "";
    const outId = extraOutId || ("out_" + Math.random().toString(16).slice(2));

    return `
      <div class="line">
        <div class="d-flex justify-content-between gap-2 flex-wrap">
          <div>
            <div class="fw-semibold">${escapeHtml(line.speaker)}: ${escapeHtml(line.de)}</div>
            ${pronHtml}
            ${enHtml}
            <div class="tiny text-muted mt-1 d-none" id="${outId}"></div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm btn-pill" data-say="${escapeHtml(line.de)}">🔊</button>
            <button class="btn btn-outline-success btn-sm btn-pill" data-rec="${escapeHtml(line.de)}" data-out="${outId}">🎙️</button>
          </div>
        </div>
      </div>
    `;
  }

  // ----------------------------
  // Render Practice Mode
  // ----------------------------
  function renderPractice() {
    $("cardAInfo2").textContent = cardInfoText(state.duo.A);
    $("cardBInfo2").textContent = cardInfoText(state.duo.B);

    const html = state.steps.map((ln) => lineHTML(ln)).join("");
    $("practiceConversation").innerHTML = html;
  }

  function practiceListenAll() {
    speakSequence(state.steps.map(s => s.de));
  }

  // ----------------------------
  // Exam Mode
  // ----------------------------
  function examResetUI() {
    state.exam.active = false;
    clearInterval(state.exam.timer);
    state.exam.timer = null;
    state.exam.ok = 0;
    state.exam.total = 0;
    state.idx = 0;

    $("examPhase").textContent = "Not started";
    $("timeLeft").textContent = "—";
    $("okCount").textContent = "0";
    $("totalCount").textContent = "0";
    $("bar").style.width = "0%";
    $("examFeedback").textContent = "";
    $("examStepArea").innerHTML = `<div class="mutedbox p-3 tiny text-muted">Click <b>Start</b> to begin.</div>`;
  }

  function currentLine() {
    return state.steps[state.idx] || null;
  }

  function roleAllowed(lineRole) {
    const role = $("roleSelect").value; // both / A / B
    if (role === "both") return true;
    return role === lineRole;
  }

  function renderExamStep() {
    const line = currentLine();
    if (!line) {
      $("examStepArea").innerHTML = `
        <div class="mutedbox p-3">
          <div class="fw-semibold">Finished ✅</div>
          <div class="text-muted tiny">Score: <b>${state.exam.ok}</b> / ${state.exam.total}</div>
        </div>
      `;
      return;
    }

    // show warning if not your role (still allow, but no scoring)
    const note = roleAllowed(line.role)
      ? `<span class="badge text-bg-light text-muted pill">Your role line</span>`
      : `<span class="badge text-bg-light text-muted pill">Other role (practice ok)</span>`;

    $("examStepArea").innerHTML = `
      <div class="mutedbox p-3">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="fw-semibold">Line ${state.idx + 1} / ${state.steps.length}</div>
          ${note}
        </div>
        <div class="mt-2">${lineHTML(line, "examOut")}</div>
      </div>
    `;
  }

  function startExam() {
    examResetUI();

    state.exam.active = true;
    state.exam.startAt = Date.now();

    const seconds = Math.max(30, parseInt($("examTime").value || "120", 10));
    state.exam.totalMs = seconds * 1000;
    state.exam.endAt = state.exam.startAt + state.exam.totalMs;

    $("examPhase").textContent = "Running";

    renderExamStep();

    clearInterval(state.exam.timer);
    state.exam.timer = setInterval(() => {
      if (!state.exam.active) return;
      const now = Date.now();
      const left = Math.max(0, state.exam.endAt - now);
      $("timeLeft").textContent = Math.ceil(left / 1000) + "s";

      const pct = Math.round(((now - state.exam.startAt) / state.exam.totalMs) * 100);
      $("bar").style.width = Math.max(0, Math.min(100, pct)) + "%";

      if (left <= 0) {
        endExam("Time finished.");
      }
    }, 200);
  }

  function endExam(msg) {
    state.exam.active = false;
    clearInterval(state.exam.timer);
    state.exam.timer = null;
    $("examPhase").textContent = "Finished";
    $("timeLeft").textContent = "0s";
    $("bar").style.width = "100%";

    $("examStepArea").innerHTML = `
      <div class="mutedbox p-3">
        <div class="fw-semibold">Exam finished ✅</div>
        <div class="text-muted tiny">${escapeHtml(msg)}</div>
        <hr class="my-2">
        <div class="d-flex justify-content-between">
          <div>Score</div>
          <div><b>${state.exam.ok}</b> / ${state.exam.total}</div>
        </div>
      </div>
    `;
  }

  function listenLine() {
    const line = currentLine();
    if (!line) return;
    const lineEl = $("examStepArea").querySelector(".line");
    speak(line.de, lineEl);
  }

  function speakLine() {
    const line = currentLine();
    if (!line) return;

    if (!canRecognize) {
      $("examFeedback").textContent = "🎙️ Not supported here. Use Chrome/Edge + https/localhost.";
      return;
    }

    const lineEl = $("examStepArea").querySelector(".line");
    $("examFeedback").textContent = "Listening… speak now.";

    recognizeOnce({
      expected: line.de,
      lineEl,
      onResult: ({ said, sim }) => {
        const pct = Math.round(sim * 100);
        const threshold = Math.min(95, Math.max(50, parseInt($("threshold").value || "75", 10))) / 100;
        const ok = sim >= threshold;

        // Only score if line matches selected role (or both)
        if (roleAllowed(line.role)) {
          state.exam.total++;
          if (ok) state.exam.ok++;
          $("okCount").textContent = String(state.exam.ok);
          $("totalCount").textContent = String(state.exam.total);
        }

        $("examFeedback").textContent =
          `You said: "${said}" • Similarity: ${pct}% • ${ok ? "✅ OK" : "❗Try again"}`;

        // auto-next after speaking
        state.idx++;
        renderExamStep();
      },
      onError: (msg) => {
        $("examFeedback").textContent = `Error: ${msg}`;
      }
    });
  }

  function nextLine() {
    state.idx++;
    renderExamStep();
  }

  // ----------------------------
  // Build / Shuffle Duo
  // ----------------------------
  function buildNewRandomDuo() {
    // pick two different teil2 cards
    const A = pickRandomCardFromTeil2(null);
    const B = pickRandomCardFromTeil2(A.theme.id);

    state.duo.A = A;
    state.duo.B = B;

    state.steps = buildDuoConversation(A, B);
    state.idx = 0;

    $("cardAInfo").textContent = cardInfoText(A);
    $("cardBInfo").textContent = cardInfoText(B);
    $("cardAInfo2").textContent = cardInfoText(A);
    $("cardBInfo2").textContent = cardInfoText(B);

    renderPractice();
    examResetUI();
  }

  // ----------------------------
  // Delegation for practice line buttons
  // ----------------------------
  document.addEventListener("click", (e) => {
    const sayBtn = e.target.closest("[data-say]");
    if (sayBtn) {
      const lineEl = sayBtn.closest(".line");
      speak(sayBtn.getAttribute("data-say"), lineEl);
    }

    const recBtn = e.target.closest("[data-rec]");
    if (recBtn) {
      const expected = recBtn.getAttribute("data-rec");
      const outId = recBtn.getAttribute("data-out");
      const outEl = document.getElementById(outId);
      const lineEl = recBtn.closest(".line");

      if (!outEl) return;

      if (!canRecognize) {
        outEl.classList.remove("d-none");
        outEl.textContent = "🎙️ Not supported. Use Chrome/Edge + https/localhost.";
        return;
      }

      outEl.classList.remove("d-none");
      outEl.textContent = "Listening… speak now.";

      recognizeOnce({
        expected,
        lineEl,
        onResult: ({ said, sim }) => {
          const pct = Math.round(sim * 100);
          outEl.textContent = `You said: "${said}" • Similarity: ${pct}%`;
        },
        onError: (msg) => outEl.textContent = `Error: ${msg}`
      });
    }
  });

  // ----------------------------
  // Init
  // ----------------------------
  async function init() {
    // dark mode
    $("btnTheme").addEventListener("click", () => {
      document.body.classList.toggle("dark");
      $("btnTheme").textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
    });

    $("btnStop").addEventListener("click", stopSpeaking);

    // voices
    if (window.speechSynthesis) {
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    if (!canRecognize) $("supportNote").classList.remove("d-none");
    setStatus("idle");
    $("statusText").textContent = "Loading…";

    // toggles
    $("togglePron").addEventListener("change", () => {
      state.showPron = $("togglePron").checked;
      renderPractice();
      renderExamStep();
    });
    $("toggleEn").addEventListener("change", () => {
      state.showEn = $("toggleEn").checked;
      renderPractice();
      renderExamStep();
    });

    // buttons
    $("btnNewDuo").addEventListener("click", buildNewRandomDuo);
    $("btnPracticeShuffle").addEventListener("click", buildNewRandomDuo);
    $("btnPracticeListenAll").addEventListener("click", practiceListenAll);

    $("btnStartExam").addEventListener("click", startExam);
    $("btnEndExam").addEventListener("click", () => endExam("Stopped by user."));
    $("btnListenLine").addEventListener("click", listenLine);
    $("btnSpeakLine").addEventListener("click", speakLine);
    $("btnNextLine").addEventListener("click", nextLine);

    // load JSON
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (${res.status})`);
      state.dataset = await res.json();

      // create first duo
      buildNewRandomDuo();

      $("statusText").textContent = "Idle";
    } catch (err) {
      console.error(err);
      $("statusText").textContent = "Error loading JSON";
      $("practiceConversation").innerHTML = `
        <div class="alert alert-danger tiny mb-0">
          Could not load <b>${escapeHtml(DATA_URL)}</b>.
          Run a local server (VS Code Live Server / python -m http.server).
        </div>
      `;
      $("examStepArea").innerHTML = `
        <div class="alert alert-danger tiny mb-0">
          Could not load <b>${escapeHtml(DATA_URL)}</b>.
        </div>
      `;
    }
  }

  window.addEventListener("load", init);
})();