import Link from 'next/link'
import { PageHero } from '@/components/site/page-hero'
import { ResourceYearFilter } from '@/components/site/resource-year-filter'
import { prisma } from '@/lib/db'
import { DownloadSimple, BookOpen } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

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

  const [resources, counts] = await Promise.all([
    prisma.resource.findMany({
      where: {
        ...(filter ? { category: filter as 'HANDBOOK' | 'STUDENT_LIST' | 'OTHER' } : {}),
        ...(yearParam ? { academicYear: { is: { year: yearParam } } } : {}),
      },
      include: { academicYear: { select: { year: true } } },
      orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.resource.groupBy({ by: ['category'], _count: { _all: true } }),
  ])

  const countOf = (c: string) => counts.find((x) => x.category === c)?._count._all ?? 0

  const academicYears = await prisma.academicYear.findMany({
    where: { resources: { some: {} } },
    orderBy: { year: 'desc' },
  })

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

  const tabClass = (isActive: boolean) =>
    cn(
      'border px-4 py-2 text-[0.8rem] font-bold transition-colors duration-150',
      isActive
        ? 'border-brand-700 bg-brand-700 text-white'
        : 'border-[#e5e5e0] bg-white text-ink-600 hover:border-brand-700 hover:text-brand-700',
    )

  return (
    <>
      <PageHero
        title="Resources"
        subtitle="Handbooks, final year project student group lists and other official documents."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-2xl mb-10">
            <span className="kicker">Downloads</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">All resources</h2>
            <p className="mt-3 text-ink-500 leading-[1.75] text-[0.95rem]">
              Every document uploaded by administration — handbooks and student group lists download the same way.
            </p>
          </div>

          {/* Category tabs + year filter */}
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <Link key={t.key ?? 'all'} href={catHref(t.key)} className={tabClass(filter === t.key)}>
                  {t.label}
                </Link>
              ))}
            </div>
            <ResourceYearFilter
              years={academicYears.map((y) => ({ id: y.id, label: y.year }))}
              currentYear={yearParam ?? null}
            />
          </div>

          {resources.length === 0 ? (
            <div className="border border-dashed border-ink-300 bg-white p-12 text-center">
              <BookOpen size={32} weight="duotone" className="mx-auto text-ink-300" />
              <p className="mt-3 font-serif text-ink-900">No resources found</p>
              <p className="mt-1 text-sm text-ink-500">Try another category or check back later.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col p-6 border border-[#e5e5e0] bg-white transition-all duration-200 hover:border-brand-700 hover:-translate-y-1"
                >
                  {/* Card head: icon + file type */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center bg-brand-50 text-brand-700">
                      <BookOpen size={18} weight="duotone" />
                    </span>
                    <span className="border border-ink-200 bg-ink-50 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-ink-600">
                      {fileExt(doc.fileUrl, doc.fileName)}
                    </span>
                  </div>

                  {/* Title + description */}
                  <h3 className="text-[1.02rem] font-bold text-ink-900 leading-snug line-clamp-2">{doc.title}</h3>
                  <p className="mt-2 text-[0.85rem] leading-[1.65] text-ink-500 line-clamp-2">{doc.description || 'No description'}</p>

                  {/* Meta chips */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="bg-brand-50 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-brand-700">
                      {doc.category === 'HANDBOOK' ? 'Handbook' : doc.category === 'STUDENT_LIST' ? 'Student List' : 'Other'}
                    </span>
                    {doc.academicYear && (
                      <span className="border border-ink-200 bg-ink-50 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-ink-600">
                        {doc.academicYear.year}
                      </span>
                    )}
                  </div>

                  {/* Footer action */}
                  <div className="mt-auto pt-5">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 border-t border-[#e5e5e0] pt-4 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-brand-700 transition-all hover:gap-3 w-full"
                    >
                      Download
                      <DownloadSimple size={14} weight="duotone" className="transition-transform duration-200 group-hover:translate-y-0.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
