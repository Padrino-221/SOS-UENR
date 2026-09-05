import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  GraduationCap,
  Clock,
  ArrowRight,
  ListChecks,
  Briefcase,
} from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getProgramme } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function ProgrammeDetailPage({
  params,
}: PageProps<'/programmes/[slug]'>) {
  const { slug } = await params
  const programme = await getProgramme(slug)

  if (!programme) notFound()

  const requirements = programme.requirements
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const careers = programme.careerPaths
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <>
      <PageHero
        title={programme.name}
        subtitle={`${programme.level.charAt(0) + programme.level.slice(1).toLowerCase()} programme${
          programme.department ? ' · ' + programme.department.name : ''
        }`}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Programmes', href: '/programmes' },
          { label: programme.name },
        ]}
      />

      <section className="section-padding bg-white">
        <div className="container-premium grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div>
              <h2 className="text-2xl font-serif text-ink-900">Programme overview</h2>
              <div className="mt-4 whitespace-pre-line leading-relaxed text-ink-600">
                {programme.overview || programme.summary}
              </div>
            </div>

            {requirements.length > 0 && (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 text-2xl font-serif text-ink-900">
                  <ListChecks size={22} weight="duotone" className="text-brand-700" /> Entry requirements
                </h2>
                <ul className="mt-5 space-y-3">
                  {requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 card-premium p-4">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                      <span className="text-sm text-ink-700 leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {careers.length > 0 && (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 text-2xl font-serif text-ink-900">
                  <Briefcase size={22} weight="duotone" className="text-brand-700" /> Career paths
                </h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {careers.map((c, i) => (
                    <li key={i} className="card-premium p-4 text-sm text-ink-700 leading-relaxed">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="card-premium p-6">
              <h3 className="flex items-center gap-2 font-serif text-ink-900">
                <GraduationCap size={20} weight="duotone" className="text-brand-700" /> Quick facts
              </h3>
              <dl className="mt-5 space-y-3 text-sm">
                {programme.code && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Code</dt>
                    <dd className="font-semibold text-ink-900">{programme.code}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Level</dt>
                  <dd className="font-semibold text-ink-900 lowercase">{programme.level}</dd>
                </div>
                {programme.duration && (
                  <div className="flex justify-between gap-4">
                    <dt className="flex items-center gap-1 text-ink-500"><Clock size={14} weight="duotone" /> Duration</dt>
                    <dd className="font-semibold text-ink-900">{programme.duration}</dd>
                  </div>
                )}
                {programme.mode && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Mode</dt>
                    <dd className="font-semibold text-ink-900">{programme.mode}</dd>
                  </div>
                )}
                {programme.department && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Department</dt>
                    <dd className="text-right font-semibold text-ink-900">{programme.department.name}</dd>
                  </div>
                )}
              </dl>
            </div>

            <Link href="https://admissions.uenr.edu.gh/applicant-login" className="flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-sm font-bold text-white hover:bg-brand-800 transition">
              Apply for this programme <ArrowRight size={16} weight="duotone" />
            </Link>
            <Link href="/programmes" className="flex items-center justify-center gap-2 rounded-lg border border-ink-100 bg-white px-5 py-3 text-sm font-bold text-ink-700 hover:border-brand-200 hover:text-brand-700 transition">
              View other programmes
            </Link>
          </aside>
        </div>
      </section>
    </>
  )
}
