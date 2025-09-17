import { useEffect } from 'react'

export default function LegacyToolsRedirect() {
  useEffect(() => {
    window.location.replace('/tools/article/')
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="space-y-2 text-center">
        <p className="text-lg font-semibold">ツールのURLが /tools/article/ に移動しました。</p>
        <p>
          数秒後に自動的に遷移しない場合は
          {' '}
          <a className="text-red-accent underline" href="/tools/article/">
            こちらをクリック
          </a>
          してください。
        </p>
      </div>
    </div>
  )
}
