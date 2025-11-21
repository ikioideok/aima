import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-32 px-6 md:px-24 flex flex-col md:flex-row justify-between items-end hover-trigger">
      <div className="mb-12 md:mb-0">
        <h2 className="text-2xl font-bold mb-8">株式会社AIMA</h2>
        <p className="text-sm font-medium leading-relaxed">
          〒530-0001<br />
          大阪府大阪市北区梅田1-2-2<br />
          大阪駅前第2ビル2階5-6号室
        </p>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <p className="text-xs font-eng tracking-widest text-gray-500 mb-4">
          &copy; 2024 AIMA Inc. All Rights Reserved.
        </p>
        <a href="/privacy" className="text-[10px] font-eng tracking-widest text-gray-400 hover:text-gray-600 transition-colors border-b border-transparent hover:border-gray-600">
          PRIVACY POLICY
        </a>
      </div>
    </footer>
  );
};