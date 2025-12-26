import React from 'react';
import { Layout } from '../components/Layout';
import '../styles/home-legacy.css';
import { SEO } from '../components/SEO';

export const PrivacyPolicy: React.FC = () => {
    return (
        <Layout>
            <SEO title="Privacy Policy" path="/privacy" />
            <div className="grid-cell span-4" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                <h2 style={{ fontSize: '2.5rem', marginTop: '20px' }}>Privacy Policy</h2>
            </div>

            <div className="grid-cell span-4" style={{ backgroundColor: '#fff' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 0', lineHeight: '2', color: '#444' }}>
                    <p className="mb-8">
                        株式会社AIMA（以下、「当社」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>1. 取得する情報</h3>
                    <p>
                        当社は、本サービスの提供にあたり、以下の情報を取得する場合があります。
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                        <li>お問い合わせフォームから送信される氏名、メールアドレス、メッセージ内容</li>
                        <li>アクセスログ等の技術情報（IPアドレス、ブラウザ種別、閲覧日時、参照元など）</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>2. 利用目的</h3>
                    <p>
                        取得した情報は、以下の目的で利用します。
                    </p>
                    <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', marginTop: '10px' }}>
                        <li>お問い合わせへの対応および連絡</li>
                        <li>本サービスの提供、改善、品質向上</li>
                        <li>不正利用の防止およびセキュリティ確保</li>
                        <li>上記に付随する目的</li>
                    </ol>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>3. 第三者提供</h3>
                    <p>
                        当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>4. 外部サービスの利用</h3>
                    <p>
                        当社は、お問い合わせ対応のために外部サービス（例：Formspree）を利用する場合があります。これらのサービスにおける個人情報の取扱いは、各サービスのプライバシーポリシーに従います。
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>5. Cookie等の利用</h3>
                    <p>
                        当社は、サイトの利便性向上や利用状況の把握のためにCookie等を使用する場合があります。Cookieの利用は、ブラウザ設定により無効化できます。
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>6. 安全管理</h3>
                    <p>
                        当社は、個人情報の漏えい、滅失、毀損の防止のために合理的な安全管理措置を講じます。
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>7. 開示・訂正・削除等</h3>
                    <p>
                        ご本人から個人情報の開示、訂正、削除、利用停止等のご請求があった場合、法令に基づき適切に対応します。
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>8. 本ポリシーの変更</h3>
                    <p>
                        本ポリシーの内容は、必要に応じて変更することがあります。変更後の内容は本ウェブサイトに掲載した時点で効力を生じます。
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '60px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>9. お問い合わせ窓口</h3>
                    <p>
                        本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
                    </p>
                    <p style={{ marginTop: '20px', background: '#f9f9f9', padding: '20px', fontSize: '0.9rem' }}>
                        住所：大阪府大阪市北区梅田一丁目2番2号　大阪駅前第2ビル2階5-6号室<br />
                        社名：株式会社AIMA<br />
                        担当部署：個人情報保護管理担当
                    </p>
                </div>
            </div>
        </Layout>
    );
};
