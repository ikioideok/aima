import { createServer } from 'vite'
import fs from 'fs'
import path from 'path'

// 必要な公開ルートだけ
const routes = ['/', '/about', '/service', '/contact']

// ViteのSSRローダを使う（ビルドは package.json 側で先に実施）
const vite = await createServer({ server: { middlewareMode: true, hmr: false } })
const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

// dist の index.html をテンプレに使う
const outDir = 'dist'
const templatePath = path.join(outDir, 'index.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// 各ルートを静的HTML化
for (const route of routes) {
  const { html } = await render(route)
  const outHtml = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const file = route === '/' ? `${outDir}/index.html` : `${outDir}${route}/index.html`
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, outHtml)
}

await vite.close()
console.log('Prerendered:', routes)
