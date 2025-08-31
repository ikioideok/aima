import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight, Sparkles, Brain, Zap, Globe, Play, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; delay: number; color: string }>>([]);

  useEffect(() => {
    // Generate floating elements
    const colors = ['bg-blue-200', 'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-violet-200'];
    const newElements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setFloatingElements(newElements);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-200/40 to-violet-200/40 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className={`absolute w-3 h-3 ${element.color} rounded-full opacity-60`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animation: `gentleFloat 8s ease-in-out infinite`,
              animationDelay: `${element.delay}s`
            }}
          />
        ))}
      </div>

      <div className="container relative px-4 py-32 text-center">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Status badges */}
          <div className="flex justify-center gap-6 mb-8">
            {[
              { icon: Brain, label: "AI-Powered", color: "blue" },
              { icon: Sparkles, label: "Innovative", color: "purple" },
              { icon: Globe, label: "Global Reach", color: "pink" }
            ].map((status, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-white/70 border-gray-200/50 text-gray-700 px-4 py-2 shadow-sm backdrop-blur-sm"
              >
                <status.icon className={`h-4 w-4 mr-2 text-${status.color}-500`} />
                {status.label}
              </Badge>
            ))}
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  The Future of
                </span>
                <br />
                <span className="text-gray-800">
                  AI Journalism
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover groundbreaking AI innovations, insightful analysis, and the stories 
                shaping tomorrow's digital landscape through our next-generation media platform.
              </p>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-8"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 rounded-2xl px-8 bg-white/50 backdrop-blur-sm"
              >
                <Star className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Feature showcase */}
          <div className="relative mt-16">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/30 to-pink-100/50 blur-3xl rounded-3xl" />
            <div className="relative bg-white/60 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 max-w-5xl mx-auto shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-left">
                  <div className="space-y-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 border-purple-200/50"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Now Live
                    </Badge>
                    <h3 className="text-2xl font-bold text-gray-800">
                      AI-Powered Content Discovery
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Experience personalized content recommendations powered by advanced machine learning, 
                      tailored to your interests and reading patterns.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {["Smart Curation", "Real-time Analysis", "Personalized Feed"].map((feature, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-200/50">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-2xl rounded-2xl" />
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1614812512031-9168a9064bf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFic3RyYWN0JTIwZ3JhZGllbnQlMjBmbHVpZHxlbnwxfHx8fDE3NTYxODMwMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="AI Technology Visualization"
                    className="relative w-full h-64 object-cover rounded-2xl border border-purple-200/30 shadow-lg"
                  />
                  
                  {/* Floating stats */}
                  <div className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-200/50">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-medium text-gray-700">98.5% Accuracy</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-200/50">
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-3 w-3 text-purple-500" />
                      <span className="font-medium text-gray-700">AI Enhanced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          33% { transform: translateY(-10px) scale(1.1); opacity: 0.8; }
          66% { transform: translateY(5px) scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}