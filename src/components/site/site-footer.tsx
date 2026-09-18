'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Envelope, ArrowUpRight, ArrowRight } from '@phosphor-icons/react'
import type { SiteFooter as SiteFooterType } from '@/data/siteDefaults'

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-5 flex items-center gap-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-white/40">
      <span aria-hidden className="h-[2px] w-4 bg-gold-300" />
      {children}
    </h4>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 py-1 text-[0.87rem] text-white/60 transition-colors duration-150 hover:text-white"
    >
      {label}
      <ArrowUpRight
        size={12}
        weight="bold"
        className="text-gold-300 opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      />
    </Link>
  )
}

export function SiteFooter({ footer, logo }: { footer: SiteFooterType; logo: string }) {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-brand-900 to-brand-950 text-white">
      {/* Gold hairline */}
      <div aria-hidden className="h-[3px] bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500" />

      {/* Dot grid decoration — echoes the checker header motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[4%] top-28 hidden h-28 w-64 opacity-40 lg:block"
        style={{
          backgroundImage: 'radial-gradient(rgba(216,201,144,.45) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          maskImage: 'linear-gradient(to left, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
        }}
      />

      {/* CTA band */}
      <div className="container-premium border-b border-white/10 py-12 sm:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-extrabold leading-tight text-white tracking-[-.01em] sm:text-2xl">
              Not sure which programme fits you?
            </h3>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/55">
              Check your WASSCE eligibility in minutes — then apply directly through UENR admissions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/programmes/eligibility-checker"
              className="inline-flex items-center gap-2 border border-white/25 px-6 py-3.5 text-[0.75rem] font-extrabold uppercase tracking-[0.08em] text-white/80 transition-colors hover:border-gold-300 hover:text-gold-200"
            >
              Eligibility Checker
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-premium relative grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.35fr_0.9fr_0.9fr_1.25fr] lg:gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3.5">
            <Image
              src={logo}
              alt="School of Sciences logo"
              width={44}
              height={54}
              className="h-12 w-auto object-contain"
            />
            <div>
              <span className="block text-lg font-extrabold tracking-[-.01em]">                {footer.brandName}
              </span>
              <span className="mt-1 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold-200">
                {footer.brandSubtitle}
              </span>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-[0.86rem] leading-[1.75] text-white/55">{footer.tagline}</p>
          <a
            href="https://uenr.edu.gh"
            target="_blank"
            rel="noreferrer"
            className="group mt-6 inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-gold-300 hover:text-gold-200"
          >
            UENR Main Site
            <ArrowUpRight
              size={12}
              weight="bold"
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <FooterHeading>{footer.quickLinksHeading}</FooterHeading>
          <ul className="flex flex-col gap-3">
            {footer.quickLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Programmes */}
        <nav aria-label="Programme links">
          <FooterHeading>{footer.programmesHeading}</FooterHeading>
          <ul className="flex flex-col gap-3">
            {footer.programmesLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <FooterHeading>{footer.contactHeading}</FooterHeading>
          <ul className="flex flex-col">
            <li className="flex items-start gap-3 py-5 first:pt-0">
              <span className="grid h-8 w-8 shrink-0 place-items-center border border-white/10 bg-white/5 text-gold-200">
                <MapPin size={15} weight="duotone" />
              </span>
              <span className="pt-1.5 text-[0.85rem] leading-relaxed text-white/60">{footer.address}</span>
            </li>
            <li className="flex items-center gap-3 border-t border-white/10 py-5">
              <span className="grid h-8 w-8 shrink-0 place-items-center border border-white/10 bg-white/5 text-gold-200">
                <Phone size={15} weight="duotone" />
              </span>
              <a
                href={`tel:${footer.phone}`}
                className="pt-0 text-[0.85rem] text-white/60 transition-colors hover:text-white"
              >
                {footer.phone}
              </a>
            </li>
            <li className="flex items-center gap-3 border-t border-white/10 py-5 last:pb-0">
              <span className="grid h-8 w-8 shrink-0 place-items-center border border-white/10 bg-white/5 text-gold-200">
                <Envelope size={15} weight="duotone" />
              </span>
              <a
                href={`mailto:${footer.email}`}
                className="break-all pt-0 text-[0.85rem] text-white/60 transition-colors hover:text-white"
              >
                {footer.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-premium flex flex-col items-center justify-between gap-3 py-7 text-[0.75rem] text-white/40 sm:flex-row">
          <p suppressHydrationWarning>© {new Date().getFullYear()} {footer.copyright}</p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="h-1 w-1 bg-gold-300" />
            {footer.bottomTagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
