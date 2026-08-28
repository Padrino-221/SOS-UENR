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

      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div>
              <h2 className="text-2xl font-bold">Programme overview</h2>
              <div className="mt-4 whitespace-pre-line leading-relaxed text-ink-700">
                {programme.overview || programme.summary}
              </div>
            </div>

            {requirements.length > 0 && (
              <div className="mt-12">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <ListChecks size={24} className="text-brand-700" /> Entry
                  requirements
                </h2>
                <ul className="mt-4 space-y-2">
                  {requirements.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 rounded-lg bg-ink-50 p-3 text-ink-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {careers.length > 0 && (
              <div className="mt-12">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <Briefcase size={24} className="text-brand-700" /> Career paths
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {careers.map((c, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-ink-100 p-3 text-ink-700"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-6">
              <h3 className="flex items-center gap-2 font-bold">
                <GraduationCap size={20} className="text-brand-700" /> Quick facts
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                {programme.code && (
                  <div className="flex justify-between">
                    <dt className="text-ink-700">Code</dt>
                    <dd className="font-semibold">{programme.code}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink-700">Level</dt>
                  <dd className="font-semibold lowercase">{programme.level}</dd>
                </div>
                {programme.duration && (
                  <div className="flex justify-between">
                    <dt className="flex items-center gap-1 text-ink-700">
                      <Clock size={14} /> Duration
                    </dt>
                    <dd className="font-semibold">{programme.duration}</dd>
                  </div>
                )}
                {programme.mode && (
                  <div className="flex justify-between">
                    <dt className="text-ink-700">Mode</dt>
                    <dd className="font-semibold">{programme.mode}</dd>
                  </div>
                )}
                {programme.department && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-700">Department</dt>
                    <dd className="text-right font-semibold">
                      {programme.department.name}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <Link
              href="https://admissions.uenr.edu.gh/applicant-login"
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Apply for this programme <ArrowRight size={16} />
            </Link>
            <Link
              href="/programmes"
              className="flex items-center justify-center gap-2 rounded-lg border border-ink-200 px-5 py-3 text-center text-sm font-semibold text-ink-800 transition hover:border-brand-300 hover:text-brand-700"
            >
              View other programmes
            </Link>
          </aside>
        </div>
      </section>
    </>
  )
}
