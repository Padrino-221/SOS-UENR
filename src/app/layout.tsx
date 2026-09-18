import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'School of Sciences | UENR, Sunyani',
    template: '%s | School of Sciences, UENR',
  },
  description:
    'The School of Sciences at the University of Energy and Natural Resources, Sunyani — transformational education in physical and biological sciences, mathematics, computer science, and information technology.',
  keywords: [
    'School of Sciences',
    'UENR',
    'University of Energy and Natural Resources',
    'Sunyani',
    'Ghana',
    'Science',
  ],
  openGraph: {
    title: 'School of Sciences | UENR, Sunyani',
    description:
      'Transformational and value-based education in physical and biological sciences, mathematics, computer science, and information technology.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  )
}
