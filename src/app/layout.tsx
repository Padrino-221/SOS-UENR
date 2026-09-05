import type { Metadata } from 'next'
import { Space_Grotesk, Sora } from 'next/font/google'
import './globals.css'

const space = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
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
    <html lang="en" className={`${space.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
