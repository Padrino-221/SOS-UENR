'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { List, X, CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { SiteNavigation } from '@/data/siteDefaults'

export function SiteHeader({
  navigation,
  logo,
}: {
  navigation: SiteNavigation
  logo: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled
          ? 'border-b border-[#e5e5e0] bg-[rgba(247,247,245,.88)] backdrop-blur-[14px] saturate-[1.4]'
          : 'border-b border-transparent bg-[#f7f7f5]',
      )}
    >
      <div className="container-page flex items-center justify-between h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src={logo}
            alt="School of Sciences logo"
            width={36}
            height={36}
            className="h-9 w-9 object-cover"
            style={{ borderRadius: '50% 50% 50% 12px' }}
          />
          <span className="leading-tight">
            <span className="block text-[0.92rem] font-extrabold text-ink-900 tracking-[-.01em] whitespace-nowrap">
              School of Sciences
            </span>
            <span className="hidden sm:block text-[0.68rem] text-ink-500 font-medium">
              University of Energy and Natural Resources
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex ml-8">
          {navigation.items.map((item) => (
            <div key={item.href} className="relative">
              {item.children && item.children.length > 0 ? (
                <button
                  type="button"
                  onMouseEnter={() => setOpenMenu(item.href)}
                  onMouseLeave={() => setOpenMenu(null)}
                  className="flex items-center gap-1 px-3.5 py-2 text-[0.82rem] font-bold text-ink-600 transition-colors duration-150 hover:text-ink-900 hover:bg-ink-900/5"
                >
                  {item.label}
                  <CaretDown size={13} className="opacity-50" />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'block px-3.5 py-2 text-[0.82rem] font-bold transition-colors duration-150',
                    pathname === item.href
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-ink-900/5',
                  )}
                >
                  {item.label}
                </Link>
              )}

              {item.children && item.children.length > 0 && (
                <div
                  onMouseEnter={() => setOpenMenu(item.href)}
                  onMouseLeave={() => setOpenMenu(null)}
                  className={cn(
                    'absolute left-0 top-full z-40 w-56 border border-[#e5e5e0] bg-[#f7f7f5] p-1.5',
                    openMenu === item.href ? 'block' : 'hidden',
                  )}
                  style={{ borderRadius: 0 }}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-3 py-2 text-[0.82rem] font-medium text-ink-600 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href={navigation.ctaHref}
            className="hidden lg:inline-flex items-center bg-brand-700 px-5 py-2 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-white transition-colors duration-150 hover:bg-brand-800"
          >
            {navigation.ctaLabel}
          </Link>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center text-ink-700 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#e5e5e0] bg-[#f7f7f5] lg:hidden">
          <nav className="container-page flex flex-col gap-0.5 py-3">
            {navigation.items.flatMap((item) => [
              <Link
                key={`nav-${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-3 py-2.5 text-[0.85rem] font-bold transition-colors',
                  pathname === item.href
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-ink-700 hover:bg-ink-900/5',
                )}
              >
                {item.label}
              </Link>,
              ...(item.children ?? []).map((child) => (
                <Link
                  key={`nav-child-${item.href}-${child.href}-${child.label}`}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 text-[0.82rem] text-ink-500 hover:bg-ink-900/5"
                >
                  {child.label}
                </Link>
              )),
            ])}
            <Link
              href={navigation.ctaHref}
              onClick={() => setOpen(false)}
              className="mt-2 bg-brand-700 px-4 py-2.5 text-center text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-white"
            >
              {navigation.ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
