import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    let rafId: number | null = null;
    const last = { x: 0, y: 0 };

    const schedule = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(() => {
        setMousePosition(last);
        rafId = null;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      last.x = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 0.5;
      last.y = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 0.5;
      schedule();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const letterVariants = {
    initial: { 
      opacity: 0, 
      y: 60,
      rotateX: -15,
    },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white pt-20">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
          transition: 'transform 0.6s ease-out',
        }}
      />

      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center max-w-7xl mx-auto px-6"
        style={{ y }}
      >
        {/* Main title */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          {/* AI text */}
          <div className="flex items-center justify-center mb-6 relative">
            {['A', 'I'].map((letter, i) => (
              <motion.span
                key={`ai-${i}`}
                variants={letterVariants}
                custom={i}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="text-9xl md:text-[12rem] lg:text-[16rem] xl:text-[18rem] leading-none font-black text-black cursor-pointer relative"
                style={{
                  textShadow: `${mousePosition.x * 3}px ${mousePosition.y * 3}px 0px rgba(255,0,0,0.1)`,
                  transform: `translateX(${mousePosition.x * 8}px) translateY(${mousePosition.y * 8}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          
          {/* Elegant line separator */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="h-0.5 bg-red-500 mx-auto mb-6 origin-center relative"
          />
          
          {/* MARKETING text */}
          <div className="flex items-center justify-center flex-wrap">
            {['M', 'A', 'R', 'K', 'E', 'T', 'I', 'N', 'G'].map((letter, i) => (
              <motion.span
                key={`marketing-${i}`}
                variants={letterVariants}
                custom={i + 2}
                whileHover={{
                  y: -4,
                  color: '#ff0000',
                  transition: { duration: 0.2 }
                }}
                className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-none font-light text-black tracking-[0.15em] cursor-pointer"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-16 max-w-3xl mx-auto font-light tracking-wide leading-relaxed"
        >
          マーケティングの課題を、AIで解決し確かな成果に。
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <a href="#contact" aria-label="無料相談へ"
             className="px-6 py-3 bg-black text-white font-bold tracking-wide hover:bg-red-500 transition-colors">
            無料相談
          </a>
          <a href="#media" aria-label="事例・最新情報を見る"
             className="px-6 py-3 border border-black text-black font-bold tracking-wide hover:bg-black hover:text-white transition-colors">
            事例を見る
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.6, delay: 1.55 }}
          className="text-sm md:text-base text-gray-500 mb-12"
        >
          導入50社以上・年間記事制作1200本・平均CPA<span className="mx-1">32%</span>改善
        </motion.p>
      </motion.div>

      {/* Minimalist corner elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="absolute top-8 left-8 w-6 h-6 border-l border-t border-black"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 2.0 }}
        className="absolute top-8 right-8 w-6 h-6 border-r border-t border-black"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 2.2 }}
        className="absolute bottom-8 left-8 w-6 h-6 border-l border-b border-black"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 2.4 }}
        className="absolute bottom-8 right-8 w-6 h-6 border-r border-b border-red-500"
      />

      {/* Subtle ambient light */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.03) 0%, transparent 70%)',
          transform: `translate(-50%, -50%) translateX(${mousePosition.x * 100}px) translateY(${mousePosition.y * 100}px)`,
          transition: 'transform 0.8s ease-out',
        }}
      />
    </section>
  );
}
