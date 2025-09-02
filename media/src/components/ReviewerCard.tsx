import React from 'react'

type Links = {
  site?: string
  twitter?: string
  linkedin?: string
  github?: string
}

export type ReviewerInfo = {
  name: string
  title?: string
  bio?: string
  avatarUrl?: string
  links?: Links
}

export function ReviewerCard({ info }: { info: ReviewerInfo }) {
  const { name, title, bio, avatarUrl, links } = info || {}
  const items = [
    links?.site ? { href: links.site, label: 'プロフィール' } : null,
    links?.twitter ? { href: links.twitter, label: 'X' } : null,
    links?.linkedin ? { href: links.linkedin, label: 'LinkedIn' } : null,
    links?.github ? { href: links.github, label: 'GitHub' } : null,
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <section id="reviewer" aria-labelledby="reviewer-heading" className="rounded-lg border p-4 md:p-6 bg-card">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name}の写真`} className="w-full h-full object-cover" loading="lazy" />
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <h3 id="reviewer-heading" className="text-base font-semibold mb-1">監修者</h3>
          <div className="text-lg font-bold leading-tight">{name}</div>
          {title && <div className="text-sm text-muted-foreground mb-2">{title}</div>}
          {bio && <p className="text-sm leading-6 mb-3 text-foreground/90">{bio}</p>}
          {items.length > 0 && (
            <div className="flex flex-wrap gap-3 text-sm">
              {items.map((it, i) => (
                <a key={i} href={it.href} target="_blank" rel="noopener" className="underline underline-offset-4 hover:opacity-80">
                  {it.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

