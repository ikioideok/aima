import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Brain, Zap, TrendingUp, BarChart } from "lucide-react";
import { DiagnosisResult, LifelineEvent } from '../types';

interface ResultsPageProps {
  diagnosisResult: DiagnosisResult | null;
  lifespan: number | null;
  lifelineItems: LifelineEvent[];
  isLoading: boolean;
  onRestart: () => void;
}

// Big Fiveのラベルを取得するヘルパー
function getBigFiveLabel(key: string): string {
  const labels: Record<string, string> = {
    openness: '開放性',
    conscientiousness: '誠実性', 
    extraversion: '外向性', 
    agreeableness: '協調性', 
    neuroticism: '神経症的傾向'
  };
  return labels[key] || key;
}

export function ResultsPage({ diagnosisResult, lifespan, lifelineItems, isLoading, onRestart }: ResultsPageProps) {

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">AIがあなたの未来を生成中です...</h2>
        <p className="text-gray-600">
          回答内容を分析し、ライフプランを作成しています。通常10〜30秒ほどかかります。
        </p>
      </div>
    );
  }

  const topCareerAnchor = diagnosisResult ? 
    Object.entries(diagnosisResult.careerAnchor).sort(([, a], [, b]) => b - a)[0]
    : null;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-3xl md:text-4xl mb-3 text-gray-900 font-bold">
            あなたの未来のロードマップ
          </h1>
          <p className="text-gray-700 text-lg">
            AIが描き出す、あなただけの人生の物語
          </p>
        </header>

        {/* 推定寿命 */}
        {lifespan && (
          <Card className="mb-6 bg-white border-gray-200 shadow-lg">
            <CardHeader className="text-center">
              <CardDescription>推定寿命</CardDescription>
              <CardTitle className="text-5xl font-bold text-gray-900">{lifespan}歳</CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* ライフライン */}
        <section id="timeline" className="space-y-6 scroll-mt-24">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Brain className="w-5 h-5 text-gray-600" />
                未来年表（ライフライン）
              </CardTitle>
              <CardDescription className="text-gray-700">
                年齢ごとの出来事をリアルタイムで生成します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lifelineItems.length > 0 ? (
                  lifelineItems.map((item) => (
                    <article key={item.age} className="border rounded-xl p-4 bg-gray-50/80 border-gray-200 relative transition-all duration-500">
                      {item.turning && (
                        <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Zap className="w-3 h-3"/>転機
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900 font-semibold text-lg">{item.age}歳</h3>
                      </div>
                      <p className="text-gray-800 leading-relaxed text-sm md:text-base">{item.text}</p>
                    </article>
                  ))
                ) : (
                  <div className="text-gray-600 text-sm text-center py-8">
                    {lifespan ? '年齢ごとの出来事を生成しています...' : 'AIからの応答を待っています...'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 性格診断サマリー */}
        {diagnosisResult && (
          <section id="summary" className="space-y-6 scroll-mt-24 mt-8">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BarChart className="w-5 h-5 text-gray-600" />
                  あなたの特性サマリー
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">ライフパス</h4>
                  <p className="text-sm text-gray-700">{diagnosisResult.lifePath.description}</p>
                </div>
                {topCareerAnchor && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">キャリアアンカー</h4>
                    <p className="text-sm text-gray-700">あなたのキャリアの軸は「{topCareerAnchor[0]}」({topCareerAnchor[1].toFixed(1)})です。</p>
                  </div>
                )}
                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-semibold">ビッグファイブ特性</h4>
                  <div className="flex flex-wrap gap-2">
                  {Object.entries(diagnosisResult.bigFive).map(([key, value]) => (
                    <div key={key} className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      {getBigFiveLabel(key)}: {value.toFixed(1)}
                    </div>
                  ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" onClick={onRestart}>
            もう一度診断する
          </Button>
        </div>
      </div>
    </div>
  );
}