import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
    </Routes>
  </BrowserRouter>
);
