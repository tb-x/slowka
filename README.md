# Słówka — a Wordle clone for Polish kids

A tiny, dependency-free word game in Polish, made for young children (~5 years old).
Guess a 3-, 4- or 5-letter Polish word in 6 tries, with the word's category shown as a hint.
Pure static HTML/CSS/JS — no backend, no build step.

## What's inside

| File | What it does |
| --- | --- |
| `index.html` | The page |
| `styles.css` | All the styling |
| `game.js` | Game logic |
| `words.js` | **The word list**, grouped by category — edit this to add your own words |
| `manifest.webmanifest`, `icon.svg`, `icon-*.png` | The Home Screen name and icon |
| `sw.js` | Keeps a copy of the game so it works offline |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Design choices for young kids

- **The category is always on screen** — 276 words across 10 categories: 🐾 Zwierzę,
  🍎 Jedzenie, 🏠 W domu, 🌳 Przyroda, 🧸 Zabawka, 🚗 Pojazd, 🏙️ Miejsce,
  🧍 Ciało człowieka, 👪 Rodzina, 🌈 Kolor. It turns a guessing game into something a
  preschooler can actually reason about.
- **Words are 3, 4 or 5 letters** — never longer, so the board stays big and readable on a
  phone. The board adapts to the word's length, and shorter words get bigger tiles.
  This cap is why 🌈 Kolor is the smallest category: almost every Polish colour name is six
  letters or more (`czarny`, `zielony`, `czerwony`, `niebieski`), so only six fit.
- **A plain, wide font** (Verdana / Tahoma) rather than a decorative or handwriting-style one —
  simple unornamented letterforms are what a child learning to read can decode fastest, and both
  fonts ship with every desktop OS and cover the Polish diacritics.
- **Alphabetical keyboard**, not QWERTY — a 5-year-old knows the alphabet, not the keyboard layout.
- **All 32 Polish letters** are on the keyboard (`a ą b c ć d e ę f g h i j k l ł m n ń o ó
  p r s ś t u w y z ź ż`), and every one of them appears in at least one answer.
- **Letters with diacritics count as separate letters**, exactly like in Polish. `Ó` will not
  light up green for `O`. This is how Polish Wordle normally works and it teaches the difference.
- **Any guess of the right length is accepted.** There's no dictionary check, so a child never
  gets "that's not a word" — a wrong guess just gets coloured feedback.
- **Every word is a plain base form** a preschooler knows — no diminutives ("koza", never
  "kózka"), and nothing ambiguous whose category would mislead.
- A word won't repeat until roughly half the list has been played.
- **🏠 in the top-left corner** goes back to the list of all games.
- Trophy counter in the corner, confetti on a win, and a friendly "Nie szkodzi!" on a loss
  that reveals the answer.
- **No double-tap zoom.** `touch-action: manipulation` stops the phone from zooming in when a
  child taps ⌫ several times quickly. Pinch-to-zoom still works.
- **The layout always fits the screen.** `fitBoard()` in `game.js` measures the real free space
  and sizes the tiles and keys to it, so nothing is ever cut off or squashed into dots. On a
  wide, short window (a tablet held sideways) the keyboard moves next to the board.

## Adding or changing words

Open `words.js` and edit the categories. Every word must be lowercase and **3, 4 or 5
letters**, in a base form a five-year-old knows, and it must obviously belong to its category:

```js
window.SLOWA = {
  "🐾 Zwierzę": ["kot", "pies", "krowa"],
  "🍎 Jedzenie": ["sok", "zupa", "mleko"]
};
```

Adding a whole new category is one more line in the same shape. There's a safety filter at the
bottom of the file that silently drops anything outside 3-5 letters or duplicated, so a typo
can never break the game — the word just won't show up.

## Play offline (add to Home Screen)

On iPhone or iPad, open the game in Safari, tap **Share → Add to Home Screen**, then open it once from the new icon while online. After that it starts full screen and works without internet. Changes arrive on their own: the next online launch downloads them and the one after shows them.

(How: `manifest.webmanifest` gives the icon and full-screen mode; `sw.js`, a service worker, keeps a copy of every file the game uses, including the word list. The icons `icon-180.png` and `icon-512.png` are rendered from `icon.svg` in headless Chrome.)

## Deploying to GitHub Pages

Create an empty repository on GitHub first (no README, no .gitignore), then from this folder:

```bash
git init -b main && git add . && git commit -m "Słówka: wordle po polsku dla dzieci"
```

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git && git push -u origin main
```

Then in the repository on GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, pick branch `main` and folder `/ (root)`, and click Save.

After a minute the game is live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

Every later `git push` to `main` republishes it automatically.

## Running it locally

Just open `index.html` in a browser — it plays fine straight from disk, though some browsers
block `localStorage` on `file://` URLs, so the trophy counter won't persist. To get the full
behaviour, serve the folder:

```bash
python -m http.server 5201
```
