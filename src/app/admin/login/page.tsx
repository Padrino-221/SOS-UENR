import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSession } from '@/lib/auth'
import { LoginForm } from '@/components/admin/login-form'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr'

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Yedent dotted pattern — adapted to school gold on brand-950 */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(rgba(200,176,90,1) 1.4px, transparent 1.4px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-xl border border-ink-100 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-white border border-ink-100 overflow-hidden flex items-center justify-center mb-4">
              <Image
                src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg"
                alt="School of Sciences"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-ink-900">School CMS</h1>
            <p className="text-ink-500 text-sm mt-1">Sign in to manage your website content</p>
          </div>

          <LoginForm />
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition">
            <CaretLeft size={14} weight="duotone" /> Back to the website
          </Link>
        </div>
      </div>
    </div>
  )
}
