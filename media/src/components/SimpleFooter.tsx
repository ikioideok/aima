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
              <Button asChild variant="outline" size="sm">
                <a href="/media/" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/media/" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/media/" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/media/feed.xml" aria-label="RSS">
                  <Rss className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-4">
            <h4 className="font-medium">記事</h4>
            <nav className="space-y-2">
              <a href="/media/latest/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">最新記事</a>
              <a href="/media/featured/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">注目記事</a>
              <a href="/media/special/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">特集記事</a>
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
              ].map((item) => {
                const slug = String(item)
                  .toLowerCase()
                  .normalize('NFKD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9\s-]/g, '')
                  .trim()
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                return (
                  <a 
                    key={item}
                    href={`/media/category/${slug}/`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                )
              })}
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-medium">運営者情報</h4>
            <nav className="space-y-2">
              <a 
                href="/jinzai/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                AIで人材不足解決.com
              </a>
              <a 
                href="https://ai-and-marketing.jp/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                rel="noopener noreferrer"
              >
                会社情報
              </a>
              <a 
                href="https://ai-and-marketing.jp/#contact"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                rel="noopener noreferrer"
              >
                お問い合わせ
              </a>
              <a 
                href="/media/privacy/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                プライバシーポリシー
              </a>
              <a 
                href="/media/terms/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                利用規約
              </a>
              <a 
                href="/media/ads/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                広告掲載
              </a>
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
