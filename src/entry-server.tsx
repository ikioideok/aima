import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render(url: string) {
  // ルーティングしている場合は StaticRouter 等をここで包む
  const html = renderToString(<App />)
  return { html, head: { title: 'AIMA｜AIマーケティング支援' } }
}
