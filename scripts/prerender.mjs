import { createServer } from 'vite'
import fs from 'fs'
import path from 'path'

// 必要な公開ルートだけ
const routes = ['/', '/about', '/service', '/contact']

// ViteのSSRローダを使う（ビルドは package.json 側で先に実施）
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

// dist の index.html をテンプレに使う
const outDir = 'dist'
const templatePath = path.join(outDir, 'index.html')
// テンプレートが意図せず2重に連結された場合でも、最初の1ドキュメントのみを使う
function normalizeTemplate(html) {
  const s = String(html || '')
  const lc = s.toLowerCase()
  const dt = lc.indexOf('<!doctype html')
  if (dt >= 0) {
    const after = s.slice(dt)
    const end = after.toLowerCase().indexOf('</html>')
    if (end >= 0) return after.slice(0, end + '</html>'.length)
    return after
  }
  const end = lc.indexOf('</html>')
  if (end >= 0) return s.slice(0, end + '</html>'.length)
  return s
}
const template = normalizeTemplate(fs.readFileSync(templatePath, 'utf-8'))

// 各ルートを静的HTML化
for (const route of routes) {
  const { html } = await render(route)
  // body 全体を差し替え、重複や残骸を回避
  const outHtml = template.replace(/<body[^>]*>[\s\S]*?<\/body>/i, `<body><div id=\"root\">${html}</div></body>`)
  const file = route === '/' ? `${outDir}/index.html` : `${outDir}${route}/index.html`
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, outHtml)
}

await vite.close()
console.log('Prerendered:', routes)
