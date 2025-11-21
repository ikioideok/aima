import React, { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children?: React.ReactNode;
  delay?: number; // delay in ms
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const transitionStyle = {
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      style={transitionStyle}
      className={`transform transition-all duration-[1500ms] ease-ink ${
        isVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-[4px] translate-y-[20px]'
      } ${className}`}
    >
      {children}
    </div>
  );
};