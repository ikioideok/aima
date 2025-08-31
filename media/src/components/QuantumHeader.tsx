import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Menu, Atom, Zap, Layers, Sparkles, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function QuantumHeader() {
  const [quantumState, setQuantumState] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(prev => (prev + 1) % 4);
    }, 3000);

    const handleMouseMove = (e: MouseEvent) => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
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

  const navItems = [
    { name: "Quantum", state: "superposition" },
    { name: "Neural", state: "entangled" },
    { name: "Matrix", state: "collapsed" },
    { name: "Void", state: "uncertain" }
  ];

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 z-50 w-full transition-all duration-1000 ${
        isCollapsed ? 'h-12 backdrop-blur-2xl' : 'h-20 backdrop-blur-xl'
      }`}
      style={{
        background: `linear-gradient(${mousePos.x}deg, 
          rgba(255,255,255,0.95) 0%, 
          rgba(240,240,255,0.9) ${quantumState * 25}%, 
          rgba(255,240,255,0.85) 100%)`
      }}
    >
      {/* Quantum Field Background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-violet-400 to-blue-400 rounded-full opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + Math.sin(quantumState + i) * 20}%`,
              transform: `rotate(${quantumState * 90 + i * 60}deg) scale(${0.5 + Math.cos(quantumState + i) * 0.3})`,
              transition: 'all 3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        ))}
      </div>

      <div className="container relative h-full flex items-center justify-between px-6">
        {/* Quantum Logo */}
        <div 
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="relative">
            {/* Multiple quantum states overlapping */}
            <div 
              className="absolute inset-0 rounded-full transition-all duration-1000"
              style={{
                background: `conic-gradient(from ${quantumState * 90}deg, 
                  #8b5cf6, #06b6d4, #f59e0b, #ef4444, #8b5cf6)`,
                transform: `scale(${0.8 + Math.sin(quantumState) * 0.2}) rotate(${quantumState * 45}deg)`,
                opacity: 0.3,
                width: '60px',
                height: '60px'
              }}
            />
            <div 
              className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000"
              style={{
                background: `linear-gradient(${quantumState * 120}deg, #667eea, #764ba2)`,
                transform: `rotate(${-quantumState * 30}deg)`
              }}
            >
              <Atom 
                className="h-6 w-6 text-white transition-transform duration-1000" 
                style={{ transform: `rotate(${quantumState * 60}deg)` }}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 
              className="text-2xl font-bold transition-all duration-1000"
              style={{
                background: `linear-gradient(${quantumState * 45}deg, #1e40af, #7c3aed, #db2777)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transform: `perspective(100px) rotateX(${Math.sin(quantumState) * 5}deg)`
              }}
            >
              QUANTUM
            </h1>
            <div 
              className="text-xs tracking-widest transition-all duration-1000"
              style={{
                color: `hsl(${quantumState * 90 + 200}, 60%, 50%)`,
                transform: `translateX(${Math.cos(quantumState) * 3}px)`
              }}
            >
              {["SUPERPOSITION", "ENTANGLEMENT", "COLLAPSE", "UNCERTAINTY"][quantumState]}
            </div>
          </div>
        </div>

        {/* Quantum Navigation */}
        <nav className={`hidden lg:flex items-center transition-all duration-1000 ${
          isCollapsed ? 'scale-75 opacity-70' : 'scale-100'
        }`}>
          {navItems.map((item, index) => (
            <div
              key={item.name}
              className="relative mx-2 cursor-pointer group"
              style={{
                transform: `translateY(${Math.sin(quantumState + index) * 3}px) 
                           translateX(${Math.cos(quantumState + index) * 2}px)`,
                transition: 'all 1s ease-in-out'
              }}
            >
              {/* Quantum probability cloud */}
              <div 
                className="absolute inset-0 rounded-lg blur-sm transition-all duration-1000 group-hover:blur-none"
                style={{
                  background: `radial-gradient(circle at ${50 + Math.sin(quantumState + index) * 20}% ${50 + Math.cos(quantumState + index) * 20}%, 
                    rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.1), transparent)`,
                  transform: `scale(${1 + Math.sin(quantumState + index) * 0.1})`
                }}
              />
              
              <div 
                className="relative px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm transition-all duration-500 group-hover:border-white/40"
                style={{
                  background: `linear-gradient(${45 + index * 30}deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                  color: quantumState === index ? '#7c3aed' : '#64748b'
                }}
              >
                <span className="text-sm font-medium">{item.name}</span>
                {quantumState === index && (
                  <div 
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-violet-500 rounded-full"
                    style={{
                      transform: 'translateX(-50%)',
                      boxShadow: '0 0 8px rgba(139, 92, 246, 0.8)'
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Quantum Controls */}
        <div className="flex items-center gap-3">
          {/* Probability Wave Search */}
          <div className={`relative transition-all duration-1000 ${
            isCollapsed ? 'w-8 overflow-hidden' : 'w-64'
          } hidden sm:block`}>
            <div 
              className="absolute inset-0 rounded-xl transition-all duration-1000"
              style={{
                background: `linear-gradient(${quantumState * 60}deg, 
                  rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.05))`,
                transform: `scale(${1 + Math.sin(quantumState) * 0.05})`
              }}
            />
            <div className="relative flex items-center">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-1000"
                style={{ 
                  color: `hsl(${quantumState * 90 + 250}, 60%, 60%)`,
                  transform: `translateY(-50%) rotate(${quantumState * 15}deg)`
                }}
              />
              <Input
                placeholder={isCollapsed ? "" : "Search quantum states..."}
                className="pl-10 bg-white/50 border-white/30 backdrop-blur-sm rounded-xl transition-all duration-1000 focus:border-violet-300 focus:ring-violet-200"
                style={{
                  transform: `perspective(100px) rotateY(${Math.sin(quantumState) * 2}deg)`
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles 
                  className="h-3 w-3 transition-all duration-1000"
                  style={{ 
                    color: `hsl(${quantumState * 120 + 280}, 70%, 60%)`,
                    transform: `rotate(${quantumState * 30}deg) scale(${0.8 + Math.cos(quantumState) * 0.2})`
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Quantum State Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 px-0 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-500"
            style={{
              background: `linear-gradient(${quantumState * 90}deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
              transform: `rotate(${quantumState * 5}deg)`
            }}
          >
            <Layers 
              className="h-4 w-4 transition-all duration-1000"
              style={{ 
                color: `hsl(${quantumState * 90 + 220}, 60%, 50%)`,
                transform: `rotateY(${quantumState * 45}deg)`
              }}
            />
          </Button>

          {/* Collapse Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden h-10 w-10 px-0 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-500"
            style={{
              background: `linear-gradient(${quantumState * 60}deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`
            }}
          >
            <ChevronDown 
              className={`h-4 w-4 transition-all duration-500 ${isCollapsed ? 'rotate-180' : ''}`}
              style={{ color: `hsl(${quantumState * 90 + 200}, 60%, 50%)` }}
            />
          </Button>
        </div>
      </div>

      {/* Quantum Border */}
      <div 
        className="absolute bottom-0 left-0 w-full h-px transition-all duration-3000"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.5) ${quantumState * 25}%, 
            rgba(6, 182, 212, 0.5) ${50 + quantumState * 10}%, 
            transparent 100%)`
        }}
      />
    </header>
  );
}