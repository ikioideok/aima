import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home-legacy.css';
import { Layout } from '../components/Layout';
import characterWalk from '../character_walk.png';
import profilePhoto from '../profile.png';
import { ServiceModal } from '../components/ServiceModal';

export const Home: React.FC = () => {
    const [selectedService, setSelectedService] = useState<{
        title: React.ReactNode;
        shortDescription: React.ReactNode;
        longDescription: string;
    } | null>(null);

    const services = {
        seo: {
            title: 'SEO・LLMO 支援',
            shortDescription: <>行動予測による最適化。<br />ユーザーの無意識領域へのアプローチ。</>,
            longDescription: "従来のデモグラフィック分析を超え、ユーザーの微細な行動ログから潜在的なニーズを予知します。心理学と機械学習を融合させ、顕在化する前の「欲しい」という感情にアプローチすることで、コンバージョン率を劇的に向上させます。LLMを活用したコンテンツ生成と、検索エンジンのアルゴリズム解析を掛け合わせ、持続的な集客基盤を構築します。"
        },
        marketing: {
            title: 'マーケティング代行',
            shortDescription: <>戦略設計から実行まで一気通貫で支援。<br />データとクリエイティブの両輪で成果を実現。</>,
            longDescription: "市場調査、競合分析に基づいた勝てる戦略を立案します。Web広告、SNS運用、CRM施策など、あらゆるチャネルを横断して最適化。データドリブンな意思決定と、人の心を動かすクリエイティブを融合させ、ビジネスの成長を加速させます。単なる代行ではなく、事業パートナーとして数値責任を共有します。"
        },
        content: {
            title: 'コンテンツ制作',
            shortDescription: <>読者に届く設計から制作まで一貫対応。<br />目的と導線に合わせた成果につながる制作。</>,
            longDescription: "SEO記事、ホワイトペーパー、導入事例インタビュー、動画シナリオなど、あらゆる形式のコンテンツを制作します。ペルソナの詳細な設定とカスタマージャーニーマップの策定から始め、「誰に、何を、どのように」伝えるかを徹底的に設計。ブランドの声を正しく届け、ファンを育成する質の高いコンテンツを提供します。"
        }
    };

    return (
        <Layout>
            <div className="grid-cell span-4 hero-section" style={{ position: 'relative', overflow: 'visible' }}>
                <div style={{ position: 'relative', zIndex: 1, paddingTop: '0px' }}>
                    <div className="hero-title-en">
                        <span className="hero-text-content delay-1">AI &amp; MARKETING</span>
                    </div>

                    <div className="hero-title-jp-1">
                        <span className="hero-text-content delay-2">人と、AIの、</span>
                    </div>

                    <div className="hero-title-jp-2">
                        <span className="hero-text-content delay-3">合間に。</span>
                    </div>

                    <div style={{ marginTop: '60px', maxWidth: '600px' }}>
                        <p style={{ fontSize: '1.1rem', color: '#555' }}>
                            Structure &amp; Fluidity. <br />
                            堅牢な戦略と、柔軟な思考。<br />
                            私たちは、AIと人間の境界線にある「新しい可能性」をデザインします。
                        </p>
                    </div>

                    <div className="hero-character-wrapper">
                        <img src={characterWalk} alt="AIMA Character" className="hero-character-img" />
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '40px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        writingMode: 'vertical-rl',
                        letterSpacing: '0.2em',
                        color: '#aaa'
                    }}
                >
                    SCROLL DOWN
                </div>
            </div>

            <div className="grid-cell span-1">
                <span className="label">Location</span>
                <h3>OSAKA / JP</h3>
            </div>
            <div className="grid-cell span-1">
                <span className="label">Established</span>
                <h3>2018</h3>
            </div>
            <div className="grid-cell span-2">
                <span className="label">Mission</span>
                <p>不確実な時代に、確かな「軸」を。</p>
            </div>

            <div className="grid-cell span-2" id="about" style={{ paddingTop: '80px' }}>
                <span className="label">01. Philosophy</span>
                <h2>We organize<br />Chaos.</h2>
            </div>
            <div className="grid-cell span-2" style={{ display: 'flex', alignItems: 'center' }}>
                <p>
                    市場には情報があふれ、本質が見えづらくなっています。<br />
                    AIMAは、AIの演算力と人間の洞察力を組み合わせ、複雑なデータを整理。<br />
                    お客様が本当に必要とする「事業の軸」を見つけ出し、迷いのない意思決定を支えます。
                </p>
            </div>

            <div className="grid-cell span-4">
                <span className="label">02. Profile</span>
            </div>
            <div className="grid-cell span-1">
                <img src={profilePhoto} alt="Yuki Mizuma" className="profile-photo" />
            </div>
            <div className="grid-cell span-3">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
                    <h2>水間 雄紀</h2>
                    <span style={{ fontWeight: 500, color: '#666' }}>Yuki Mizuma</span>
                    <span style={{ fontSize: '0.8rem', background: '#eee', padding: '4px 10px', borderRadius: '4px' }}>
                        CEO / Founder
                    </span>
                </div>
                <p style={{ marginTop: '20px', maxWidth: '800px' }}>
                    2018年、株式会社circlizeを創業。50社以上のSEO戦略設計・編集ディレクションを担当し、2024年にラグザス株式会社へ事業譲渡。<br />
                    2025年、株式会社AIMAへ社名変更。現在は株式会社フォーティファイヴにて品質管理にも従事しながら、コンテンツとAIの融合領域を開拓している。
                </p>
                <div style={{ marginTop: '30px' }}>
                    <span className="label" style={{ marginBottom: '10px' }}>Specialties</span>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <span style={{ borderBottom: '2px solid var(--aurora-1)' }}>SEO Strategy</span>
                        <span style={{ borderBottom: '2px solid var(--aurora-2)' }}>AI Marketing</span>
                        <span style={{ borderBottom: '2px solid var(--aurora-3)' }}>LLM Operations</span>
                    </div>
                </div>
            </div>

            <div className="grid-cell span-4" id="works">
                <span className="label">03. Services</span>
                <h2>Our Expertise</h2>
            </div>

            <div className="grid-cell span-2 hover-aurora">
                <span className="label" style={{ color: 'var(--aurora-1)' }}>01. SEO・LLMO</span>
                <h3>{services.seo.title}</h3>
                <p style={{ marginTop: '20px' }}>
                    {services.seo.shortDescription}
                </p>
                <button
                    onClick={() => setSelectedService(services.seo)}
                    className="btn-line"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                    View Details
                </button>
            </div>

            <div className="grid-cell span-2 hover-aurora">
                <span className="label" style={{ color: 'var(--aurora-3)' }}>02. Marketing</span>
                <h3>{services.marketing.title}</h3>
                <p style={{ marginTop: '20px' }}>
                    {services.marketing.shortDescription}
                </p>
                <button
                    onClick={() => setSelectedService(services.marketing)}
                    className="btn-line"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                    View Details
                </button>
            </div>

            <div className="grid-cell span-2 hover-aurora">
                <span className="label" style={{ color: 'var(--aurora-2)' }}>03. Content Creation</span>
                <h3>{services.content.title}</h3>
                <p style={{ marginTop: '20px' }}>
                    {services.content.shortDescription}
                </p>
                <button
                    onClick={() => setSelectedService(services.content)}
                    className="btn-line"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                    View Details
                </button>
            </div>

            <div
                className="grid-cell span-2"
                style={{ background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <span style={{ fontSize: '0.9rem', color: '#999' }}>More services coming soon.</span>
            </div>

            <div className="grid-cell span-2" id="contact">
                <span className="label">04. Contact</span>
                <h2 style={{ marginBottom: '40px' }}>Let's Talk.</h2>
                <p>
                    プロジェクトのご相談、協業のご提案など、<br />お気軽にお問い合わせください。
                </p>

                <div style={{ marginTop: 'auto' }}>
                    <p style={{ fontWeight: 700 }}>株式会社AIMA</p>
                    <p style={{ fontSize: '0.9rem' }}>
                        〒530-0001 大阪府大阪市北区梅田1-2-2<br />
                        大阪駅前第2ビル2階5-6号室<br />
                    </p>
                </div>
            </div>

            <div className="grid-cell span-2">
                <form className="contact-form" action="https://formspree.io/f/mnnbnagl" method="POST">
                    <div>
                        <label className="label">Name</label>
                        <input type="text" name="name" placeholder="お名前" required />
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input type="email" name="email" placeholder="メールアドレス" required />
                    </div>
                    <div>
                        <label className="label">Message</label>
                        <textarea rows={5} name="message" placeholder="お問い合わせ内容" required />
                    </div>
                    <button type="submit" className="submit-btn">SEND MESSAGE</button>
                </form>
            </div>

            <ServiceModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                service={selectedService}
            />
        </Layout>
    );
};
