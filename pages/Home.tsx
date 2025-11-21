import React from 'react';
import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { Philosophy } from '../components/Philosophy';
import { Services } from '../components/Services';
import { Core } from '../components/Core';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen">
            <Navigation />

            <main>
                <h1 className="sr-only">AIMA Inc.｜AIマーケティング・LLM活用・データ分析コンサルティング</h1>
                <Hero />
                <Philosophy />
                <Services />
                <Core />
                <Footer />
            </main>
        </div>
    );
};
