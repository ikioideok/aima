import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Twitter, Github, Linkedin, Mail, Brain, Sparkles, Globe, Heart, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 border-t border-purple-100/50 overflow-hidden">
      {/* Floating gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-violet-200/20 rounded-full blur-2xl" />
      </div>

      <div className="container relative px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 opacity-20 blur-lg" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-0">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FluidAI
                </h3>
                <div className="text-sm text-gray-500 tracking-wide">
                  Next-Gen Media Platform
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed max-w-md">
              Revolutionizing AI journalism through innovative storytelling, 
              cutting-edge technology, and meaningful insights that shape the future 
              of digital media.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Daily Readers", value: "250K+", icon: Globe },
                { label: "AI Articles", value: "1.2K+", icon: Brain },
                { label: "Expert Writers", value: "50+", icon: Star },
                { label: "Happy Users", value: "99%", icon: Heart }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/60 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-4 w-4 text-purple-500" />
                      <span className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</span>
                    </div>
                    <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, label: "Twitter", color: "from-blue-400 to-blue-500" },
                { icon: Github, label: "GitHub", color: "from-gray-600 to-gray-700" },
                { icon: Linkedin, label: "LinkedIn", color: "from-blue-600 to-blue-700" },
                { icon: Mail, label: "Email", color: "from-purple-500 to-purple-600" }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 px-0 bg-white/50 border border-purple-200/50 hover:bg-white hover:border-purple-300/50 transition-all duration-300 rounded-2xl group"
                  >
                    <Icon className="h-4 w-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Explore
            </h4>
            <nav className="space-y-3">
              {[
                "AI Technology",
                "Machine Learning", 
                "Innovation Hub",
                "Future Trends",
                "Research Papers",
                "Expert Insights"
              ].map((item, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="block text-gray-600 hover:text-purple-600 transition-colors duration-300 text-sm group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </div>
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-500" />
              Stay Updated
            </h4>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Get the latest AI insights, breakthrough discoveries, and tech trends 
                delivered to your inbox weekly.
              </p>
              
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    placeholder="Your email address"
                    className="bg-white/70 border-purple-200/50 text-gray-700 placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/25 rounded-2xl pr-12"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white shadow-lg rounded-2xl">
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe Now
                </Button>
              </div>

              <div className="text-xs text-gray-500 leading-relaxed">
                Join 250K+ readers • Weekly updates • Unsubscribe anytime
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

        {/* Bottom section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>© 2025 FluidAI Media</span>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              <span>Powered by AI</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Cookie Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Contact Us
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}