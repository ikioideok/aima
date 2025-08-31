import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, User, Eye, Layers, Atom, Zap, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect, useRef } from "react";

interface DimensionalCardProps {
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  imageUrl: string;
  dimension?: number;
  timeline?: "past" | "present" | "future";
  quantumState?: "stable" | "superposition" | "entangled";
  index: number;
}

export function DimensionalCard({
  title,
  excerpt,
  author,
  readTime,
  category,
  imageUrl,
  dimension = 3,
  timeline = "present",
  quantumState = "stable",
  index
}: DimensionalCardProps) {
  const [time, setTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [observationState, setObservationState] = useState<"quantum" | "collapsed">("quantum");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.02);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const phase = time + index * 0.5;
  
  const getTimelineColor = () => {
    switch (timeline) {
      case "past": return `hsl(${220 + Math.sin(phase) * 20}deg, 60%, 50%)`;
      case "present": return `hsl(${160 + Math.sin(phase) * 20}deg, 60%, 50%)`;
      case "future": return `hsl(${280 + Math.sin(phase) * 20}deg, 60%, 50%)`;
    }
  };

  const getQuantumEffect = () => {
    switch (quantumState) {
      case "stable": 
        return {
          opacity: 1,
          blur: 0,
          scale: 1
        };
      case "superposition":
        return {
          opacity: 0.7 + Math.sin(phase * 3) * 0.3,
          blur: Math.abs(Math.sin(phase * 2)) * 2,
          scale: 1 + Math.sin(phase * 4) * 0.05
        };
      case "entangled":
        return {
          opacity: 0.8 + Math.sin(phase * 5) * 0.2,
          blur: Math.abs(Math.cos(phase * 3)) * 1,
          scale: 1 + Math.sin(phase * 6) * 0.03
        };
    }
  };

  const quantumEffect = getQuantumEffect();
  const timelineColor = getTimelineColor();

  return (
    <div 
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => {
        setIsHovered(true);
        setObservationState("collapsed");
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setTimeout(() => setObservationState("quantum"), 500);
      }}
      style={{
        transform: `
          perspective(1000px) 
          rotateX(${10 + Math.sin(phase) * (isHovered ? 2 : 5)}deg) 
          rotateY(${Math.cos(phase * 0.7) * (isHovered ? 1 : 3)}deg) 
          rotateZ(${Math.sin(phase * 0.3) * (isHovered ? 0.5 : 1)}deg)
          translateZ(${isHovered ? 20 : 0}px)
          scale(${quantumEffect.scale})
        `,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease-out',
        filter: `blur(${quantumEffect.blur}px)`,
        opacity: quantumEffect.opacity
      }}
    >
      {/* Dimensional Shadows */}
      {Array.from({ length: dimension }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(${45 + i * 30}deg, 
              rgba(0,0,0,0.1), 
              rgba(0,0,0,0.05))`,
            transform: `
              translateZ(${-10 - i * 5}px) 
              translate(${Math.sin(phase + i) * 2}px, ${Math.cos(phase + i) * 2}px)
              rotateY(${i * 2}deg)
            `,
            opacity: 0.3 - i * 0.1,
            transformStyle: 'preserve-3d'
          }}
        />
      ))}

      {/* Quantum Probability Cloud */}
      <div 
        className="absolute inset-0 rounded-3xl transition-all duration-500"
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(phase) * 20}% ${50 + Math.cos(phase) * 20}%, 
            ${timelineColor}20, 
            ${timelineColor}10, 
            transparent)`,
          transform: `translateZ(-5px) scale(${1.1 + Math.sin(phase) * 0.1})`,
          opacity: isHovered ? 0.8 : 0.4
        }}
      />

      <Card 
        className="relative bg-white/80 backdrop-blur-xl border-0 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl"
        style={{
          background: `linear-gradient(${135 + index * 30}deg, 
            rgba(255,255,255,0.9), 
            rgba(248,250,252,0.8), 
            rgba(241,245,249,0.9))`,
          borderLeft: `4px solid ${timelineColor}`,
          transform: 'translateZ(0)',
          transformStyle: 'preserve-3d'
        }}
      >
        <CardContent className="p-0">
          {/* Image Section with Temporal Distortion */}
          <div 
            className="relative overflow-hidden"
            style={{ height: '240px' }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${phase * 30}deg, 
                  ${timelineColor}20, 
                  transparent 50%, 
                  ${timelineColor}10)`
              }}
            />
            
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-all duration-700"
              style={{
                transform: `
                  scale(${1.1 + Math.sin(phase) * 0.05}) 
                  rotateZ(${Math.sin(phase * 0.5) * 1}deg)
                  translateZ(${Math.sin(phase) * 2}px)
                `,
                filter: `
                  hue-rotate(${Math.sin(phase) * 10}deg) 
                  saturate(${1 + Math.cos(phase) * 0.2})
                  brightness(${1 + Math.sin(phase * 0.3) * 0.1})
                `
              }}
            />

            {/* Timeline Badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 backdrop-blur-sm border-0 shadow-lg transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${timelineColor}90, ${timelineColor}70)`,
                color: 'white',
                transform: `
                  translateZ(5px) 
                  rotateY(${Math.sin(phase) * 5}deg)
                  scale(${1 + Math.sin(phase * 2) * 0.05})
                `
              }}
            >
              {timeline.toUpperCase()}
            </Badge>

            {/* Quantum State Indicator */}
            <div 
              className="absolute top-4 right-4 backdrop-blur-sm rounded-xl p-2 border border-white/50 shadow-lg"
              style={{
                background: 'rgba(255,255,255,0.8)',
                transform: `
                  translateZ(8px) 
                  rotate(${Math.sin(phase * 3) * 5}deg)
                  scale(${0.9 + Math.cos(phase * 2) * 0.1})
                `
              }}
            >
              <div className="flex items-center gap-1">
                {quantumState === "stable" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                {quantumState === "superposition" && (
                  <Atom 
                    className="h-3 w-3" 
                    style={{ 
                      color: timelineColor,
                      transform: `rotate(${phase * 60}deg)`
                    }}
                  />
                )}
                {quantumState === "entangled" && (
                  <Layers 
                    className="h-3 w-3" 
                    style={{ 
                      color: timelineColor,
                      transform: `rotateY(${phase * 45}deg)`
                    }}
                  />
                )}
                <span className="text-xs font-mono text-gray-600">{quantumState}</span>
              </div>
            </div>

            {/* Category with Dimensional Depth */}
            <div 
              className="absolute bottom-4 left-4"
              style={{
                transform: `translateZ(6px) perspective(100px) rotateX(-10deg)`
              }}
            >
              <Badge 
                variant="secondary"
                className="backdrop-blur-sm border-0 shadow-lg"
                style={{
                  background: `linear-gradient(45deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))`,
                  color: timelineColor,
                  border: `1px solid ${timelineColor}30`
                }}
              >
                {category}
              </Badge>
            </div>
          </div>

          {/* Content with Anamorphic Perspective */}
          <div 
            className="p-6 space-y-4"
            style={{
              transform: `perspective(400px) rotateX(${isHovered ? 0 : -2}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Title with Quantum Typography */}
            <h3 
              className="font-bold line-clamp-2 transition-all duration-500"
              style={{
                fontSize: '1.125rem',
                color: `hsl(${(phase * 20 + index * 30) % 360}, 40%, 20%)`,
                transform: `
                  translateZ(${Math.sin(phase) * 1}px)
                  perspective(200px) 
                  rotateX(${Math.sin(phase * 0.5) * 2}deg)
                `,
                textShadow: `
                  0 0 10px ${timelineColor}20,
                  0 0 20px ${timelineColor}10
                `
              }}
            >
              {title}
            </h3>
            
            {/* Excerpt with Dimensional Shift */}
            <p 
              className="text-gray-600 line-clamp-3 leading-relaxed transition-all duration-500"
              style={{
                transform: `
                  translateZ(${Math.cos(phase) * 0.5}px)
                  perspective(300px) 
                  rotateX(${Math.cos(phase * 0.3) * 1}deg)
                `,
                opacity: 0.8 + Math.sin(phase) * 0.1
              }}
            >
              {excerpt}
            </p>

            {/* Metadata with Temporal Drift */}
            <div 
              className="flex items-center justify-between pt-4 border-t border-gray-200/50"
              style={{
                transform: `
                  translateZ(${Math.sin(phase * 0.7) * 1}px)
                  perspective(200px) 
                  rotateX(${Math.sin(phase * 0.8) * 1}deg)
                `
              }}
            >
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${timelineColor}, ${timelineColor}80)`,
                      transform: `rotate(${Math.sin(phase * 2) * 10}deg)`
                    }}
                  >
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">{author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readTime}</span>
                </div>
              </div>
              
              {/* Observation Trigger */}
              <button
                className="group/btn flex items-center gap-2 text-sm transition-all duration-300 hover:scale-105"
                style={{
                  color: timelineColor,
                  transform: `translateZ(${2 + Math.sin(phase * 1.5) * 1}px)`
                }}
              >
                <Eye 
                  className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" 
                  style={{
                    transform: `rotate(${Math.sin(phase * 2) * 5}deg)`
                  }}
                />
                <span className="font-medium">
                  {observationState === "quantum" ? "Observe" : "Observed"}
                </span>
                <ArrowRight 
                  className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1"
                  style={{
                    transform: `translateX(${Math.sin(phase * 3) * 2}px)`
                  }}
                />
              </button>
            </div>
          </div>

          {/* Dimensional Border */}
          <div 
            className="absolute bottom-0 left-0 w-full h-1 transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${timelineColor} ${Math.sin(phase) * 50 + 25}%, 
                transparent 100%)`,
              transform: `translateZ(1px) scaleX(${isHovered ? 1 : 0.8})`,
              opacity: isHovered ? 1 : 0.6
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}