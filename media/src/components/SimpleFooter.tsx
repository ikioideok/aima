import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Twitter, Github, Linkedin, Mail, Rss } from "lucide-react";

export function SimpleFooter() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="w-full max-w-[95vw] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-bold title-font">
                  <span className="text-red-accent">AI</span> Media Hub
                </h3>
                <div className="text-xs text-muted-foreground">人工知能情報メディア</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              人工知能の最新技術動向、研究成果、ビジネス応用まで、
              AI分野の信頼できる情報をお届けします。
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Rss className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h4 className="font-medium">コンテンツ</h4>
            <nav className="space-y-2">
              {[
                "最新記事",
                "AI技術解説", 
                "研究論文解説",
                "ビジネス事例",
                "ツール紹介",
                "インタビュー"
              ].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-medium">カテゴリー</h4>
            <nav className="space-y-2">
              {[
                "機械学習",
                "深層学習",
                "自然言語処理",
                "コンピュータビジョン",
                "データサイエンス",
                "AI倫理"
              ].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-medium">会社情報</h4>
            <nav className="space-y-2">
              {[
                "About",
                "執筆者紹介",
                "お問い合わせ",
                "プライバシーポリシー",
                "利用規約",
                "広告掲載"
              ].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 AI Media Hub</span>
            <span>All rights reserved</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made with ❤️ for AI community</span>
            <Button variant="outline" size="sm" className="h-8">
              <Mail className="h-3 w-3 mr-1" />
              Newsletter
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}