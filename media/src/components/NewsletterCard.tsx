import React from 'react'
import cfg from '../data/newsletter.json'

type Provider = 'google_forms' | 'mailto'

export function NewsletterCard({ variant = 'default' }: { variant?: 'default' | 'inline' }) {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle'|'error'|'ok'>('idle')
  const emailInputRef = React.useRef<HTMLInputElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const hiddenRef = React.useRef<HTMLInputElement>(null)

  const provider = (cfg?.provider || 'mailto') as Provider
  const valid = /^\S+@\S+\.\S+$/.test(email)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) { setStatus('error'); return }
    if (provider === 'google_forms' && cfg?.googleForms?.action && cfg?.googleForms?.emailEntry) {
      try {
        if (hiddenRef.current) hiddenRef.current.value = email
        if (formRef.current) formRef.current.submit()
        setStatus('ok')
        setEmail('')
      } catch {
        setStatus('error')
      }
      return
    }
    // mailto fallback
    const addr = cfg?.mailto?.address || ''
    const subject = encodeURIComponent(cfg?.mailto?.subject || 'Newsletter subscribe request')
    const body = encodeURIComponent((cfg?.mailto?.bodyTemplate || 'Please add this address to the list: {{email}}').replace('{{email}}', email))
    if (addr) {
      window.location.href = `mailto:${addr}?subject=${subject}&body=${body}`
      setStatus('ok')
      setEmail('')
    } else {
      setStatus('error')
    }
  }

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={variant === 'inline' ? 'my-6 p-4 border rounded-lg bg-card/50' : 'p-6 rounded-xl border bg-card/50'}>
      {children}
    </div>
  )

  return (
    <Wrapper>
      <div className="text-sm text-muted-foreground mb-2">ニュースレター</div>
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="font-semibold text-foreground">{cfg?.title || '最新記事と資料をお届け'}</div>
          {cfg?.copy && <p className="text-sm text-muted-foreground m-0">{cfg.copy}</p>}
        </div>
        <form ref={formRef} action={(cfg as any)?.googleForms?.action || undefined} method="POST" target="_blank" onSubmit={onSubmit} className="flex w-full md:w-auto gap-2">
          {/* Hidden for Google Forms */}
          {provider === 'google_forms' && cfg?.googleForms?.emailEntry && (
            <input ref={hiddenRef} type="hidden" name={cfg.googleForms.emailEntry} value={email} />
          )}
          <input
            ref={emailInputRef}
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e)=>{ setEmail(e.target.value); if (status!=='idle') setStatus('idle') }}
            className="flex-1 md:w-72 px-3 py-2 border rounded-md bg-background text-foreground"
          />
          <button type="submit" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition whitespace-nowrap">
            登録する
          </button>
        </form>
      </div>
      {status === 'error' && (
        <p className="text-xs text-destructive mt-2">メールアドレスを確認してください。</p>
      )}
      {status === 'ok' && (
        <p className="text-xs text-green-600 mt-2">ありがとうございます。登録手続きが完了しました（またはメール作成が開きます）。</p>
      )}
      {cfg?.privacyNote && (
        <p className="text-xs text-muted-foreground mt-2">{cfg.privacyNote}</p>
      )}
    </Wrapper>
  )
}

export default NewsletterCard

