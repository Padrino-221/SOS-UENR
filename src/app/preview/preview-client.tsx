'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, GraduationCap, Buildings, Newspaper } from '@phosphor-icons/react'
import { siteDefaults, type SiteSections } from '@/data/siteDefaults'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PublicShell } from '@/components/site/public-shell'
import { getDepartmentIcon } from '@/lib/department-icons'
import { truncate, formatDate } from '@/lib/utils'

function deepMerge(defaults: any, saved: any): any {
  if (!saved || typeof saved !== 'object') return defaults
  if (!defaults || typeof defaults !== 'object') return saved
  const result: any = { ...defaults }
  for (const key of Object.keys(saved)) {
    const v = saved[key]
    const d = defaults[key]
    if (v !== null && v !== undefined && typeof v === 'object' && !Array.isArray(v) && typeof d === 'object' && d !== null && !Array.isArray(d)) {
      result[key] = deepMerge(d, v)
    } else if (v !== undefined) {
      result[key] = v
    }
  }
  return result
}

export function PreviewClient({
  liveDepartments,
  liveFeaturedPosts,
  liveProgrammes,
  liveSections,
}: {
  liveDepartments: Awaited<ReturnType<typeof import('@/lib/data').getDepartments>>
  liveFeaturedPosts: Awaited<ReturnType<typeof import('@/lib/data').getFeaturedPosts>>
  liveProgrammes: Awaited<ReturnType<typeof import('@/lib/data').getProgrammes>>
  liveSections: SiteSections
}) {
  const [sections, setSections] = useState<SiteSections>(liveSections)
  const [isPreview, setIsPreview] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('site-builder-preview')
      if (raw) {
        const parsed = JSON.parse(raw)
        setSections(deepMerge(siteDefaults, parsed))
        setIsPreview(true)
        return
      }
      const m = document.cookie.match(/(?:^|; )site-builder-preview=([^;]*)/)
      if (m) {
        const parsed = JSON.parse(decodeURIComponent(m[1]))
        setSections(deepMerge(siteDefaults, parsed))
        setIsPreview(true)
      }
    } catch {}
  }, [])

  const { hero, home, about } = sections
  const degreeCount = liveProgrammes.filter((p: any) => p.level === 'DEGREE').length
  const featuredDepts = liveDepartments.slice(0, 3)
  const featuredProgs = liveProgrammes.slice(0, 6)

  const heroData = {
    badge: hero?.badge || 'University of Energy and Natural Resources',
    title: hero?.title || 'School of Sciences —',
    highlightWord: hero?.highlightWord || 'Science',
    subtitle: hero?.subtitle || 'is\nan adventure',
    description: hero?.description || 'Transformational and value-based education in physical and biological sciences.',
    primaryCta: hero?.primaryCta || { label: 'Explore Programmes', href: '/programmes' },
    secondaryCta: hero?.secondaryCta || { label: 'Learn About Us', href: '/about' },
    image: hero?.image || '/JOEY SHOT IT_2.jpg',
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
    newsEmpty: (home as any)?.newsEmpty || 'No stories yet.',
    ctaHeading: (home as any)?.ctaHeading || 'Ready to begin your scientific journey?',
    ctaBody: (home as any)?.ctaBody || 'Join innovators building sustainable solutions for Ghana and Africa.',
    ctaPrimary: (home as any)?.ctaPrimary || { label: 'Apply to UENR', href: 'https://admissions.uenr.edu.gh/applicant-login' },
    ctaSecondary: (home as any)?.ctaSecondary || { label: 'Contact Us', href: '/contact' },
  }

  const branding = (sections as any).branding || liveSections.branding
  const navigation = (sections as any).navigation || liveSections.navigation
  const footer = (sections as any).footer || liveSections.footer

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      <div
        suppressHydrationWarning
        className={`sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between gap-4 text-sm ${mounted && isPreview ? 'bg-amber-400 text-ink-900' : 'bg-amber-50 border-b border-amber-200 text-amber-800'}`}
      >
        <span suppressHydrationWarning className="font-bold">
          {mounted && isPreview ? 'Preview Mode — showing unsaved builder changes (not live)' : 'No preview data — showing live site. Open Site Builder → Preview to see your edits.'}
        </span>
        <Link
          href={mounted && isPreview ? '/admin/site-builder' : '/'}
          className="rounded-lg bg-ink-900 text-white px-3 py-1.5 text-xs font-bold hover:bg-ink-800 inline-flex items-center gap-1.5"
        >
          {mounted && isPreview ? 'Back to Builder' : 'Back to Live Site'}
        </Link>
      </div>
      <PublicShell>
        <SiteHeader navigation={navigation} logo={branding.logo} />
        <main>
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
                <div className="relative h-80 sm:h-96">
                  <Image src={heroData.image} alt="School of Sciences" fill className="object-cover" priority />
                </div>
                <div className="grid grid-cols-3 divide-x divide-ink-100 border-t border-ink-100">
                  <div className="p-4 text-center">
                    <p className="text-xl font-serif text-brand-700">{degreeCount}+</p>
                    <p className="text-xs uppercase tracking-widest text-ink-500">Programmes</p>
                  </div>
                  {heroData.stats.slice(0, 2).map((s: any, i: number) => (
                    <div key={i} className="p-4 text-center">
                      <p className="text-xl font-serif text-ink-900">{s.value}</p>
                      <p className="text-xs uppercase tracking-widest text-ink-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-950 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
        <div className="container-premium relative">
          <div className="max-w-3xl">
            <span className="kicker !text-gold-300 !before:bg-gold-400">{homeData.aboutEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-white leading-tight text-balance">{homeData.aboutHeading}</h2>
            <p className="mt-4 text-white/70 leading-relaxed">{homeData.aboutBody}</p>
            <Link href={homeData.aboutLink} className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold-300">
              Read our story <ArrowRight size={14} weight="duotone" className="text-gold-300" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-3xl font-serif text-gold-300">{homeData.aboutYear}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-2">Established</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-3xl font-serif text-gold-300">{homeData.aboutStat1Value}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-2">{homeData.aboutStat1Label}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-3xl font-serif text-gold-300">{homeData.aboutStat2Value}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-2">{homeData.aboutStat2Label}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink-50">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="kicker">{homeData.deptEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{homeData.deptHeading}</h2>
            </div>
            <Link href={homeData.deptLink} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-700">
              All departments <ArrowRight size={14} weight="duotone" />
            </Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {featuredDepts.map((dept: any) => {
              const Icon = getDepartmentIcon(dept.slug)
              return (
                <div key={dept.id} className="card-premium p-7">
                  <span className="w-12 h-12 rounded-lg bg-brand-50 text-brand-700 grid place-items-center">
                    <Icon size={22} weight="duotone" />
                  </span>
                  <h3 className="mt-5 text-xl font-serif text-ink-900">{dept.name}</h3>
                  <p className="mt-2 text-sm text-ink-600 line-clamp-3">{truncate(dept.summary, 120)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-3xl mb-10">
            <span className="kicker">{homeData.progEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900 text-balance">{homeData.progHeading}</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProgs.map((p: any) => (
              <div key={p.id} className="card-premium p-7">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-700">{p.level.toLowerCase()}</span>
                <h3 className="mt-3 text-lg font-serif text-ink-900 leading-tight">{p.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-950 relative overflow-hidden">
        <div className="container-premium relative">
          <div className="max-w-3xl mb-10">
            <span className="kicker !text-gold-300 !before:bg-gold-400">What we stand for</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-white leading-tight">Values that guide discovery</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.slice(0, 4).map((v: any) => (
              <div key={v.title} className="rounded-xl bg-white/5 border border-white/10 p-6">
                <h4 className="font-serif text-white">{v.title}</h4>
                <p className="mt-2 text-sm text-white/70">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="kicker">{homeData.newsEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">{homeData.newsHeading}</h2>
            </div>
          </div>
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-3">
            {liveFeaturedPosts.map((post: any) => (
              <div key={post.id} className="card-premium overflow-hidden">
                <div className="h-56 bg-gradient-to-br from-brand-100 to-brand-300 grid place-items-center">
                  <Newspaper size={40} weight="duotone" className="text-brand-700" />
                </div>
                <div className="p-7">
                  <h3 className="font-serif text-ink-900 line-clamp-2 leading-relaxed">{post.title}</h3>
                  <p className="mt-3 text-sm text-ink-600 line-clamp-3 leading-7">{truncate(post.excerpt, 100)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        </main>
        <SiteFooter footer={footer} logo={branding.logo} />
      </PublicShell>
    </div>
  )
}
