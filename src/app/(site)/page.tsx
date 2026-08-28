import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap,
  ArrowRight,
  Buildings,
  Newspaper,
} from '@phosphor-icons/react/dist/ssr'
import { getDepartments, getProgrammes, getFeaturedPosts } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'
import { truncate, formatDate } from '@/lib/utils'
import { getDepartmentIcon } from '@/lib/department-icons'

export default async function HomePage() {
  const [departments, featuredPosts, programmes, sections] = await Promise.all([
    getDepartments(),
    getFeaturedPosts(3),
    getProgrammes(),
    getSiteSections(),
  ])

  const degreeCount = programmes.filter((p) => p.level === 'DEGREE').length
  const { hero, home } = sections

  return (
    <>
      {/* Hero */}
      <section className="bg-ink-100">
        <div className="container-page grid items-center gap-0 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-500">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-700" />
              {hero.badge}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] text-ink-900 sm:text-5xl lg:text-6xl">
              {hero.title}
              <br />
              <span className="relative inline-block">
                {hero.highlightWord}
                <span className="absolute bottom-1 left-0 -z-10 h-3 w-full bg-lime-400/60" />
              </span>{' '}
              {hero.subtitle.replace('\n', ' ').split(' ').slice(0, 1).join(' ')}
              <br />
              {hero.subtitle.replace('\n', ' ').split(' ').slice(1).join(' ')}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-600">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={hero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
              >
                {hero.primaryCta.label} <ArrowRight size={14} />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-brand-700 px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-700 hover:text-white"
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="relative hidden h-[480px] lg:block">
            <div className="absolute bottom-[10%] left-[8%] h-[70px] w-[70px] rounded-[18px] bg-gold-500 opacity-15 -rotate-12" />
            <div className="absolute right-[10%] top-0 h-[220px] w-[220px] rounded-[40px] bg-brand-700 rotate-[10deg]" />
            <div className="absolute right-[28%] top-[15%] h-[100px] w-[100px] rounded-[24px] bg-brand-100 rotate-[18deg]" />
            <div className="absolute bottom-[10%] right-[5%] h-[150px] w-[150px] rounded-[32px] bg-lime-400 -rotate-[6deg]" />
            <div className="absolute left-1/2 top-1/2 z-10 h-[400px] w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px]">
              <Image
                src={hero.image}
                alt="School of Sciences"
                fill
                className="object-cover scale-110"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-brand-700">
        <div className="container-page grid grid-cols-2 lg:grid-cols-4">
          <div className="border-r border-white/10 px-8 py-10 text-white lg:py-12">
            <p className="text-4xl font-extrabold">{degreeCount}+</p>
            <p className="mt-1.5 text-xs text-white/60">Degree Programmes</p>
          </div>
          {hero.stats.map((stat, i) => (
            <div
              key={i}
              className={`border-r border-white/10 px-8 py-10 text-white lg:py-12 ${
                i === hero.stats.length - 1 ? 'border-r-0 max-lg:border-r-0' : ''
              } ${i === 2 ? 'max-lg:border-r-0' : ''}`}
            >
              <p className="text-4xl font-extrabold">{stat.value}</p>
              <p className="mt-1.5 text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About preview */}
      <section className="py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              {home.aboutEyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {home.aboutHeading}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-700">
              {home.aboutBody}
            </p>
            <Link
              href={home.aboutLink}
              className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
            >
              Read our story <ArrowRight size={16} />
            </Link>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-brand-700 p-10 text-center">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-500 opacity-30" />
              <div className="absolute -bottom-4 left-5 h-16 w-16 rounded-full bg-brand-400 opacity-20" />
              <p className="relative text-6xl font-extrabold text-white">
                {home.aboutYear}
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-white/70">
                {home.aboutYearText}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-ink-900">{home.aboutStat1Value}</p>
                  <p className="text-xs text-ink-600">{home.aboutStat1Label}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Buildings size={22} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-ink-900">{home.aboutStat2Value}</p>
                  <p className="text-xs text-ink-600">{home.aboutStat2Label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-ink-50 py-20">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                {home.deptEyebrow}
              </span>
              <h2 className="mt-3 text-3xl font-bold">{home.deptHeading}</h2>
            </div>
            <Link
              href={home.deptLink}
              className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
            >
              All departments <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.slice(0, 6).map((dept) => {
              const DeptIcon = getDepartmentIcon(dept.slug)
              return (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.slug}`}
                  className="group rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <DeptIcon size={24} weight="duotone" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-brand-700">
                    {dept.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink-700">
                    {truncate(dept.summary, 120)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    {dept._count.programmes} programmes <ArrowRight size={14} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Programmes preview */}
      <section className="py-20">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                {home.progEyebrow}
              </span>
              <h2 className="mt-3 text-3xl font-bold">{home.progHeading}</h2>
            </div>
            <Link
              href={home.progLink}
              className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
            >
              View all programmes <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.slice(0, 6).map((p) => (
              <Link
                key={p.id}
                href={`/programmes/${p.slug}`}
                className="group flex items-start justify-between rounded-xl border border-ink-100 p-5 transition hover:border-brand-300 hover:bg-brand-50/40"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                    {p.level.toLowerCase()}
                  </p>
                  <h3 className="mt-1 font-semibold group-hover:text-brand-700">
                    {p.name}
                  </h3>
                  {p.department && (
                    <p className="mt-1 text-xs text-ink-700">{p.department.name}</p>
                  )}
                </div>
                <GraduationCap size={20} className="mt-1 shrink-0 text-ink-200" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured news */}
      <section className="bg-ink-50 py-20">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                {home.newsEyebrow}
              </span>
              <h2 className="mt-3 text-3xl font-bold">{home.newsHeading}</h2>
            </div>
            <Link
              href={home.newsLink}
              className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
            >
              All news <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredPosts.length === 0 && (
              <p className="text-ink-700">{home.newsEmpty}</p>
            )}
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-1"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-100 to-brand-300">
                  <Newspaper size={40} className="text-brand-700" weight="duotone" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                    {post.category.toLowerCase().replace('_', ' ')} ·{' '}
                    {formatDate(post.publishedAt)}
                  </p>
                  <h3 className="mt-2 font-semibold group-hover:text-brand-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-700">
                    {truncate(post.excerpt, 120)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl bg-brand-700 px-8 py-20 text-center sm:px-16">
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-brand-500 opacity-15" />
            <div className="absolute -bottom-15 -left-10 h-[200px] w-[200px] rounded-full bg-lime-400 opacity-10" />
            <h2 className="relative z-10 text-3xl font-extrabold text-white sm:text-4xl">
              {home.ctaHeading}
            </h2>
            <p className="relative z-10 mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
              {home.ctaBody}
            </p>
            <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={home.ctaPrimary.href}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                {home.ctaPrimary.label}
              </Link>
              <Link
                href={home.ctaSecondary.href}
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {home.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
