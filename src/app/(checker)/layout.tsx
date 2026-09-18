import { Archivo } from 'next/font/google'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default function CheckerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${archivo.variable} ck-scope min-h-screen bg-ink-50`}>
      {children}
    </div>
  )
}
