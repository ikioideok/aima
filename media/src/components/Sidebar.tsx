import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TrendingUp, User, Mail, Twitter, Github, Linkedin } from "lucide-react";
import featuredArticle from '../data/featuredArticle.json'
import specialArticles from '../data/specialArticles.json'
import recentArticles from '../data/recentArticles.json'
import siteOwner from '../data/siteOwner.json'
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CompactCard } from "./CompactCard";
import recommendedSlugs from '../data/recommended.json'

export function Sidebar() {
  const popularArticles = [
    { title: "CV向上のためのLP改善チェックリスト", readTime: "6分", views: "12.3k" },
    { title: "Google広告の入札戦略を成果別に最適化する方法", readTime: "8分", views: "9.8k" },
    { title: "BtoB向けコンテンツマーケのKPI設計", readTime: "9分", views: "7.2k" },
    { title: "SEOに強い情報設計：サイト構造と内部リンク", readTime: "10分", views: "6.1k" }
  ];

  function slugify(str: string): string {
    return String(str || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const categories = (() => {
    const all = [featuredArticle, ...specialArticles, ...recentArticles].filter(Boolean) as any[]
    const map = new Map<string, { name: string, count: number, slug: string }>()
    for (const a of all) {
      const name = a?.category || 'その他'
      const slug = slugify(name)
      const cur = map.get(slug) || { name, count: 0, slug }
      cur.count += 1
      map.set(slug, cur)
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  })();

  return (
    <aside className="space-y-6">
      {/* Editorial Picks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">編集部おすすめ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(() => {
            const pool = [featuredArticle, ...specialArticles, ...recentArticles].filter(Boolean) as any[]
            const bySlug = new Map(pool.map((a) => [a.slug, a]))
            const picks = (recommendedSlugs as string[])
              .map((s) => bySlug.get(s))
              .filter(Boolean) as any[]
            const fallback = picks.length ? picks : specialArticles.slice(0, 3)
            return fallback.slice(0, 3).map((a) => (
              <a key={a.slug} href={`/media/articles/${a.slug}/`}>
                <CompactCard {...a} />
              </a>
            ))
          })()}
        </CardContent>
      </Card>
      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">最新情報をお届け</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            マーケティングの最新トレンドと実務ノウハウを、週1回のニュースレターでお届けします。
          </p>
          <div className="space-y-3">
            <Input placeholder="メールアドレス" />
            <Button className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              購読する
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            いつでも配信停止できます
          </p>
        </CardContent>
      </Card>

      {/* Resources CTA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">無料テンプレート・資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            記事ブリーフ雛形、チェックリスト、プロンプト例など、すぐ使える実務テンプレを配布中。資料請求・ダウンロードのご相談はお気軽に。
          </p>
          <Button asChild className="w-full">
            <a href="https://ai-and-marketing.jp/#contact" rel="noopener noreferrer">資料について相談する</a>
          </Button>
        </CardContent>
      </Card>

      {/* Popular Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            人気記事
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularArticles.map((article, index) => (
            <div
              key={index}
              className="group cursor-pointer pb-4 border-b border-border last:border-b-0 last:pb-0"
            >
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors mb-2">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{article.readTime}</span>
                <span>•</span>
                <span>{article.views} views</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">カテゴリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`/media/category/${category.slug}/`}
                className="flex items-center justify-between py-1 hover:text-primary transition-colors"
              >
                <span className="text-sm">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Owner/Supervisor Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">監修者について</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {siteOwner.avatarUrl ? (
              <img src={siteOwner.avatarUrl} alt={siteOwner.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <h4 className="font-medium">{siteOwner.name || '（要入力）'}</h4>
              <p className="text-sm text-muted-foreground">{siteOwner.title || '代表'}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{siteOwner.bio}</p>
          <div className="flex flex-wrap gap-2">
            {siteOwner.links?.site && (
              <Button asChild variant="outline" size="sm">
                <a href={siteOwner.links.site} rel="noopener noreferrer">公式サイト</a>
              </Button>
            )}
            {siteOwner.links?.twitter && (
              <Button asChild variant="outline" size="sm">
                <a href={siteOwner.links.twitter} rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
              </Button>
            )}
            {siteOwner.links?.github && (
              <Button asChild variant="outline" size="sm">
                <a href={siteOwner.links.github} rel="noopener noreferrer"><Github className="h-4 w-4" /></a>
              </Button>
            )}
            {siteOwner.links?.linkedin && (
              <Button asChild variant="outline" size="sm">
                <a href={siteOwner.links.linkedin} rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/** タグ機能は現状未運用のため非表示（将来再導入時に復活） */}
    </aside>
  );
}
