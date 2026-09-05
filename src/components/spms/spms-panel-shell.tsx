'use client'

import { useState } from 'react'
import { SpmsSidebar, SpmsMobileTopbar } from '@/components/spms/sidebar'
import type { SpmsSession } from '@/lib/spms-auth'

export function SpmsPanelShell({
  session,
  children,
}: {
  session: SpmsSession
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-50">
      <SpmsSidebar session={session} isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="lg:pl-64">
        <SpmsMobileTopbar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />
        <main className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  )
}
