(() => {
  const app = document.getElementById("app");
  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  const QUICK_COUNT = 10;
  const TERM_COUNT = 10;
  const SURVIVAL_LIVES = 3;
  const SURVIVAL_SECONDS = 20;

  let chapter = CHAPTERS[0];
  let selectedSections = new Set();
  let state = null;
  let challenge = null;
  let timer = null;

  // ═══════════════ Utils ═══════════════
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const range = (n) => [...Array(n).keys()];

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  const fmtTime = (ms) => {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // ═══════════════ Toasts ═══════════════
  const toastBox = document.createElement("div");
  toastBox.className = "toasts";
  document.body.appendChild(toastBox);

  function toast(html, cls = "") {
    const t = document.createElement("div");
    t.className = `toast ${cls}`;
    t.innerHTML = html;
    toastBox.appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3200);
  }

  // ═══════════════ Sons ═══════════════
  let audio = null;
  let muted = store.get("hus-muted") === true;
  const SFX = {
    good: [[660, 0, 0.12], [880, 0.08, 0.2]],
    bad: [[220, 0, 0.18, "triangle"], [165, 0.12, 0.25, "triangle"]],
    tick: [[1200, 0, 0.04]],
    badge: [[784, 0, 0.12], [988, 0.1, 0.12], [1319, 0.2, 0.3]],
    level: [[523, 0, 0.15], [659, 0.12, 0.15], [784, 0.24, 0.15], [1047, 0.36, 0.45]],
    key: [[300, 0, 0.02, "square"]]
  };
  function sfx(name) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const now = audio.currentTime;
      SFX[name].forEach(([f, t, d, type]) => {
        const o = audio.createOscillator();
        const g = audio.createGain();
        o.type = type || "sine";
        o.frequency.value = f;
        const vol = name === "key" ? 0.015 : 0.12;
        g.gain.setValueAtTime(0.0001, now + t);
        g.gain.exponentialRampToValueAtTime(vol, now + t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
        o.connect(g).connect(audio.destination);
        o.start(now + t);
        o.stop(now + t + d + 0.05);
      });
    } catch (e) {}
  }

  // ═══════════════ Confettis ═══════════════
  function confetti() {
    if (reducedMotion()) return;
    const c = document.createElement("canvas");
    c.className = "confetti";
    document.body.appendChild(c);
    const x = c.getContext("2d");
    const W = (c.width = innerWidth);
    const H = (c.height = innerHeight);
    const colors = ["#8b6cff", "#22d3ee", "#3ddc84", "#ffcc00", "#ff6b9a"];
    const P = Array.from({ length: 170 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3,
      y: H * 0.35,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 15 - 4,
      r: Math.random() * 7 + 4,
      c: colors[(Math.random() * colors.length) | 0],
      a: Math.random() * 6,
      va: (Math.random() - 0.5) * 0.3
    }));
    let t = 0;
    (function frame() {
      x.clearRect(0, 0, W, H);
      P.forEach((p) => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        x.save(); x.translate(p.x, p.y); x.rotate(p.a);
        x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        x.restore();
      });
      if (++t < 200) requestAnimationFrame(frame); else c.remove();
    })();
  }

  // ═══════════════ Profil, XP, niveaux, badges ═══════════════
  const LEVELS = [
    [0, "Débutant", "🐣"],
    [100, "Apprenti", "🧑‍💻"],
    [300, "Utilisateur Linux", "🐧"],
    [600, "Admin Système", "🛠️"],
    [1000, "Sysadmin Pro", "⚙️"],
    [1600, "Kernel Hacker", "🧠"],
    [2500, "Linus Torvalds", "👑"]
  ];
  const levelOf = (xp) => {
    let i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
    return i;
  };

  const SECTION_ICONS = {
    "Versions": "🔢", "Configuration": "🧩", "/proc & sysctl": "🎛️", "Compilation": "🔨",
    "Installation": "📦", "Mise à jour": "🔄", "Modules": "🧱", "Démarrage": "🚀"
  };

  const BADGES = [
    { id: "premier", icon: "🎯", name: "Premier pas", desc: "Termine ton premier quiz" },
    { id: "serie5", icon: "🔥", name: "En feu", desc: "5 bonnes réponses d'affilée" },
    { id: "serie10", icon: "☄️", name: "Inarrêtable", desc: "10 bonnes réponses d'affilée" },
    { id: "parfait", icon: "🏆", name: "Sans faute", desc: "100 % sur un quiz d'au moins 10 questions" },
    { id: "eclair", icon: "⚡", name: "Éclair", desc: "Sans faute en moins de 90 secondes" },
    { id: "examen", icon: "🎓", name: "Examen blanc", desc: "Termine l'examen complet" },
    { id: "examen80", icon: "🥇", name: "Major de promo", desc: "80 % ou plus à l'examen complet" },
    { id: "term1", icon: "💻", name: "Hello shell", desc: "Réussis ta première commande" },
    { id: "term10", icon: "🖥️", name: "Root", desc: "10 commandes réussies du premier coup" },
    { id: "survie10", icon: "❤️", name: "Survivant", desc: "10 bonnes réponses en mode Survie" },
    { id: "survie25", icon: "🛡️", name: "Immortel", desc: "25 bonnes réponses en mode Survie" },
    { id: "defi", icon: "🤝", name: "Duelliste", desc: "Gagne un défi contre un ami" },
    { id: "hibou", icon: "🦉", name: "Oiseau de nuit", desc: "Joue entre minuit et 5 h" }
  ];
  const sectionNames = () => [...new Set(chapter.questions.map((q) => q.s))];
  const allBadges = () => [
    ...BADGES,
    ...sectionNames().map((s) => ({
      id: `maitre-${slug(s)}`,
      icon: SECTION_ICONS[s] || "⭐",
      name: `Maître · ${s}`,
      desc: `Réponds juste au moins une fois à toutes les questions « ${s} »`
    }))
  ];

  const profile = Object.assign(
    { name: "", xp: 0, badges: {}, mastered: [], survivalBest: 0, termFirst: 0 },
    store.get("hus-profile") || {}
  );
  const saveProfile = () => store.set("hus-profile", profile);

  function addXP(n) {
    if (n <= 0) return;
    const before = levelOf(profile.xp);
    profile.xp += n;
    if (state) state.xpGained = (state.xpGained || 0) + n;
    saveProfile();
    const after = levelOf(profile.xp);
    if (after > before) setTimeout(() => levelUp(after), 600);
  }

  function unlock(id) {
    if (profile.badges[id]) return;
    const b = allBadges().find((x) => x.id === id);
    if (!b) return;
    profile.badges[id] = Date.now();
    saveProfile();
    if (state) (state.newBadges = state.newBadges || []).push(id);
    setTimeout(() => {
      sfx("badge");
      toast(`<span class="t-ico">${b.icon}</span><div><small>Badge débloqué</small><b>${esc(b.name)}</b></div>`, "badge");
    }, 400);
  }

  function levelUp(i) {
    const [, title, icon] = LEVELS[i];
    sfx("level");
    confetti();
    const m = document.createElement("div");
    m.className = "modal";
    m.innerHTML = `
      <div class="modal-card pop">
        <div class="big">${icon}</div>
        <small>Niveau supérieur !</small>
        <h2>Niveau ${i + 1} · ${esc(title)}</h2>
        <p>Continue comme ça, tu deviens un vrai pro de Linux.</p>
        <button class="btn primary">Continuer</button>
      </div>`;
    document.body.appendChild(m);
    const close = () => m.remove();
    m.querySelector("button").addEventListener("click", close);
    m.addEventListener("click", (e) => { if (e.target === m) close(); });
  }

  function markMastered(ref) {
    if (profile.mastered.includes(ref)) return;
    profile.mastered.push(ref);
    saveProfile();
    const s = chapter.questions[ref].s;
    const all = chapter.questions.map((q, i) => (q.s === s ? i : -1)).filter((i) => i >= 0);
    if (all.every((i) => profile.mastered.includes(i))) unlock(`maitre-${slug(s)}`);
  }

  // ═══════════════ Défis (lien partageable) ═══════════════
  const encode = (o) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const decode = (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))));

  function readChallenge() {
    const m = location.hash.match(/^#defi=([\w-]+)$/);
    if (!m) return null;
    try {
      const d = decode(m[1]);
      const ch = CHAPTERS.find((c) => c.id === d.c);
      if (!ch || !["quiz", "terminal", "survie"].includes(d.k)) return null;
      const max = d.k === "terminal" ? ch.terminal.length : ch.questions.length;
      const idx = Array.isArray(d.i) ? d.i.filter((x) => Number.isInteger(x) && x >= 0 && x < max).slice(0, 200) : [];
      if (d.k !== "survie" && !idx.length) return null;
      return {
        chapter: ch,
        kind: d.k,
        indices: idx,
        name: String(d.n || "Un ami").slice(0, 20),
        score: Math.max(0, Math.min(d.k === "survie" ? 999 : 100, Number(d.s) || 0))
      };
    } catch (e) {
      return null;
    }
  }

  const KIND_LABEL = { quiz: "Quiz", terminal: "Terminal", survie: "Survie" };
  const scoreLabel = (kind, s) => (kind === "survie" ? `${s} bonne${s > 1 ? "s" : ""} réponse${s > 1 ? "s" : ""}` : `${s}%`);

  // ═══════════════ Accueil ═══════════════
  function poolIndices() {
    return chapter.questions.map((q, i) => i).filter((i) => !selectedSections.size || selectedSections.has(chapter.questions[i].s));
  }
  function terminalPool() {
    const all = range(chapter.terminal.length);
    if (!selectedSections.size) return all;
    const f = all.filter((i) => selectedSections.has(chapter.terminal[i].s));
    return f.length ? f : all;
  }

  function renderHome() {
    stopTimer();
    state = null;
    const best = store.get(`hus-best-${chapter.id}`);
    const secs = sectionNames().map((s) => [s, chapter.questions.filter((q) => q.s === s).length]);
    const pool = poolIndices();
    const tpool = terminalPool();
    const lv = levelOf(profile.xp);
    const [lvMin, lvTitle, lvIcon] = LEVELS[lv];
    const next = LEVELS[lv + 1];
    const pct = next ? ((profile.xp - lvMin) / (next[0] - lvMin)) * 100 : 100;
    const badges = allBadges();
    const got = badges.filter((b) => profile.badges[b.id]).length;

    app.innerHTML = `
      ${challenge ? `
        <section class="banner fade-in">
          <div class="banner-ico">⚔️</div>
          <div class="banner-txt">
            <b>${esc(challenge.name)} te défie !</b>
            <span>Mode ${KIND_LABEL[challenge.kind]}${challenge.kind !== "survie" ? ` · ${challenge.indices.length} questions` : ""} · score à battre : <b>${scoreLabel(challenge.kind, challenge.score)}</b></span>
          </div>
          <div class="banner-actions">
            <button class="btn primary" id="acceptDefi">Relever le défi</button>
            <button class="icon-btn" id="dismissDefi" aria-label="Ignorer">✕</button>
          </div>
        </section>` : ""}

      <section class="hero fade-in">
        <span class="pill">📚 Révision Linux</span>
        <h1>Révise ensemble,<br><span>réussis ensemble.</span></h1>
        <p>Quiz, vrai terminal, mode survie et défis entre amis — tout le chapitre pour réussir l'examen.</p>
      </section>

      <section class="card profile fade-in">
        <div class="avatar">${lvIcon}</div>
        <div class="pinfo">
          <input class="name-input" id="nameInput" maxlength="20" placeholder="Ton pseudo ✏️" value="${esc(profile.name)}" aria-label="Ton pseudo">
          <div class="lvl">Niveau ${lv + 1} · <b>${esc(lvTitle)}</b></div>
          <div class="xpbar"><div style="width:${pct}%"></div></div>
          <small>${profile.xp} XP${next ? ` · encore ${next[0] - profile.xp} XP pour « ${esc(next[1])} »` : " · niveau max !"}</small>
        </div>
        <button class="btn badge-btn" id="badgesBtn" aria-expanded="false">🏅 ${got}/${badges.length}</button>
        <div class="badges" id="badgesGrid" hidden>
          ${badges.map((b) => `
            <div class="badge ${profile.badges[b.id] ? "on" : ""}" title="${esc(b.desc)}">
              <span class="b-ico">${profile.badges[b.id] ? b.icon : "🔒"}</span>
              <b>${esc(b.name)}</b>
              <small>${esc(b.desc)}</small>
            </div>`).join("")}
        </div>
      </section>

      <section class="card fade-in">
        <div class="chapter-head">
          <div>
            <span class="pill">${esc(chapter.tag)}</span>
            <h2>${esc(chapter.title)}</h2>
            <p>${esc(chapter.description)}</p>
          </div>
          <div class="best">
            Meilleur score
            <strong>${best != null ? best + "%" : "—"}</strong>
            ${profile.survivalBest ? `<span>Survie : ${profile.survivalBest}</span>` : ""}
          </div>
        </div>

        <div class="stats-row">
          <div class="stat"><b>${chapter.questions.length}</b><span>questions</span></div>
          <div class="stat"><b>${chapter.terminal.length}</b><span>missions terminal</span></div>
          <div class="stat"><b>${secs.length}</b><span>thèmes</span></div>
        </div>

        <div class="label">Thèmes ${selectedSections.size ? `· ${pool.length} questions sélectionnées` : "· tous"}</div>
        <div class="chips">
          <button class="chip ${selectedSections.size === 0 ? "on" : ""}" data-sec="">Tous</button>
          ${secs.map(([s, n]) => `<button class="chip ${selectedSections.has(s) ? "on" : ""}" data-sec="${esc(s)}">${SECTION_ICONS[s] || ""} ${esc(s)}<small>${n}</small></button>`).join("")}
        </div>

        <div class="modes">
          <button class="mode featured" data-mode="quick">
            <div class="ico">⚡</div>
            <h3>Quiz rapide</h3>
            <p>${Math.min(QUICK_COUNT, pool.length)} questions au hasard</p>
          </button>
          <button class="mode" data-mode="full">
            <div class="ico">🎯</div>
            <h3>Examen complet</h3>
            <p>Les ${pool.length} questions, mélangées</p>
          </button>
          <button class="mode term-mode" data-mode="terminal">
            <span class="tag-new">NOUVEAU</span>
            <div class="ico">💻</div>
            <h3>Mode Terminal</h3>
            <p>Tape les vraies commandes · ${Math.min(TERM_COUNT, tpool.length)} missions</p>
          </button>
          <button class="mode" data-mode="survie">
            <div class="ico">❤️</div>
            <h3>Survie</h3>
            <p>${SURVIVAL_LIVES} vies, ${SURVIVAL_SECONDS} s par question. Tiens le plus longtemps !</p>
          </button>
        </div>

        <p class="tips">Astuce : <kbd>1</kbd>–<kbd>4</kbd> pour répondre, <kbd>Entrée</kbd> pour continuer.</p>
      </section>
    `;

    const nameInput = document.getElementById("nameInput");
    nameInput.addEventListener("input", () => { profile.name = nameInput.value.trim().slice(0, 20); saveProfile(); });

    const bb = document.getElementById("badgesBtn");
    bb.addEventListener("click", () => {
      const g = document.getElementById("badgesGrid");
      g.hidden = !g.hidden;
      bb.setAttribute("aria-expanded", String(!g.hidden));
    });

    app.querySelectorAll(".chip").forEach((c) =>
      c.addEventListener("click", () => {
        const s = c.dataset.sec;
        if (!s) selectedSections.clear();
        else if (selectedSections.has(s)) selectedSections.delete(s);
        else selectedSections.add(s);
        renderHome();
      })
    );

    app.querySelectorAll(".mode").forEach((m) =>
      m.addEventListener("click", () => {
        const mode = m.dataset.mode;
        if (mode === "quick") startQuiz(shuffle(poolIndices()).slice(0, QUICK_COUNT), { mode });
        else if (mode === "full") startQuiz(shuffle(poolIndices()), { mode });
        else if (mode === "terminal") startTerminal(shuffle(terminalPool()).slice(0, TERM_COUNT).sort((a, b) => a - b));
        else startSurvival();
      })
    );

    if (challenge) {
      document.getElementById("acceptDefi").addEventListener("click", () => {
        const c = challenge;
        challenge = null;
        history.replaceState(null, "", location.pathname + location.search);
        chapter = c.chapter;
        if (c.kind === "quiz") startQuiz(c.indices, { mode: "defi", challenge: c });
        else if (c.kind === "terminal") startTerminal(c.indices, { challenge: c });
        else startSurvival({ challenge: c });
      });
      document.getElementById("dismissDefi").addEventListener("click", () => {
        challenge = null;
        history.replaceState(null, "", location.pathname + location.search);
        renderHome();
      });
    }
  }

  // ═══════════════ Quiz & Survie ═══════════════
  function baseState(kind, extra) {
    return Object.assign(
      { kind, idx: 0, answers: [], streak: 0, bestStreak: 0, startedAt: Date.now(), xpGained: 0, newBadges: [] },
      extra
    );
  }

  const prepQuestion = (i) => {
    const q = chapter.questions[i];
    return { ...q, ref: i, opts: shuffle(q.o.map((text, j) => ({ text, ok: j === q.a }))) };
  };

  function startQuiz(indices, { mode = "quick", challenge: ch = null } = {}) {
    state = baseState("quiz", { mode, challenge: ch, list: indices.map(prepQuestion) });
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startSurvival({ challenge: ch = null } = {}) {
    const pool = ch ? range(chapter.questions.length) : poolIndices();
    state = baseState("survie", { challenge: ch, pool, list: shuffle(pool).map(prepQuestion), lives: SURVIVAL_LIVES });
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    stopTimer();
    const { list, idx, kind } = state;
    const q = list[idx];
    const score = state.answers.filter((a) => a.ok).length;
    const survival = kind === "survie";
    const progress = survival ? 100 : (state.answers.length / list.length) * 100;

    app.innerHTML = `
      <div class="quiz-top">
        <button class="icon-btn" id="quitBtn" title="Quitter" aria-label="Quitter">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        ${survival
          ? `<div class="bar timer"><div id="timerBar" style="width:100%"></div></div>
             <span class="lives">${"❤️".repeat(state.lives)}${"🖤".repeat(SURVIVAL_LIVES - state.lives)}</span>`
          : `<div class="bar"><div style="width:${progress}%"></div></div>
             <span class="count">${idx + 1} / ${list.length}</span>`}
      </div>
      <section class="card fade-in">
        <div class="quiz-meta">
          <span class="pill">${SECTION_ICONS[q.s] || ""} ${esc(q.s)}</span>
          <span>${survival ? `Question ${idx + 1} · ` : ""}✅ ${score} ${state.streak >= 3 ? `<span class="streak">· 🔥 ${state.streak} d'affilée</span>` : ""}</span>
        </div>
        <div class="question">${esc(q.q)}</div>
        <div class="options">
          ${q.opts.map((o, i) => `
            <button class="opt" data-i="${i}">
              <span class="key">${LETTERS[i]}</span>
              <span class="txt">${esc(o.text)}</span>
            </button>`).join("")}
        </div>
        <div id="feedback"></div>
        <div class="quiz-actions">
          <span class="xp-live" id="xpLive">⭐ ${state.xpGained} XP</span>
          <button class="btn primary" id="nextBtn" disabled>Suivant →</button>
        </div>
      </section>
    `;

    app.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => answer(+b.dataset.i)));
    document.getElementById("nextBtn").addEventListener("click", next);
    document.getElementById("quitBtn").addEventListener("click", quit);

    if (survival) {
      const end = Date.now() + SURVIVAL_SECONDS * 1000;
      let lastSec = SURVIVAL_SECONDS;
      timer = setInterval(() => {
        const left = end - Date.now();
        const bar = document.getElementById("timerBar");
        if (!bar) return stopTimer();
        bar.style.width = `${Math.max(0, (left / (SURVIVAL_SECONDS * 1000)) * 100)}%`;
        bar.classList.toggle("hurry", left < 5000);
        const sec = Math.ceil(left / 1000);
        if (sec !== lastSec && sec <= 5 && sec > 0) sfx("tick");
        lastSec = sec;
        if (left <= 0) { stopTimer(); answer(-1); }
      }, 100);
    }
  }

  function answer(i) {
    const q = state.list[state.idx];
    if (state.answers.length > state.idx) return;
    stopTimer();
    const ok = i >= 0 && q.opts[i].ok;
    const right = q.opts.find((o) => o.ok).text;
    state.answers.push({ ref: q.ref, ok, q: q.q, yours: i >= 0 ? q.opts[i].text : "⏱️ Temps écoulé", right, e: q.e });
    state.streak = ok ? state.streak + 1 : 0;
    state.bestStreak = Math.max(state.bestStreak, state.streak);

    let gain = 0;
    if (ok) {
      gain = 10 + (state.streak % 5 === 0 ? 20 : 0);
      addXP(gain);
      markMastered(q.ref);
      if (state.streak >= 5) unlock("serie5");
      if (state.streak >= 10) unlock("serie10");
      sfx("good");
    } else {
      sfx("bad");
      if (state.kind === "survie") state.lives--;
    }

    app.querySelectorAll(".opt").forEach((b, j) => {
      b.disabled = true;
      if (q.opts[j].ok) b.classList.add("correct");
      else if (j === i) b.classList.add("wrong");
      else b.classList.add("dim");
    });

    const lead = ok
      ? `✅ Bonne réponse ! <span class="xp-pop">+${gain} XP${gain > 10 ? " 🔥 bonus série" : ""}</span>`
      : `${i < 0 ? "⏱️ Temps écoulé" : "❌ Raté"} — la bonne réponse : ${esc(right)}`;
    document.getElementById("feedback").innerHTML = `
      <div class="explain ${ok ? "" : "bad"} fade-in">
        <strong>${lead}</strong>
        ${esc(q.e)}
      </div>`;

    if (state.kind === "survie") {
      document.querySelector(".lives").textContent = "❤️".repeat(state.lives) + "🖤".repeat(SURVIVAL_LIVES - state.lives);
      if (!ok) document.querySelector(".lives").classList.add("hit");
    } else {
      document.querySelector(".bar > div").style.width = `${(state.answers.length / state.list.length) * 100}%`;
    }
    document.getElementById("xpLive").textContent = `⭐ ${state.xpGained} XP`;

    const nb = document.getElementById("nextBtn");
    const last = state.kind === "survie" ? state.lives <= 0 : state.idx + 1 === state.list.length;
    if (last) nb.textContent = "Voir le résultat →";
    nb.disabled = false;
    nb.focus({ preventScroll: true });
  }

  function next() {
    if (state.answers.length <= state.idx) return;
    if (state.kind === "survie") {
      if (state.lives <= 0) return renderResult();
      state.idx++;
      if (state.idx >= state.list.length) state.list.push(...shuffle(state.pool).map(prepQuestion));
      return renderQuestion();
    }
    if (state.idx + 1 < state.list.length) {
      state.idx++;
      renderQuestion();
    } else {
      renderResult();
    }
  }

  function quit() {
    if (!state || state.finished || !state.answers.length || confirm("Quitter ? Ta progression sera perdue.")) renderHome();
  }

  // ═══════════════ Mode Terminal ═══════════════
  function startTerminal(indices, { challenge: ch = null } = {}) {
    state = baseState("terminal", {
      challenge: ch,
      list: indices.map((i) => ({ ...chapter.terminal[i], ref: i })),
      log: [
        `<span class="t-muted">Help Us Student — terminal d'entraînement (Linux 2.6.35.5)</span>`,
        `<span class="t-muted">Tape <span class="t-yellow">aide</span> pour la liste des commandes spéciales.</span>`
      ],
      hist: [],
      histPos: 0
    });
    renderMission();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const promptFor = (t) => {
    const user = t.root ? "root" : "etudiant";
    return `<span class="t-green">${user}@hus</span>:<span class="t-blue">${esc(t.cwd)}</span>${t.root ? "#" : "$"}`;
  };

  function renderMission() {
    const { list, idx } = state;
    const t = list[idx];
    Object.assign(state, { tries: 0, hintUsed: false, done: false, lastWrong: "" });
    state.log.push(`<span class="t-mission"># ── Mission ${idx + 1} : ${esc(t.t)}</span>`);
    if (state.log.length > 80) state.log = state.log.slice(-80);

    app.innerHTML = `
      <div class="quiz-top">
        <button class="icon-btn" id="quitBtn" title="Quitter" aria-label="Quitter">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div class="bar"><div style="width:${(state.answers.length / list.length) * 100}%"></div></div>
        <span class="count">${idx + 1} / ${list.length}</span>
      </div>

      <section class="card mission fade-in">
        <div class="quiz-meta">
          <span class="pill">💻 Mission ${idx + 1} · ${esc(t.s)}</span>
          <span id="tries">Essais : 0 / 3</span>
        </div>
        <div class="question">${esc(t.t)}</div>
        <div class="mission-actions">
          <button class="btn small" id="hintBtn">💡 Indice</button>
          <button class="btn small" id="skipBtn">Passer</button>
          <span class="xp-live" id="xpLive">⭐ ${state.xpGained} XP</span>
        </div>
      </section>

      <div class="term fade-in" id="term">
        <div class="term-head"><i></i><i></i><i></i><span>${t.root ? "root" : "etudiant"}@help-us-student: ${esc(t.cwd)}</span></div>
        <div class="term-body" id="tb">
          ${state.log.map((l) => `<div class="t-line">${l}</div>`).join("")}
          <div class="t-line t-input" id="tInputLine">
            <span class="ps">${promptFor(t)}</span>
            <input id="ti" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Commande">
          </div>
        </div>
      </div>

      <div class="quiz-actions">
        <span class="tips left">Valide avec <kbd>Entrée</kbd> · <kbd>↑</kbd> historique</span>
        <button class="btn primary" id="nextBtn" disabled>${idx + 1 === list.length ? "Voir le résultat" : "Mission suivante"} →</button>
      </div>
    `;

    const ti = document.getElementById("ti");
    const tb = document.getElementById("tb");
    tb.scrollTop = tb.scrollHeight;
    ti.focus({ preventScroll: true });

    document.getElementById("term").addEventListener("click", () => ti.focus({ preventScroll: true }));
    document.getElementById("quitBtn").addEventListener("click", quit);
    document.getElementById("hintBtn").addEventListener("click", () => { showHint(); ti.focus(); });
    document.getElementById("skipBtn").addEventListener("click", () => { reveal(); ti.focus(); });
    document.getElementById("nextBtn").addEventListener("click", nextMission);

    ti.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (state.done) return nextMission();
        const raw = ti.value;
        ti.value = "";
        if (raw.trim()) { state.hist.push(raw); state.histPos = state.hist.length; }
        runCommand(raw);
      } else if (e.key === "ArrowUp" && state.hist.length) {
        e.preventDefault();
        state.histPos = Math.max(0, state.histPos - 1);
        ti.value = state.hist[state.histPos] || "";
      } else if (e.key === "ArrowDown" && state.hist.length) {
        e.preventDefault();
        state.histPos = Math.min(state.hist.length, state.histPos + 1);
        ti.value = state.hist[state.histPos] || "";
      } else if (e.key.length === 1) {
        sfx("key");
      }
    });
  }

  function termPrint(html, cls = "") {
    const line = `<span class="${cls}">${html}</span>`;
    state.log.push(line);
    const tb = document.getElementById("tb");
    const inputLine = document.getElementById("tInputLine");
    if (!tb || !inputLine) return;
    const div = document.createElement("div");
    div.className = "t-line";
    div.innerHTML = line;
    tb.insertBefore(div, inputLine);
    tb.scrollTop = tb.scrollHeight;
  }

  const normCmd = (raw) =>
    raw.trim().replace(/^[$#]\s*/, "").replace(/^sudo\s+/, "").replace(/\s+/g, " ");

  function runCommand(raw) {
    const t = state.list[state.idx];
    termPrint(`${promptFor(t)} ${esc(raw)}`);
    const cmd = normCmd(raw);
    if (!cmd) return;

    if (/^(aide|help)$/i.test(cmd)) {
      termPrint("Commandes spéciales :", "t-yellow");
      termPrint("  indice   affiche un indice (moins d'XP)", "t-muted");
      termPrint("  passer   affiche la solution et passe à la suite", "t-muted");
      termPrint("  clear    efface l'écran", "t-muted");
      return;
    }
    if (cmd === "clear") {
      state.log = [];
      document.querySelectorAll("#tb .t-line:not(.t-input)").forEach((n) => n.remove());
      return;
    }
    if (/^(indice|hint)$/i.test(cmd)) return showHint();
    if (/^(passer|skip)$/i.test(cmd)) return reveal();

    if (t.a.some((re) => re.test(cmd))) return success();

    state.tries++;
    state.lastWrong = raw.trim();
    document.getElementById("tries").textContent = `Essais : ${state.tries} / 3`;
    sfx("bad");
    const term = document.getElementById("term");
    term.classList.remove("shake");
    void term.offsetWidth;
    term.classList.add("shake");
    const first = cmd.split(" ")[0];
    termPrint(`✗ ${esc(first)} : ce n'est pas la commande attendue pour cette mission (essai ${state.tries}/3)`, "t-red");
    if (state.tries === 2 && !state.hintUsed) showHint();
    if (state.tries >= 3) reveal();
  }

  function showHint() {
    if (state.done) return;
    state.hintUsed = true;
    termPrint(`💡 Indice : ${esc(state.list[state.idx].h)}`, "t-yellow");
  }

  function printOutput(t, after) {
    const lines = t.out ? t.out.split("\n") : [];
    const step = reducedMotion() ? 0 : 35;
    lines.forEach((l, i) => setTimeout(() => termPrint(esc(l)), i * step));
    setTimeout(() => {
      if (t.note) termPrint(`# ${esc(t.note)}`, "t-muted");
      after();
    }, lines.length * step + 20);
  }

  function finishMission(ok) {
    const t = state.list[state.idx];
    state.done = true;
    state.answers.push({ ref: t.ref, ok, q: t.t, yours: ok ? t.sol : state.lastWrong || "—", right: t.sol, e: t.h, cmd: true });
    state.streak = ok ? state.streak + 1 : 0;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    document.querySelector(".bar > div").style.width = `${(state.answers.length / state.list.length) * 100}%`;
    document.getElementById("xpLive").textContent = `⭐ ${state.xpGained} XP`;
    document.getElementById("hintBtn").disabled = true;
    document.getElementById("skipBtn").disabled = true;
    const nb = document.getElementById("nextBtn");
    nb.disabled = false;
    termPrint(`<span class="t-muted">Appuie sur Entrée pour continuer…</span>`);
  }

  function success() {
    const t = state.list[state.idx];
    state.done = true;
    const firstTry = state.tries === 0 && !state.hintUsed;
    const gain = firstTry ? 20 : 10;
    sfx("good");
    printOutput(t, () => {
      termPrint(`✓ Mission réussie ! +${gain} XP${firstTry ? " (du premier coup)" : ""}`, "t-green t-bold");
      addXP(gain);
      unlock("term1");
      if (firstTry) {
        profile.termFirst++;
        saveProfile();
        if (profile.termFirst >= 10) unlock("term10");
      }
      finishMission(true);
    });
  }

  function reveal() {
    if (state.done) return;
    const t = state.list[state.idx];
    state.done = true;
    termPrint(`La solution était :`, "t-yellow");
    termPrint(`${promptFor(t)} ${esc(t.sol)}`);
    printOutput(t, () => finishMission(false));
  }

  function nextMission() {
    if (!state.done || state.answers.length <= state.idx) return;
    if (state.idx + 1 < state.list.length) {
      state.idx++;
      renderMission();
    } else {
      renderResult();
    }
  }

  // ═══════════════ Résultat ═══════════════
  function renderResult() {
    stopTimer();
    const { kind } = state;
    const total = state.answers.length;
    const score = state.answers.filter((a) => a.ok).length;
    const pct = total ? Math.round((score / total) * 100) : 0;
    const wrong = state.answers.filter((a) => !a.ok);
    const time = Date.now() - state.startedAt;
    const metric = kind === "survie" ? score : pct;

    // Récompenses de fin
    state.finished = true;
    unlock("premier");
    if (new Date().getHours() < 5) unlock("hibou");
    let isRecord = false;
    if (kind === "quiz") {
      if (total >= QUICK_COUNT && pct === 100) {
        addXP(50);
        unlock("parfait");
        if (time < 90000) unlock("eclair");
      }
      if (state.mode === "full" && total === chapter.questions.length) {
        unlock("examen");
        if (pct >= 80) unlock("examen80");
      }
      const key = `hus-best-${chapter.id}`;
      const prev = store.get(key);
      isRecord = total >= QUICK_COUNT && (prev == null || pct > prev);
      if (isRecord) store.set(key, pct);
    } else if (kind === "survie") {
      if (score >= 10) unlock("survie10");
      if (score >= 25) unlock("survie25");
      isRecord = score > profile.survivalBest;
      if (isRecord) { profile.survivalBest = score; saveProfile(); }
    } else if (kind === "terminal" && pct === 100 && total >= 5) {
      addXP(50);
    }

    // Défi
    let duel = "";
    const ch = state.challenge;
    if (ch) {
      const win = metric > ch.score;
      const tie = metric === ch.score;
      if (win) { unlock("defi"); addXP(50); }
      duel = `
        <div class="duel ${win ? "win" : tie ? "tie" : "lose"}">
          <div><small>Toi</small><b>${scoreLabel(kind, metric)}</b></div>
          <div class="vs">VS</div>
          <div><small>${esc(ch.name)}</small><b>${scoreLabel(kind, ch.score)}</b></div>
          <p>${win ? `🏆 Tu as battu ${esc(ch.name)} ! +50 XP` : tie ? "🤝 Égalité parfaite !" : `😅 ${esc(ch.name)} garde la tête… revanche ?`}</p>
        </div>`;
    }

    const good = kind === "survie" ? score >= 10 : pct >= 80;
    if (good || (ch && metric > ch.score)) setTimeout(confetti, 300);

    const [title, msg] =
      kind === "survie"
        ? score >= 25 ? ["Immortel ! 🛡️", "Personne ne t'arrête."]
        : score >= 10 ? ["Survivant ! ❤️", "Belle résistance, tu connais bien le chapitre."]
        : ["Game over 💀", "Relis le cours et retente ta chance."]
        : pct === 100 ? ["Parfait ! 🏆", "Tu maîtrises ce chapitre. Aide tes camarades !"]
        : pct >= 80 ? ["Excellent ! 🎉", "Encore quelques détails et c'est parfait."]
        : pct >= 60 ? ["Bien joué 👍", "Revois les erreurs ci-dessous et réessaie."]
        : pct >= 40 ? ["Pas mal, continue 💪", "Relis les parties du cours où tu as hésité."]
        : ["On s'accroche 📖", "Relis le chapitre puis refais le quiz, tu vas progresser."];

    const C = 2 * Math.PI * 70;
    const fill = kind === "survie" ? Math.min(score / 25, 1) : pct / 100;
    const newBadges = allBadges().filter((b) => state.newBadges.includes(b.id));

    app.innerHTML = `
      <section class="card result fade-in">
        <span class="pill">${kind === "terminal" ? "💻 Mode Terminal" : kind === "survie" ? "❤️ Survie" : "🎯 Quiz"}</span>
        <div class="ring">
          <svg width="170" height="170" viewBox="0 0 170 170">
            <defs><linearGradient id="grad" x1="0" x2="1"><stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs>
            <circle class="track" cx="85" cy="85" r="70" fill="none" stroke-width="14"/>
            <circle class="val" cx="85" cy="85" r="70" fill="none" stroke-width="14" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
          </svg>
          <div class="pct">${kind === "survie" ? score : pct + "%"}</div>
        </div>
        <h2>${title}</h2>
        <p>${msg}${isRecord ? " <br><b>🎖️ Nouveau record !</b>" : ""}</p>

        ${duel}

        <div class="stats-row">
          <div class="stat"><b>${score}/${total}</b><span>${kind === "terminal" ? "missions réussies" : "bonnes réponses"}</span></div>
          <div class="stat"><b>🔥 ${state.bestStreak}</b><span>meilleure série</span></div>
          <div class="stat"><b>${fmtTime(time)}</b><span>temps</span></div>
          <div class="stat"><b>⭐ ${state.xpGained}</b><span>XP gagnés</span></div>
        </div>

        ${newBadges.length ? `
          <div class="new-badges">
            ${newBadges.map((b) => `<span class="nb">${b.icon} ${esc(b.name)}</span>`).join("")}
          </div>` : ""}

        <div class="result-actions">
          ${wrong.length && kind !== "survie" ? `<button class="btn primary" id="retryWrong">🔁 Refaire mes ${wrong.length} erreur${wrong.length > 1 ? "s" : ""}</button>` : ""}
          <button class="btn ${wrong.length && kind !== "survie" ? "" : "primary"}" id="defiBtn">⚔️ Défier un ami</button>
          <button class="btn" id="again">Accueil</button>
        </div>
        <div id="defiBox"></div>

        ${wrong.length ? `
          <div class="review">
            <h3>À revoir</h3>
            ${wrong.map((a) => `
              <div class="rev-item">
                <div class="rq">${esc(a.q)}</div>
                <div class="ra bad">✗ Ta réponse : ${a.cmd ? `<code>${esc(a.yours)}</code>` : esc(a.yours)}</div>
                <div class="ra good">✓ Bonne réponse : ${a.cmd ? `<code>${esc(a.right)}</code>` : esc(a.right)}</div>
                <div class="re">${esc(a.e)}</div>
              </div>`).join("")}
          </div>` : ""}
      </section>
    `;

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const v = app.querySelector(".ring .val");
        if (v) v.style.strokeDashoffset = C * (1 - fill);
      })
    );

    const retry = document.getElementById("retryWrong");
    if (retry) {
      const refs = wrong.map((a) => a.ref);
      retry.addEventListener("click", () =>
        kind === "terminal" ? startTerminal(refs) : startQuiz(shuffle(refs), { mode: "retry" })
      );
    }
    document.getElementById("again").addEventListener("click", renderHome);
    document.getElementById("defiBtn").addEventListener("click", () => openDefi(kind, metric));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openDefi(kind, metric) {
    const box = document.getElementById("defiBox");
    const build = () => {
      const payload = { v: 1, c: chapter.id, k: kind, n: profile.name, s: metric };
      if (kind !== "survie") payload.i = state.list.map((x) => x.ref);
      return `${location.origin}${location.pathname}#defi=${encode(payload)}`;
    };
    const share = async () => {
      const url = build();
      const text = `⚔️ ${profile.name} te défie sur Help Us Student ! Mode ${KIND_LABEL[kind]} — score à battre : ${scoreLabel(kind, metric)}. Tu peux faire mieux ?`;
      box.innerHTML = `
        <div class="defi-box fade-in">
          <p>Envoie ce lien à tes amis (WhatsApp, Discord…). Ils auront <b>exactement les mêmes questions</b>.</p>
          <div class="copy-row">
            <input readonly value="${esc(url)}" id="defiUrl" aria-label="Lien du défi">
            <button class="btn primary" id="copyBtn">Copier</button>
          </div>
        </div>`;
      document.getElementById("copyBtn").addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(`${text}\n${url}`); toast("✅ Lien copié !"); }
        catch (e) { const inp = document.getElementById("defiUrl"); inp.select(); document.execCommand("copy"); toast("✅ Lien copié !"); }
      });
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        try { await navigator.share({ title: "Help Us Student", text, url }); } catch (e) {}
      }
    };

    if (profile.name) return share();
    box.innerHTML = `
      <form class="defi-box fade-in" id="nameForm">
        <p>Choisis un pseudo pour que tes amis sachent qui les défie :</p>
        <div class="copy-row">
          <input id="defiName" maxlength="20" placeholder="Ton pseudo" required aria-label="Ton pseudo">
          <button class="btn primary">Créer le défi</button>
        </div>
      </form>`;
    const inp = document.getElementById("defiName");
    inp.focus();
    document.getElementById("nameForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const n = inp.value.trim().slice(0, 20);
      if (!n) return;
      profile.name = n;
      saveProfile();
      share();
    });
  }

  // ═══════════════ Clavier (quiz) ═══════════════
  document.addEventListener("keydown", (e) => {
    if (!state || state.kind === "terminal" || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.tagName === "INPUT") return;
    const q = state.list[state.idx];
    if (!q || !document.querySelector(".opt")) return;
    const n = "123456".indexOf(e.key) + 1 || "abcdef".indexOf(e.key.toLowerCase()) + 1;
    if (n && n <= q.opts.length) answer(n - 1);
    else if (e.key === "Enter" && state.answers.length > state.idx) { e.preventDefault(); next(); }
  });

  // ═══════════════ Barre du haut ═══════════════
  document.getElementById("themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("hus-theme", root.dataset.theme); } catch (e) {}
  });

  const soundBtn = document.getElementById("soundBtn");
  const paintSound = () => {
    soundBtn.textContent = muted ? "🔇" : "🔊";
    soundBtn.setAttribute("aria-label", muted ? "Activer le son" : "Couper le son");
  };
  soundBtn.addEventListener("click", () => { muted = !muted; store.set("hus-muted", muted); paintSound(); if (!muted) sfx("good"); });
  paintSound();

  document.getElementById("homeLink").addEventListener("click", (e) => { e.preventDefault(); quit(); });
  document.getElementById("year").textContent = new Date().getFullYear();

  window.addEventListener("hashchange", () => {
    const c = readChallenge();
    if (c) { challenge = c; renderHome(); }
  });

  challenge = readChallenge();
  renderHome();
})();
