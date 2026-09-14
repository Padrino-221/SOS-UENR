import Link from 'next/link'
import { Newspaper, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { getDepartments, getProgrammes, getFeaturedPosts } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'
import { truncate, formatDate } from '@/lib/utils'
import { getDepartmentIcon } from '@/lib/department-icons'
import { HeroImageCarousel } from '@/components/site/hero-image-carousel'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [departments, featuredPosts, programmes, sections] = await Promise.all([
    getDepartments(),
    getFeaturedPosts(3),
    getProgrammes(),
    getSiteSections(),
  ])

  const { hero, home, about } = sections
  const featuredDepts = departments.slice(0, 3)
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
      {/* HERO — clean split, like news card style */}
      <section className="bg-ink-50">
        <div className="container-premium py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-none text-ink-900 text-balance tracking-tight">
                {heroData.title} <span className="text-brand-700">{heroData.highlightWord}</span>
                <br />
                <span className="font-normal">{heroData.subtitle.replace('\n', ' ')}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600">{heroData.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={heroData.primaryCta.href} className="btn-primary">
                  {heroData.primaryCta.label} <ArrowRight size={14} weight="duotone" />
                </Link>
                <Link href={heroData.secondaryCta.href} className="btn-secondary">
                  {heroData.secondaryCta.label}
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-xl border border-ink-100 bg-white">
                <HeroImageCarousel images={heroData.images} fallback={heroData.image} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE — dark ImpactBand */}
      <section className="section-padding bg-brand-950 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
        <div className="container-premium relative">
          <div className="max-w-3xl">
            <span className="kicker !text-gold-300 !before:bg-gold-400">{homeData.aboutEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-white leading-tight text-balance">{homeData.aboutHeading}</h2>
            <p className="mt-4 text-white/70 leading-relaxed">{homeData.aboutBody}</p>
            <Link href={homeData.aboutLink} className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold-300 hover:gap-3 transition-all">
              Read our story <ArrowRight size={14} weight="duotone" className="text-gold-300" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center backdrop-blur-sm">
              <p className="text-3xl font-serif text-gold-300">{homeData.aboutYear}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-2">Established</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center backdrop-blur-sm">
              <p className="text-3xl font-serif text-gold-300">{homeData.aboutStat1Value}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-2">{homeData.aboutStat1Label}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center backdrop-blur-sm">
              <p className="text-3xl font-serif text-gold-300">{homeData.aboutStat2Value}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-2">{homeData.aboutStat2Label}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS — clean grid like news */}
      <section className="section-padding bg-ink-50">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="kicker">{homeData.deptEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{homeData.deptHeading}</h2>
            </div>
            <Link href={homeData.deptLink} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700">All departments <ArrowRight size={14} weight="duotone" /></Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {featuredDepts.map((dept) => {
              const Icon = getDepartmentIcon(dept.slug)
              return (
                <Link key={dept.id} href={`/departments/${dept.slug}`} className="card-premium p-7 group flex flex-col h-full">
                  <span className="w-12 h-12 rounded-lg bg-brand-50 text-brand-700 grid place-items-center">
                    <Icon size={22} weight="duotone" />
                  </span>
                  <h3 className="mt-5 text-xl font-serif text-ink-900 group-hover:text-brand-700">{dept.name}</h3>
                  <p className="mt-2 text-sm text-ink-600 line-clamp-3 flex-1">{truncate(dept.summary, 120)}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">{dept._count.programmes} programmes <ArrowRight size={12} weight="duotone" /></span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* PROGRAMMES — clean uniform grid like news */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-3xl mb-10">
            <span className="kicker">{homeData.progEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900 text-balance">{homeData.progHeading}</h2>
            <p className="mt-3 text-ink-600">Choose from diploma, undergraduate and postgraduate pathways — each built with industry, research and innovation at its core.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProgs.map((p) => (
              <Link key={p.id} href={`/programmes/${p.slug}`} className="card-premium p-7 group flex flex-col h-full">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-700">{p.level.toLowerCase()}</span>
                <h3 className="mt-3 text-lg font-serif text-ink-900 group-hover:text-brand-700 leading-tight flex-1">{p.name}</h3>
                {p.department && <p className="mt-2 text-xs text-ink-500">{p.department.name}</p>}
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">Explore <ArrowRight size={12} weight="duotone" /></span>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex justify-center"><Link href={homeData.progLink} className="btn-secondary">View all programmes <ArrowRight size={16} weight="duotone" /></Link></div>
        </div>
      </section>

      {/* WHAT WE STAND FOR — ImpactBand dark (Yedent reference) */}
      <section className="section-padding bg-brand-950 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-brand-700/20 blur-3xl pointer-events-none" />
        <div className="container-premium relative">
          <div className="max-w-3xl mb-10">
            <span className="kicker !text-gold-300 !before:bg-gold-400">What we stand for</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-white leading-tight">Values that guide discovery</h2>
            <p className="mt-3 text-white/70 leading-relaxed">Principles that turn knowledge into impact — from lab to community.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.slice(0, 4).map((v) => (
              <div key={v.title} className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 hover:border-gold-400/30 transition">
                <h4 className="font-serif text-white">{v.title}</h4>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS — keep as liked (gap-10, h-56, p-7) */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="kicker">{homeData.newsEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{homeData.newsHeading}</h2>
            </div>
            <Link href={homeData.newsLink} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700">All stories <ArrowRight size={14} weight="duotone" /></Link>
          </div>
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-3">
            {featuredPosts.length === 0 ? (
              <p className="text-ink-600">{homeData.newsEmpty}</p>
            ) : (
              featuredPosts.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="card-premium overflow-hidden group flex flex-col h-full">
                  <div className="h-56 bg-gradient-to-br from-brand-100 to-brand-300 grid place-items-center">
                    <Newspaper size={40} weight="duotone" className="text-brand-700" />
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="container-premium">
          <div className="rounded-xl bg-brand-700 p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-serif text-white leading-tight">{homeData.ctaHeading}</h2>
              <p className="mt-3 text-white/80 leading-relaxed">{homeData.ctaBody}</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href={homeData.ctaPrimary.href} className="bg-white text-brand-700 hover:bg-gold-400 rounded-lg px-7 py-3.5 text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2 transition">{homeData.ctaPrimary.label} <ArrowRight size={14} weight="duotone" /></Link>
              <Link href={homeData.ctaSecondary.href} className="border border-white/30 text-white hover:bg-white hover:text-brand-700 rounded-lg px-7 py-3.5 text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2 transition">{homeData.ctaSecondary.label}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
