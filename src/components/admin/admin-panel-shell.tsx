'use client'

import { useState } from 'react'
import { AdminSidebar, AdminMobileTopbar } from '@/components/admin/admin-sidebar'

export function AdminPanelShell({
  session,
  children,
}: {
  session: { name: string; email: string }
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-50">
      <AdminSidebar session={session} isOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main column — Yedent: lg:pl-64 + centered max-w-6xl, topbar inside */}
      <div className="lg:pl-64">
        <AdminMobileTopbar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />
        <main className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  )
}
