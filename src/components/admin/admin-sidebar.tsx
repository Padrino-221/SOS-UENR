'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  SquaresFour,
  GraduationCap,
  Newspaper,
  Buildings,
  Users,
  Envelope,
  Gear,
  SignOut,
  ArrowSquareLeft,
} from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/actions/auth'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: SquaresFour },
  { href: '/admin/programmes', label: 'Programmes', icon: GraduationCap },
  { href: '/admin/departments', label: 'Departments', icon: Buildings },
  { href: '/admin/posts', label: 'News & Events', icon: Newspaper },
  { href: '/admin/staff', label: 'Staff', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: Envelope },
  { href: '/admin/site-builder', label: 'Site Builder', icon: Gear },
]

export function AdminSidebar({
  session,
}: {
  session: { name: string; email: string }
}) {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-brand-700 lg:flex">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg"
            alt="Logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="leading-tight">
            <span className="block text-sm font-bold text-white">
              School of Sciences
            </span>
            <span className="block text-xs text-white/60">CMS</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
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
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/15 hover:text-white"
            target="_blank"
          >
            <ArrowSquareLeft size={14} /> View site
          </Link>
          <form action={logoutAction} className="flex-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2.5 text-xs font-medium text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
            >
              <SignOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
