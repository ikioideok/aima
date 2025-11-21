import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let isVisible = false;

    const moveCursor = (e: MouseEvent) => {
      // 最初の移動でカーソルを表示
      if (!isVisible) {
        cursor.style.opacity = '1';
        isVisible = true;
      }

      // Directly manipulating DOM for performance to avoid React render cycle lag
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a, button, .hover-trigger');
      
      // Note: Since we are using mix-blend-difference with bg-white:
      // On white bg -> becomes black
      // On black bg -> becomes white
      if (isHoverable) {
        cursor.classList.add('w-[60px]', 'h-[60px]');
        cursor.classList.remove('w-3', 'h-3');
        // Hover時は少し透過させて背景を見せる
        cursor.style.opacity = '0.5';
      } else {
        cursor.classList.remove('w-[60px]', 'h-[60px]');
        cursor.classList.add('w-3', 'h-3');
        // 通常時は不透明
        cursor.style.opacity = '1';
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{ opacity: 0 }} // Initial state hidden
      className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-300 mix-blend-difference hidden md:block"
    />
  );
};