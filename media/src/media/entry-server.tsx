import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'
import App from '../App'
import ArticlePage from '../pages/ArticlePage'
import PageList from '../pages/PageList'
import LatestPage from '../pages/LatestPage'
import FeaturedPage from '../pages/FeaturedPage'
import SpecialPage from '../pages/SpecialPage'
import CategoriesPage from '../pages/CategoriesPage'
import CategoryPage from '../pages/CategoryPage'
import PrivacyPage from '../pages/PrivacyPage'
import TermsPage from '../pages/TermsPage'
import AdsPage from '../pages/AdsPage'

export function render(url: string) {
  // Note: In a real app, you'd need to handle data fetching for the components
  // being rendered. For now, the components fetch their own data from JSON.
  const html = renderToString(
    <StaticRouter location={url} basename="/media">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/page/:page" element={<PageList />} />
        <Route path="/latest" element={<LatestPage />} />
        <Route path="/featured" element={<FeaturedPage />} />
        <Route path="/special" element={<SpecialPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/ads" element={<AdsPage />} />
      </Routes>
    </StaticRouter>
  )
  return { html }
}
