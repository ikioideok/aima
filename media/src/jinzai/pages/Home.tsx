import React, { useMemo, useState } from 'react'
import { JinzaiHeader } from '../components/JinzaiHeader'
import { JinzaiFooter } from '../components/JinzaiFooter'

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-all px-5 py-3 ${props.className||''}`}
      style={{ backgroundColor: '#005BAC', color: 'white' }}
    />
  )
}

export default function JinzaiHome() {
  return (
    <div className="min-h-screen bg-background">
      <JinzaiHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-10">
        {/* Hero */}
        <section className="text-center space-y-5 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold title-font">人材不足を、現場から解決する</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            採用・育成・配置・現場支援まで。課題に応じて最適な手段（テクノロジー活用含む）を選び、
            まずは「欠員コスト」を見える化し、投資対効果を明確にします。
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="/media/">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-all px-5 py-3 border">
                情報を見る（メディア）
              </button>
            </a>
          </div>
        </section>

        {/* Quick categories */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {[
            { title: '採用×AI', desc: 'JD作成、面接評価、自動日程調整' },
            { title: '育成・定着×AI', desc: 'OJT教材生成、社内FAQ、面談要約' },
            { title: '配置・シフト最適化', desc: 'スキルマトリクス、制約最適化' },
            { title: '現場自動化', desc: '音声→日報、安全点検、書類自動化' },
            { title: 'コンプライアンス', desc: '個人情報・著作権・AI利用ポリシー' },
            { title: 'KPI・ROI', desc: '削減時間・欠員コスト・効果測定' },
          ].map((b) => (
            <div key={b.title} className="p-5 rounded-lg border bg-card">
              <div className="font-semibold mb-1">{b.title}</div>
              <div className="text-sm text-muted-foreground">{b.desc}</div>
            </div>
          ))}
        </section>

        {/* （診断フォームは削除） */}
      </main>
      <JinzaiFooter />
    </div>
  )
}

function number(v: string): number { return Math.max(0, Number(v || '0') || 0) }

function VacancyCostForm() {
  const [headcount, setHeadcount] = useState('1')
  const [monthlyProd, setMonthlyProd] = useState('80') // 1人あたりの月間付加価値(万円)の目安
  const [timeToHire, setTimeToHire] = useState('2') // 採用までの月数
  const [backfillRate, setBackfillRate] = useState('50') // 代替率（チーム補完でどの程度カバーできるか）
  const [extraCost, setExtraCost] = useState('10') // 代替要員・残業・外注等の追加費用(万円)

  const result = useMemo(() => {
    const n = number(headcount)
    const prod = number(monthlyProd)
    const m = number(timeToHire)
    const cover = Math.min(100, Math.max(0, number(backfillRate))) / 100
    const extra = number(extraCost)
    // 損失 = 欠員数 × (月間付加価値 × (1-代替率) × 採用までの月数) + 追加費用
    const loss = n * (prod * (1 - cover) * m) + extra
    return Math.round(loss)
  }, [headcount, monthlyProd, timeToHire, backfillRate, extraCost])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LabeledInput label="欠員人数（人）" value={headcount} onChange={(e)=>setHeadcount(e.target.value)} suffix="人" />
        <LabeledInput label="1人あたり月間付加価値（万円）" value={monthlyProd} onChange={(e)=>setMonthlyProd(e.target.value)} suffix="万円" />
        <LabeledInput label="採用までの期間（月）" value={timeToHire} onChange={(e)=>setTimeToHire(e.target.value)} suffix="ヶ月" />
        <LabeledInput label="代替率（%）" value={backfillRate} onChange={(e)=>setBackfillRate(e.target.value)} suffix="%" />
        <LabeledInput label="追加費用（万円）" value={extraCost} onChange={(e)=>setExtraCost(e.target.value)} suffix="万円" />
      </div>
      <div className="p-4 rounded-lg bg-muted/40 border">
        <div className="text-sm text-muted-foreground">推定損失額（総額・税抜）</div>
        <div className="text-3xl font-bold mt-1" style={{ color: '#005BAC' }}>{result.toLocaleString()} 万円</div>
        <div className="text-xs text-muted-foreground mt-2">※ 試算式: 欠員人数 × (月間付加価値 × (1-代替率) × 採用までの月数) + 追加費用</div>
      </div>
      <div className="flex gap-3">
        <a href="#contact">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-all px-5 py-3 border">詳しい診断・ご相談</button>
        </a>
        <a href="#">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-all px-5 py-3 border">AI活用ポリシー雛形（準備中）</button>
        </a>
      </div>
    </div>
  )
}

function LabeledInput({ label, suffix, ...rest }:{ label: string, suffix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <input type="number" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" {...rest} />
        {suffix ? <span className="text-sm text-muted-foreground w-10 text-right">{suffix}</span> : null}
      </div>
    </label>
  )
}
