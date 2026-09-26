# Sonny Parlin — profile site

A single-page static site. No build step, no dependencies.

## Files

- `index.html` — the page (hero, story, lineage + belt timeline, Gracie Bradenton, competition gallery, off the mat, footer)
- `style.css` — all styling ("Mat White": cream background, blue accent, Inter Tight, responsive down to phone width)
- `site.js` — live "on the mat for" counter from 2007-09-04, scroll-reveal, active nav state, and the gallery lightbox
- `img/` — web-sized photos used by the page
- `photos/` — original photos copied from `~/Desktop/me` (not referenced by the page; safe to delete or keep as source)

## Design proposals

`proposals/` holds three alternative design directions as standalone mockups (`index.html` compares them).
They reuse `../img/` and are not linked from the live site. Delete the folder once a direction is chosen.

## Preview locally

```bash
node .claude/serve.js
```

Then open http://127.0.0.1:8765. Any static server works (the folder is plain HTML).

## Deploy

The site is hosted on Vercel as project `sonny-parlin`, live at https://sonnyparlin.com (DNS at GoDaddy: A @ 76.76.21.21, CNAME www cname.vercel-dns.com). `vercel.json` redirects www to the bare domain. Fallback URL: https://sonny-parlin.vercel.app.
`.vercelignore` keeps `photos/`, `proposals/`, and `.claude/` out of the upload.

Source lives at https://github.com/sonnyparlin/sonnyparlin.com and the Vercel project is connected to it,
so every push to `main` deploys to production automatically:

```bash
git add -A && git commit -m "Describe the change" && git push
```

A manual deploy still works if ever needed: `npx vercel deploy --prod --yes`.

Any other static host works too: upload `index.html`, `style.css`, `site.js`, and `img/`.

## Editing content

Everything lives in `index.html`. Search for the section comments (`<!-- STORY -->`, `<!-- LINEAGE -->`, etc.).
The belt timeline and lineage chain are plain lists. To change the hero photo, swap `img/portrait-gi-tampa.jpg`.
