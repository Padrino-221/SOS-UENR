import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSession } from '@/lib/auth'
import { LoginForm } from '@/components/admin/login-form'

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session) {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
      <div className="flex w-full max-w-3xl overflow-hidden rounded-3xl border border-ink-200 bg-white">
        {/* Left - Form */}
        <div className="flex w-full flex-col justify-between p-8 lg:w-[45%] lg:p-10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-sm font-bold text-ink-900">School of Sciences</span>
          </Link>

          <div className="my-auto py-10">
            <LoginForm />
          </div>
        </div>

        {/* Right - Branding */}
        <div className="hidden w-[55%] bg-brand-700 p-10 lg:flex lg:flex-col lg:justify-between relative overflow-hidden">
          {/* Decorative curves */}
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-600/40" />
            <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-brand-800/50" />
            <div className="absolute bottom-1/3 left-10 h-64 w-64 rounded-full bg-brand-500/20" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold leading-tight text-white">
              Manage Your<br />Website Content
            </h1>
            <p className="mt-2 text-lg font-medium text-white/70">
              All in one place
            </p>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">What you can manage</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                Programmes
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                Departments
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                News & Events
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                Staff Directory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
