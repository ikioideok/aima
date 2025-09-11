import React from 'react'

export function JinzaiHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[95vw] mx-auto flex h-16 items-center justify-between px-4">
        <a href="/jinzai/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#005BAC', color: 'white' }}>
            <span className="text-sm font-bold">AI</span>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground title-font">
              人材不足解決.com
            </div>
            <div className="text-xs text-muted-foreground">Workforce Solutions</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-6">
          <a href="/jinzai/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">ホーム</a>
          <a href="/media/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">AI Marketing News</a>
        </nav>
      </div>
    </header>
  )
}
