import Link from 'next/link'
import { GraduationCap, Clock } from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getProgrammes } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import type { ProgrammeLevel } from '@prisma/client'

const levelTabs: { key: string; label: string; value: ProgrammeLevel | null }[] = [
  { key: 'all', label: 'All', value: null },
  { key: 'degree', label: 'Degree', value: 'DEGREE' },
  { key: 'diploma', label: 'Diploma', value: 'DIPLOMA' },
  { key: 'postgraduate', label: 'Postgraduate', value: 'POSTGRADUATE' },
]

export const dynamic = 'force-dynamic'

export default async function ProgrammesPage({
  searchParams,
}: PageProps<'/programmes'>) {
  const sp = await searchParams
  const levelRaw = Array.isArray(sp.level) ? sp.level[0] : sp.level
  const level: ProgrammeLevel | null =
    levelRaw === 'degree'
      ? 'DEGREE'
      : levelRaw === 'diploma'
        ? 'DIPLOMA'
        : levelRaw === 'postgraduate'
          ? 'POSTGRADUATE'
          : null

  const [programmes, sections] = await Promise.all([
    getProgrammes({ level }),
    getSiteSections(),
  ])

  const { programmes: progContent } = sections

  return (
    <>
      <PageHero
        title={progContent.heroTitle}
        subtitle={progContent.heroSubtitle}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Programmes' }]}
      />

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="mb-10 flex flex-wrap gap-3">
            {levelTabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.value ? `/programmes?level=${tab.key}` : '/programmes'}
                className={cn(
                  'rounded-lg px-5 py-2.5 text-sm font-bold transition',
                  level === tab.value
                    ? 'bg-brand-700 text-white'
                    : 'border border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {programmes.length === 0 ? (
            <p className="text-center py-12 text-ink-600">No programmes found in this category yet.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {programmes.map((p) => (
                <Link
                  key={p.id}
                  href={`/programmes/${p.slug}`}
                  className="card-premium p-7 group flex flex-col h-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-700">{p.level.toLowerCase()}</span>
                    <span className="h-10 w-10 grid place-items-center rounded-lg bg-brand-50 text-brand-700 group-hover:bg-brand-700 group-hover:text-white transition">
                      <GraduationCap size={18} weight="duotone" />
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-serif text-ink-900 group-hover:text-brand-700 leading-tight">{p.name}</h3>
                  {p.department && <p className="mt-1 text-xs text-ink-500">{p.department.name}</p>}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 line-clamp-3">{p.summary}</p>
                  <div className="mt-5 flex items-center gap-3 text-xs text-ink-500">
                    {p.duration && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} weight="duotone" /> {p.duration}
                      </span>
                    )}
                    {p.code && <span className="rounded-full bg-ink-50 border border-ink-100 px-2.5 py-1 text-xs font-semibold">{p.code}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-xl bg-brand-700 p-8 sm:p-10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif">{progContent.reqHeading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80 max-w-xl">{progContent.reqBody}</p>
            </div>
            <a href={progContent.reqCta.href} className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-gold-400 hover:text-brand-900 transition">
              {progContent.reqCta.label}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
