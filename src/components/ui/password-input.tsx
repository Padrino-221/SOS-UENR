'use client'

import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  error?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="mb-1 block text-xs font-semibold text-ink-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={cn(
              'w-full rounded-xl border border-ink-200 bg-white px-3 py-2 pr-10 text-sm text-ink-900 placeholder:text-ink-400',
              'focus:border-system-400 focus:ring-1 focus:ring-system-400 focus:outline-none',
              'disabled:bg-ink-50 disabled:text-ink-500',
              error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
            tabIndex={-1}
          >
            {visible ? <EyeSlash size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="mt-0.5 text-[11px] text-red-600">{error}</p>}
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'
