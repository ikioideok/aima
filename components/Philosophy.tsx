import React from 'react';
import { FadeIn } from './FadeIn';
import './Philosophy.css';

export const Philosophy: React.FC = () => {
  return (
    <section id="about" className="philosophy-section w-full py-32 md:py-48 px-6 md:px-24 flex flex-col items-center bg-white">
      <div className="philosophy-watermark">PHILOSOPHY</div>

      <div className="max-w-3xl text-center relative z-10">
        <FadeIn delay={0}>
          <span className="block text-xs md:text-sm font-eng font-bold tracking-[0.4em] text-gray-400 mb-6">AIMA Inc.</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">Philosophy</h2>
        </FadeIn>

        {/* Block 1 */}
        <FadeIn delay={0}>
          <p className="text-base md:text-xl leading-loose font-medium text-gray-800 mb-12 tracking-wider">
            市場には、さまざまな情報や意見があふれており、<br />
            何が本質なのか見えづらくなることがあります。
          </p>
        </FadeIn>

        {/* Block 2 */}
        <FadeIn delay={300}>
          <p className="text-base md:text-xl leading-loose font-medium text-gray-800 mb-12 tracking-wider">
            私たちAIMAは、AIの力を使って複雑なデータを整理し、<br />
            お客様が本当に必要とされている<br />
            「基盤となる考え方」や「事業の軸」<br />
            を一緒に見つけていきたいと考えております。
          </p>
        </FadeIn>

        {/* Block 3 */}
        <FadeIn delay={600}>
          <p className="text-base md:text-xl leading-loose font-medium text-gray-800 tracking-wider">
            不確実な時代だからこそ、迷いを減らし、<br />
            より良い意思決定を支える存在でありたい──<br />
            そんな思いで取り組んでいます。
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={800} className="mt-32 w-[1px] h-40 bg-gradient-to-b from-gray-800 to-transparent opacity-50" />
    </section>
  );
};