'use client'

import { Trash } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface DeleteButtonProps {
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function DeleteButton({ className, onClick, disabled }: DeleteButtonProps) {
  const handleClick = () => {
    if (!confirm('Are you sure you want to delete this?')) return
    onClick?.()
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2 py-1.5 text-xs font-semibold text-ink-500 transition',
        'hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50',
        className,
      )}
    >
      <Trash size={14} weight="duotone" />
      Delete
    </button>
  )
}
