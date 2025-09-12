import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Calendar, Heart, Briefcase, Wallet, Activity, Users, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { cn } from "../utils/cn";
import { FormData, Answer } from "../types";

interface QuestionFlowProps {
  onComplete: (answers: Answer[]) => void;
  onBack: () => void;
}

// ヘルパーコンポーネント
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </Label>
      {children}
    </div>
  );
}

function RadioGroup({ name, options, value, onChange }: { name: string; options: { label: string; value: string }[]; value?: string; onChange: (v: string) => void }) {
  const selectedIndex = options.findIndex((o) => o.value === value);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!options.length) return;
    const last = options.length - 1;
    let idx = selectedIndex;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        idx = idx < 0 ? 0 : Math.min(last, idx + 1);
        onChange(options[idx].value);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        idx = idx <= 0 ? 0 : idx - 1;
        onChange(options[idx].value);
        break;
      case 'Home':
        e.preventDefault();
        onChange(options[0].value);
        break;
      case 'End':
        e.preventDefault();
        onChange(options[last].value);
        break;
    }
  }

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-2"
      role="radiogroup"
      aria-label={name}
      onKeyDown={handleKeyDown}
    >
      {options.map((opt, i) => {
        const checked = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked || (i === 0 && selectedIndex === -1) ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={cn(
              "border rounded-xl px-3 py-2 text-sm text-left transition shadow-sm",
              checked
                ? "border-gray-600 bg-gray-50 text-gray-900"
                : "border-gray-200 hover:border-gray-300 bg-white"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: { value?: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-500"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>
        {placeholder || "選択してください"}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function QuestionFlow({ onComplete, onBack }: QuestionFlowProps) {
  const steps = useMemo(
    () => [
      { key: "profile", label: "基本プロフィール", icon: Calendar },
      { key: "career", label: "学歴・キャリア", icon: Briefcase },
      { key: "finance", label: "経済・資産", icon: Wallet },
      { key: "health", label: "健康・生活習慣", icon: Activity },
      { key: "family", label: "恋愛・結婚・家庭", icon: Users },
      { key: "values", label: "性格・価値観", icon: Heart },
      { key: "goals", label: "夢・目標", icon: Target },
      { key: "review", label: "確認・送信", icon: Check },
    ],
    []
  );

  const [step, setStep] = useState(0);
  // 開発用のデフォルト入力（年齢70、性別女性、学歴：大学）
  const defaultData: FormData = (import.meta as any).env?.DEV
    ? { age: '70', gender: 'female', education: '大学' }
    : {};
  const [data, setData] = useState<FormData>(defaultData);
  const current = steps[step];

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  const progress = ((step + 1) / steps.length) * 100;

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else {
      // フォームデータをAnswer形式に変換
      const answers: Answer[] = Object.entries(data).map(([key, value]) => ({
        questionId: key,
        value: value || ""
      }));
      onComplete(answers);
    }
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
    else onBack();
  }

  // 各ステップで必須項目がチェックされているかを確認
  const canProceed = () => {
    switch (current.key) {
      case "profile":
        return data.age && data.gender;
      case "career":
        return data.education;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gray-600 shadow-md grid place-items-center">
              <span className="text-white font-bold">診</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
                人生診断フォーム
              </h1>
              <p className="text-gray-500 text-sm">あなたの未来を見通すための詳細診断</p>
            </div>
          </div>
        </div>

        {/* プログレス */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center">
                  <div
                    className={cn(
                      "h-8 px-3 rounded-full text-xs font-medium flex items-center gap-2 border whitespace-nowrap",
                      i === step
                        ? "bg-gray-600 text-white border-gray-600 shadow"
                        : i < step
                        ? "bg-gray-50 text-gray-700 border-gray-200"
                        : "bg-white text-gray-600 border-gray-200"
                    )}
                  >
                    <s.icon className="h-3.5 w-3.5" /> {s.label}
                  </div>
                  {i < steps.length - 1 && <div className="w-3 md:w-5" />}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-600/80 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* メインコンテンツ */}
        <Card className="rounded-3xl border-gray-200 shadow-xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
              {current.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {current.key === "profile" && (
                    <>
                      <Field label="年齢" required>
                        <Input
                          type="number"
                          placeholder="例：29"
                          value={data.age || ""}
                          onChange={(e) => set("age", e.target.value)}
                        />
                      </Field>
                      <Field label="性別" required>
                        <RadioGroup
                          name="gender"
                          value={data.gender}
                          onChange={(v) => set("gender", v)}
                          options={[
                            { label: "男性", value: "male" },
                            { label: "女性", value: "female" },
                            { label: "その他", value: "other" },
                          ]}
                        />
                      </Field>
                      <Field label="出生地">
                        <Input
                          placeholder="都道府県または国名"
                          value={data.birthPlace || ""}
                          onChange={(e) => set("birthPlace", e.target.value)}
                        />
                      </Field>
                      <Field label="現在の居住地">
                        <RadioGroup
                          name="residence"
                          value={data.residence}
                          onChange={(v) => set("residence", v)}
                          options={[
                            { label: "都市部", value: "urban" },
                            { label: "地方", value: "rural" },
                            { label: "海外", value: "overseas" },
                          ]}
                        />
                      </Field>
                      <Field label="家族構成">
                        <Select
                          value={data.family}
                          onChange={(v) => set("family", v)}
                          options={["独身", "既婚（子なし）", "既婚（子あり）", "同居家族あり"]}
                          placeholder="選択"
                        />
                      </Field>
                    </>
                  )}

                  {current.key === "career" && (
                    <>
                      <Field label="最終学歴" required>
                        <Select
                          value={data.education}
                          onChange={(v) => set("education", v)}
                          options={["高校", "専門", "短大・高専", "大学", "大学院以上"]}
                        />
                      </Field>
                      <Field label="現在の職業">
                        <Input
                          placeholder="例：Webエンジニア／営業／自営業 など"
                          value={data.occupation || ""}
                          onChange={(e) => set("occupation", e.target.value)}
                        />
                      </Field>
                      <Field label="勤続年数">
                        <Select
                          value={data.tenure}
                          onChange={(v) => set("tenure", v)}
                          options={["1年未満", "1〜3年", "4〜7年", "8年以上"]}
                        />
                      </Field>
                      <Field label="転職経験">
                        <Select
                          value={data.changes}
                          onChange={(v) => set("changes", v)}
                          options={["なし", "1回", "2回以上"]}
                        />
                      </Field>
                      <Field label="現在の年収">
                        <Select
                          value={data.income}
                          onChange={(v) => set("income", v)}
                          options={["〜300万", "300〜500万", "500〜800万", "800万以上"]}
                        />
                      </Field>
                      <Field label="将来やってみたい仕事">
                        <Input
                          placeholder="自由入力"
                          value={data.futureJob || ""}
                          onChange={(e) => set("futureJob", e.target.value)}
                        />
                      </Field>
                    </>
                  )}

                  {current.key === "finance" && (
                    <>
                      <Field label="現在の貯金額">
                        <Select
                          value={data.savings}
                          onChange={(v) => set("savings", v)}
                          options={["〜50万", "50〜200万", "200〜500万", "500万以上"]}
                        />
                      </Field>
                      <Field label="投資状況">
                        <Select
                          value={data.investing}
                          onChange={(v) => set("investing", v)}
                          options={["していない", "NISAなど少額", "株式・投資信託", "不動産など本格的"]}
                        />
                      </Field>
                      <Field label="借入の有無">
                        <Select
                          value={data.debt}
                          onChange={(v) => set("debt", v)}
                          options={["なし", "住宅ローン", "奨学金", "その他ローン"]}
                        />
                      </Field>
                      <Field label="お金の使い方に近いのは？">
                        <RadioGroup
                          name="spending"
                          value={data.spending}
                          onChange={(v) => set("spending", v)}
                          options={[
                            { label: "貯金重視", value: "save" },
                            { label: "バランス型", value: "balance" },
                            { label: "浪費傾向", value: "spend" },
                          ]}
                        />
                      </Field>
                      <Field label="資産形成の不安度 (1-5)">
                        <Input
                          type="range"
                          min={1}
                          max={5}
                          value={data.financeFear || 3}
                          onChange={(e) => set("financeFear", Number(e.target.value))}
                        />
                        <div className="text-xs text-gray-500">現在: {data.financeFear || 3}</div>
                      </Field>
                    </>
                  )}

                  {current.key === "health" && (
                    <>
                      <Field label="身長 (cm)">
                        <Input type="number" value={data.height || ""} onChange={(e) => set("height", e.target.value)} placeholder="例：170" />
                      </Field>
                      <Field label="体重 (kg)">
                        <Input type="number" value={data.weight || ""} onChange={(e) => set("weight", e.target.value)} placeholder="例：63" />
                      </Field>
                      <Field label="喫煙習慣">
                        <Select value={data.smoke} onChange={(v) => set("smoke", v)} options={["吸わない", "時々", "毎日"]} />
                      </Field>
                      <Field label="飲酒習慣">
                        <Select value={data.drink} onChange={(v) => set("drink", v)} options={["ほとんど飲まない", "週1〜2回", "週3回以上"]} />
                      </Field>
                      <Field label="運動習慣">
                        <Select value={data.exercise} onChange={(v) => set("exercise", v)} options={["しない", "月1回", "週1〜2回", "週3回以上"]} />
                      </Field>
                      <Field label="平均睡眠時間">
                        <Select value={data.sleep} onChange={(v) => set("sleep", v)} options={["5時間未満", "6〜7時間", "8時間以上"]} />
                      </Field>
                      <Field label="ストレスレベル">
                        <Select value={data.stress} onChange={(v) => set("stress", v)} options={["低い", "普通", "高い"]} />
                      </Field>
                      <Field label="健康診断の受診">
                        <RadioGroup
                          name="checkup"
                          value={data.checkup}
                          onChange={(v) => set("checkup", v)}
                          options={[
                            { label: "毎年受診", value: "annual" },
                            { label: "数年に一度", value: "rare" },
                            { label: "受けていない", value: "none" },
                          ]}
                        />
                      </Field>
                    </>
                  )}

                  {current.key === "family" && (
                    <>
                      <Field label="恋愛経験">
                        <Select value={data.loveExp} onChange={(v) => set("loveExp", v)} options={["なし", "少し", "多い"]} />
                      </Field>
                      <Field label="結婚願望">
                        <RadioGroup
                          name="marriage"
                          value={data.marriage}
                          onChange={(v) => set("marriage", v)}
                          options={[
                            { label: "ある", value: "yes" },
                            { label: "ない", value: "no" },
                            { label: "未定", value: "maybe" },
                          ]}
                        />
                      </Field>
                      <Field label="理想の結婚時期（年齢）">
                        <Input type="number" placeholder="例：30" value={data.marriageAge || ""} onChange={(e) => set("marriageAge", e.target.value)} />
                      </Field>
                      <Field label="子ども希望">
                        <Select value={data.children} onChange={(v) => set("children", v)} options={["0", "1", "2", "3以上"]} />
                      </Field>
                      <Field label="家族との関係性">
                        <Select value={data.familyRel} onChange={(v) => set("familyRel", v)} options={["良好", "普通", "不和"]} />
                      </Field>
                    </>
                  )}

                  {current.key === "values" && (
                    <>
                      <Field label="初対面の人とすぐ打ち解けられる？">
                        <RadioGroup
                          name="social"
                          value={data.social}
                          onChange={(v) => set("social", v)}
                          options={[
                            { label: "はい", value: "yes" },
                            { label: "いいえ", value: "no" },
                          ]}
                        />
                      </Field>
                      <Field label="大きな決断は？">
                        <RadioGroup
                          name="decision"
                          value={data.decision}
                          onChange={(v) => set("decision", v)}
                          options={[
                            { label: "直感派", value: "intuition" },
                            { label: "計画派", value: "plan" },
                          ]}
                        />
                      </Field>
                      <Field label="ストレスがたまったときの行動">
                        <Select
                          value={data.stressAct}
                          onChange={(v) => set("stressAct", v)}
                          options={["食べる", "寝る", "運動", "買い物", "相談する"]}
                        />
                      </Field>
                      <Field label="一番大事にしているもの">
                        <Select
                          value={data.priority}
                          onChange={(v) => set("priority", v)}
                          options={["お金", "家族", "健康", "自由", "挑戦", "安定"]}
                        />
                      </Field>
                      <Field label="あなたを一言で表すなら？">
                        <Input value={data.selfOne || ""} onChange={(e) => set("selfOne", e.target.value)} placeholder="例：探究心の塊" />
                      </Field>
                    </>
                  )}

                  {current.key === "goals" && (
                    <>
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="10年後に達成していたいこと">
                          <Textarea rows={4} value={data.tenYears || ""} onChange={(e) => set("tenYears", e.target.value)} placeholder="例：年収◯◯／海外居住／事業を立ち上げる など" />
                        </Field>
                        <Field label="死ぬまでにやりたいこと（Bucket List）">
                          <Textarea rows={4} value={data.bucket || ""} onChange={(e) => set("bucket", e.target.value)} placeholder="例：世界一周／本を出版／家族で◯◯" />
                        </Field>
                        <Field label="将来住みたい場所">
                          <Select value={data.liveWhere} onChange={(v) => set("liveWhere", v)} options={["都会", "郊外", "海外", "今のまま"]} />
                        </Field>
                        <Field label="理想の人生像（短く）">
                          <Input value={data.ideal || ""} onChange={(e) => set("ideal", e.target.value)} placeholder="例：自由で健康、家族と豊かに暮らす" />
                        </Field>
                      </div>
                    </>
                  )}

                  {current.key === "review" && (
                    <div className="md:col-span-2">
                      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">入力内容の確認</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700 mb-2">基本情報</p>
                            <ul className="space-y-1 text-gray-600">
                              <li>年齢: {data.age}歳</li>
                              <li>性別: {data.gender === "male" ? "男性" : data.gender === "female" ? "女性" : "その他"}</li>
                              <li>居住地: {data.residence}</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 mb-2">キャリア</p>
                            <ul className="space-y-1 text-gray-600">
                              <li>学歴: {data.education}</li>
                              <li>職業: {data.occupation || "未入力"}</li>
                              <li>年収: {data.income}</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 mb-2">価値観</p>
                            <ul className="space-y-1 text-gray-600">
                              <li>大切なもの: {data.priority}</li>
                              <li>決断スタイル: {data.decision === "intuition" ? "直感派" : "計画派"}</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 mb-2">目標</p>
                            <ul className="space-y-1 text-gray-600">
                              <li>理想の人生: {data.ideal || "未入力"}</li>
                              <li>居住希望: {data.liveWhere}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        診断結果は、入力いただいた情報をもとに AI が分析・生成いたします
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* フッターナビゲーション */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" className="rounded-xl" onClick={prev} disabled={step === 0}>
                <ChevronLeft className="h-4 w-4 mr-1" /> 戻る
              </Button>
              <div className="flex items-center gap-2">
                {step < steps.length - 1 ? (
                  <Button 
                    className="rounded-xl px-6 bg-gray-900 hover:bg-gray-800" 
                    onClick={next}
                    disabled={!canProceed()}
                  >
                    次へ <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button className="rounded-xl px-6 bg-gray-900 hover:bg-gray-800" onClick={next}>
                    診断結果を見る
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
