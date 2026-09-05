import Link from 'next/link'
import { PageHero } from '@/components/site/page-hero'
import { prisma } from '@/lib/db'
import { DownloadSimple, Users, BookOpen, FileText } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) {
  const { year } = await searchParams
  const [handbooks, studentLists, academicYears] = await Promise.all([
    prisma.resource.findMany({
      where: { category: 'HANDBOOK' },
      include: { academicYear: { select: { year: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.resource.findMany({
      where: { category: 'STUDENT_LIST', ...(year ? { academicYearId: year } : {}) },
      include: { academicYear: { select: { year: true } } },
      orderBy: [{ academicYear: { year: 'desc' } }, { createdAt: 'desc' }],
    }),
    prisma.academicYear.findMany({ orderBy: { year: 'desc' } }),
  ])

  // Fallback sample handbooks if none uploaded yet
  const handbookFallback = [
    { id: 'sample1', title: 'Student Handbook 2024/2025', description: 'Academic regulations, programmes and campus life.', fileUrl: '/sample-first-page.pdf', fileName: 'Student_Handbook.pdf', academicYear: null },
    { id: 'sample2', title: 'Final Year Project Handbook', description: 'Guidelines for topic selection, formatting and submission.', fileUrl: '/sample-first-page.pdf', fileName: 'Project_Handbook.pdf', academicYear: null },
  ]
  const displayHandbooks = handbooks.length > 0 ? handbooks : handbookFallback

  return (
    <>
      <PageHero
        title="Resources"
        subtitle="Handbooks and final year project group lists — all documents uploaded for students."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-3xl mb-10">
            <span className="kicker">Handbooks</span>
            <h2 className="mt-3 text-3xl font-serif text-ink-900">Download handbooks</h2>
            <p className="mt-3 text-ink-600 leading-relaxed">Official handbooks uploaded by administration — same upload flow as other documents.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayHandbooks.map((h: any) => (
              <div key={h.id} className="card-premium p-7 flex flex-col">
                <span className="h-10 w-10 grid place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <BookOpen size={18} weight="duotone" />
                </span>
                <h3 className="mt-4 font-serif text-ink-900">{h.title}</h3>
                <p className="mt-2 text-sm text-ink-600 flex-1 line-clamp-3">{h.description || 'No description'}</p>
                {h.academicYear && <span className="mt-2 inline-flex text-xs font-semibold text-ink-500">{h.academicYear.year}</span>}
                <a
                  href={h.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700 hover:gap-3 transition-all"
                >
                  Download <DownloadSimple size={14} weight="duotone" /> <span className="text-ink-500 normal-case tracking-normal truncate">{h.fileName || 'Download PDF'}</span>
                </a>
              </div>
            ))}
          </div>
          {handbooks.length === 0 && (
            <p className="mt-6 text-center text-sm text-ink-500">No handbooks uploaded yet — admin can upload via Admin → Resources.</p>
          )}
        </div>
      </section>

      <section className="section-padding bg-ink-50">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="kicker">Final Year Projects</span>
              <h2 className="mt-3 text-3xl font-serif text-ink-900">Student Group Lists</h2>
              <p className="mt-2 text-sm text-ink-600">Uploaded per academic year — each document lists students and their groups, just like handbooks.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/resources"
                className={`rounded-lg px-4 py-2 text-sm font-bold ${!year ? 'bg-brand-700 text-white' : 'border border-ink-100 bg-white text-ink-700 hover:border-brand-200'}`}
              >
                All Years
              </Link>
              {academicYears.map((y) => (
                <Link
                  key={y.id}
                  href={`/resources?year=${y.id}`}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${year === y.id ? 'bg-brand-700 text-white' : 'border border-ink-100 bg-white text-ink-700 hover:border-brand-200'}`}
                >
                  {y.year}
                </Link>
              ))}
            </div>
          </div>

          {studentLists.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <Users size={32} weight="duotone" className="mx-auto text-ink-300" />
              <p className="mt-3 font-serif text-ink-900">No student lists uploaded</p>
              <p className="mt-1 text-sm text-ink-500">Check back later or try another year. Admin uploads via Admin → Resources → Student List.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studentLists.map((doc: any) => (
                <div key={doc.id} className="card-premium p-7 flex flex-col">
                  <span className="h-10 w-10 grid place-items-center rounded-lg bg-gold-50 text-brand-700 border border-gold-200">
                    <FileText size={18} weight="duotone" />
                  </span>
                  <h3 className="mt-4 font-serif text-ink-900 line-clamp-2">{doc.title}</h3>
                  <p className="mt-2 text-sm text-ink-600 line-clamp-2 flex-1">{doc.description || 'Group list document'}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    {doc.academicYear && <span className="rounded-full bg-ink-50 border border-ink-100 px-2.5 py-1 font-semibold text-ink-600">{doc.academicYear.year}</span>}
                    <span className="text-ink-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-800"
                  >
                    <DownloadSimple size={14} weight="duotone" /> Download {doc.fileName ? '' : 'PDF'}
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
