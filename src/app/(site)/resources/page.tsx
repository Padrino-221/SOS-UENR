import Link from 'next/link'
import { PageHero } from '@/components/site/page-hero'
import { prisma } from '@/lib/db'
import { DownloadSimple, BookOpen } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

function fileExt(url: string, name?: string | null) {
  const s = (name || url).split('.').pop() || ''
  return s.slice(0, 4).toUpperCase()
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; year?: string }>
}) {
  const { category, year: yearParam } = await searchParams
  const validCats = ['HANDBOOK', 'STUDENT_LIST', 'OTHER']
  const filter = category && validCats.includes(category.toUpperCase()) ? category.toUpperCase() : null

  const [resources, counts, yearCounts] = await Promise.all([
    prisma.resource.findMany({
      where: {
        ...(filter ? { category: filter as 'HANDBOOK' | 'STUDENT_LIST' | 'OTHER' } : {}),
        ...(yearParam ? { academicYear: { is: { year: yearParam } } } : {}),
      },
      include: { academicYear: { select: { year: true } } },
      orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.resource.groupBy({ by: ['category'], _count: { _all: true } }),
    prisma.resource.groupBy({ by: ['academicYearId'], _count: { _all: true } }),
  ])

  const countOf = (c: string) => counts.find((x) => x.category === c)?._count._all ?? 0

  const academicYears = await prisma.academicYear.findMany({
    where: { resources: { some: {} } },
    orderBy: { year: 'desc' },
  })

  const yearCountOf = (id: string) => yearCounts.find((x) => x.academicYearId === id)?._count._all ?? 0

  const tabs = [
    { key: null, label: `All (${counts.reduce((s, c) => s + c._count._all, 0)})` },
    { key: 'HANDBOOK', label: `Handbooks (${countOf('HANDBOOK')})` },
    { key: 'STUDENT_LIST', label: `Student Lists (${countOf('STUDENT_LIST')})` },
    { key: 'OTHER', label: `Other (${countOf('OTHER')})` },
  ]

  const catHref = (key: string | null) => {
    const base = key ? `/resources?category=${key}` : '/resources'
    return yearParam ? `${base}${base.includes('?') ? '&' : '?'}year=${encodeURIComponent(yearParam)}` : base
  }

  const yearHref = (y: string) => {
    const base = filter ? `/resources?category=${filter}&year=${encodeURIComponent(y)}` : `/resources?year=${encodeURIComponent(y)}`
    return base
  }

  const allYearsHref = filter ? `/resources?category=${filter}` : '/resources'

  return (
    <>
      <PageHero
        title="Resources"
        subtitle="Handbooks, final year project student group lists and other official documents."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-3xl mb-10">
            <span className="kicker">Downloads</span>
            <h2 className="mt-3 text-3xl font-serif text-ink-900">All resources</h2>
            <p className="mt-3 text-ink-600 leading-relaxed">Every document uploaded by administration — handbooks and student group lists download the same way.</p>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            {tabs.map((t) => (
              <Link
                key={t.key ?? 'all'}
                href={catHref(t.key)}
                className={`rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                  filter === t.key
                    ? 'bg-brand-700 text-white'
                    : 'border border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4">
            <span className="mr-1 text-xs font-bold uppercase tracking-widest text-ink-400">Year</span>
            <Link
              href={allYearsHref}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                !yearParam
                  ? 'bg-brand-700 text-white'
                  : 'border border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700'
              }`}
            >
              All years ({counts.reduce((s, c) => s + c._count._all, 0)})
            </Link>
            {academicYears.map((y) => (
              <Link
                key={y.id}
                href={yearHref(y.year)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                  yearParam === y.year
                    ? 'bg-brand-700 text-white'
                    : 'border border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700'
                }`}
              >
                {y.year} ({yearCountOf(y.id)})
              </Link>
            ))}
          </div>

          {resources.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <BookOpen size={32} weight="duotone" className="mx-auto text-ink-300" />
              <p className="mt-3 font-serif text-ink-900">No resources found</p>
              <p className="mt-1 text-sm text-ink-500">Try another category or check back later.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((doc) => (
                <div key={doc.id} className="card-premium p-7 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="h-10 w-10 grid place-items-center rounded-lg bg-brand-50 text-brand-700">
                      <BookOpen size={18} weight="duotone" />
                    </span>
                    <span className="rounded-full bg-ink-50 border border-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600">
                      {fileExt(doc.fileUrl, doc.fileName)}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-ink-900 line-clamp-2">{doc.title}</h3>
                  <p className="mt-2 text-sm text-ink-600 line-clamp-2 flex-1">{doc.description || 'No description'}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                      {doc.category === 'HANDBOOK' ? 'Handbook' : doc.category === 'STUDENT_LIST' ? 'Student List' : 'Other'}
                    </span>
                    {doc.academicYear && (
                      <span className="rounded-full bg-ink-50 border border-ink-100 px-2.5 py-1 font-semibold text-ink-600">
                        {doc.academicYear.year}
                      </span>
                    )}
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-800"
                  >
                    <DownloadSimple size={14} weight="duotone" /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
