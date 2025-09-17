import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ToolsArticle from './ToolsArticle'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/tools">
    <Routes>
      <Route path="/article" element={<ToolsArticle />} />
      <Route path="*" element={<Navigate to="/article" replace />} />
    </Routes>
  </BrowserRouter>
)
