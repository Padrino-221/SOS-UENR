'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  SquaresFour,
  FolderOpen,
  Notebook,
  Gear,
  User,
  SignOut,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { spmsLogout } from '@/app/spms/(protected)/actions'
import type { SpmsSession } from '@/lib/spms-auth'

const nav = [
  { href: '/spms/dashboard', label: 'Dashboard', icon: SquaresFour },
  { href: '/spms/projects', label: 'Projects', icon: FolderOpen },
  { href: '/spms/records', label: 'Records', icon: Notebook },
]

const accountNav = [
  { href: '/spms/profile', label: 'Profile', icon: User },
]

const adminNav = [
  { href: '/spms/settings', label: 'Settings', icon: Gear },
]

export function SpmsSidebar({ session }: { session: SpmsSession }) {
  const pathname = usePathname()
  const isAdmin = session.role === 'ADMIN'

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-brand-700 lg:flex">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/spms/dashboard" className="flex items-center gap-3">
          <Image
            src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg"
            alt="Logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="leading-tight">
            <span className="block text-sm font-bold text-white">SPMS</span>
            <span className="block text-xs text-white/60">Project Management</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <item.icon size={18} weight={isActive ? 'fill' : 'bold'} />
              {item.label}
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-white/10" />
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Admin
            </p>
            {adminNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <item.icon size={18} weight={isActive ? 'fill' : 'bold'} />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}

        <div className="my-3 border-t border-white/10" />
        <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
          Account
        </p>
        {accountNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <item.icon size={18} weight={isActive ? 'fill' : 'bold'} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 text-sm">
          <p className="font-semibold text-white">{session.name}</p>
          <p className="text-xs text-white/50">{session.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/15 hover:text-white"
            target="_blank"
          >
            View site
          </Link>
          <form action={spmsLogout} className="flex-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
            >
              <SignOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
