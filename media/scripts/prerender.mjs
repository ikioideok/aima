import { createServer } from 'vite'
import fs from 'fs'
import path from 'path'

// Build routes: '/' and all article detail pages
function collectArticleRoutes() {
  const dataDir = path.resolve('src/data')
  const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(dataDir, p), 'utf-8'))

  const featured = readJSON('featuredArticle.json')
  const recent = readJSON('recentArticles.json')
  const special = readJSON('specialArticles.json')
  const dummy = fs.existsSync(path.join(dataDir, 'dummyArticle.json'))
    ? readJSON('dummyArticle.json')
    : null

  const slugs = new Set()
  if (featured?.slug) slugs.add(featured.slug)
  for (const a of recent || []) if (a?.slug) slugs.add(a.slug)
  for (const a of special || []) if (a?.slug) slugs.add(a.slug)
  if (dummy?.slug) slugs.add(dummy.slug)

  const articleRoutes = Array.from(slugs).map((slug) => `/media/articles/${slug}`)
  return ['/media/', ...articleRoutes]
}

// Use Vite's SSR loader
const vite = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true, hmr: false },
  appType: 'custom'
})

// The entry is under src/media/entry-server.tsx
const { render } = await vite.ssrLoadModule('/src/media/entry-server.tsx')

// dist output path from media/vite.config.ts
const outDir = path.resolve('../dist/media')
const templatePath = path.join(outDir, 'index.html')
const template = fs.readFileSync(templatePath, 'utf-8')

const routes = collectArticleRoutes()

for (const url of routes) {
  const { html } = await render(url)
  const outHtml = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`) 
  const rel = url.replace(/^\/media\/?/, '') // '' or 'articles/slug'
  const file = rel === '' ? path.join(outDir, 'index.html') : path.join(outDir, rel, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, outHtml)
}

await vite.close()
console.log('Prerendered routes:', routes)

