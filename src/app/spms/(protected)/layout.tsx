import { redirect } from 'next/navigation'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { prisma } from '@/lib/db'
import { ToastProvider } from '@/components/ui'
import { PasswordGuard } from '@/components/spms/password-guard'
import { SpmsPanelShell } from '@/components/spms/spms-panel-shell'

export default async function SpmsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireSpmsAuth()

  const staff = await prisma.staff.findUnique({
    where: { id: session.staffId },
    select: { spmsPasswordChanged: true },
  })

  const spmsPasswordChanged = staff?.spmsPasswordChanged ?? false

  return (
    <PasswordGuard spmsPasswordChanged={spmsPasswordChanged}>
      <ToastProvider>
        <SpmsPanelShell session={session}>{children}</SpmsPanelShell>
      </ToastProvider>
    </PasswordGuard>
  )
}
