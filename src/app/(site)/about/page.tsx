import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Target,
  Compass,
  CheckCircle,
  Leaf,
  Users,
  Buildings,
  Trophy,
} from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getDepartments } from '@/lib/data'
import { getDepartmentIcon } from '@/lib/department-icons'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const [departments, sections] = await Promise.all([getDepartments(), getSiteSections()])

  const { about } = sections
  const storyParagraphs = about.storyBody.split('\n\n').filter(Boolean)
  const valueIcons = [Users, Leaf, Buildings, Trophy]

  return (
    <>
      <PageHero title={about.heroTitle} subtitle={about.heroSubtitle} crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      {/* Our Story — clean, no glow */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-3xl mb-10">
            <span className="kicker">{about.storyEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif text-ink-900 leading-tight text-balance">{about.storyHeading}</h2>
          </div>
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                {storyParagraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed text-ink-600">
                    {p}
                  </p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="card-premium p-4 sm:p-6">
                  <span className="h-10 w-10 grid place-items-center rounded-lg bg-brand-700 text-white mb-3">
                    <Target size={18} weight="duotone" />
                  </span>
                  <h3 className="font-serif text-sm sm:text-base text-ink-900">{about.visionTitle}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-600 line-clamp-4">{about.visionBody}</p>
                </div>
                <div className="card-premium p-4 sm:p-6">
                  <span className="h-10 w-10 grid place-items-center rounded-lg bg-ink-100 text-brand-700 mb-3 border border-ink-200">
                    <Compass size={18} weight="duotone" />
                  </span>
                  <h3 className="font-serif text-sm sm:text-base text-ink-900">{about.missionTitle}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-600 line-clamp-4">{about.missionBody}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
                <div className="relative aspect-[4/3]">
                  <Image src="/JOEY SHOT IT_2.jpg" alt="School of Sciences" fill className="object-cover" />
                </div>
                <div className="p-5 border-t border-ink-100 bg-ink-50">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Since 2013</p>
                  <p className="mt-1 font-serif text-ink-900 leading-tight">Building scientific leaders for Ghana and Africa</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">The School began with Mathematics & Statistics and Computer Science — today seven departments strong.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments — Yedent subsidiaries style */}
      <section id="departments" className="section-padding bg-ink-50">
        <div className="container-premium">
          <div className="max-w-3xl">
            <span className="kicker">{about.deptEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900 leading-tight text-balance">{about.deptHeading}</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => {
              const DeptIcon = getDepartmentIcon(dept.slug)
              return (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.slug}`}
                  className="card-premium p-5 sm:p-7 group flex flex-col h-full"
                >
                  <span className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-brand-50 text-brand-700 grid place-items-center">
                    <DeptIcon size={20} weight="duotone" className="sm:hidden" />
                    <DeptIcon size={22} weight="duotone" className="hidden sm:block" />
                  </span>
                  <h3 className="mt-3 sm:mt-4 text-sm sm:text-lg font-serif text-ink-900 group-hover:text-brand-700 leading-tight">{dept.name}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-600 line-clamp-3 flex-1">{dept.summary}</p>
                  <span className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">{dept._count.programmes} <span className="hidden sm:inline">programmes</span><span className="sm:hidden">prog</span> <ArrowRight size={12} weight="duotone" /></span>
                </Link>
              )
            })}
          </div>

          {departments.length > 0 && (
            <div className="mt-10 rounded-xl border border-ink-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-ink-900">{about.cerabHeading}</h3>
                <p className="mt-1 text-sm text-ink-600">
                  {about.cerabBody}
                  <a href={about.cerabLink} className="text-brand-700 hover:underline font-semibold">
                    cerab.uenr.edu.gh
                  </a>
                  .
                </p>
              </div>
              <Link href={about.cerabLink} target="_blank" className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:gap-3 transition-all">
                Visit CeRAB <ArrowRight size={14} weight="duotone" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Values — Yedent Core Values dark/cream alternation, now light like news */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="kicker justify-center">{about.valuesEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{about.valuesHeading}</h2>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {about.values.map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length]
              return (
                <div key={v.title} className="card-premium p-6">
                  <span className="h-10 w-10 grid place-items-center rounded-lg bg-brand-50 text-brand-700 mb-4">
                    <Icon size={20} weight="duotone" />
                  </span>
                  <h3 className="font-serif text-ink-900">{v.title}</h3>
                  <p className="mt-2 text-sm text-ink-600 leading-relaxed">{v.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>


    </>
  )
}
