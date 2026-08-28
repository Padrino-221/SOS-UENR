import Link from 'next/link'
import {
  ArrowRight,
  Target,
  Compass,
  CheckCircle,
} from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getDepartments } from '@/lib/data'
import { getDepartmentIcon } from '@/lib/department-icons'
import { getSiteSections } from '@/lib/site-content'

export default async function AboutPage() {
  const [departments, sections] = await Promise.all([
    getDepartments(),
    getSiteSections(),
  ])

  const { about } = sections
  const storyParagraphs = about.storyBody.split('\n\n').filter(Boolean)

  return (
    <>
      <PageHero
        title={about.heroTitle}
        subtitle={about.heroSubtitle}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <section className="py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              {about.storyEyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold">
              {about.storyHeading}
            </h2>
            {storyParagraphs.map((p, i) => (
              <p key={i} className="mt-5 leading-relaxed text-ink-700">
                {p}
              </p>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-8">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-700 text-white">
                  <Target size={24} weight="duotone" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{about.visionTitle}</h3>
                  <p className="mt-2 text-ink-700">
                    {about.visionBody}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-8">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-400 text-white">
                  <Compass size={24} weight="duotone" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{about.missionTitle}</h3>
                  <p className="mt-2 text-ink-700">
                    {about.missionBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="bg-ink-50 py-20">
        <div className="container-page">
          <div className="mb-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              {about.deptEyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold">
              {about.deptHeading}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => {
              const DeptIcon = getDepartmentIcon(dept.slug)
              return (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.slug}`}
                  className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <DeptIcon size={24} weight="duotone" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-brand-700">
                    {dept.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-ink-700">{dept.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    {dept._count.programmes} programmes <ArrowRight size={14} />
                  </span>
                </Link>
              )
            })}
          </div>

          {departments.length > 0 && (
            <div className="mt-10 rounded-2xl bg-white p-6">
              <h3 className="font-semibold">{about.cerabHeading}</h3>
              <p className="mt-1 text-sm text-ink-700">
                {about.cerabBody}
                <a
                  href={about.cerabLink}
                  className="text-brand-700 hover:underline"
                >
                  cerab.uenr.edu.gh
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-page">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              {about.valuesEyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold">
              {about.valuesHeading}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <div
                key={v.title}
                className="flex items-start gap-3 rounded-2xl border border-ink-100 p-6"
              >
                <CheckCircle className="mt-0.5 shrink-0 text-brand-600" size={22} />
                <div>
                  <h3 className="font-bold">{v.title}</h3>
                  <p className="mt-1 text-sm text-ink-700">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
