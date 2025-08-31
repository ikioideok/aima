import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Menu, Moon, Sun, Sparkles, Brain, Zap, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [activeNav, setActiveNav] = useState("ホーム");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const navItems = [
    { name: "ホーム", icon: Brain },
    { name: "AI Insights", icon: Sparkles },
    { name: "Tech News", icon: Zap },
    { name: "Innovation", icon: Globe },
    { name: "About", icon: Menu }
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-purple-100/50 shadow-sm">
      {/* Fluid gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50" />
      
      <div className="container relative flex h-16 items-center justify-between px-4">
        {/* Modern Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 opacity-20 blur-lg" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="space-y-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              FluidAI
            </h1>
            <div className="text-xs text-gray-500 tracking-wide">
              Next-Gen Media
            </div>
          </div>
        </div>

        {/* Fluid Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  activeNav === item.name ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setActiveNav(item.name)}
              >
                <div className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  activeNav === item.name 
                    ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 text-purple-700 shadow-md border border-purple-200/50' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
                }`}>
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Modern Controls */}
        <div className="flex items-center gap-3">
          {/* Fluid Search */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-100/50 to-purple-100/50 blur-sm" />
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
              <Input
                placeholder="Discover AI insights..."
                className="pl-10 w-64 bg-white/70 border-purple-200/50 text-gray-700 placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/25 rounded-2xl"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-3 w-3 text-purple-400" />
              </div>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-10 w-10 px-0 bg-white/50 border border-purple-200/50 hover:bg-purple-50 hover:border-purple-300/50 transition-all duration-300 rounded-2xl"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-purple-600" />
            ) : (
              <Moon className="h-4 w-4 text-purple-600" />
            )}
          </Button>

          {/* Mobile Menu */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden h-10 w-10 px-0 bg-white/50 border border-purple-200/50 hover:bg-purple-50 hover:border-purple-300/50 transition-all duration-300 rounded-2xl"
          >
            <Menu className="h-4 w-4 text-purple-600" />
          </Button>
        </div>
      </div>
    </header>
  );
}