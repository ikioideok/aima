import React, { useMemo, useState } from 'react'
import { JinzaiHeader } from '../components/JinzaiHeader'
import { JinzaiFooter } from '../components/JinzaiFooter'
import links from '../data/links.json'

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

        {/* Categories */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {[
            { kind: 'hiring', href: '/jinzai/hiring/', title: '採用', desc: '応募・歩留まり・採用単価の見直し' },
            { kind: 'retention', href: '/jinzai/retention/', title: '定着・育成', desc: '入社90日オンボードと育成の標準化' },
            { kind: 'staffing', href: '/jinzai/staffing/', title: '配置', desc: 'スキル見える化と柔軟シフト' },
            { kind: 'efficiency', href: '/jinzai/efficiency/', title: '業務効率', desc: '紙・転記・属人化をやめる' },
            { kind: 'quality', href: '/jinzai/quality/', title: '安全・品質', desc: 'チェックリストと初動対応の標準化' },
          ].map((b) => {
            const items = (links as any)[b.kind] as Array<{ title: string; href: string }>
            return (
              <div key={b.title} className="p-5 rounded-lg border bg-card">
                <a href={b.href} className="block hover:underline">
                  <div className="font-semibold mb-1">{b.title}</div>
                </a>
                <div className="text-sm text-muted-foreground mb-3">{b.desc}</div>
                {Array.isArray(items) && items.length > 0 && (
                  <ul className="text-sm space-y-1">
                    {items.slice(0,3).map((it, i) => (
                      <li key={i} className="truncate">
                        <a
                          href={it.href}
                          className="text-primary underline underline-offset-2 inline-flex items-center gap-1 hover:opacity-90"
                        >
                          <span className="truncate">{it.title}</span>
                          <span aria-hidden className="shrink-0">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
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
