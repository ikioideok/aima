import { Button } from "./ui/button";
import { Eye, Menu, Settings } from "lucide-react";

interface HeaderProps {
  onNavigateHome?: () => void;
  onNavigateAdmin?: () => void;
}

export function Header({ onNavigateHome, onNavigateAdmin }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・サイト名 */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={onNavigateHome}
          >
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">人生診断</h1>
              <p className="text-xs text-gray-600">死ぬまで見える未来</p>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">
              診断について
            </a>
            <a href="#method" className="text-gray-700 hover:text-gray-900 transition-colors">
              分析手法
            </a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              お問い合わせ
            </a>
            <button onClick={onNavigateAdmin} className="text-gray-700 hover:text-gray-900 transition-colors inline-flex items-center gap-1">
              <Settings className="w-4 h-4" /> 管理
            </button>
          </nav>

          {/* モバイルメニュー */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onNavigateAdmin}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
