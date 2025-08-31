import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TrendingUp, User, Mail, Twitter, Github, Linkedin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Sidebar() {
  const popularArticles = [
    {
      title: "ChatGPT-4の最新アップデートで変わること",
      readTime: "5分",
      views: "12.3k"
    },
    {
      title: "画像生成AIの商用利用における注意点",
      readTime: "8分", 
      views: "9.8k"
    },
    {
      title: "機械学習エンジニアのキャリアパス2024",
      readTime: "12分",
      views: "7.2k"
    },
    {
      title: "AutoMLツール比較：初心者向けガイド",
      readTime: "10分",
      views: "6.1k"
    }
  ];

  const categories = [
    { name: "機械学習", count: 45 },
    { name: "深層学習", count: 32 },
    { name: "自然言語処理", count: 28 },
    { name: "コンピュータビジョン", count: 24 },
    { name: "データサイエンス", count: 38 },
    { name: "AI倫理", count: 15 },
    { name: "ビジネスAI", count: 22 }
  ];

  return (
    <aside className="space-y-6">
      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">最新情報をお届け</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            AI技術の最新動向や深い洞察を週1回のニュースレターでお届けします。
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
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1 cursor-pointer hover:text-primary transition-colors"
              >
                <span className="text-sm">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Author Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">執筆者について</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium">田中 太郎</h4>
              <p className="text-sm text-muted-foreground">AI研究者</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            機械学習とAI倫理を専門とする研究者。最新のAI技術動向と社会への影響について執筆しています。
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
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">タグ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "Python", "TensorFlow", "PyTorch", "OpenAI", "Hugging Face",
              "Transformer", "CNN", "RNN", "GAN", "BERT", "GPT", "DALL-E"
            ].map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}