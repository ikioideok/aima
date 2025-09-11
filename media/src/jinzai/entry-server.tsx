import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url} basename="/jinzai">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hiring" element={<CategoryPage kind="hiring" />} />
        <Route path="/retention" element={<CategoryPage kind="retention" />} />
        <Route path="/staffing" element={<CategoryPage kind="staffing" />} />
        <Route path="/efficiency" element={<CategoryPage kind="efficiency" />} />
        <Route path="/quality" element={<CategoryPage kind="quality" />} />
      </Routes>
    </StaticRouter>
  )
  return { html }
}
