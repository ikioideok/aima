import { SimpleHeader } from "./components/SimpleHeader";
import { SimpleCard } from "./components/SimpleCard";
import { CompactCard } from "./components/CompactCard";
import { Sidebar } from "./components/Sidebar";
import { SimpleFooter } from "./components/SimpleFooter";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { ArrowRight, TrendingUp, Star, Zap } from "lucide-react";

import featuredArticle from "./data/featuredArticle.json";
import specialArticles from "./data/specialArticles.json";
import recentArticles from "./data/recentArticles.json";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground title-font">
              <span className="text-red-accent">AI</span> Media Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              人工知能の最新技術動向、研究成果、ビジネス応用まで、
              AI分野の信頼できる情報をわかりやすくお届けします
            </p>
          </div>
        </section>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Article */}
            <section>
              <SimpleCard {...featuredArticle} />
            </section>

            {/* Special Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="h-6 w-6 text-red-accent" />
                  特集
                </h2>
                <Button variant="outline" className="border-red-accent text-red-accent hover:bg-red-accent hover:text-red-accent-foreground">
                  特集一覧
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specialArticles.map((article, index) => (
                  <SimpleCard key={index} {...article} />
                ))}
              </div>
            </section>

            {/* Recent Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="h-6 w-6 text-red-accent" />
                  最新記事
                </h2>
                <Button variant="outline" className="border-red-accent text-red-accent hover:bg-red-accent hover:text-red-accent-foreground">
                  すべて見る
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentArticles.map((article, index) => (
                  <CompactCard key={index} {...article} />
                ))}
              </div>
            </section>

            {/* Load More */}
            <div className="text-center pt-8">
              <Button size="lg" className="bg-red-accent text-red-accent-foreground hover:bg-red-accent/90">
                さらに記事を読む
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}