'use client'

import { forwardRef, type InputHTMLAttributes, useState, useId } from 'react'
import { cn } from '@/lib/utils'

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label?: string
  hint?: string
}

/**
 * Yedent Toggle — w-11 h-6 rounded-full, brand-700 when on, ink-200 when off, thumb 5w.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, hint, id, defaultChecked, onChange, ...props }, ref) => {
    const generatedId = useId()
    const toggleId = id || generatedId
    const [checked, setChecked] = useState(defaultChecked ?? false)

    return (
      <div>
        <label htmlFor={toggleId} className="flex cursor-pointer items-center gap-3 group">
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            defaultChecked={defaultChecked}
            onChange={(e) => {
              setChecked(e.target.checked)
              onChange?.(e)
            }}
            className="sr-only"
            {...props}
          />
          <span
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
              checked ? 'bg-brand-700' : 'bg-ink-200',
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 rounded-full bg-white transition-transform',
                checked ? 'translate-x-5' : 'translate-x-0.5',
              )}
            />
          </span>
          {label && (
            <span className="text-sm text-ink-700 group-hover:text-ink-900">{label}</span>
          )}
        </label>
        {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
      </div>
    )
  },
)
Toggle.displayName = 'Toggle'
