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
      <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(rgba(200,176,90,1) 1.4px, transparent 1.4px)', backgroundSize: '22px 22px' }} />
        <div className="relative w-full max-w-md rounded-xl border border-ink-100 bg-white p-8 text-center">
          <Link href="/" className="mb-6 flex items-center justify-center gap-2">
            <Image src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg" alt="Logo" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-sm font-bold text-ink-900">School of Sciences</span>
          </Link>
          <h1 className="text-xl font-bold text-ink-900">Invalid Link</h1>
          <p className="mt-2 text-sm text-ink-500">This password reset link is invalid or missing a token.</p>
          <Link href="/spms/login" className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800">← Back to login</Link>
        </div>
      </div>
    )
  }

  const staff = await prisma.staff.findFirst({
    where: { spmsResetToken: token, spmsAccess: true },
    select: { id: true, name: true, email: true, spmsResetExpiry: true, spmsPasswordChanged: true },
  })

  if (!staff || !staff.spmsResetExpiry || staff.spmsResetExpiry < new Date()) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(rgba(200,176,90,1) 1.4px, transparent 1.4px)', backgroundSize: '22px 22px' }} />
        <div className="relative w-full max-w-md rounded-xl border border-ink-100 bg-white p-8 text-center">
          <Link href="/" className="mb-6 flex items-center justify-center gap-2">
            <Image src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg" alt="Logo" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-sm font-bold text-ink-900">School of Sciences</span>
          </Link>
          <h1 className="text-xl font-bold text-ink-900">Link Expired</h1>
          <p className="mt-2 text-sm text-ink-500">This password reset link has expired. Please contact your administrator for a new one.</p>
          <Link href="/spms/login" className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800">← Back to login</Link>
        </div>
      </div>
    )
  }

  if (staff.spmsPasswordChanged) {
    redirect('/spms/login')
  }

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(rgba(200,176,90,1) 1.4px, transparent 1.4px)', backgroundSize: '22px 22px' }} />
      <div className="relative w-full max-w-md rounded-xl border border-ink-100 bg-white p-8">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Image src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg" alt="Logo" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />
          <span className="text-sm font-bold text-ink-900">School of Sciences</span>
        </Link>
        <SetPasswordForm token={token} staffName={staff.name} />
      </div>
    </div>
  )
}
