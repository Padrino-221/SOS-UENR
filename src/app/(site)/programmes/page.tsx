import Link from 'next/link'
import { PageHero } from '@/components/site/page-hero'
import { ProgrammesTable } from '@/components/site/programmes-table'
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
    getProgrammes({ level, school: 'School of Sciences' }),
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
          <div className="mb-6 flex flex-wrap gap-3">
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

          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-brand-100 bg-brand-50/60 p-5">
            <div>
              <p className="text-sm font-bold text-brand-800">Not sure where you fit?</p>
              <p className="text-sm text-ink-600">Enter your WASSCE grades and get a friendly, private recommendation for the best programmes for you.</p>
            </div>
            <Link href="/programmes/eligibility-checker" className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800 transition">
              Check eligibility
            </Link>
          </div>

          {programmes.length === 0 ? (
            <p className="text-center py-12 text-ink-600">No programmes found in this category yet.</p>
          ) : (
            <ProgrammesTable
              programmes={programmes.map((p) => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                level: p.level,
                duration: p.duration,
                summary: p.summary,
                departmentName: p.department?.name ?? null,
              }))}
            />
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
