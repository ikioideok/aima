import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import App from "./App.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import Admin from "./pages/Admin.tsx";
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
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </BrowserRouter>
);
