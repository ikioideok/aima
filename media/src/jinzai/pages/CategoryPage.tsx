import React from 'react'
import { JinzaiHeader } from '../components/JinzaiHeader'
import { JinzaiFooter } from '../components/JinzaiFooter'

type Kind = 'hiring' | 'retention' | 'staffing' | 'efficiency' | 'quality'

const CATEGORIES: Record<Kind, { title: string; desc: string; bullets: string[] } > = {
  hiring: {
    title: '採用が決まらない',
    desc: '応募数・歩留まり・採用単価を見直し、「決まる」採用へ。母集団形成と候補者体験を最短で整えます。',
    bullets: [
      '求人打ち出しの差別化（職務内容・報酬以外の3点）',
      '応募→面談予約の返信テンプレ/即レス体制',
      '再募集/紹介/母集団の拡張とチャネル見直し',
    ],
  },
  retention: {
    title: '定着しない・育成が回らない',
    desc: '入社90日オンボーディングと育成の標準化で、早期離職を防ぎ、立ち上がりを加速します。',
    bullets: [
      '入社90日のオンボード設計（役割/期待/支援）',
      'OJTの型と評価の期待合わせ',
      '1on1運用の基本（頻度・アジェンダ・記録）',
    ],
  },
  staffing: {
    title: '配置・シフトが組めない',
    desc: 'スキルと稼働の見える化で、人員の過不足を平準化。繁忙期の柔軟シフトを実現します。',
    bullets: [
      'スキルマトリクスの作り方（誰が何ができるか）',
      '繁忙期シフトの3原則（優先・代替・平準化）',
      '要員計画の型（見込み/実績/差分の管理）',
    ],
  },
  efficiency: {
    title: '業務効率化（現場・バックオフィス）',
    desc: '紙・転記・属人化をやめる。現場/バックオフィスの作業をシンプルにし、ムダを削減します。',
    bullets: [
      '点検/日報フォーム化と写真・音声の活用',
      '請求/経費の月中処理とワークフロー整備',
      'よくある質問・標準手順の整備と検索性',
    ],
  },
  quality: {
    title: '安全・品質を維持できない',
    desc: 'チェックリストと初動対応の標準化で、抜け漏れを減らし、再発防止の仕組みを作ります。',
    bullets: [
      '点検抜けゼロのチェックリスト運用',
      '初動対応カード（連絡/隔離/記録/報告）',
      '証跡（写真/動画/ログ）の残し方',
    ],
  },
}

export default function CategoryPage({ kind }: { kind: Kind }) {
  const cfg = CATEGORIES[kind]
  return (
    <div className="min-h-screen bg-background">
      <JinzaiHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-10">
        <section className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold title-font">{cfg.title}</h1>
          <p className="text-muted-foreground text-base md:text-lg">{cfg.desc}</p>
          <ul className="list-disc ml-6 space-y-2 text-sm md:text-base">
            {cfg.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <div className="flex gap-3 pt-2">
            <a href="https://ai-and-marketing.jp/#contact" rel="noopener" className="inline-flex items-center justify-center px-5 py-3 rounded-md border">
              無料で壁打ち相談
            </a>
            <a href="/media/resources/" className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-primary text-primary-foreground">
              雛形・チェックリストを見る
            </a>
          </div>
        </section>
      </main>
      <JinzaiFooter />
    </div>
  )
}

