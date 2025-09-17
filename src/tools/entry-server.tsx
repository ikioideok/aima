import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'
import ToolsArticle from './ToolsArticle'

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url} basename="/tools">
      <Routes>
        <Route path="/article" element={<ToolsArticle />} />
      </Routes>
    </StaticRouter>
  )

  return { html }
}
