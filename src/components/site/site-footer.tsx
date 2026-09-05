'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Envelope } from '@phosphor-icons/react'
import type { SiteFooter as SiteFooterType } from '@/data/siteDefaults'

export function SiteFooter({ footer, logo }: { footer: SiteFooterType; logo: string }) {
  return (
    <footer className="bg-brand-950 text-white">
      <div className="container-premium py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image src={logo} alt="School of Sciences logo" width={40} height={40} className="h-10 w-10 rounded-lg object-cover border border-white/10" />
              <div>
                <p className="font-serif font-bold leading-tight">{footer.brandName}</p>
                <p className="text-xs uppercase tracking-widest text-gold-300">{footer.brandSubtitle}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs">{footer.tagline}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">{footer.quickLinksHeading}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footer.quickLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-white/60 hover:text-white transition">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">{footer.programmesHeading}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footer.programmesLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-white/60 hover:text-white transition">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">{footer.contactHeading}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3 text-white/60">
                <MapPin size={16} weight="duotone" className="shrink-0 text-gold-300 mt-0.5" />
                <span className="leading-relaxed">{footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} weight="duotone" className="shrink-0 text-gold-300" />
                <a href={`tel:${footer.phone}`} className="text-white/60 hover:text-white">{footer.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Envelope size={16} weight="duotone" className="shrink-0 text-gold-300" />
                <a href={`mailto:${footer.email}`} className="text-white/60 hover:text-white break-all">{footer.email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-premium py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p suppressHydrationWarning>© {new Date().getFullYear()} {footer.copyright}</p>
          <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold-400" /> {footer.bottomTagline}</p>
        </div>
      </div>
    </footer>
  )
}
