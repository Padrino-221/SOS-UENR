import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Envelope } from '@phosphor-icons/react/dist/ssr'
import type { SiteFooter as SiteFooterType } from '@/data/siteDefaults'

export function SiteFooter({ footer, logo }: { footer: SiteFooterType; logo: string }) {
  return (
    <footer className="bg-brand-700 text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src={logo}
              alt="School of Sciences logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="leading-tight">
              <span className="block font-bold text-white">{footer.brandName}</span>
              <span className="block text-xs">{footer.brandSubtitle}</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            {footer.tagline}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            {footer.quickLinksHeading}
          </h3>
          <ul className="space-y-2 text-sm">
            {footer.quickLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            {footer.programmesHeading}
          </h3>
          <ul className="space-y-2 text-sm">
            {footer.programmesLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            {footer.contactHeading}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-white/50" />
              <span>{footer.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-white/50" />
              <span>{footer.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Envelope size={16} className="shrink-0 text-white/50" />
              <a href={`mailto:${footer.email}`} className="hover:text-white">
                {footer.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          <p>{footer.bottomTagline}</p>
        </div>
      </div>
    </footer>
  )
}
