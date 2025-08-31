import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, User, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  imageUrl: string;
  isFeature?: boolean;
  trend?: boolean;
}

export function ArticleCard({
  title,
  excerpt,
  author,
  readTime,
  category,
  imageUrl,
  isFeature = false,
  trend = false
}: ArticleCardProps) {
  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-background to-muted/20 ${
      isFeature ? 'lg:col-span-2' : ''
    }`}>
      <CardContent className="p-0">
        <div className={`${isFeature ? 'lg:flex' : ''} h-full`}>
          <div className={`relative overflow-hidden ${
            isFeature ? 'lg:w-1/2' : 'aspect-video'
          }`}>
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Category badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border-0"
            >
              {category}
            </Badge>

            {/* Trending indicator */}
            {trend && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                トレンド
              </div>
            )}
          </div>

          <div className={`p-6 flex flex-col justify-between ${
            isFeature ? 'lg:w-1/2' : ''
          }`}>
            <div className="space-y-3">
              <h3 className={`font-bold line-clamp-2 group-hover:text-blue-600 transition-colors ${
                isFeature ? 'text-2xl' : 'text-lg'
              }`}>
                {title}
              </h3>
              
              <p className={`text-muted-foreground line-clamp-3 ${
                isFeature ? 'text-base' : 'text-sm'
              }`}>
                {excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readTime}</span>
                </div>
              </div>
              
              <div className="text-sm text-blue-600 font-medium group-hover:underline">
                続きを読む →
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}