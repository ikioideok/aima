import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Brain, Target, BarChart3, Zap, Users, TrendingUp } from 'lucide-react';

export function ServiceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Fast, sleek animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      rotateX: -15,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.4,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3,
      },
    },
  };

  const services = [
    {
      icon: TrendingUp,
      title: "SEO支援",
      description: (
        <>
          <span className="font-bold">AIで効率化しつつ、成果につながるSEO施策を。</span>
          <br />
          <br />
          従来の外注に頼るSEOはコストが高く、成果の見えづらさも課題でした。
          <br />
          弊社では企業ごとにカスタマイズした、誰でも高品質な記事を数分で生成できる「記事作成ツール」を提供。
          <br />
          外注費を<span className="text-red-500">半分以下</span>にすることを目指します。
        </>
      ),
      features: ["AIMAの違い: 内製ツールで記事作成〜公開のリードタイムを1/3に短縮"]
    },
    {
      icon: Target,
      title: "広告運用最適化",
      description: (
        <>
          <span className="font-bold">ムダを省き、投資対効果を最大化。</span>
          <br />
          <br />
          広告費を増やしても成果が比例しない、そんな悩みを抱える企業は少なくありません。
          <br />
          AIによるデータ解析で無駄な出稿を抑え、<span className="text-red-500">費用対効果</span>を改善。
          <br />
          クリエイティブ検証やA/Bテストを繰り返し、最適な広告運用を実現します。
        </>
      ),
      features: ["AIMAの違い: クリエイティブ検証と入札自動化でCPAの中央値を継続改善"]
    },
    {
      icon: Users,
      title: "SNSマーケティング",
      description: (
        <>
          <span className="font-bold">共感を生み、顧客とのつながりを。</span>
          <br />
          <br />
          情報発信があふれる時代、単なる投稿では顧客の心を動かすことはできません。
          <br />
          弊社ではAIを活用した分析と、ユーザー視点の企画運営を組み合わせ、SNSを企業の資産に変えていきます。
          <br />
          フォロワー数のみならず、<span className="text-red-500">エンゲージメント</span>とブランド信頼を重視した支援を行います。
        </>
      ),
      features: ["AIMAの違い: 分析×企画テンプレで運用開始から30日でKPI可視化"]
    },
    {
      icon: Brain,
      title: "コンサルティング",
      description: (
        <>
          <span className="font-bold">課題解決から、次の成長へ。</span>
          <br />
          <br />
          表面的な施策ではなく、企業の本質的な課題に向き合います。
          <br />
          AIによるデータ解析をもとに、経営者や担当者と共に戦略を立案。
          <br />
          短期的な成果はもちろん、<span className="text-red-500">中長期的な成長</span>を見据えたマーケティング戦略を伴走型で支援します。
        </>
      ),
      features: ["AIMAの違い: 経営KPIと連動したロードマップで短期×中長期を両立"]
    },
    {
      icon: Zap,
      title: "AI導入支援",
      description: (
        <>
          <span className="font-bold">AIを現場に定着させ、成果につなげる。</span>
          <br />
          <br />
          AIツールを導入するだけでは効果は出ません。
          <br />
          弊社では要件定義から導入、研修、運用サポートまで一貫して支援。
          <br />
          「<span className="text-red-500">現場で使えるAI活用</span>」を実現し、企業が自走できる仕組みを構築します。
        </>
      ),
      features: ["AIMAの違い: PoC→教育→運用定着まで一気通貫で伴走"]
    },
    {
      icon: BarChart3,
      title: "マーケティング自動化",
      description: (
        <>
          <span className="font-bold">業務を効率化し、戦略に集中できる環境を。</span>
          <br />
          <br />
          繰り返し発生する業務をAIで自動化。
          <br />
          人手不足を解消するとともに、成果につながる業務環境を実現します。
          <br />
          <span className="text-red-500">人的リソースを削減</span>し、担当者がより付加価値の高い業務に集中できる体制をつくります。
        </>
      ),
      features: ["AIMAの違い: RPA/連携自動化で月40時間の定常業務を削減"]
    },
  ];

  return (
    <section id="service" className="py-20 bg-white relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={titleVariants}
            className="text-6xl md:text-8xl lg:text-9xl mb-4 font-black text-black tracking-tighter"
          >
            SERVICE
            <motion.span 
              className="text-red-500"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 600, damping: 25 }}
            >
              .
            </motion.span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
            className="w-24 h-1 bg-red-500 mx-auto mb-6"
          />
          <motion.p
            variants={titleVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            常に寄り添い、未来へと続く成長を。<br />
            AIで企業の課題を解決し、新たな成長を実現します。
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ 
                y: -15, 
                scale: 1.02,
                rotateY: 5,
                transition: { type: "spring", stiffness: 400, damping: 25 } 
              }}
              className="group relative bg-white border border-black/10 p-6 transition-all duration-300 hover:border-red-500 hover:shadow-2xl overflow-hidden"
            >
              {/* Animated corner accent */}
              <motion.div
                className="absolute top-0 left-0 w-0 h-0 border-l-[50px] border-l-red-500 border-b-[50px] border-b-transparent"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05, type: "spring", stiffness: 500 }}
              />
              
              {/* Icon */}
              <motion.div
                className="relative mb-6 z-10"
                whileHover={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1.1, 1]
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 flex items-center justify-center text-black group-hover:text-red-500 transition-colors duration-300">
                  <service.icon className="h-8 w-8" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3 
                className="text-xl font-bold tracking-tight group-hover:text-red-500 transition-colors duration-300 mb-3"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {service.title}
              </motion.h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6 font-light text-sm">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 1.2 + index * 0.05 + featureIndex * 0.03, 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300
                    }}
                    className="flex items-center text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300"
                  >
                    <motion.div 
                      className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"
                      whileHover={{ scale: 1.5 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                    {feature}
                  </motion.div>
                ))}
              </div>

              {/* Hover line effect */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-black"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0, width: '100%' }}
              />

              {/* Background glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 300, damping: 25 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ 
              scale: 1.05,
              rotateX: 5,
              y: -5
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-block cursor-pointer"
          >
            <div className="bg-black text-white p-8 relative group overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600"
                initial={{ x: '-100%', skewX: -20 }}
                whileHover={{ x: 0, skewX: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              <h3 className="text-3xl mb-2 font-black tracking-tighter relative z-10">
                気軽に相談してみる
              </h3>
              <p className="text-gray-300 group-hover:text-white relative z-10 transition-colors duration-300">
                「とりあえず相談してみたい」そんな軽いお問い合わせも大歓迎です。<br />
                気軽にご連絡ください。
              </p>
            </div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
