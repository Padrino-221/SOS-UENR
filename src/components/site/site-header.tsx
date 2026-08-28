'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  GraduationCap,
  List,
  X,
  CaretDown,
} from '@phosphor-icons/react'
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="bg-brand-800 text-white">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p className="hidden sm:block">
            {navigation.topBarText}
          </p>
          <div className="ml-auto flex items-center gap-4">
            <Link href={navigation.topBarLink.href} className="hover:underline">
              {navigation.topBarLink.label}
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="School of Sciences logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-cover"
          />
          <span className="leading-tight">
            <span className="block text-lg font-bold text-ink-900">
              School of Sciences
            </span>
            <span className="block text-xs text-ink-700">
              University of Energy and Natural Resources
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.items.map((item) => (
            <div key={item.href} className="relative">
              {item.children && item.children.length > 0 ? (
                <button
                  type="button"
                  onMouseEnter={() => setOpenMenu(item.href)}
                  onMouseLeave={() => setOpenMenu(null)}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-800"
                >
                  {item.label}
                  <CaretDown size={14} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm font-medium transition hover:bg-brand-50 hover:text-brand-800',
                    pathname === item.href && 'bg-brand-50 text-brand-800',
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
                    'absolute left-0 top-full z-40 w-60 rounded-lg border border-ink-100 bg-white p-1.5',
                    openMenu === item.href ? 'block' : 'hidden',
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-800"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href={navigation.ctaHref}
            className="ml-3 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            {navigation.ctaLabel}
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md text-ink-800 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <List size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {navigation.items.flatMap((item) => [
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-800 hover:bg-brand-50"
              >
                {item.label}
              </Link>,
              ...(item.children ?? []).map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-6 py-2 text-sm text-ink-700 hover:bg-brand-50"
                >
                  {child.label}
                </Link>
              )),
            ])}
            <Link
              href={navigation.ctaHref}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-brand-700 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {navigation.ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
