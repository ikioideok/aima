import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Twitter, Github, Linkedin, Mail, Atom, Layers, Zap, Triangle, Hexagon, Star } from "lucide-react";
import { useEffect, useState } from "react";

export function QuantumFooter() {
  const [time, setTime] = useState(0);
  const [quantumField, setQuantumField] = useState<Array<{
    id: number;
    x: number;
    y: number;
    velocity: { x: number; y: number };
    phase: number;
    frequency: number;
  }>>([]);

  useEffect(() => {
    // Initialize quantum field particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      velocity: {
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.1
      },
      phase: Math.random() * Math.PI * 2,
      frequency: 0.5 + Math.random() * 1.5
    }));
    setQuantumField(particles);

    const interval = setInterval(() => {
      setTime(prev => prev + 0.02);
      setQuantumField(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.velocity.x + 100) % 100,
        y: (particle.y + particle.velocity.y + 100) % 100
      })));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer 
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(${time * 5}deg, 
          #f8fafc 0%, 
          #f1f5f9 40%, 
          #e2e8f0 70%, 
          #f8fafc 100%)`
      }}
    >
      {/* Quantum Field Background */}
      <div className="absolute inset-0">
        {quantumField.map((particle) => {
          const phase = time * particle.frequency + particle.phase;
          return (
            <div
              key={particle.id}
              className="absolute transition-all duration-100"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                transform: `
                  translate(-50%, -50%) 
                  scale(${0.5 + Math.sin(phase) * 0.3})
                  rotate(${phase * 30}deg)
                `,
                opacity: 0.1 + Math.sin(phase) * 0.1
              }}
            >
              <Hexagon 
                className="w-4 h-4"
                style={{
                  color: `hsl(${(phase * 50) % 360}, 50%, 60%)`,
                  filter: `blur(${Math.abs(Math.sin(phase)) * 1}px)`
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Dimensional Border */}
      <div 
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            hsl(${time * 30}deg, 60%, 60%) ${Math.sin(time) * 50 + 25}%, 
            hsl(${time * 30 + 120}deg, 60%, 60%) ${Math.cos(time) * 50 + 50}%, 
            transparent 100%)`,
          transform: `scaleX(${1 + Math.sin(time) * 0.1})`
        }}
      />

      <div className="container relative px-6 py-20">
        {/* Isometric Grid Layout */}
        <div 
          className="grid lg:grid-cols-4 gap-12"
          style={{
            transform: `perspective(1000px) rotateX(${5 + Math.sin(time) * 2}deg) rotateY(${Math.cos(time * 0.7) * 1}deg)`
          }}
        >
          {/* Quantum Brand Section */}
          <div 
            className="lg:col-span-2 space-y-8"
            style={{
              transform: `translateZ(${Math.sin(time) * 5}px)`
            }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* Multi-dimensional logo layers */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: `conic-gradient(from ${time * 20 + i * 120}deg, 
                        hsl(${220 + i * 60}deg, 70%, 60%), 
                        hsl(${280 + i * 60}deg, 70%, 60%), 
                        hsl(${340 + i * 60}deg, 70%, 60%), 
                        hsl(${220 + i * 60}deg, 70%, 60%))`,
                      transform: `
                        translateZ(${-i * 3}px) 
                        scale(${1 - i * 0.1}) 
                        rotate(${time * (10 + i * 5)}deg)
                      `,
                      opacity: 0.6 - i * 0.2,
                      transformStyle: 'preserve-3d'
                    }}
                  />
                ))}
                
                <div 
                  className="relative w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(${time * 45}deg, #667eea, #764ba2)`,
                    transform: `translateZ(5px) rotate(${-time * 15}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <Atom 
                    className="h-6 w-6 text-white" 
                    style={{
                      transform: `rotate(${time * 60}deg)`
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 
                  className="text-3xl font-bold"
                  style={{
                    background: `linear-gradient(${time * 25}deg, #1e293b, #7c3aed, #0ea5e9)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transform: `perspective(200px) rotateX(${Math.sin(time) * 3}deg)`
                  }}
                >
                  QUANTUM
                </h3>
                <div 
                  className="text-sm tracking-widest"
                  style={{
                    color: `hsl(${time * 40 + 220}deg, 60%, 50%)`,
                    transform: `translateX(${Math.cos(time) * 2}px)`
                  }}
                >
                  REALITY DISTORTION FIELD
                </div>
              </div>
            </div>
            
            <p 
              className="text-gray-600 leading-relaxed max-w-md"
              style={{
                transform: `perspective(400px) rotateX(${Math.sin(time * 0.8) * 2}deg)`,
                opacity: 0.8 + Math.sin(time) * 0.1
              }}
            >
              Transcending dimensional boundaries to deliver news from parallel realities. 
              Experience journalism that exists in quantum superposition until observed by consciousness.
            </p>

            {/* Quantum Statistics */}
            <div 
              className="grid grid-cols-2 gap-4"
              style={{
                transform: `perspective(500px) rotateX(${Math.sin(time * 0.6) * 3}deg)`
              }}
            >
              {[
                { label: "Dimensions", value: "∞", icon: Layers, phase: 0 },
                { label: "Realities", value: "11^23", icon: Triangle, phase: 1 },
                { label: "Observers", value: "∅", icon: Star, phase: 2 },
                { label: "Entropy", value: "↓∞", icon: Zap, phase: 3 }
              ].map((stat, index) => {
                const Icon = stat.icon;
                const statPhase = time + stat.phase;
                return (
                  <div 
                    key={index}
                    className="relative group cursor-pointer"
                    style={{
                      transform: `
                        translateY(${Math.sin(statPhase) * 3}px)
                        translateZ(${Math.cos(statPhase) * 2}px)
                        rotateY(${Math.sin(statPhase) * 2}deg)
                      `,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div 
                      className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-500"
                      style={{
                        background: `linear-gradient(${135 + index * 30}deg, 
                          rgba(255,255,255,0.8), 
                          rgba(248,250,252,0.9))`,
                        borderLeft: `3px solid hsl(${(statPhase * 60 + index * 90) % 360}, 60%, 60%)`
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon 
                          className="h-4 w-4"
                          style={{
                            color: `hsl(${(statPhase * 60 + index * 90) % 360}, 60%, 50%)`,
                            transform: `rotate(${statPhase * 20}deg)`
                          }}
                        />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</span>
                      </div>
                      <div 
                        className="text-xl font-bold font-mono"
                        style={{
                          color: `hsl(${(statPhase * 40 + index * 90) % 360}, 60%, 40%)`,
                          transform: `perspective(100px) rotateX(${Math.sin(statPhase) * 3}deg)`
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dimensional Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, phase: 0 },
                { icon: Github, phase: 0.5 },
                { icon: Linkedin, phase: 1 },
                { icon: Mail, phase: 1.5 }
              ].map((social, index) => {
                const Icon = social.icon;
                const socialPhase = time + social.phase;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12 px-0 rounded-2xl backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-500 group"
                    style={{
                      background: `linear-gradient(${135 + index * 45}deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4))`,
                      transform: `
                        perspective(100px) 
                        rotateX(${Math.sin(socialPhase) * 5}deg) 
                        rotateY(${Math.cos(socialPhase) * 5}deg)
                        translateZ(${Math.sin(socialPhase) * 2}px)
                      `,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <Icon 
                      className="h-4 w-4 transition-all duration-500 group-hover:scale-110"
                      style={{
                        color: `hsl(${(socialPhase * 50 + index * 60) % 360}, 60%, 50%)`,
                        transform: `rotate(${socialPhase * 10}deg)`
                      }}
                    />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quantum Navigation */}
          <div 
            className="space-y-6"
            style={{
              transform: `translateZ(${Math.cos(time) * 3}px) perspective(300px) rotateY(${Math.sin(time * 0.5) * 2}deg)`
            }}
          >
            <h4 
              className="text-lg font-bold flex items-center gap-2"
              style={{
                color: `hsl(${time * 30 + 200}deg, 60%, 40%)`,
                transform: `perspective(200px) rotateX(${Math.sin(time) * 2}deg)`
              }}
            >
              <Layers 
                className="h-4 w-4"
                style={{
                  transform: `rotate(${time * 20}deg)`
                }}
              />
              Explore Dimensions
            </h4>
            <nav className="space-y-3">
              {[
                "Quantum Mechanics",
                "Parallel Universes", 
                "Temporal Dynamics",
                "Reality Synthesis",
                "Consciousness Studies",
                "Dimensional Theory"
              ].map((item, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="block text-gray-600 hover:text-violet-600 transition-all duration-300 text-sm group"
                  style={{
                    transform: `
                      translateY(${Math.sin(time + index * 0.5) * 1}px)
                      translateX(${Math.cos(time + index * 0.5) * 1}px)
                    `
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-1 h-1 rounded-full transition-all duration-300 group-hover:w-2"
                      style={{
                        backgroundColor: `hsl(${(time * 20 + index * 40) % 360}, 60%, 60%)`,
                        opacity: 0.5 + Math.sin(time + index) * 0.3
                      }}
                    />
                    {item}
                  </div>
                </a>
              ))}
            </nav>
          </div>

          {/* Quantum Interface */}
          <div 
            className="space-y-6"
            style={{
              transform: `translateZ(${Math.sin(time * 0.7) * 4}px) perspective(400px) rotateX(${Math.cos(time * 0.3) * 2}deg)`
            }}
          >
            <h4 
              className="text-lg font-bold flex items-center gap-2"
              style={{
                color: `hsl(${time * 30 + 260}deg, 60%, 40%)`,
                transform: `perspective(200px) rotateY(${Math.sin(time) * 2}deg)`
              }}
            >
              <Atom 
                className="h-4 w-4"
                style={{
                  transform: `rotate(${time * 45}deg)`
                }}
              />
              Quantum Entanglement
            </h4>
            
            <div className="space-y-4">
              <p 
                className="text-sm text-gray-600 leading-relaxed"
                style={{
                  transform: `perspective(300px) rotateX(${Math.sin(time * 0.8) * 1}deg)`,
                  opacity: 0.8 + Math.sin(time) * 0.1
                }}
              >
                Subscribe to receive quantum-encrypted updates from parallel timelines 
                and alternate reality news feeds.
              </p>
              
              <div className="space-y-3">
                <div 
                  className="relative"
                  style={{
                    transform: `perspective(200px) rotateX(${Math.sin(time) * 2}deg)`
                  }}
                >
                  <Input
                    placeholder="Your quantum signature..."
                    className="bg-white/70 border-white/40 backdrop-blur-sm rounded-2xl pr-12 transition-all duration-500 focus:border-violet-300 focus:ring-violet-200"
                    style={{
                      transform: `translateZ(${Math.sin(time) * 1}px)`
                    }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Zap 
                      className="h-4 w-4"
                      style={{
                        color: `hsl(${time * 60 + 280}deg, 70%, 60%)`,
                        transform: `rotate(${time * 30}deg) scale(${0.8 + Math.sin(time * 2) * 0.2})`
                      }}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full rounded-2xl transition-all duration-500 hover:scale-105"
                  style={{
                    background: `linear-gradient(${time * 15}deg, 
                      hsl(${time * 30 + 240}deg, 70%, 50%), 
                      hsl(${time * 30 + 300}deg, 70%, 60%))`,
                    transform: `
                      perspective(200px) 
                      rotateX(-5deg) 
                      translateZ(${2 + Math.sin(time) * 1}px)
                    `,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <Atom className="mr-2 h-4 w-4" />
                  Initiate Entanglement
                </Button>
              </div>

              <div 
                className="text-xs text-gray-500 space-y-1"
                style={{
                  transform: `perspective(200px) rotateX(${Math.sin(time * 0.6) * 1}deg)`
                }}
              >
                <div>Quantum-encrypted • Parallel-verified • Reality-safe</div>
                <div 
                  style={{
                    opacity: 0.7 + Math.sin(time) * 0.2
                  }}
                >
                  Probability of spam: {Math.abs(Math.sin(time * 3) * 0.001).toFixed(6)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator 
          className="my-12"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              hsl(${time * 40}deg, 50%, 70%) ${Math.sin(time) * 50 + 25}%, 
              hsl(${time * 40 + 120}deg, 50%, 70%) ${Math.cos(time) * 50 + 50}%, 
              transparent 100%)`,
            height: '2px',
            transform: `perspective(500px) rotateX(45deg) scaleY(${1 + Math.sin(time) * 0.2})`
          }}
        />

        {/* Quantum Footer Info */}
        <div 
          className="flex flex-col lg:flex-row justify-between items-center gap-6"
          style={{
            transform: `perspective(600px) rotateX(${Math.sin(time * 0.5) * 2}deg)`
          }}
        >
          <div 
            className="flex items-center gap-4 text-sm text-gray-500"
            style={{
              transform: `translateZ(${Math.sin(time) * 2}px)`
            }}
          >
            <span>© 2025 Quantum Reality Corp</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-1 h-1 rounded-full animate-pulse"
                style={{
                  backgroundColor: `hsl(${time * 80}deg, 70%, 60%)`
                }}
              />
              <span>Existing in superposition</span>
            </div>
          </div>
          
          <nav 
            className="flex items-center gap-6 text-sm"
            style={{
              transform: `translateZ(${Math.cos(time) * 2}px)`
            }}
          >
            {["Quantum Privacy", "Reality Terms", "Dimensional Ethics", "Contact Matrix"].map((link, index) => (
              <a 
                key={index}
                href="#" 
                className="text-gray-500 hover:text-violet-600 transition-all duration-300"
                style={{
                  transform: `
                    translateY(${Math.sin(time + index * 0.7) * 1}px)
                    perspective(100px) rotateY(${Math.cos(time + index) * 2}deg)
                  `
                }}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}