import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Menu } from "lucide-react";

export function SimpleHeader() {
  const navItems = [
    { name: "ホーム", href: "#" },
    { name: "AI技術", href: "#" },
    { name: "機械学習", href: "#" },
    { name: "研究", href: "#" },
    { name: "ニュース", href: "#" },
    { name: "About", href: "#" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[95vw] mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground title-font">
              <span className="text-red-accent">AI</span> Media Hub
            </h1>
            <div className="text-xs text-muted-foreground">人工知能情報メディア</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="記事を検索..."
              className="pl-10 w-64 bg-muted/50 border-border"
            />
          </div>
          
          {/* Mobile Menu */}
          <Button variant="outline" size="sm" className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}