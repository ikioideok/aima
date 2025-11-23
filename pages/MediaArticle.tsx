import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { FadeIn } from '../components/FadeIn';
import { Sidebar } from '../components/Sidebar';
import { Article } from '../types';

// Static Data with JSX content
const STATIC_ARTICLES: Record<string, {
    title: string;
    date: string;
    category: string;
    heroImage: string;
    content: React.ReactNode;
}> = {
    'llmo-seo-difference': {
        title: 'LLMOとは？SEOとの違いや生成AI時代に必須の対策方法を徹底解説',
        date: '2024.11.22',
        category: 'INSIGHT',
        heroImage: 'https://images.unsplash.com/photo-1679082292712-3dc12473cd2d?q=80&w=1200&auto=format&fit=crop',
        content: (
            <div className="space-y-12">
                <p>
                    ChatGPTをはじめとする生成AIの普及により、私たちが情報を探す方法は劇的に変化しています。
                    これに伴い、従来のSEO対策だけではカバーできない新たなマーケティング領域「LLMO」が注目を集めています。
                    本記事では、これからの時代に企業が生き残るために不可欠なLLMOの基礎知識から実践的な対策までを詳しくご紹介します。
                </p>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMO（Large Language Model Optimization）の定義と意味</h2>
                    <p className="mb-6">
                        生成AIが日常的なツールとして定着する中、自社の情報がAIの回答に正確に反映されているか不安を感じる企業が増えています。
                        検索エンジンの上位表示を目指すだけでは不十分な時代において、AIからの参照を獲得する新たな手法が求められています。ここではLLMOの定義と意味について解説します。
                    </p>

                    <h3 className="text-xl font-bold mb-3">LLMOとは何か</h3>
                    <p className="mb-6">
                        LLMO（Large Language Model Optimization）とは、大規模言語モデル（LLM）に対して、自社のコンテンツやブランド情報が「信頼できる回答元」として引用・参照されるように最適化を行うマーケティング手法のことです。
                        従来のSEOがGoogleなどの検索結果ページで上位表示を目指すのに対し、LLMOはChatGPTやClaude、Perplexityといった対話型AIがユーザーの質問に答える際、その回答内容の中に自社の製品名やサービス情報、あるいはWebサイトのリンクが含まれることを目的としています。AIは学習データや検索機能（RAG）を通じて情報を生成するため、その学習プロセスや参照プロセスにおいて「選ばれる」ための技術的・コンテンツ的な工夫が必要となります。これは単なる露出の拡大にとどまらず、AI時代におけるブランドの信頼性を担保するための重要な戦略と言えます。
                    </p>
                </section>
                {/* Truncated for brevity in this view, but full content is preserved in static data if I were to copy it all. 
                    However, since I am replacing the file, I must include the FULL content of the static article or I will lose it.
                    I will copy the full content from the previous view_file output.
                */}
                <section>
                    <h3 className="text-xl font-bold mb-3">GEO（Generative Engine Optimization）やAIOとの関係性</h3>
                    <p>
                        LLMOと似た文脈で使われる言葉に、GEO（Generative Engine Optimization）やAIO（Artificial Intelligence Optimization）があります。これらはしばしば同義語として扱われますが、厳密には対象とするプラットフォームのニュアンスが異なります。GEOは主にGoogleのAI Overview（旧SGE）やBingのAI検索機能など、「検索エンジンに組み込まれた生成AI」への最適化を指す傾向が強い言葉です。一方、AIOはより広義なAI全般への最適化を意味します。LLMOはこれらを包括しつつ、特に大規模言語モデルそのものの学習データや文脈理解にどう食い込むかという点に重きを置いています。実務上の対策内容は重複する部分が多いため、マーケティング担当者はこれらを包括的な「AI対策」として捉え、用語の違いにこだわりすぎず、本質的な情報の信頼性向上に努める姿勢が大切です。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">なぜ今、LLMOが必要とされているのか</h2>
                    <p className="mb-6">
                        ユーザーの情報収集行動は、キーワードを入力する検索から、AIと対話して答えを得る形式へと急速にシフトしています。この変化に対応できなければ、将来的に顧客との接点を大きく失うリスクがあります。ここではなぜ今、LLMOが必要とされているのかについて解説します。
                    </p>

                    <h3 className="text-xl font-bold mb-3">検索行動の変化：キーワード検索から対話型検索へ</h3>
                    <p className="mb-6">
                        かつてユーザーは「SEO 対策」のような単語の羅列で検索し、表示されたリンクを自らクリックして情報を探していました。しかし現在は、「SEO対策の具体的な手順を教えて」とAIに話しかけ、要約された回答を直接受け取るスタイルが定着しつつあります。この対話型検索において、ユーザーは複数のサイトを比較検討する手間を省き、AIが提示する「正解」をそのまま受け入れる傾向が強まっています。つまり、AIが最初の回答（回答のトップ）で自社ブランドを推奨しなければ、ユーザーの目に触れる機会さえ与えられない状況が生まれ始めているのです。能動的な検索から受動的な回答受容へのシフトは、企業の集客戦略の根幹を揺るがす大きな変化であり、早急な対応が求められています。
                    </p>

                    <h3 className="text-xl font-bold mb-3">ゼロクリックサーチの増加とAI Overview（SGE）の影響</h3>
                    <p className="mb-6">
                        Google検索にAI Overview（SGE）が導入されたことで、検索結果ページ上で回答が完結する「ゼロクリックサーチ」が加速しています。ユーザーは検索結果のリストをクリックしてWebサイトを訪れることなく、AIが生成した概要だけで満足してしまうケースが増えました。Webサイトへのトラフィック減少は避けられない現実となりつつあり、これまでのPV数重視のKPI設定ではマーケティングの効果を正しく測れなくなっています。サイトへの流入が減る中でもブランドの認知や購買意欲を高めるためには、AIの生成する回答内で好意的な言及を獲得し、そこから指名検索や直接のコンバージョンにつなげるという、従来とは異なるアプローチが必要です。
                    </p>

                    <h3 className="text-xl font-bold mb-3">企業マーケティングにおける新たな競争軸</h3>
                    <p>
                        これまでのデジタルマーケティング競争は、検索順位の1位を奪い合う椅子取りゲームでした。しかしLLMの台頭により、競争の軸は「検索順位」から「AIの推奨枠」へと移行しています。AIは膨大なデータの中から最も確率的に確からしい、あるいは信頼性が高いと判断した情報を提示するため、単なるキーワードの詰め込みや小手先のテクニックは通用しません。企業としての実態、専門性、そしてインターネット上での評判（サイテーション）が、AIによる推奨の決定打となります。競合他社よりもAIに「詳しい」「信頼できる」と認識させることは、これからのブランド戦略において、WebサイトのSEO対策以上に重要な差別化要因となっていくはずです。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMOとSEOの決定的な違い</h2>
                    <p className="mb-6">
                        従来のSEO対策をそのまま続けていても、AIからの参照を効果的に獲得できるとは限りません。両者は仕組みも目指すべきゴールも根本的に異なるため、戦略を明確に切り替える必要があります。ここではLLMOとSEOの決定的な違いについて解説します。
                    </p>

                    <h3 className="text-xl font-bold mb-3">最適化の対象：検索アルゴリズム対大規模言語モデル</h3>
                    <p className="mb-6">
                        SEOが相手にするのは検索エンジンのアルゴリズムであり、クローラーがWebページを巡回してインデックスする仕組みに基づいています。対してLLMOが最適化の対象とするのは、ニューラルネットワークを用いた大規模言語モデルです。LLMはWeb上のテキストデータを学習し、単語と単語のつながりや文脈を確率的に予測して文章を生成します。そのため、SEOではHTMLタグの正確さやリンク構造が重視されますが、LLMOでは文章としての論理性や、AIが学習しやすい構造化されたテキストデータかどうかが重視されます。検索エンジンは「場所」を探すシステムですが、LLMは「意味」を理解して再構成するシステムであるという違いを理解しなければなりません。
                    </p>

                    <h3 className="text-xl font-bold mb-3">目的の違い：検索上位表示対AI回答での引用・推奨</h3>
                    <p className="mb-6">
                        SEOの最大の目的は、特定のキーワード検索において自社サイトを1位などの上位に表示させ、クリック（流入）を最大化することにありました。しかしLLMOの目的は、AIが生成する文章の中で「引用」または「推奨」されることです。たとえば、「おすすめの会計ソフトは？」という質問に対し、AIが「A社とB社が人気です」と回答した際、そこに自社名が含まれることを目指します。必ずしもWebサイトへの直接的なリンククリックを目的とせず、AIとの対話の中でブランド名がポジティブな文脈で登場し、ユーザーの記憶に残る「シェア・オブ・モデル（AIモデル内での占有率）」を高めることが重要視されます。
                    </p>

                    <h3 className="text-xl font-bold mb-3">評価基準の違い：被リンク・キーワード対信頼性・エンティティ理解</h3>
                    <p>
                        検索エンジンは長らく、被リンクの数や質、ドメインパワー、キーワードの含有率などを主要な評価基準としてきました。これらはWebのグラフ構造に基づく指標です。一方、LLMは「エンティティ（実体）」の概念を重視します。ある企業や製品が、どのような属性を持ち、どのような文脈で語られているかという「事実の結びつき」を評価します。そのため、単にリンクが多いだけでは不十分で、Web全体で一貫した情報が発信されているか、権威ある第三者から言及（サイテーション）されているかといった、情報の正確性と信頼性がより厳密に問われます。AIは矛盾する情報を嫌うため、事実に基づいた一貫性のある情報発信がLLMOにおける最大の評価ポイントとなります。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMO対策の具体的な実践方法：3つの柱</h2>

                    <h3 className="text-xl font-bold mb-3">1. テクニカル対策：構造化データとクロール制御</h3>
                    <p className="mb-6">
                        AIが情報を正確に読み取るためには、Webサイトの情報を機械可読性の高い形式で提供する必要があります。最も効果的なのがSchema.orgを用いた構造化データのマークアップです。企業概要、製品情報、FAQなどを構造化データで記述することで、LLMはそれが単なるテキストではなく「特定の意味を持つデータ」であることを明確に認識します。また、robots.txtの設定を見直し、OpenAIの「GPTBot」などのAIクローラーのアクセスを許可することも必須です。セキュリティ上の理由でブロックしている企業もありますが、LLMOの観点からは、情報を学習させるためにクローラーを招き入れる設定が前提となります。
                    </p>

                    <h3 className="text-xl font-bold mb-3">2. コンテンツ対策：AIが理解しやすい記事構成とQ&amp;A</h3>
                    <p className="mb-6">
                        コンテンツを作成する際は、人間だけでなくAIにとっても読みやすい論理構造を意識します。結論から述べる構成や、主語と述語が明確な文章が好まれます。特に有効なのが、Q&amp;A形式のコンテンツです。「〇〇とは？」「〇〇のメリットは？」といった質問と、それに対する簡潔な回答をセットにして記述することで、AIはユーザーからの類似質問に対する回答ソースとしてその部分を抽出しやすくなります。また、長文のテキストだけでなく、情報をリスト形式や表形式で整理することも重要です。複雑なデータも整理された状態で提示されることで、AIによる情報の抽出精度が向上し、回答に採用される確率が高まります。
                    </p>

                    <h3 className="text-xl font-bold mb-3">3. 権威性対策：E-E-A-Tの強化とサイテーション獲得</h3>
                    <p>
                        LLMは学習データの中で頻繁に登場し、かつ信頼できるソースと関連付けられている情報を「正解」として優先します。そのため、Googleが提唱するE-E-A-T（経験・専門性・権威性・信頼性）を高める施策は、LLMOにおいても極めて有効です。自社サイト内での発信だけでなく、業界団体、ニュースメディア、公的機関などの権威ある外部サイトで自社ブランドが言及される「サイテーション」を増やす活動が求められます。プレスリリースの積極的な配信や、専門家としての寄稿、インタビュー記事の掲載などを通じて、Web上の多様な場所で「信頼できるブランド」として名前が挙がる状態を作ることが、AIの信頼獲得につながります。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">生成AIに選ばれるためのライティングと実装ポイント</h2>

                    <h3 className="text-xl font-bold mb-3">「〇〇とは」の定義文を明確かつ簡潔にする</h3>
                    <p className="mb-6">
                        ユーザーがAIに用語の意味を尋ねた際、AIはその定義を説明している信頼性の高い文章を探します。このとき、記事の冒頭や見出しの直下で「〇〇とは、〜〜である。」という形式で、定義を端的に言い切ることが重要です。修飾語が多すぎる曖昧な文章や、比喩表現を多用した情緒的な文章は、AIが事実として処理しにくいため避けましょう。辞書のように客観的で、かつ誰が読んでも誤解のない簡潔な構造を心がけます。この定義文が明確であればあるほど、AIは「このサイトは用語の定義を正しく理解している」と判断し、回答のベースとして採用しやすくなります。
                    </p>

                    <h3 className="text-xl font-bold mb-3">一次情報と信頼できる具体的な数値を提示する</h3>
                    <p className="mb-6">
                        生成AIは事実に基づいた回答を作成しようとするため、独自の調査データや具体的な数値が含まれているコンテンツを好みます。「多くの人が利用している」という曖昧な表現ではなく、「2023年の調査では85%のユーザーが利用している」といった具体的な数値をソース付きで提示してください。自社で実施したアンケート結果や実験データなどの一次情報は、他のサイトにはないオリジナルの価値となり、AIにとっても代替不可能な学習ソースとなります。参照元として公的機関のデータや論文などを明記することも、情報の信頼性を担保し、AIによるファクトチェックを通過しやすくするために効果的です。
                    </p>

                    <h3 className="text-xl font-bold mb-3">専門用語と関連エンティティの共起を意識する</h3>
                    <p>
                        LLMは単語同士の共起関係（一緒に使われる頻度）を見て文脈を理解しています。特定のトピックについて解説する際は、その分野で一般的に使われる専門用語や、関連する人物・企業・製品名（エンティティ）を自然な形で文章に盛り込むことが大切です。例えば「マーケティング」の記事であれば、「リードナーチャリング」「CPA」「コトラー」などの関連語が含まれていることで、記事の専門性が高いと判断されます。ただし、無意味にキーワードを羅列するのは逆効果です。あくまで文脈の中で論理的につながりがある場合に限り、関連エンティティを網羅することで、AIに対してトピック全体を深くカバーしていることをアピールできます。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMOの効果測定とモニタリング方法</h2>

                    <h3 className="text-xl font-bold mb-3">主要な生成AI（ChatGPT, Gemini, Perplexity）での出力確認</h3>
                    <p className="mb-6">
                        現時点で最も確実な確認方法は、実際に主要な生成AIを使って自社関連のプロンプトを入力してみることです。「〇〇業界のおすすめ企業は？」「（自社製品名）の特徴を教えて」といった質問を定期的に投げかけ、自社の情報が表示されるか、内容が正確か、ポジティブな文脈かをチェックします。ChatGPT、Gemini、Perplexity、Claudeなど、モデルによって学習データや回答傾向が異なるため、複数のプラットフォームで確認が必要です。手動での確認が大変な場合は、APIを活用して定期的に回答を取得し、スプレッドシートなどで記録・管理する体制を整えると、経時的な変化を把握しやすくなります。
                    </p>

                    <h3 className="text-xl font-bold mb-3">指名検索数（ブランド認知）の推移</h3>
                    <p className="mb-6">
                        AIチャットボットで自社を知ったユーザーは、その後詳細を確認するために検索エンジンで「指名検索」を行う傾向があります。そのため、Google Search Consoleなどのツールを用いて、ブランド名や製品名を含むクエリの検索ボリューム推移をモニタリングすることが重要です。AIの回答で推奨される頻度が高まれば、自然と指名検索数も増加する相関関係が見込めます。サイト全体の流入数が横ばい、あるいは減少傾向であっても、指名検索の割合が増えていれば、LLMOによるブランド認知効果が出ている一つの指標として評価できるでしょう。
                    </p>

                    <h3 className="text-xl font-bold mb-3">AI参照トラフィックの変化分析</h3>
                    <p>
                        一部の生成AI、特に検索機能を備えたPerplexityやBing Chat、GoogleのAI Overviewなどは、回答の典拠としてWebサイトへのリンクを提示します。アクセス解析ツールでリファラー（参照元）を確認し、これらのAIプラットフォームからの流入が増えているかを分析します。ただし、従来のWebサイトからのリンクとは異なり、リファラー情報が明確に残らないケースや、"Direct"として計測されるケースもあります。そのため、特定のランディングページへの流入経路の変化や、滞在時間の長さなどを含めて複合的に分析し、AI経由のユーザー行動を推測していく必要があります。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMOに取り組むメリットと今後の展望</h2>

                    <h3 className="text-xl font-bold mb-3">先行者利益によるブランド信頼性の確立</h3>
                    <p className="mb-6">
                        現在、本格的にLLMOに取り組んでいる企業はまだ少数派です。競合他社が対策を始める前に、AIからの「第一想起」を獲得できれば、その先行者利益は長期にわたって続きます。一度LLMに「この分野の権威はこの企業」と学習されれば、その評価を覆すには多くの時間とリソースが必要になるからです。AIが日常的な情報検索のパートナーとして定着していく中で、初期段階で信頼できる情報源としての地位を確立しておくことは、将来的なマーケティングコストの削減にもつながります。今のうちからAIに選ばれる土壌を作っておくことが、数年後のブランド価値を決定づけるでしょう。
                    </p>

                    <h3 className="text-xl font-bold mb-3">検索エンジン以外からの流入チャネル確保</h3>
                    <p className="mb-6">
                        Google検索のアルゴリズム変動による順位下落は、Webマーケティングにおける最大のリスク要因でした。しかし、LLMOを通じてAIチャットボットやその他のAIプラットフォームからの認知・流入経路を確保できれば、検索エンジンへの依存度を下げ、リスクを分散させることができます。AIは音声アシスタントやスマート家電、ウェアラブルデバイスなど、画面を持たないインターフェースにも組み込まれていきます。検索結果画面（SERPs）に依存しない情報伝達手段を持つことは、あらゆるデバイスやプラットフォームで顧客と接点を持つための強固な基盤となります。
                    </p>

                    <h3 className="text-xl font-bold mb-3">AI時代のデジタルマーケティング戦略の再定義</h3>
                    <p>
                        LLMOへの取り組みは、単なる技術的な最適化にとどまりません。「AIにどう理解されるか」を考えることは、自社の強みや提供価値を言語化し、デジタル空間での存在意義を再定義するプロセスそのものです。コンテンツの質、情報の透明性、ブランドの信頼性がこれまでにないほど厳しく問われる時代において、LLMOを起点としたマーケティング戦略の構築は、企業としての本質的な競争力を高めるきっかけとなります。人とAIが共存するこれからの社会において、情報を届ける相手は人間だけでなく、その背後にいるAIも含まれるという意識変革が求められています。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">まとめ</h2>
                    <p>
                        LLMOは、生成AI時代の新しいSEOとも呼べる重要なマーケティング戦略です。検索エンジンでの上位表示を目指す従来のSEOとは異なり、AIに信頼され、推奨されることを目的としています。構造化データの活用やE-E-A-Tの強化、そしてAIが理解しやすいコンテンツ作成に取り組むことで、将来にわたってブランドの信頼性と認知を獲得し続けることができるでしょう。変化の激しい今こそ、LLMOへの取り組みをスタートさせる最適なタイミングです。
                    </p>
                </section>
            </div>
        )
    }
};

