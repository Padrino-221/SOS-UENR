'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, House } from '@phosphor-icons/react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Image
          src="/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg"
          alt="Logo"
          width={56}
          height={56}
          className="mb-8 h-14 w-14 rounded-[5px] object-cover"
        />
        <p className="font-serif text-7xl font-bold text-brand-700">404</p>
        <h1 className="mt-4 text-3xl font-serif text-ink-900">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link href="/" className="btn-primary">
            <House size={16} weight="duotone" /> Go home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            <ArrowLeft size={16} weight="duotone" /> Go back
          </button>
        </div>
      </div>
    </div>
  )
}