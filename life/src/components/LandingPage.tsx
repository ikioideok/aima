import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Brain, Eye, Scroll, Clock } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヒーローセクション */}
        <div className="text-center mb-16 pt-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-gray-900">
            あなたの人生、<br />
            <span className="text-gray-600">死ぬまで全部見えます。</span>
          </h1>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            生年月日と20の質問から、AIがあなただけの一生を<br />
            年表と手紙で描き出します。
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-gray-600 mb-12">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              未来予知
            </span>
            <span className="flex items-center gap-2">
              <Scroll className="w-4 h-4" />
              人生年表
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              運命解析
            </span>
          </div>
        </div>

        {/* 体験概要セクション */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            あなたが得られる、未来の断片
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl">
                  未来年表
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  転機・出会い・仕事・お金・健康。あなたに訪れる主要な出来事を、年齢という時間軸で具体的に可視化します。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
              <CardTitle className="text-gray-900 text-xl">
                  未来の自分からの手紙
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  人生の節目に立つ、未来のあなたから短い手紙が届きます。その言葉は、迷いを晴らし、決断のヒントを与えてくれるでしょう。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl">
                  分岐の示唆
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  人生は選択の連続です。「このまま進んだ場合」と「もし今、何かを変えるなら」。可能性の分岐点を、数行の言葉で添えます。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 根拠感セクション */}
        <Card className="mb-16 bg-white border-gray-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-900 text-2xl mb-4">
              AI × 心理質問 × 未来モデル
            </CardTitle>
            <CardDescription className="text-gray-700 text-lg leading-relaxed">
              20の質問で"いまのあなた"の傾向を把握し、AIが未来のシナリオを組み立てます。<br />
              断定ではなく、いまの選択から辿りやすい道筋を提示します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-gray-900 mb-3 text-lg">心理学的アプローチ</h3>
                <p className="text-gray-600 leading-relaxed">あなたの価値観や行動傾向の本質を、設問から多角的に分析します。</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-gray-900 mb-3 text-lg">AIによるシナリオ生成</h3>
                <p className="text-gray-600 leading-relaxed">膨大な学習データに基づき、あなたに固有の未来の可能性を導き出します。</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-gray-900 mb-3 text-lg">時間軸シミュレーション</h3>
                <p className="text-gray-600 leading-relaxed">年齢という時間軸に沿って、ライフイベントの発生確率をシミュレートします。</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={onStart} 
            size="lg" 
            className="px-12 py-4 text-xl bg-gray-900 text-white hover:bg-gray-800 font-bold transition-colors"
          >
            診断をはじめる
          </Button>
          <p className="text-gray-600 mt-6 text-lg">
            所要時間：約5分。結果はすぐにご覧いただけます。
          </p>
        </div>
      </div>
    </div>
  );
}
