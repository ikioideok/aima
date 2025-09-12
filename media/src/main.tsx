import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import App from "./App.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import PageList from "./pages/PageList.tsx";
import LatestPage from "./pages/LatestPage.tsx";
import FeaturedPage from "./pages/FeaturedPage.tsx";
import SpecialPage from "./pages/SpecialPage.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import AdsPage from "./pages/AdsPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import ResourcesPage from "./pages/ResourcesPage.tsx";
import SubscribePage from "./pages/SubscribePage.tsx";
import ConsultPage from "./pages/ConsultPage.tsx";
import SeoChecklistPage from "./pages/SeoChecklistPage.tsx";
import Admin from "./pages/Admin.tsx";
import ToolsArticle from "./pages/ToolsArticle.tsx";
import "./styles/globals.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Ensure navigating to a new route resets scroll to top
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/media">
    <ScrollToTop />
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
      <Route path="/search" element={<SearchPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/seo-checklist" element={<SeoChecklistPage />} />
      <Route path="/subscribe" element={<SubscribePage />} />
      <Route path="/consult" element={<ConsultPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/tools/article" element={<ToolsArticle />} />
    </Routes>
  </BrowserRouter>
);
