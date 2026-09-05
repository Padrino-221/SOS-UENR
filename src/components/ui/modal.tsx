'use client'

import { useEffect, useCallback } from 'react'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function Modal({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({
  title,
  description,
  onClose,
}: {
  title: string
  description?: string
  onClose: () => void
}) {
  return (
    <div className="sticky top-0 z-10 flex items-start justify-between border-b border-ink-100 bg-white px-6 py-5 rounded-t-2xl">
      <div>
        <h2 className="text-lg font-bold text-ink-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-ink-500">{description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
      >
        <X size={18} weight="duotone" />
      </button>
    </div>
  )
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-5 rounded-b-2xl">{children}</div>
}
