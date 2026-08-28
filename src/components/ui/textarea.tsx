import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const textareaId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div>
        {label && (
          <label htmlFor={textareaId} className="mb-1 block text-xs font-semibold text-ink-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400',
            'focus:border-system-400 focus:ring-1 focus:ring-system-400 focus:outline-none',
            'disabled:bg-ink-50 disabled:text-ink-500',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="mt-0.5 text-[11px] text-ink-400">{hint}</p>}
        {error && <p className="mt-0.5 text-[11px] text-red-600">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
