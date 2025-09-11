import React from 'react'

export function JinzaiFooter() {
  return (
    <footer className="border-t mt-12">
      <div className="w-full max-w-[95vw] mx-auto px-4 py-8 text-sm text-muted-foreground">
        <div className="mb-2 font-semibold">人材不足解決.com</div>
        <div className="flex flex-wrap gap-4">
          <a href="/jinzai/" className="hover:text-foreground">ホーム</a>
          <a href="/jinzai/tools/vacancy-cost/" className="hover:text-foreground">欠員コスト診断</a>
          <a href="/media/privacy/" className="hover:text-foreground">プライバシーポリシー</a>
          <a href="/media/terms/" className="hover:text-foreground">利用規約</a>
        </div>
        <div className="mt-4">© {new Date().getFullYear()} Workforce Solutions</div>
      </div>
    </footer>
  )
}
