type PageHeroProps = {
  title: string
  subtitle?: string
  crumbs?: { label: string; href?: string }[]
}

export function PageHero({ title, subtitle, crumbs }: PageHeroProps) {
  return (
    <section className="bg-brand-700 py-16 text-white">
      <div className="container-page">
        <nav className="mb-3 text-xs text-white/60">
          {crumbs?.map((c, i) => (
            <span key={`${c.label}-${i}`}>
              {c.href ? (
                <a href={c.href} className="transition hover:text-white">
                  {c.label}
                </a>
              ) : (
                <span className="font-medium text-white">{c.label}</span>
              )}
              {i < (crumbs?.length ?? 0) - 1 && (
                <span className="mx-1.5 text-white/40">/</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-bold sm:text-4xl text-white">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-white/70">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
