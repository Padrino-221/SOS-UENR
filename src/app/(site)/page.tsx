import Link from 'next/link'
import Image from 'next/image'
import { Newspaper, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { getDepartments, getProgrammes, getFeaturedPosts } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'
import { cn, truncate, formatDate } from '@/lib/utils'
import { getDepartmentIcon } from '@/lib/department-icons'
import { HeroImageCarousel } from '@/components/site/hero-image-carousel'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [departments, featuredPosts, programmes, sections] = await Promise.all([
    getDepartments('School of Sciences'),
    getFeaturedPosts(3),
    getProgrammes({ school: 'School of Sciences' }),
    getSiteSections(),
  ])

  const { hero, home, about } = sections
  const featuredProgs = programmes.slice(0, 6)

  const allHeroImages = hero?.images
  const fallbackImage = hero?.image || '/JOEY SHOT IT_2.jpg'
  const heroImages = allHeroImages && allHeroImages.length > 0 ? allHeroImages.filter(Boolean) : [fallbackImage]
  const heroData = {
    badge: hero?.badge || 'University of Energy and Natural Resources',
    title: hero?.title || 'School of Sciences —',
    highlightWord: hero?.highlightWord || 'Science',
    subtitle: hero?.subtitle || 'is\nan adventure',
    description: hero?.description || 'Transformational and value-based education in physical and biological sciences.',
    primaryCta: hero?.primaryCta || { label: 'Explore Programmes', href: '/programmes' },
    secondaryCta: hero?.secondaryCta || { label: 'Learn About Us', href: '/about' },
    image: fallbackImage,
    images: heroImages,
    stats: hero?.stats || [{ value: '4,000+', label: 'Students' }, { value: '80+', label: 'Lecturers' }, { value: '3,000+', label: 'Graduates' }],
  }
  const homeData = {
    aboutEyebrow: (home as any)?.aboutEyebrow || 'Who We Are',
    aboutHeading: (home as any)?.aboutHeading || 'Generating and advancing scientific knowledge',
    aboutBody: (home as any)?.aboutBody || 'Established in the 2013/2014 academic year, the School of Sciences began with two departments and now hosts seven departments and centres.',
    aboutLink: (home as any)?.aboutLink || '/about',
    aboutYear: (home as any)?.aboutYear || 2013,
    aboutStat1Value: (home as any)?.aboutStat1Value || '9',
    aboutStat1Label: (home as any)?.aboutStat1Label || 'Degree programmes',
    aboutStat2Value: (home as any)?.aboutStat2Value || '7',
    aboutStat2Label: (home as any)?.aboutStat2Label || 'Departments',
    deptEyebrow: (home as any)?.deptEyebrow || 'Departments',
    deptHeading: (home as any)?.deptHeading || 'Where discovery happens',
    deptLink: (home as any)?.deptLink || '/about#departments',
    progEyebrow: (home as any)?.progEyebrow || 'Programmes',
    progHeading: (home as any)?.progHeading || 'Find your future',
    progLink: (home as any)?.progLink || '/programmes',
    newsEyebrow: (home as any)?.newsEyebrow || 'News & Events',
    newsHeading: (home as any)?.newsHeading || 'Latest stories',
    newsLink: (home as any)?.newsLink || '/news',
    newsEmpty: (home as any)?.newsEmpty || 'No stories yet.',
    ctaHeading: (home as any)?.ctaHeading || 'Ready to begin your scientific journey?',
    ctaBody: (home as any)?.ctaBody || 'Join innovators building sustainable solutions for Ghana and Africa.',
    ctaPrimary: (home as any)?.ctaPrimary || { label: 'Apply to UENR', href: 'https://admissions.uenr.edu.gh/applicant-login' },
    ctaSecondary: (home as any)?.ctaSecondary || { label: 'Contact Us', href: '/contact' },
  }

  return (
    <>
      {/* HERO — warm cream, portrait frame, floating cards */}
      <section className="relative overflow-hidden pt-12 pb-0" style={{ background: 'radial-gradient(circle at 80% 5%, rgba(13,32,99,.07), transparent 27rem), #f7f7f5' }}>

        <div className="container-premium relative pb-0">
          <div className="grid lg:grid-cols-[.96fr_1.04fr] gap-10 sm:gap-14 lg:gap-20 items-center lg:min-h-[580px]">
            {/* Left content */}
            <div className="relative z-10 pb-12">
              <h1 className="max-w-[650px] text-[2.15rem] sm:text-[3.2rem] lg:text-[3.8rem] font-serif leading-[1.05] tracking-[-.055em] text-ink-900 mb-6">
                {heroData.title} <span className="text-brand-700">{heroData.highlightWord}</span>
                <br />
                <span className="font-normal">{heroData.subtitle.replace('\n', ' ')}</span>
              </h1>
              <p className="max-w-[565px] text-ink-500 text-[1.08rem] leading-[1.7]">{heroData.description}</p>
              <div className="flex flex-col items-stretch gap-3 mt-8 mb-8 sm:flex-row sm:items-center">
                <Link href={heroData.primaryCta.href} className="btn-primary">
                  {heroData.primaryCta.label} <ArrowRight size={14} weight="duotone" />
                </Link>
                <Link href={heroData.secondaryCta.href} className="inline-flex items-center justify-center gap-2 px-[18px] min-h-[46px] border border-[#d2d2cb] bg-white text-ink-900 text-[.9rem] font-bold transition-all duration-200 hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700">
                  {heroData.secondaryCta.label}
                  <span className="inline-grid place-items-center w-5 h-5" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative hidden self-end min-h-[580px] z-20 lg:block">
              {/* Portrait frame */}
              <div className="absolute right-0 bottom-0 w-full max-w-[675px] h-[580px] overflow-hidden bg-[#dadad6]" style={{ borderRadius: '52% 52% 6px 6px' }}>
                <HeroImageCarousel images={heroData.images} fallback={heroData.image} className="relative h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 pointer-events-none" />
              </div>
              {/* Floating card — programme match */}
              <div className="absolute left-[-28px] bottom-[72px] z-30 flex items-center gap-3 bg-white px-4 py-3.5">
                <span className="inline-grid place-items-center w-[35px] h-[35px] bg-brand-50 text-brand-700 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M20 6 9 17l-5-5"/></svg>
                </span>
                <div>
                  <strong className="block text-xs text-ink-900">Right department. Right fit.</strong>
                  <small className="block text-[10px] text-ink-500">Programmes selected for you</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE — image + text, HR career-story style */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-[1fr_.9fr] gap-12 lg:gap-[90px] items-center">
            {/* Left — image with dot pattern behind + floating badge */}
            <div className="relative h-[430px] sm:h-[500px] lg:h-[550px] overflow-visible">
              {/* Dot pattern — behind image */}
              <div
                className="absolute pointer-events-none z-0 -left-4 -top-4 h-[104px] w-[104px] sm:-left-7 sm:-top-7 sm:h-[130px] sm:w-[130px]"
                style={{
                  backgroundImage: 'radial-gradient(var(--color-brand-700) 1.5px, transparent 1.5px)',
                  backgroundSize: '11px 11px',
                }}
              />
              {/* Image */}
              <div className="absolute inset-0 bg-ink-100 z-10">
                <Image
                  src={heroData.image}
                  alt="School of Sciences campus"
                  fill
                  className="object-cover object-center saturate-[.78]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute right-2 bottom-[42px] w-[112px] h-[112px] sm:right-[-36px] sm:w-[135px] sm:h-[135px] bg-brand-700 text-white flex flex-col items-center justify-center p-5 text-center z-20">
                <strong className="text-[2rem] font-bold leading-none">2013</strong>
                <span className="text-[0.68rem] leading-[1.35] mt-1 opacity-90">Established</span>
              </div>
            </div>

            {/* Right — content */}
            <div>
              <span className="kicker">{homeData.aboutEyebrow}</span>
              <h2 className="mt-3 text-[2rem] sm:text-[2.4rem] lg:text-[2.8rem] font-serif text-ink-900 leading-[1.08] tracking-[-.04em] text-balance">
                {homeData.aboutHeading}
              </h2>
              <p className="mt-5 text-ink-500 leading-[1.75] text-[0.95rem]">{homeData.aboutBody}</p>

              {/* Benefit list */}
              <div className="mt-7 grid gap-4">
                {[
                  { label: 'Seven departments and centres', desc: 'Chemical Sciences, Computer Science and Informatics, Mathematics and Statistics, Biological Science, Medical Laboratory Science, Nursing, and CeRAB.' },
                  { label: 'Diploma, degree, and postgraduate programmes', desc: 'Pathways spanning physical, biological, and computational sciences.' },
                  { label: 'Qualified lecturers', desc: 'Over 80 faculty advancing knowledge across energy, natural resources, and applied sciences.' },
                ].map((b) => (
                  <div key={b.label} className="flex items-start gap-3.5">
                    <span className="shrink-0 w-7 h-7 bg-brand-50 text-brand-700 grid place-items-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[15px] h-[15px]">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <div>
                      <strong className="block text-[0.88rem] text-ink-900">{b.label}</strong>
                      <small className="block text-[0.77rem] text-ink-500 mt-0.5 leading-relaxed">{b.desc}</small>
                    </div>
                  </div>
                ))}
              </div>

              <Link href={homeData.aboutLink} className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700 hover:gap-3 transition-all">
                Read our story <ArrowRight size={14} weight="duotone" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS — HR service-card style */}
      <section className="section-padding bg-[#f7f7f5]">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="kicker">{homeData.deptEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{homeData.deptHeading}</h2>
            </div>
            <Link href={homeData.deptLink} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700 transition-all hover:gap-3">All departments <ArrowRight size={14} weight="duotone" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {departments.slice(0, 4).map((dept, i) => {
              const Icon = getDepartmentIcon(dept.slug)
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
                    <Icon size={24} weight="duotone" />
                  </span>

                  <h3 className={cn('text-[1.02rem] font-bold mb-3 leading-snug transition-colors duration-200', isFeatured ? 'text-white group-hover:text-gold-200' : 'text-ink-900 group-hover:text-brand-700')}>
                    {dept.name}
                  </h3>
                  <p className={cn('text-[0.82rem] leading-[1.7] flex-1', isFeatured ? 'text-white/76' : 'text-ink-500')}>
                    {truncate(dept.summary, 100)}
                  </p>
                </Link>
              )
            })}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href={homeData.deptLink} className="btn-secondary">All departments <ArrowRight size={16} weight="duotone" /></Link>
          </div>
        </div>
      </section>

      {/* PROGRAMMES — HR job-card style */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="kicker">{homeData.progEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{homeData.progHeading}</h2>
            </div>
            <Link href={homeData.progLink} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700 transition-all hover:gap-3">All programmes <ArrowRight size={14} weight="duotone" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProgs.map((p) => (
              <Link key={p.id} href={`/programmes/${p.slug}`} className="group flex flex-col p-6 border border-[#e5e5e0] bg-white transition-all duration-200 hover:border-brand-700 hover:-translate-y-1">
                {/* Card head: level badge + department */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-brand-700 bg-brand-50 px-2.5 py-1">{p.level.toLowerCase()}</span>
                  {p.department && <span className="text-[0.72rem] text-ink-400 truncate max-w-[160px]">{p.department.name}</span>}
                </div>

                {/* Title */}
                <h3 className="text-[1.08rem] font-bold text-ink-900 group-hover:text-brand-700 leading-snug mb-4">{p.name}</h3>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-[#e5e5e0]">
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-brand-700">
                    Explore <ArrowRight size={12} weight="duotone" className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href={homeData.progLink} className="btn-secondary">View all programmes <ArrowRight size={16} weight="duotone" /></Link>
          </div>
        </div>
      </section>

      {/* VALUES — dark band with dot pattern */}
      <section className="section-padding bg-brand-950 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-brand-700/20 blur-3xl pointer-events-none" />
        <div className="container-premium relative">
          <div className="max-w-3xl mb-10">
            <span className="kicker !text-gold-300 !before:bg-gold-400">What we stand for</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-white leading-tight">Values that guide discovery</h2>
            <p className="mt-3 text-white/70 leading-relaxed">Principles that turn knowledge into impact — from lab to community.</p>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4 border border-white/10 overflow-hidden">
            {about.values.slice(0, 4).map((v) => (
              <div key={v.title} className="bg-white/5 p-6 border-b last:border-b-0 sm:border-b-0 sm:border-r border-white/10 last:border-r-0 hover:bg-white/10 hover:border-gold-400/30 transition">
                <h4 className="font-serif text-white">{v.title}</h4>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS — cream background */}
      <section className="section-padding bg-[#f7f7f5]">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="kicker">{homeData.newsEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{homeData.newsHeading}</h2>
            </div>
            <Link href={homeData.newsLink} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700 transition-all hover:gap-3">All stories <ArrowRight size={14} weight="duotone" /></Link>
          </div>
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
            {featuredPosts.length === 0 ? (
              <p className="text-ink-600">{homeData.newsEmpty}</p>
            ) : (
              featuredPosts.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="warm-card overflow-hidden group flex flex-col h-full">
                  <div className="h-44 sm:h-56 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-300 grid place-items-center">
                      <Newspaper size={40} weight="duotone" className="text-brand-700" />
                    </div>
                  </div>
                  <div className="p-7 flex-1 flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-700">{post.category.toLowerCase().replace('_',' ')} • {formatDate(post.publishedAt)}</span>
                    <h3 className="mt-3 font-serif text-ink-900 group-hover:text-brand-700 line-clamp-2 leading-relaxed">{post.title}</h3>
                    <p className="mt-3 text-sm text-ink-600 line-clamp-3 flex-1 leading-7">{truncate(post.excerpt, 100)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href={homeData.newsLink} className="btn-secondary">All stories <ArrowRight size={16} weight="duotone" /></Link>
          </div>
        </div>
      </section>

      {/* CTA — solid primary */}
      <section className="bg-brand-700">
        <div className="container-premium py-20 sm:py-[82px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <h2 className="text-[2rem] sm:text-[2.4rem] lg:text-[2.75rem] font-serif text-white leading-[1.05] tracking-[-.04em]">
              {homeData.ctaHeading}
            </h2>
            <Link
              href={homeData.ctaPrimary.href}
              className="shrink-0 bg-white text-brand-700 px-8 py-3.5 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] inline-flex items-center gap-2 transition-colors duration-200 hover:bg-ink-900 hover:text-white"
            >
              {homeData.ctaPrimary.label} <ArrowRight size={14} weight="duotone" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
