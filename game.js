/* ==========================================================
   Słówka — wordle po polsku, dla dzieci
   Słowa mają 3, 4 albo 5 liter; nad planszą widać kategorię.
   ========================================================== */
(function () {
  "use strict";

  var ROWS = 6;                        // ile prób
  var WORDS = window.WORDS || [];      // lista { slowo, kategoria }

  // Polski alfabet, po kolei — dzieciom łatwiej niż QWERTY.
  var KEY_ROWS = [
    ["A", "Ą", "B", "C", "Ć", "D", "E", "Ę"],
    ["F", "G", "H", "I", "J", "K", "L", "Ł"],
    ["M", "N", "Ń", "O", "Ó", "P", "R", "S"],
    ["Ś", "T", "U", "W", "Y", "Z", "Ź", "Ż"]
  ];
  var LETTERS = KEY_ROWS.join(",").split(",").join("");

  var mainEl   = document.querySelector("main");
  var topbar   = document.querySelector(".topbar");
  var board    = document.getElementById("board");
  var keyboard = document.getElementById("keyboard");
  var message  = document.getElementById("message");
  var hintEl   = document.getElementById("hint");
  var winsEl   = document.getElementById("wins");
  var endcard  = document.getElementById("endcard");
  var helpcard = document.getElementById("helpcard");

  var secret = "";       // szukane słowo, WIELKIMI literami
  var category = "";     // kategoria szukanego słowa
  var LEN = 5;           // długość szukanego słowa (3, 4 albo 5)
  var guess = [];        // litery wpisane w bieżącym wierszu
  var rowIndex = 0;
  var locked = true;     // blokada w czasie animacji i po końcu gry
  var tiles = [];        // tiles[wiersz][kolumna]
  var keyEls = {};       // litera -> przycisk klawiatury
  var keyState = {};     // litera -> "absent" | "present" | "correct"

  /* ---------- mała pamięć w przeglądarce ---------- */
  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  /* ---------- dopasowanie do okna ----------
     Na ekranie muszą się zmieścić naraz: 6 wierszy planszy
     i 5 rzędów klawiatury. Zamiast zgadywać w CSS, mierzymy
     realne wolne miejsce i dzielimy je między jedno i drugie.
     Dzięki temu w niskim oknie plansza nie robi się „kropkami”,
     a klawiatura nie ucieka poza ekran. */
  var KB_GAP = 6, KEY_MAX = 52, KEY_MIN = 30, TILE_MAX = 76;

  function fitBoard() {
    var doc = document.documentElement;
    var st = getComputedStyle(mainEl);
    var gap = parseFloat(st.rowGap) || 6;
    var padB = parseFloat(st.paddingBottom) || 0;
    var poziomo = st.flexDirection === "row";

    // przy długich słowach ciaśniejsze odstępy — kafelki wychodzą wtedy większe
    var tileGap = LEN > 6 ? 4 : 7;
    board.style.setProperty("--tile-gap", tileGap + "px");

    var ponizejPaska = doc.clientHeight - topbar.offsetHeight - padB;
    var naPlansze = ponizejPaska - hintEl.offsetHeight - message.offsetHeight;
    var keyH, boardH, boardW;

    if (poziomo) {
      // plansza obok klawiatury: każda ma całą wysokość dla siebie
      keyH = Math.max(KEY_MIN, Math.min(KEY_MAX,
             Math.floor((ponizejPaska - KB_GAP * 4) / 5)));
      boardW = doc.clientWidth - keyboard.offsetWidth - 40;
      boardH = naPlansze - gap * 2 - 4;
    } else {
      var wolne = Math.max(160, naPlansze - gap * 3 - 4);
      var keyChce = Math.min(KEY_MAX, Math.max(40, doc.clientWidth * 0.105));
      boardW = doc.clientWidth - 24;

      // Ile plansza naprawdę potrzebuje. Przy długim słowie kafelek ogranicza
      // szerokość, nie wysokość — plansza jest wtedy niższa, niż mogłaby być.
      var limitWys = Math.max(120, wolne - (keyChce * 5 + KB_GAP * 4));
      var kafelek = Math.floor(Math.min(
        TILE_MAX,
        (boardW - (LEN - 1) * tileGap) / LEN,
        (limitWys - 5 * tileGap) / 6
      ));
      boardH = kafelek * 6 + 5 * tileGap;

      // Czego plansza nie zużyła, dostaje klawiatura — większe klawisze
      // zamiast pustej dziury na środku ekranu.
      keyH = Math.max(KEY_MIN, Math.min(KEY_MAX,
             Math.floor((wolne - boardH - KB_GAP * 4) / 5)));
    }

    keyboard.style.setProperty("--key-h", keyH + "px");
    board.style.setProperty("--board-w", Math.max(90, boardW) + "px");
    board.style.setProperty("--board-h", Math.max(90, boardH) + "px");
  }

  /* ---------- budowa planszy i klawiatury ---------- */
  function buildBoard() {
    board.innerHTML = "";
    board.style.setProperty("--cols", LEN);
    tiles = [];

    for (var r = 0; r < ROWS; r++) {
      var row = document.createElement("div");
      row.className = "row";
      row.setAttribute("role", "row");
      var rowTiles = [];
      for (var c = 0; c < LEN; c++) {
        var t = document.createElement("div");
        t.className = "tile";
        t.setAttribute("role", "gridcell");
        row.appendChild(t);
        rowTiles.push(t);
      }
      board.appendChild(row);
      tiles.push(rowTiles);
    }
  }

  function buildKeyboard() {
    keyboard.innerHTML = "";
    keyEls = {};

    KEY_ROWS.forEach(function (letters) {
      var row = document.createElement("div");
      row.className = "krow";
      letters.forEach(function (ch) {
        var b = document.createElement("button");
        b.className = "key";
        b.type = "button";
        b.textContent = ch;
        b.setAttribute("aria-label", "Litera " + ch);
        b.addEventListener("click", function () { typeLetter(ch); });
        row.appendChild(b);
        keyEls[ch] = b;
      });
      keyboard.appendChild(row);
    });

    var last = document.createElement("div");
    last.className = "krow";

    var del = document.createElement("button");
    del.className = "key key-wide key-del";
    del.type = "button";
    del.textContent = "⌫ Usuń";
    del.setAttribute("aria-label", "Usuń literę");
    del.addEventListener("click", backspace);

    var enter = document.createElement("button");
    enter.className = "key key-wide key-enter";
    enter.type = "button";
    enter.textContent = "Sprawdź ✓";
    enter.setAttribute("aria-label", "Sprawdź słowo");
    enter.addEventListener("click", submit);

    last.appendChild(del);
    last.appendChild(enter);
    keyboard.appendChild(last);
  }

  /* ---------- start gry ---------- */
  function pickWord() {
    var recent = load("slowka.recent", []);
    if (!Array.isArray(recent)) recent = [];

    var pool = WORDS.filter(function (w) { return recent.indexOf(w.slowo) === -1; });
    if (pool.length === 0) {
      pool = WORDS.slice();
      recent = [];
    }

    var wybrane = pool[Math.floor(Math.random() * pool.length)];
    recent.push(wybrane.slowo);
    // pamiętamy ostatnią połowę listy, żeby słowa szybko się nie powtarzały
    while (recent.length > Math.floor(WORDS.length / 2)) recent.shift();
    save("slowka.recent", recent);

    return wybrane;
  }

  function newGame() {
    var wybrane = pickWord();
    secret = wybrane.slowo.toUpperCase();
    category = wybrane.kategoria;
    LEN = secret.length;

    guess = [];
    rowIndex = 0;
    locked = false;
    keyState = {};

    buildBoard();
    Object.keys(keyEls).forEach(function (ch) { keyEls[ch].className = "key"; });

    hintEl.textContent = category;
    say("");
    endcard.hidden = true;
    fitBoard();
  }

  /* ---------- wpisywanie ---------- */
  function say(text) { message.textContent = text; }

  // polska odmiana po liczbie: 1 literkę / 2 literki / 5 literek
  function odmiana(n, jeden, dwa, piec) {
    if (n === 1) return jeden;
    var d = n % 10, s = n % 100;
    if (d >= 2 && d <= 4 && !(s >= 12 && s <= 14)) return dwa;
    return piec;
  }

  function typeLetter(ch) {
    if (locked || guess.length >= LEN) return;
    guess.push(ch);
    var t = tiles[rowIndex][guess.length - 1];
    t.textContent = ch;
    t.classList.add("filled");
    say("");
  }

  function backspace() {
    if (locked || guess.length === 0) return;
    var t = tiles[rowIndex][guess.length - 1];
    t.textContent = "";
    t.classList.remove("filled");
    guess.pop();
    say("");
  }

  function submit() {
    if (locked) return;
    if (guess.length < LEN) {
      var brakuje = LEN - guess.length;
      shakeRow();
      say("Wpisz jeszcze " + brakuje + " " +
          odmiana(brakuje, "literkę", "literki", "literek") + "!");
      return;
    }
    reveal(guess.join(""));
  }

  function shakeRow() {
    var row = board.children[rowIndex];
    row.classList.remove("shake");
    void row.offsetWidth;          // restart animacji
    row.classList.add("shake");
  }

  /* ---------- ocena słowa ---------- */
  function score(word, target) {
    var result = [];
    var left = {};
    var i, ch;

    for (i = 0; i < LEN; i++) result.push("absent");

    for (i = 0; i < LEN; i++) {
      ch = target[i];
      left[ch] = (left[ch] || 0) + 1;
    }
    for (i = 0; i < LEN; i++) {
      if (word[i] === target[i]) {
        result[i] = "correct";
        left[word[i]]--;
      }
    }
    for (i = 0; i < LEN; i++) {
      if (result[i] === "correct") continue;
      ch = word[i];
      if (left[ch] > 0) {
        result[i] = "present";
        left[ch]--;
      }
    }
    return result;
  }

  function reveal(word) {
    locked = true;
    var result = score(word, secret);
    var row = rowIndex;

    result.forEach(function (state, i) {
      var t = tiles[row][i];
      setTimeout(function () {
        t.classList.add("flip");
        setTimeout(function () { t.classList.add("tile-" + state); }, 220);
        paintKey(word[i], state);
      }, i * 260);
    });

    setTimeout(function () { finishRow(word); }, LEN * 260 + 260);
  }

  function paintKey(ch, state) {
    var rank = { absent: 1, present: 2, correct: 3 };
    var current = keyState[ch];
    if (current && rank[current] >= rank[state]) return;
    keyState[ch] = state;
    if (keyEls[ch]) keyEls[ch].className = "key " + state;
  }

  function finishRow(word) {
    if (word === secret) {
      win();
      return;
    }

    rowIndex++;
    guess = [];

    if (rowIndex >= ROWS) {
      lose();
      return;
    }

    locked = false;
    var zostalo = ROWS - rowIndex;
    say(zostalo === 1
      ? "Ostatnia próba!"
      : "Jeszcze " + zostalo + " " + odmiana(zostalo, "próba", "próby", "prób"));
  }

  /* ---------- koniec gry ---------- */
  function win() {
    tiles[rowIndex].forEach(function (t, i) {
      setTimeout(function () { t.classList.add("jump"); }, i * 110);
    });

    var wins = load("slowka.wins", 0) + 1;
    save("slowka.wins", wins);
    winsEl.textContent = wins;

    confetti();

    var praise = ["Brawo!", "Super!", "Świetnie!", "Ekstra!", "Wspaniale!"];
    var proby = rowIndex + 1;
    showEnd(
      "🎉",
      praise[Math.floor(Math.random() * praise.length)],
      proby === 1 ? "Udało się za pierwszym razem!" : "Udało się w " + proby + " próbach!",
      900,
      secret
    );
  }

  function lose() {
    showEnd("🙂", "Nie szkodzi!", "Szukane słowo to:", 600, secret);
  }

  function showEnd(emoji, title, text, delay, solution) {
    setTimeout(function () {
      document.getElementById("end-emoji").textContent = emoji;
      document.getElementById("end-title").textContent = title;

      var box = document.getElementById("end-text");
      box.textContent = text;

      var span = document.createElement("span");
      span.className = "solution";
      span.textContent = solution;
      box.appendChild(document.createElement("br"));
      box.appendChild(span);

      endcard.hidden = false;
      document.getElementById("again-btn").focus();
    }, delay);
  }

  function confetti() {
    var colors = ["#58cc02", "#ffc800", "#ff6b6b", "#4dabf7", "#c77dff", "#ff9f43"];
    for (var i = 0; i < 60; i++) {
      var p = document.createElement("div");
      p.className = "confetti";
      p.style.left = (Math.random() * 100) + "vw";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
      p.style.animationDelay = (Math.random() * 0.5) + "s";
      document.body.appendChild(p);
      window.setTimeout(removeEl(p), 3600);
    }
  }

  function removeEl(el) {
    return function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }

  /* ---------- klawiatura fizyczna ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey) return;

    // gdy otwarty jest panel, Enter / spacja / Escape go zamyka
    if (!endcard.hidden || !helpcard.hidden) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        if (!helpcard.hidden) helpcard.hidden = true;
        else newGame();
      }
      return;
    }

    if (e.key === "Enter") { e.preventDefault(); submit(); return; }
    if (e.key === "Backspace") { e.preventDefault(); backspace(); return; }

    var ch = e.key.toUpperCase();
    if (ch.length === 1 && LETTERS.indexOf(ch) !== -1) {
      e.preventDefault();
      typeLetter(ch);
    }
  });

  /* ---------- przyciski ---------- */
  document.getElementById("again-btn").addEventListener("click", newGame);

  document.getElementById("help-btn").addEventListener("click", function () {
    helpcard.hidden = false;
    document.getElementById("help-close").focus();
  });

  document.getElementById("help-close").addEventListener("click", function () {
    helpcard.hidden = true;
  });

  window.addEventListener("resize", fitBoard);
  window.addEventListener("orientationchange", fitBoard);

  /* ---------- start ---------- */
  winsEl.textContent = load("slowka.wins", 0);
  buildKeyboard();

  if (WORDS.length === 0) {
    buildBoard();
    say("Brak słów w pliku words.js!");
  } else {
    newGame();
  }

  fitBoard();
})();
