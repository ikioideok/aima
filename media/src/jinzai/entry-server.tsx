import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VacancyCostPage from './pages/VacancyCostPage'

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url} basename="/jinzai">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/vacancy-cost" element={<VacancyCostPage />} />
      </Routes>
    </StaticRouter>
  )
  return { html }
}

