'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react'
import type { SiteHero } from '@/data/siteDefaults'

export function HeroCarousel({ hero }: { hero: SiteHero }) {
  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-end overflow-hidden bg-brand-950">
      <Image
        src={hero.image}
        alt="School of Sciences hero"
        fill
        priority
        className="object-cover"
        style={{ objectPosition: 'center 22%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent h-[220px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/40 via-transparent to-transparent" />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-10 sm:pb-14 lg:pb-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[4rem] font-bold text-white leading-[0.95] tracking-tight mb-4" style={{ fontFamily: 'var(--font-space)', letterSpacing: '-0.03em' }}>
                {hero.title} <span className="text-gold-300">{hero.highlightWord}</span>
                <br />
                <span className="font-normal text-white/90">{hero.subtitle.replace('\n', ' ')}</span>
              </h1>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">{hero.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href={hero.primaryCta.href}
                className="bg-gold-400 hover:bg-gold-300 text-brand-900 font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{ borderRadius: 5, fontFamily: 'var(--font-sora)' }}
              >
                {hero.primaryCta.label} <ArrowRight size={14} weight="bold" />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="border border-white/90 bg-black/20 hover:bg-white hover:text-brand-900 text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 transition-colors backdrop-blur-sm inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{ borderRadius: 5, fontFamily: 'var(--font-sora)' }}
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-3 border-t border-white/15 gap-0">
            {hero.stats.map((stat, i) => (
              <div key={i} className={`px-3 sm:px-6 py-5 sm:py-6 lg:py-7 border-white/15 ${i % 2 === 0 ? 'border-r' : ''} lg:border-r ${i === 2 ? 'lg:border-r-0 border-r-0 sm:border-r' : ''} ${i >= 2 ? 'border-t lg:border-t-0' : ''}`}>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-space)' }}>{stat.value}</p>
                <p className="mt-1 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/60 leading-tight" style={{ fontFamily: 'var(--font-sora)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
