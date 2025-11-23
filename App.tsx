import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { MediaTop } from './pages/MediaTop';
import { MediaArticle } from './pages/MediaArticle';
import { MediaAdmin } from './pages/MediaAdmin';
import { ServiceSeoLlmo } from './pages/ServiceSeoLlmo';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/media" element={<MediaTop />} />
          <Route path="/media/admin" element={<MediaAdmin />} />
          <Route path="/media/:id" element={<MediaArticle />} />
          <Route path="/service/seo-llmo" element={<ServiceSeoLlmo />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;