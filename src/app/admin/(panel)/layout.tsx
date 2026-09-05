import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminToasts } from '@/components/admin/admin-toasts'
import { AdminPanelShell } from '@/components/admin/admin-panel-shell'

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
      <AdminPanelShell session={session}>{children}</AdminPanelShell>
    </AdminToasts>
  )
}