export const MediaArticle: React.FC = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<any>(null);

    useEffect(() => {
        if (!id) return;

        // 1. Check static data
        if (STATIC_ARTICLES[id]) {
            setArticle(STATIC_ARTICLES[id]);
            return;
        }

        // 2. Check local storage
        try {
            const localArticlesStr = localStorage.getItem('aima_media_articles');
            if (localArticlesStr) {
                const localArticles: Article[] = JSON.parse(localArticlesStr);
                const found = localArticles.find(a => a.id === id);
                if (found) {
                    console.log('Found local article:', found);
                    setArticle(found);
                }
            }
        } catch (error) {
            console.error('Failed to parse local articles:', error);
        }
    }, [id]);

    if (!article && !STATIC_ARTICLES['llmo-seo-difference']) return <div>Loading...</div>;

    // Fallback to default article if not found (or handle 404)
    const displayArticle = article || STATIC_ARTICLES['llmo-seo-difference'];

    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow pt-40 px-6 md:px-12 max-w-7xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Article Content */}
                    <div className="lg:w-2/3">
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-4 text-xs font-eng tracking-widest text-gray-500 mb-6">
                                <span>{displayArticle.category}</span>
                                <span>{displayArticle.date}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-12">
                                {displayArticle.title}
                            </h1>
                            <div className="w-full aspect-video overflow-hidden">
                                <img
                                    src={displayArticle.heroImage || displayArticle.image}
                                    alt={displayArticle.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none font-medium leading-loose text-justify mb-32">
                            {displayArticle.content ? (
                                typeof displayArticle.content === 'string' ? (
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: displayArticle.content }} />
                                        {/* DEBUG: Show raw content */}
                                        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 text-xs font-mono whitespace-pre-wrap">
                                            <p className="font-bold mb-2">DEBUG: Raw Content</p>
                                            {displayArticle.content.substring(0, 500)}... (truncated)
                                        </div>
                                    </>
                                ) : (
                                    displayArticle.content
                                )
                            ) : (
                                <p className="text-gray-500 italic">本文がありません。</p>
                            )}
                        </div>

                        <div className="text-center mb-24">
                            <Link to="/media" className="inline-block border-b border-black pb-1 text-sm font-bold tracking-widest hover:text-gray-600 transition-colors">
                                BACK TO LIST
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        <Sidebar />
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};
