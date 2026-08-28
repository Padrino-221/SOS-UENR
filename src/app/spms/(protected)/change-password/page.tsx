import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { prisma } from '@/lib/db'
import { ChangePasswordForm } from '@/components/spms/change-password-form'

export const dynamic = 'force-dynamic'

export default async function ChangePasswordPage() {
  const session = await requireSpmsAuth()

  const staff = await prisma.staff.findUnique({
    where: { id: session.staffId },
    select: { spmsPasswordChanged: true, name: true },
  })

  // Already set password — go to dashboard
  if (staff?.spmsPasswordChanged) redirect('/spms/dashboard')

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-ink-200 bg-white p-8">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Image
            src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="text-sm font-bold text-ink-900">School of Sciences</span>
        </Link>
        <ChangePasswordForm staffName={staff?.name ?? 'User'} />
      </div>
    </div>
  )
}
