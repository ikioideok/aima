import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url} basename="/jinzai">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </StaticRouter>
  )
  return { html }
}
