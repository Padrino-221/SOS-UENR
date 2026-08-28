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

      <section className="py-16">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap gap-2">
            {levelTabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.value ? `/programmes?level=${tab.key}` : '/programmes'}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-semibold transition',
                  level === tab.value
                    ? 'bg-brand-700 text-white'
                    : 'border border-ink-100 text-ink-700 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {programmes.length === 0 ? (
            <p className="text-ink-700">
              No programmes found in this category yet.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {programmes.map((p) => (
                <Link
                  key={p.id}
                  href={`/programmes/${p.slug}`}
                  className="group flex flex-col rounded-2xl border border-ink-100 p-6 transition hover:-translate-y-1 hover:border-brand-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
                      {p.level.toLowerCase()}
                    </span>
                    <GraduationCap
                      size={22}
                      className="text-ink-200 group-hover:text-brand-700"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-brand-700">
                    {p.name}
                  </h3>
                  {p.department && (
                    <p className="mt-1 text-sm text-ink-700">{p.department.name}</p>
                  )}
                  <p className="mt-3 flex-1 text-sm text-ink-700">{p.summary}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-ink-700">
                    {p.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {p.duration}
                      </span>
                    )}
                    {p.code && (
                      <span className="rounded bg-ink-100 px-2 py-0.5">{p.code}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-2xl bg-brand-800 p-8 text-white">
            <h2 className="text-xl font-bold">{progContent.reqHeading}</h2>
            <p className="mt-3 text-sm text-brand-100">
              {progContent.reqBody}
            </p>
            <a
              href={progContent.reqCta.href}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              {progContent.reqCta.label}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
