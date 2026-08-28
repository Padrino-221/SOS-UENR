import { redirect } from 'next/navigation'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { prisma } from '@/lib/db'
import { SpmsSidebar } from '@/components/spms/sidebar'
import { ToastProvider } from '@/components/ui'
import { PasswordGuard } from '@/components/spms/password-guard'

export default async function SpmsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireSpmsAuth()

  // Fetch fresh staff data to check password status
  const staff = await prisma.staff.findUnique({
    where: { id: session.staffId },
    select: { spmsPasswordChanged: true },
  })

  const spmsPasswordChanged = staff?.spmsPasswordChanged ?? false

  return (
    <PasswordGuard spmsPasswordChanged={spmsPasswordChanged}>
      <ToastProvider>
        <div className="flex min-h-screen bg-ink-50">
          <SpmsSidebar session={session} />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </ToastProvider>
    </PasswordGuard>
  )
}
