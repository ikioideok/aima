import React from 'react';

export const Navigation: React.FC = () => {
  return (
    <>
      {/* Logo */}
      <div className="fixed top-0 left-0 p-8 z-50 mix-blend-difference text-white hover-trigger">
        <a
          href="https://ai-and-marketing.jp/"
          className="font-eng text-sm font-bold tracking-widest"
          aria-label="AIMA"
        >
          AIMA
        </a>
      </div>

      {/* Menu */}
      <div className="fixed top-0 right-0 p-8 z-50 flex flex-col gap-6 items-end mix-blend-difference text-white">
        {[
          { label: 'ABOUT', href: '/#about' },
          { label: 'WORKS', href: '/#works' },
          { label: 'CONTACT', href: '/#contact' }
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 group"
          >
            <span className="font-eng text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">
              {item.label}
            </span>
            <div className="w-1.5 h-1.5 bg-white rounded-full transition-transform duration-300 group-hover:scale-[2]" />
          </a>
        ))}
      </div>

      {/* Location */}
      <div className="fixed bottom-8 left-8 z-50 font-eng text-xs font-light tracking-widest mix-blend-difference text-white">
        OSAKA / JP
      </div>
    </>
  );
};
