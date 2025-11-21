import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { FadeIn } from './FadeIn';

export const Core: React.FC = () => {
  const [state, handleSubmit] = useForm("mnnbnagl");

  if (state.succeeded) {
    return (
      <section className="w-full py-24 px-6 md:px-24 bg-black text-white relative overflow-hidden flex items-center justify-center min-h-[600px]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-indigo-900 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900 rounded-full blur-[100px]" />
        </div>
        <FadeIn>
          <div className="text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Thank you.</h3>
            <p className="text-gray-400 text-lg">お問い合わせありがとうございます。<br />内容を確認の上、担当者よりご連絡いたします。</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-12 text-sm font-bold tracking-widest border-b border-white pb-1 hover:text-gray-300 transition-colors"
            >
              BACK TO FORM
            </button>
          </div>
        </FadeIn>
      </section>
    );
  }

  return (
    <section id="contact" className="w-full py-24 px-6 md:px-24 bg-black text-white relative overflow-hidden">
      {/* Background Texture/Gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-indigo-900 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-16 md:gap-32">

        {/* Left Column: Heading & Info */}
        <div className="md:w-1/3">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Contact</h2>
            <p className="text-gray-400 leading-relaxed mb-12">
              プロジェクトのご相談、協業のご提案など、<br />
              お気軽にお問い合わせください。<br />
              通常、3営業日以内に返信いたします。
            </p>

            <div className="space-y-4 text-sm text-gray-500 font-mono">
              <p>INFO@AIMA-INC.JP</p>
              <p>TOKYO, JAPAN</p>
            </div>
          </FadeIn>
        </div>

        {/* Right Column: Form */}
        <div className="md:w-2/3">
          <FadeIn delay={200}>
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group">
                  <label htmlFor="name" className="block text-xs font-bold tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">NAME *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    className="w-full bg-transparent border-b border-gray-800 py-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-gray-800"
                    placeholder="山田 太郎"
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
                </div>
                <div className="group">
                  <label htmlFor="company" className="block text-xs font-bold tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">COMPANY</label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    className="w-full bg-transparent border-b border-gray-800 py-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-gray-800"
                    placeholder="株式会社AIMA"
                  />
                  <ValidationError prefix="Company" field="company" errors={state.errors} className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-xs font-bold tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">EMAIL *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-gray-800 py-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-gray-800"
                  placeholder="name@example.com"
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-xs font-bold tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">MESSAGE *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-gray-800 py-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-gray-800 resize-none"
                  placeholder="お問い合わせ内容をご記入ください"
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1" />
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-bold text-white transition-all duration-300 border border-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-2 tracking-widest">{state.submitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </form>
          </FadeIn>
        </div>

      </div>
    </section>
  );
};