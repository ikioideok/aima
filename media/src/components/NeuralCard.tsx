import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, User, Zap, Brain, Activity, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface NeuralCardProps {
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  imageUrl: string;
  neuralScore?: number;
  isQuantum?: boolean;
  priority?: "high" | "medium" | "low";
}

export function NeuralCard({
  title,
  excerpt,
  author,
  readTime,
  category,
  imageUrl,
  neuralScore = 85,
  isQuantum = false,
  priority = "medium"
}: NeuralCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    high: "cyan",
    medium: "purple", 
    low: "blue"
  };

  const color = priorityColors[priority];

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-${color}-500/20 to-purple-500/20 rounded-xl blur-lg transition-all duration-500 ${
        isHovered ? 'opacity-100 scale-105' : 'opacity-0'
      }`} />
      
      {/* Neural Scan Lines */}
      <div className={`absolute inset-0 overflow-hidden rounded-xl transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse delay-500" />
      </div>

      <Card className={`relative bg-gray-900/90 backdrop-blur-xl border-${color}-500/30 transition-all duration-500 hover:border-${color}-500/60 cursor-pointer ${
        isHovered ? 'transform scale-105 shadow-2xl shadow-cyan-500/20' : ''
      }`}>
        <CardContent className="p-0 overflow-hidden">
          {/* Neural Header */}
          <div className="relative">
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Neural Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
            
            {/* Quantum Badge */}
            {isQuantum && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap className="h-3 w-3" />
                QUANTUM
              </div>
            )}

            {/* Neural Score */}
            <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-2 border border-cyan-500/30">
              <div className="flex items-center gap-2 text-xs">
                <Brain className="h-3 w-3 text-cyan-400" />
                <span className="text-cyan-300 font-mono">{neuralScore}%</span>
              </div>
            </div>

            {/* Category Badge */}
            <Badge 
              variant="secondary" 
              className={`absolute bottom-4 left-4 bg-${color}-500/20 border-${color}-500/50 text-${color}-300`}
            >
              {category}
            </Badge>
          </div>

          {/* Neural Content */}
          <div className="p-6 space-y-4">
            {/* Title with Neural Effect */}
            <div className="relative">
              <h3 className={`text-lg font-bold text-${color}-100 group-hover:text-${color}-300 transition-colors duration-300 line-clamp-2`}>
                {title}
              </h3>
              {isHovered && (
                <div className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-${color}-500 to-transparent transition-all duration-500 w-full`} />
              )}
            </div>
            
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
              {excerpt}
            </p>

            {/* Neural Metrics */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readTime}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Neural Activity Indicator */}
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-green-400" />
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                </div>
                
                {/* View Action */}
                <div className={`flex items-center gap-1 text-xs text-${color}-400 group-hover:text-${color}-300 transition-colors cursor-pointer`}>
                  <Eye className="h-3 w-3" />
                  <span>Neural Link</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Neural Glow */}
          <div className={`h-1 bg-gradient-to-r from-${color}-500/0 via-${color}-500/50 to-${color}-500/0 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </CardContent>
      </Card>
    </div>
  );
}