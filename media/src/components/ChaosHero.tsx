import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight, Atom, Zap, Layers, Triangle, Hexagon, Square, Circle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState, useRef } from "react";

export function ChaosHero() {
  const [time, setTime] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [hexagons, setHexagons] = useState<Array<{
    id: number;
    x: number;
    y: number;
    z: number;
    rotation: number;
    scale: number;
    opacity: number;
    speed: number;
    type: 'hex' | 'triangle' | 'square' | 'circle';
  }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate chaotic geometric elements
    const elements = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.3 + Math.random() * 0.7,
      opacity: 0.1 + Math.random() * 0.4,
      speed: 0.2 + Math.random() * 0.8,
      type: ['hex', 'triangle', 'square', 'circle'][Math.floor(Math.random() * 4)] as 'hex' | 'triangle' | 'square' | 'circle'
    }));
    setHexagons(elements);

    const interval = setInterval(() => {
      setTime(prev => prev + 0.02);
    }, 16);

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'hex': return Hexagon;
      case 'triangle': return Triangle;
      case 'square': return Square;
      case 'circle': return Circle;
      default: return Hexagon;
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(${time * 10}deg, 
          #f8fafc 0%, 
          #f1f5f9 30%, 
          #e2e8f0 60%, 
          #f8fafc 100%)`
      }}
    >
      {/* Chaotic Geometric Field */}
      <div className="absolute inset-0">
        {hexagons.map((hex) => {
          const Icon = getIcon(hex.type);
          const phase = time * hex.speed + hex.id;
          const x = hex.x + Math.sin(phase) * 10 + (mousePos.x - 50) * 0.02 * hex.z;
          const y = hex.y + Math.cos(phase * 0.7) * 8 + (mousePos.y - 50) * 0.02 * hex.z;
          const rotation = hex.rotation + time * 30 * hex.speed;
          const scale = hex.scale * (0.8 + Math.sin(phase * 1.5) * 0.3);
          const perspective = hex.z * 100 + 50;
          
          return (
            <div
              key={hex.id}
              className="absolute transition-all duration-100 ease-out"
              style={{
                left: `${Math.max(0, Math.min(100, x))}%`,
                top: `${Math.max(0, Math.min(100, y))}%`,
                transform: `
                  translate(-50%, -50%) 
                  perspective(${perspective}px) 
                  rotateX(${Math.sin(phase) * 15}deg) 
                  rotateY(${Math.cos(phase * 0.8) * 20}deg) 
                  rotateZ(${rotation}deg) 
                  scale(${scale})
                `,
                zIndex: Math.floor(hex.z * 10)
              }}
            >
              <Icon 
                className="transition-all duration-200"
                style={{
                  width: `${20 + hex.scale * 30}px`,
                  height: `${20 + hex.scale * 30}px`,
                  color: `hsl(${(phase * 50 + hex.id * 30) % 360}, 60%, ${50 + Math.sin(phase) * 20}%)`,
                  opacity: hex.opacity * (0.5 + Math.sin(phase) * 0.3),
                  filter: `blur(${(1 - hex.z) * 2}px) brightness(${1 + Math.sin(phase) * 0.3})`
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Isometric Content Grid */}
      <div className="container relative px-6 py-32">
        <div 
          className="max-w-7xl mx-auto"
          style={{
            transform: `perspective(1000px) rotateX(${5 + Math.sin(time) * 3}deg) rotateY(${Math.cos(time * 0.7) * 2}deg)`
          }}
        >
          {/* Floating Status Indicators */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { icon: Atom, label: "Quantum State", value: "Superposition", color: `hsl(${time * 30}deg, 70%, 60%)` },
              { icon: Zap, label: "Neural Activity", value: "Accelerated", color: `hsl(${time * 30 + 120}deg, 70%, 60%)` },
              { icon: Layers, label: "Dimension", value: "Multi-verse", color: `hsl(${time * 30 + 240}deg, 70%, 60%)` }
            ].map((status, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                style={{
                  transform: `
                    translateY(${Math.sin(time + index) * 8}px) 
                    translateZ(${Math.cos(time + index) * 10}px)
                    rotateY(${Math.sin(time + index) * 5}deg)
                  `,
                  transition: 'all 0.3s ease-out'
                }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-white/60 backdrop-blur-xl border-0 px-6 py-3 shadow-lg group-hover:shadow-xl transition-all duration-500"
                  style={{
                    background: `linear-gradient(${45 + index * 30}deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))`,
                    borderLeft: `3px solid ${status.color}`,
                    transform: 'perspective(100px) rotateX(-5deg)'
                  }}
                >
                  <status.icon 
                    className="h-4 w-4 mr-2 transition-all duration-500" 
                    style={{ 
                      color: status.color,
                      transform: `rotate(${time * 20 + index * 45}deg)`
                    }}
                  />
                  <span className="text-gray-700 font-medium">{status.label}</span>
                </Badge>
              </div>
            ))}
          </div>

          {/* Anamorphic Title */}
          <div className="text-center mb-16 space-y-8">
            <div 
              className="relative"
              style={{
                transform: `perspective(800px) rotateX(${10 + Math.sin(time) * 5}deg) rotateY(${Math.cos(time * 0.5) * 3}deg)`
              }}
            >
              {/* Shadow layers for depth */}
              <h1 
                className="absolute inset-0 text-6xl md:text-8xl font-bold opacity-20 blur-sm"
                style={{
                  background: `linear-gradient(${time * 20}deg, #94a3b8, #64748b)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transform: `translate(${Math.sin(time) * 3}px, ${Math.cos(time) * 3}px)`
                }}
              >
                REALITY
                <br />
                DISTORTION
              </h1>
              
              <h1 
                className="relative text-6xl md:text-8xl font-bold leading-tight"
                style={{
                  background: `linear-gradient(${45 + time * 30}deg, 
                    #1e293b 0%, 
                    #7c3aed ${Math.sin(time) * 50 + 25}%, 
                    #0ea5e9 ${Math.cos(time) * 50 + 50}%, 
                    #1e293b 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                REALITY
                <br />
                DISTORTION
              </h1>
            </div>
            
            <p 
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              style={{
                transform: `perspective(600px) rotateX(${Math.sin(time * 0.8) * 3}deg)`,
                opacity: 0.8 + Math.sin(time) * 0.2
              }}
            >
              Step into the quantum realm where artificial intelligence transcends dimensional boundaries. 
              Experience news that exists in multiple states simultaneously until observed.
            </p>
          </div>

          {/* Isometric Action Grid */}
          <div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            style={{
              transform: `perspective(1200px) rotateX(${15 + Math.sin(time * 0.6) * 5}deg) rotateY(${Math.cos(time * 0.4) * 8}deg)`
            }}
          >
            {[
              { title: "Enter the Matrix", desc: "Access parallel news realities", action: "Phase Shift" },
              { title: "Quantum Entanglement", desc: "Connect with universal consciousness", action: "Entangle" },
              { title: "Reality Collapse", desc: "Observe and collapse possibilities", action: "Collapse" }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative cursor-pointer"
                style={{
                  transform: `
                    translateY(${Math.sin(time + index * 2) * 6}px) 
                    translateX(${Math.cos(time + index * 2) * 4}px)
                    rotateX(${Math.sin(time + index) * 3}deg)
                    rotateY(${Math.cos(time + index) * 2}deg)
                  `,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Depth shadow */}
                <div 
                  className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm"
                  style={{
                    transform: `translateZ(-10px) translate(${Math.sin(time + index) * 2}px, ${Math.cos(time + index) * 2}px)`
                  }}
                />
                
                <div 
                  className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-xl group-hover:shadow-2xl transition-all duration-500"
                  style={{
                    background: `linear-gradient(${135 + index * 45}deg, 
                      rgba(255,255,255,0.9), 
                      rgba(255,255,255,0.7), 
                      rgba(248,250,252,0.8))`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <h3 
                    className="text-xl font-bold mb-3 transition-all duration-500"
                    style={{
                      color: `hsl(${(time * 20 + index * 60) % 360}, 60%, 40%)`,
                      transform: `translateZ(${Math.sin(time + index) * 2}px)`
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6 transform transition-all duration-500 group-hover:translateZ-2">
                    {item.desc}
                  </p>
                  <Button 
                    className="w-full transition-all duration-500"
                    style={{
                      background: `linear-gradient(${90 + index * 30}deg, 
                        hsl(${(time * 15 + index * 60) % 360}, 70%, 50%), 
                        hsl(${(time * 15 + index * 60 + 60) % 360}, 70%, 60%))`,
                      transform: `translateZ(${2 + Math.sin(time + index) * 1}px) rotateX(-5deg)`,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {item.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Quantum Interface */}
          <div 
            className="relative max-w-5xl mx-auto"
            style={{
              transform: `perspective(1000px) rotateX(${8 + Math.sin(time * 0.7) * 4}deg) rotateY(${Math.cos(time * 0.3) * 5}deg)`
            }}
          >
            <div 
              className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/40 shadow-2xl"
              style={{
                background: `linear-gradient(${time * 5}deg, 
                  rgba(255,255,255,0.8), 
                  rgba(248,250,252,0.9), 
                  rgba(241,245,249,0.8))`,
                transform: 'translateZ(0)'
              }}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border-violet-200/50"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Quantum Interface Active
                  </Badge>
                  
                  <h3 
                    className="text-3xl font-bold"
                    style={{
                      color: `hsl(${time * 25}deg, 60%, 30%)`,
                      transform: `perspective(300px) rotateX(${Math.sin(time) * 2}deg)`
                    }}
                  >
                    Multi-Dimensional Content Discovery
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    Navigate through infinite parallel timelines of AI development. 
                    Each article exists in quantum superposition until you choose to observe it.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {["Quantum AI", "Parallel Processing", "Dimensional Shift", "Timeline Merge"].map((tag, i) => (
                      <div 
                        key={i}
                        className="px-3 py-1 rounded-full text-sm border transition-all duration-500 hover:scale-105"
                        style={{
                          background: `linear-gradient(${45 + i * 30}deg, 
                            rgba(139, 92, 246, 0.1), 
                            rgba(6, 182, 212, 0.05))`,
                          borderColor: `hsl(${(time * 10 + i * 60) % 360}, 50%, 60%)`,
                          color: `hsl(${(time * 10 + i * 60) % 360}, 60%, 40%)`,
                          transform: `translateY(${Math.sin(time + i) * 1}px)`
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="relative"
                  style={{
                    transform: `perspective(500px) rotateX(${Math.sin(time * 0.8) * 5}deg) rotateY(${Math.cos(time * 0.6) * 8}deg)`
                  }}
                >
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-violet-200/30 to-blue-200/30 blur-2xl rounded-2xl"
                    style={{
                      transform: `translateZ(-20px) scale(${1.1 + Math.sin(time) * 0.1})`
                    }}
                  />
                  
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1753454116027-4f3ff53af389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMDNkJTIwaXNvbWV0cmljJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc1NjE4MzU1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Quantum Reality Interface"
                    className="relative w-full h-64 object-cover rounded-2xl border border-white/30 shadow-xl"
                    style={{
                      transform: `translateZ(0) scale(${1 + Math.sin(time * 0.5) * 0.02})`
                    }}
                  />
                  
                  {/* Floating quantum indicators */}
                  <div 
                    className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50"
                    style={{
                      transform: `translateZ(10px) rotate(${Math.sin(time) * 3}deg)`
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: `hsl(${time * 60}deg, 70%, 60%)` }}
                      />
                      <span className="font-medium text-gray-700">Reality: Stable</span>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50"
                    style={{
                      transform: `translateZ(15px) rotate(${-Math.cos(time) * 3}deg)`
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Layers 
                        className="h-3 w-3" 
                        style={{ 
                          color: `hsl(${time * 60 + 180}deg, 70%, 60%)`,
                          transform: `rotate(${time * 45}deg)`
                        }}
                      />
                      <span className="font-medium text-gray-700">Dimensions: ∞</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Horizon */}
      <div 
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: `linear-gradient(0deg, 
            rgba(248,250,252,0.9) 0%, 
            rgba(248,250,252,0.7) 30%, 
            transparent 100%)`,
          transform: `perspective(500px) rotateX(${20 + Math.sin(time) * 5}deg)`
        }}
      />
    </section>
  );
}