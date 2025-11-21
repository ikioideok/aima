import React, { useState, useEffect } from 'react';
import { FadeIn } from './FadeIn';

// 概念的な白黒・抽象画像のリスト
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1507608869274-2c33ee0bdf5f?q=80&w=2500&auto=format&fit=crop", // Light & Shadow
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2500&auto=format&fit=crop", // Abstract Architecture
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2500&auto=format&fit=crop", // Water/Ripple
  "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=2500&auto=format&fit=crop", // Fog/Mist
];

export const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // 8秒ごとに画像を切り替え
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-white">
      
      {/* Background Slideshow: 極めて薄い不透明度で表示 */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        {BACKGROUND_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[4000ms] ease-in-out ${
              index === currentImageIndex ? 'opacity-[0.08]' : 'opacity-0'
            }`}
            >
              <img
                src={src}
                alt="抽象的な白黒の光と影"
                className="w-full h-full object-cover grayscale scale-105"
              />
            </div>
        ))}
      </div>

      {/* Vertical Main Copy */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row-reverse gap-8 md:gap-24 h-[60vh] items-center z-10">
        
        {/* Line 1: 人と、 */}
        <FadeIn delay={0}>
          <h2 className="writing-vertical text-5xl md:text-7xl font-black tracking-[0.2em] animate-float-slow">
            人と、
          </h2>
        </FadeIn>

        {/* Line 2: AIの、 (Staggered vertically) */}
        <FadeIn delay={300} className="mt-16 md:mt-32">
          <h2 className="writing-vertical text-5xl md:text-7xl font-black tracking-[0.2em] animate-float-medium">
            <span style={{ textOrientation: 'upright' }}>AI</span>の、
          </h2>
        </FadeIn>

        {/* Line 3: 合間に。 */}
        <FadeIn delay={600}>
          <h2 className="writing-vertical text-5xl md:text-7xl font-black tracking-[0.2em] animate-float-slow" style={{ animationDelay: '1.5s' }}>
            合間に。
          </h2>
        </FadeIn>

      </div>

      {/* English Subtext */}
      <div className="absolute bottom-20 right-8 md:right-20 text-right z-10">
        <FadeIn delay={1000}>
          <p className="font-eng text-xs font-light tracking-[0.2em] mb-2">BETWEEN HUMAN & AI</p>
          <p className="font-eng text-xs font-light tracking-[0.2em]">EST. 2018</p>
        </FadeIn>
      </div>
    </section>
  );
};
