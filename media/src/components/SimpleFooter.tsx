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
                <h3 className="font-bold title-font"><span className="text-red-accent">AI</span> Marketing News</h3>
                <div className="text-xs text-muted-foreground">マーケティング情報メディア</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              マーケティング戦略、SEO、広告運用、コンテンツ制作、
              マーケティングAI活用まで、成果につながる実務知見をお届けします。
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

          {/* Articles */}
          <div className="space-y-4">
            <h4 className="font-medium">記事</h4>
            <nav className="space-y-2">
              {["最新記事", "注目記事", "特集記事"].map((item) => (
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
                "コンテンツマーケティング",
                "SEO",
                "広告運用",
                "SNSマーケティング",
                "マーケティング戦略",
                "マーケティングAI/自動化"
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

        <div className="flex justify-center items-center">
          <div className="text-center text-sm text-muted-foreground">
            <div>© 2025 AI Marketing News</div>
            <div>All rights reserved</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
