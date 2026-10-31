# DeutschPath — German Learning Space

A responsive German-learning hub that brings four existing projects together in one place. Every learning page now shares a consistent dark theme, a responsive site-wide header with links to all 24 learning pages, and a footer credit for Md Khorshed Alom.

## Included learning spaces

1. **German foundations** — alphabet, numbers, time, phrases, grammar, articles, prepositions, sentence building, verbs and exercises (`german/`).
2. **A1 speaking lab** — speaking practice, exam task practice and a prompt-card generator (`German_a1_speaking/`).
3. **A1 vocabulary studio** — German-English glossary, pronunciation, flashcards, quizzes and favourites (`german_glossar/`).
4. **Guided story reader** — line-by-line reading, translations, pronunciation and grammar support (`german_stories/`).

## Run locally

Some of the original learning tools load their JSON data using `fetch()`. Open the site through a local web server instead of double-clicking `index.html`.

With Python installed, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy free

This is a static website and can be hosted on GitHub Pages, Netlify or Cloudflare Pages. Upload the contents of this folder (including all project folders and `assets/`) without changing the relative folder structure. The homepage is `index.html`.

## Notes

- The main `index.html` is the new DeutschPath home page.
- Original project pages and supporting files are preserved in their original folders.
- The original tools may load Bootstrap and Google Fonts from CDNs, and some browser speech features depend on browser support and microphone permission.
- Update the shared navigation, creator credit or global styling in `assets/portfolio-shell.js` and `assets/portfolio-theme.css`.
