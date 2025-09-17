import React from 'react';
import { motion } from 'motion/react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServiceSection } from './components/ServiceSection';
import { MediaSection } from './components/MediaSection';
import { ContactSection } from './components/ContactSection';
import { PlaygroundSection } from './components/PlaygroundSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Global Performance Optimizations */}
      <style>{`
        * {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -ms-backface-visibility: hidden;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hardware acceleration for animations */
        .motion-element {
          transform: translateZ(0);
          will-change: transform, opacity;
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Content */}
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ServiceSection />
        <MediaSection />
        <PlaygroundSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
