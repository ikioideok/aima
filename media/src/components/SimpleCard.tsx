import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, User, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SimpleCardProps {
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  imageUrl: string;
  featured?: boolean;
}

export function SimpleCard({
  title,
  excerpt,
  author,
  publishDate,
  readTime,
  category,
  imageUrl,
  featured = false
}: SimpleCardProps) {
  return (
    <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${
      featured ? 'md:col-span-2' : ''
    }`}>
      <CardContent className="p-0">
        <div className={`${featured ? 'md:flex' : ''} h-full`}>
          {/* Image */}
          <div className={`relative overflow-hidden ${
            featured ? 'md:w-1/2' : 'aspect-video'
          }`}>
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            
            {/* Category Badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-3 left-3 bg-background/90 text-foreground"
            >
              {category}
            </Badge>

            {featured && (
              <Badge 
                variant="default" 
                className="absolute top-3 right-3 bg-red-accent text-red-accent-foreground"
              >
                注目記事
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className={`p-6 flex flex-col justify-between ${
            featured ? 'md:w-1/2' : ''
          }`}>
            <div className="space-y-3">
              <h3 className={`font-bold line-clamp-2 group-hover:text-primary transition-colors ${
                featured ? 'text-xl' : 'text-lg'
              }`}>
                {title}
              </h3>
              
              <p className={`text-muted-foreground line-clamp-3 leading-relaxed ${
                featured ? 'text-base' : 'text-sm'
              }`}>
                {excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readTime}</span>
                </div>
                <span>{publishDate}</span>
              </div>
              
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}