'use client'

import { useState, useEffect } from 'react'
import { CaretUp } from '@phosphor-icons/react'

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-800"
      aria-label="Scroll to top"
    >
      <CaretUp size={20} weight="bold" />
    </button>
  )
}
