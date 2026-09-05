'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  SquaresFour,
  GraduationCap,
  Newspaper,
  Buildings,
  Users,
  Student,
  Envelope,
  Gear,
  SignOut,
  ArrowSquareOut,
  CaretDown,
  User,
  List,
  X,
} from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/actions/auth'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: SquaresFour },
  { href: '/admin/programmes', label: 'Programmes', icon: GraduationCap },
  { href: '/admin/departments', label: 'Departments', icon: Buildings },
  { href: '/admin/posts', label: 'News & Events', icon: Newspaper },
  { href: '/admin/staff', label: 'Staff', icon: Users },
  { href: '/admin/student-leadership', label: 'Student Leadership', icon: Student },
  { href: '/admin/messages', label: 'Messages', icon: Envelope },
  { href: '/admin/site-builder', label: 'Site Builder', icon: Gear },
]

export function AdminSidebar({
  session,
  onToggle,
  isOpen,
}: {
  session: { name: string; email: string }
  onToggle?: (open: boolean) => void
  isOpen?: boolean
}) {
  const pathname = usePathname()
  const [internalOpen, setInternalOpen] = useState(false)
  const sidebarOpen = isOpen ?? internalOpen
  const setSidebarOpen = (v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === 'function' ? (v as (p: boolean) => boolean)(sidebarOpen) : v
    if (onToggle) onToggle(next)
    else setInternalOpen(next)
  }
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const initials = session.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setUserMenuOpen(false)
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
            <Image
              src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg"
              alt="School of Sciences Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold leading-none tracking-wide text-white uppercase">School CMS</p>
            <p className="mt-1 text-[11px] text-white/50">Content Management</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-gold-500 text-brand-950 font-semibold'
                  : 'text-white/75 hover:bg-white/10 hover:text-white',
              )}
            >
              <item.icon size={20} weight="duotone" className="shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4" ref={userMenuRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            className="flex w-full items-center gap-3 rounded px-1.5 py-2 hover:bg-white/10 transition"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-brand-950">
              {initials}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-semibold text-white">{session.name}</span>
              <span className="block truncate text-xs capitalize text-white/50">{session.email}</span>
            </span>
            <CaretDown size={14} weight="duotone" className={cn('shrink-0 text-white/40 transition', userMenuOpen && 'rotate-180')} />
          </button>

          {userMenuOpen && (
            <div
              role="menu"
              className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-ink-100 bg-white py-1.5"
            >
              <Link
                href="/admin/profile"
                role="menuitem"
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                onClick={() => setUserMenuOpen(false)}
              >
                <User size={16} weight="duotone" /> Profile
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                onClick={() => setUserMenuOpen(false)}
              >
                <ArrowSquareOut size={16} weight="duotone" /> View live site
              </a>
              <div className="my-1.5 border-t border-ink-100" />
              <form action={logoutAction}>
                <button
                  type="submit"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <SignOut size={16} weight="duotone" /> Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — fixed, hidden on mobile — Yedent pattern */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-brand-900 to-brand-950 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-72 bg-gradient-to-b from-brand-900 to-brand-950">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

// Mobile topbar — rendered inside the main column (Yedent pattern)
export function AdminMobileTopbar({ onToggle, isOpen }: { onToggle: () => void; isOpen: boolean }) {
  return (
    <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-brand-950 px-4 py-3 text-white">
      <Link href="/admin" className="text-sm font-bold uppercase tracking-wide">
        School CMS
      </Link>
      <button onClick={onToggle} className="p-1.5" aria-label="Toggle menu">
        {isOpen ? <X size={20} weight="duotone" /> : <List size={20} weight="duotone" />}
      </button>
    </div>
  )
}
