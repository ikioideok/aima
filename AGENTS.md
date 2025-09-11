# Agent Guide (Repo-wide)

This repository contains the corporate root site and a media site (with a sub-tenant "jinzai") in a single repo. This guide summarizes structure, key files, and how to build/deploy so you can analyze and modify quickly.

## Structure
- Root (corporate site)
  - Source under `src/` (root app)
  - Build: outputs to `dist/`
  - Prerender/head-tweaks logic: `scripts/prerender.mjs`
- Media site (this is a separate Vite app under `media/`)
  - Source under `media/src/`
  - Build: outputs to `dist/media/`
  - SSR entry: `media/src/media/entry-server.tsx`
  - Prerender/head: handled by root `scripts/prerender.mjs` (reads media data, renders `/media/...` routes into `dist/media/`)
  - Data JSON (articles/settings): `media/src/data/*.json`
  - Pages: `media/src/pages/*.tsx` (e.g., ArticlePage, ResourcesPage, etc.)
  - CTA/Newsletter/Consult config: `media/src/data/cta.json`, `media/src/data/newsletter.json`, `media/src/data/consult.json`
- Jinzai tenant (static pages under `/jinzai`)
  - SSR entry: `media/src/jinzai/entry-server.tsx`
  - Prerendered to `dist/jinzai/`
  - `.htaccess` is generated into `dist/jinzai/.htaccess` to disable inherited rewrites

## Key Files (media app)
- `media/src/pages/ArticlePage.tsx`
  - Renders articles, builds TOC, injects inline CTA mid-article, and formats long paragraphs (double `<br>` around ~150 chars for readability).
- `media/src/media/entry-server.tsx`
  - SSR entry for `/media` routes during prerender.
- `media/scripts/prerender.mjs` (actually lives at `scripts/prerender.mjs` in repo root)
  - Collects article data from `media/src/data`, renders `/media` and `/jinzai` routes, and writes static HTML into `dist/media` and `dist/jinzai`.
- Data files
  - `media/src/data/recentArticles.json`, `featuredArticle.json`, `specialArticles.json`, etc.
  - CTA config: `media/src/data/cta.json`
  - Newsletter config: `media/src/data/newsletter.json`
  - Consult config: `media/src/data/consult.json`

## Build & Run
- Root build (+ media):
  - `npm ci`
  - `npm run build` (builds root, then media via `postbuild`, then prerenders into `dist/`, `dist/media/`, `dist/jinzai/`)
- Media only (from `media/` folder):
  - `npm ci`
  - `npm run build && npm run postbuild`

## Deploy (CI)
Workflows under `.github/workflows/`:
- `deploy-on-pages.yml`: After GitHub Pages build, builds media and deploys `/media` and `/jinzai` via SFTP to Sakura.
- `deploy-manual.yml`: Manually trigger build + deploy to Sakura.
- `auto-generate-and-deploy.yml`: Scheduled/Manual. Generates an article from `keywordPlans.json` using Gemini, commits JSON, builds, and deploys.

Secrets used (in GitHub → Settings → Secrets and variables → Actions):
- Media generation: `GEMINI_API_KEY` (required), `GEMINI_API_BASE` (optional)
- Deploy (Sakura): `SAKURA_HOST`, `SAKURA_USER`, `SAKURA_PASSWORD`, `SAKURA_REMOTE_DIR` (e.g., `/home/…/www/public_html/media/`)
- Build env: `VITE_CMS_API_BASE`, `VITE_ADMIN_TOKEN`

## Tips for Agents
- Articles aggregation and prerender happen in `scripts/prerender.mjs`. If pages don’t reflect changes, check CI deploy and that `dist/media`/`dist/jinzai` are updated.
- Mid-article CTA and paragraph formatting logic live in `media/src/pages/ArticlePage.tsx` (search for `data-cta="inline"` and comment blocks around breaks).
- Jinzai uses its own SSR entry and `.htaccess` in `dist/jinzai` to avoid `/media` rewrites.
- CI derives docroot from `SAKURA_REMOTE_DIR`; recent workflows deploy to both `/www/` and `/www/public_html/` to avoid mismatches.

## Conventions
- Keep changes minimal and localized to the app (root vs media vs jinzai).
- Data-driven configs under `media/src/data/*.json` for CTAs and signup.
- Do not add global rewrites; tenant rewrites are disabled for `/jinzai`.

