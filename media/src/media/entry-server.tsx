import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'
import App from '../App'
import ArticlePage from '../pages/ArticlePage'

export function render(url: string) {
  // Note: In a real app, you'd need to handle data fetching for the components
  // being rendered. For now, the components fetch their own data from JSON.
  const html = renderToString(
    <StaticRouter location={url}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
      </Routes>
    </StaticRouter>
  )
  return { html }
}
