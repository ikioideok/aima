import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, User, TrendingUp, Heart, Share, Bookmark } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface FluidCardProps {
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  imageUrl: string;
  trending?: boolean;
  featured?: boolean;
}

export function FluidCard({
  title,
  excerpt,
  author,
  readTime,
  category,
  imageUrl,
  trending = false,
  featured = false
}: FluidCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const categoryColors = {
    "AI Technology": "from-blue-500 to-blue-600",
    "Machine Learning": "from-purple-500 to-purple-600", 
    "Innovation": "from-pink-500 to-pink-600",
    "Future Tech": "from-indigo-500 to-indigo-600",
    "Research": "from-violet-500 to-violet-600"
  };

  const getBgColor = () => {
    return categoryColors[category as keyof typeof categoryColors] || "from-gray-500 to-gray-600";
  };

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating gradient background */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${getBgColor()} rounded-3xl blur-lg transition-all duration-500 ${
        isHovered ? 'opacity-20 scale-105' : 'opacity-0'
      }`} />
      
      <Card className={`relative bg-white/80 backdrop-blur-sm border-gray-200/50 transition-all duration-500 hover:shadow-xl cursor-pointer overflow-hidden rounded-3xl ${
        isHovered ? 'transform scale-[1.02] shadow-2xl border-purple-300/50' : 'shadow-md'
      } ${featured ? 'lg:col-span-2' : ''}`}>
        <CardContent className="p-0">
          <div className={`${featured ? 'lg:flex' : ''} h-full`}>
            {/* Image section */}
            <div className={`relative overflow-hidden ${
              featured ? 'lg:w-1/2' : 'aspect-video'
            }`}>
              <ImageWithFallback
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* Category badge */}
              <Badge 
                variant="secondary" 
                className={`absolute top-4 left-4 bg-gradient-to-r ${getBgColor()} text-white border-0 shadow-lg backdrop-blur-sm`}
              >
                {category}
              </Badge>

              {/* Trending indicator */}
              {trending && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </div>
              )}

              {/* Action buttons */}
              <div className={`absolute bottom-4 right-4 flex gap-2 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLiked(!isLiked);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBookmarked(!isBookmarked);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                  }`}
                >
                  <Bookmark className={`h-3 w-3 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Content section */}
            <div className={`p-6 flex flex-col justify-between ${
              featured ? 'lg:w-1/2' : ''
            }`}>
              <div className="space-y-4">
                <h3 className={`font-bold line-clamp-2 group-hover:text-purple-600 transition-colors duration-300 ${
                  featured ? 'text-2xl' : 'text-lg'
                } text-gray-800`}>
                  {title}
                </h3>
                
                <p className={`text-gray-600 line-clamp-3 leading-relaxed ${
                  featured ? 'text-base' : 'text-sm'
                }`}>
                  {excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">{author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{readTime}</span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-purple-500 transition-colors duration-300"
                >
                  <Share className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className={`h-1 bg-gradient-to-r ${getBgColor()} transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </CardContent>
      </Card>
    </div>
  );
}