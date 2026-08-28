import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminToasts } from '@/components/admin/admin-toasts'
import { User, CaretRight } from '@phosphor-icons/react/dist/ssr'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AdminToasts>
      <div className="flex min-h-screen bg-ink-50">
        <AdminSidebar session={session} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/80 backdrop-blur-md px-6">
            <h1 className="text-lg font-bold text-ink-900">Admin Panel</h1>
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 rounded-xl border border-ink-100 px-3 py-1.5 transition hover:border-brand-200 hover:bg-brand-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                <User size={16} />
              </span>
              <span className="hidden text-sm font-medium text-ink-700 sm:block">
                {session.name}
              </span>
              <CaretRight size={12} className="hidden text-ink-400 sm:block" />
            </Link>
          </header>
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminToasts>
  )
}
