# Agent Guide (Media app)

This `media/` directory contains the media site (mounted at `/media`) and also the `jinzai` tenant (mounted at `/jinzai`).

## Where things are
- Pages (React): `src/pages/*.tsx`
  - `ArticlePage.tsx`: article rendering, TOC, CTA injection, and long-paragraph formatting (double `<br>` ~150 chars).
  - `ResourcesPage.tsx`, `SubscribePage.tsx`, `ConsultPage.tsx`, `SeoChecklistPage.tsx`.
- Data JSON: `src/data/*.json`
  - Articles: `recentArticles.json`, `featuredArticle.json`, `specialArticles.json`.
  - CTA config: `cta.json` (inline + bottom CTAs)
  - Newsletter config: `newsletter.json` (Google Forms or mailto)
  - Consult config: `consult.json` (mailto or scheduler URL)
- SSR/Prerender
  - `/media` SSR entry: `src/media/entry-server.tsx`
  - `/jinzai` SSR entry: `src/jinzai/entry-server.tsx`
  - Prerender and head/meta tweaks are driven by repo-root `scripts/prerender.mjs`.

## Build
- In `media/`:
  - `npm ci`
  - `npm run build && npm run postbuild` → writes to `../dist/media/` and `../dist/jinzai/`

## Deploy
- CI workflows at repo root handle build + SFTP deploy to Sakura.
- `SAKURA_REMOTE_DIR` should point to `/…/www/public_html/media/` (workflows also deploy to the sibling `/www/` docroot for safety).

## Quick pointers for common tasks
- Change inline CTA copy/URL: edit `src/data/cta.json` (inline section). The inline CTA is injected near the article midpoint.
- Adjust paragraph formatting: search `// Insert double line breaks` in `src/pages/ArticlePage.tsx` and tweak `LIMIT`.
- Add a new resource/LP: add a page in `src/pages/` and wire it in `src/main.tsx` and `src/media/entry-server.tsx`.

