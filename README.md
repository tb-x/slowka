# Słówka — a Wordle clone for Polish kids

A tiny, dependency-free word game in Polish, made for young children (~5 years old).
Guess a 5-letter word in 6 tries. Pure static HTML/CSS/JS — no backend, no build step.

## What's inside

| File | What it does |
| --- | --- |
| `index.html` | The page |
| `styles.css` | All the styling |
| `game.js` | Game logic |
| `words.js` | **The word list** — edit this to add your own words |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Design choices for young kids

- **Alphabetical keyboard**, not QWERTY — a 5-year-old knows the alphabet, not the keyboard layout.
- **All 32 Polish letters** are on the keyboard (`a ą b c ć d e ę f g h i j k l ł m n ń o ó p r s ś t u w y z ź ż`), and every one of them appears in at least one answer.
- **Letters with diacritics count as separate letters**, exactly like in Polish. `Ó` will not light up green for `O`. This is how Polish Wordle normally works and it teaches the difference.
- **Any 5-letter guess is accepted.** There's no dictionary check, so a child never gets "that's not a word" — a wrong guess just gets coloured feedback.
- 145 simple nouns a preschooler knows: animals, food, home, nature, toys.
- A word won't repeat until roughly half the list has been played.
- Trophy counter in the corner, confetti on a win, and a friendly "Nie szkodzi!" on a loss that reveals the answer.

## Adding or changing words

Open `words.js` and edit the list. Every word must be **exactly 5 letters** and lowercase:

```js
window.WORDS = [
  "kotek", "domek", "twoje",
  ...
];
```

There's a safety filter at the bottom of the file that silently drops anything that isn't 5 letters, so a typo can never break the game — but the word just won't show up.

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
python -m http.server 5173
```
