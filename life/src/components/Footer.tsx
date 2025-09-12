import { Eye, Mail, Shield, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* サイト情報 */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">人生診断</h3>
                <p className="text-xs text-gray-600">死ぬまで見える未来</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              AIと心理学の力で、あなただけの人生のロードマップを描き出します。
            </p>
            <p className="text-xs text-gray-500">
              © 2024 人生診断. All rights reserved.
            </p>
          </div>

          {/* サービス */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">サービス</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#diagnosis" className="hover:text-gray-900 transition-colors">
                  人生診断
                </a>
              </li>
              <li>
                <a href="#report" className="hover:text-gray-900 transition-colors">
                  詳細レポート
                </a>
              </li>
              <li>
                <a href="#consultation" className="hover:text-gray-900 transition-colors">
                  個人相談
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-gray-900 transition-colors">
                  API連携
                </a>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">サポート</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#faq" className="hover:text-gray-900 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  よくある質問
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gray-900 transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-gray-900 transition-colors">
                  ヘルプセンター
                </a>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">法的情報</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#privacy" className="hover:text-gray-900 transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-gray-900 transition-colors">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#law" className="hover:text-gray-900 transition-colors">
                  特定商取引法
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-gray-900 transition-colors">
                  免責事項
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 下部セクション */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span>運営会社: 株式会社ライフテック</span>
              <span>所在地: 東京都渋谷区</span>
            </div>
            <div className="text-xs text-gray-500">
              <span>本診断結果は参考情報であり、将来を保証するものではありません。</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}