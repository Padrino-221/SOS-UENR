import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { getSpmsSession } from '@/lib/spms-auth'
import { SetPasswordForm } from '@/components/spms/set-password-form'

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  // If logged in and already set password, go to dashboard
  const session = await getSpmsSession()
  if (session) {
    const staff = await prisma.staff.findUnique({
      where: { id: session.staffId },
      select: { spmsPasswordChanged: true },
    })
    if (staff?.spmsPasswordChanged) redirect('/spms/dashboard')
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-ink-200 bg-white p-8 text-center">
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
          <h1 className="text-xl font-extrabold text-ink-900">Invalid Link</h1>
          <p className="mt-2 text-sm text-ink-500">
            This password reset link is invalid or missing a token.
          </p>
          <Link
            href="/spms/login"
            className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    )
  }

  // Validate token
  const staff = await prisma.staff.findFirst({
    where: {
      spmsResetToken: token,
      spmsAccess: true,
    },
    select: { id: true, name: true, email: true, spmsResetExpiry: true, spmsPasswordChanged: true },
  })

  if (!staff || !staff.spmsResetExpiry || staff.spmsResetExpiry < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-ink-200 bg-white p-8 text-center">
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
          <h1 className="text-xl font-extrabold text-ink-900">Link Expired</h1>
          <p className="mt-2 text-sm text-ink-500">
            This password reset link has expired. Please contact your administrator for a new one.
          </p>
          <Link
            href="/spms/login"
            className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    )
  }

  // Already set password — go to login
  if (staff.spmsPasswordChanged) {
    redirect('/spms/login')
  }

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
        <SetPasswordForm token={token} staffName={staff.name} />
      </div>
    </div>
  )
}
