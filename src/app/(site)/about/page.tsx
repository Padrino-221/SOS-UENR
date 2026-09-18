import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Target, Compass } from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getDepartments } from '@/lib/data'
import { getDepartmentIcon } from '@/lib/department-icons'
import { getSiteSections } from '@/lib/site-content'
import { cn, truncate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const [departments, sections] = await Promise.all([getDepartments('School of Sciences'), getSiteSections()])

  const { about, home } = sections
  const storyParagraphs = about.storyBody.split('\n\n').filter(Boolean)

  return (
    <>
      <PageHero title={about.heroTitle} subtitle={about.heroSubtitle} crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      {/* OUR STORY — editorial split: sticky image left, story right with stat rail */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-12 lg:gap-[80px] items-start">
            {/* Content — first on mobile, right on desktop */}
            <div className="lg:order-2">
              <span className="kicker">{about.storyEyebrow}</span>
              <h2 className="mt-3 text-[2rem] sm:text-[2.4rem] lg:text-[2.8rem] font-serif text-ink-900 leading-[1.08] tracking-[-.04em] text-balance">
                {about.storyHeading}
              </h2>
              <div className="mt-7 space-y-4">
                {storyParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className={cn(
                      'leading-[1.75]',
                      i === 0 ? 'text-[1.05rem] text-ink-700' : 'text-[0.95rem] text-ink-500',
                    )}
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Vision / Mission — flush divided band */}
              <div className="mt-8 grid sm:grid-cols-2 border border-[#e5e5e0] divide-y sm:divide-y-0 sm:divide-x divide-[#e5e5e0]">
                <div className="p-6">
                  <span className="w-10 h-10 grid place-items-center bg-brand-700 text-white mb-4">
                    <Target size={18} weight="duotone" />
                  </span>
                  <h3 className="font-serif text-base text-ink-900">{about.visionTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{about.visionBody}</p>
                </div>
                <div className="p-6">
                  <span className="w-10 h-10 grid place-items-center bg-ink-100 text-brand-700 mb-4 border border-ink-200">
                    <Compass size={18} weight="duotone" />
                  </span>
                  <h3 className="font-serif text-base text-ink-900">{about.missionTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{about.missionBody}</p>
                </div>
              </div>
            </div>

            {/* Image — left on desktop, below story on mobile */}
            <div className="relative lg:order-1 lg:sticky lg:top-24">
              <div
                className="absolute pointer-events-none z-0 -right-4 -top-4 h-[104px] w-[104px] lg:-right-7 lg:-top-7 lg:h-[130px] lg:w-[130px]"
                style={{
                  backgroundImage: 'radial-gradient(var(--color-brand-700) 1.5px, transparent 1.5px)',
                  backgroundSize: '11px 11px',
                }}
              />
              <div className="relative z-10 aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-ink-100">
                <Image
                  src="/JOEY SHOT IT_2.jpg"
                  alt="School of Sciences"
                  fill
                  className="object-cover object-center saturate-[.78]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute right-2 bottom-[42px] sm:right-auto sm:left-[-24px] w-[112px] h-[112px] sm:w-[135px] sm:h-[135px] bg-brand-700 text-white flex flex-col items-center justify-center p-5 text-center z-20">
                <strong className="text-[2rem] font-bold leading-none">{home.aboutYear}</strong>
                <span className="text-[0.68rem] leading-[1.35] mt-1 opacity-90">Established</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS — landing numbered card grid with featured first card */}
      <section id="departments" className="section-padding bg-[#f7f7f5]">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="kicker">{about.deptEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{about.deptHeading}</h2>
            </div>
            <Link href="/programmes" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700 transition-all hover:gap-3">
              View programmes <ArrowRight size={14} weight="duotone" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept, i) => {
              const DeptIcon = getDepartmentIcon(dept.slug)
              const isFeatured = i === 0
              return (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.slug}`}
                  className={cn(
                    'group relative p-8 sm:p-9 flex flex-col min-h-[310px] border border-[#e5e5e0] transition-all duration-200 hover:-translate-y-1',
                    isFeatured
                      ? 'bg-brand-700 border-brand-700 text-white'
                      : 'bg-white hover:border-brand-700',
                  )}
                >
                  {/* Number */}
                  <span className={cn(
                    'absolute top-7 right-6 text-[0.68rem] font-extrabold',
                    isFeatured ? 'text-white/50' : 'text-ink-300',
                  )}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <span className={cn(
                    'w-12 h-12 grid place-items-center mb-10 transition-transform duration-200 group-hover:rotate-12',
                    isFeatured ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-700',
                  )}>
                    <DeptIcon size={24} weight="duotone" />
                  </span>

                  <h3 className={cn('text-[1.02rem] font-bold mb-3 leading-snug transition-colors duration-200', isFeatured ? 'text-white group-hover:text-gold-200' : 'text-ink-900 group-hover:text-brand-700')}>
                    {dept.name}
                  </h3>
                  <p className={cn('text-[0.82rem] leading-[1.7] flex-1', isFeatured ? 'text-white/76' : 'text-ink-500')}>
                    {truncate(dept.summary, 100)}
                  </p>

                  <span className={cn(
                    'mt-auto pt-4 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]',
                    isFeatured ? 'border-t border-white/20 text-white/60' : 'border-t border-[#e5e5e0] text-ink-400',
                  )}>
                    {dept._count.programmes} {dept._count.programmes === 1 ? 'Programme' : 'Programmes'}
                  </span>
                </Link>
              )
            })}
          </div>

          {departments.length > 0 && (
            <div className="mt-10 border border-[#e5e5e0] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              <Link href={about.cerabLink} target="_blank" className="shrink-0 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700 transition-all hover:gap-3">
                Visit CeRAB <ArrowRight size={14} weight="duotone" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* VALUES — landing dark band with dot pattern */}
      <section className="section-padding bg-brand-950 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-brand-700/20 blur-3xl pointer-events-none" />
        <div className="container-premium relative">
          <div className="max-w-3xl mb-10">
            <span className="kicker !text-gold-300 !before:bg-gold-400">{about.valuesEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-white leading-tight">{about.valuesHeading}</h2>
            <p className="mt-3 text-white/70 leading-relaxed">Principles that turn knowledge into impact — from lab to community.</p>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4 border border-white/10 overflow-hidden">
            {about.values.map((v) => (
              <div key={v.title} className="bg-white/5 p-6 border-b last:border-b-0 sm:border-b-0 sm:border-r border-white/10 last:border-r-0 hover:bg-white/10 hover:border-gold-400/30 transition">
                <h4 className="font-serif text-white">{v.title}</h4>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
