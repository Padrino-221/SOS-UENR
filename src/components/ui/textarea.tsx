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
          <label htmlFor={textareaId} className="mb-1.5 block text-sm font-semibold text-ink-900">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-[5px] border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 resize-y',
            'focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/10',
            'disabled:bg-ink-50 disabled:text-ink-500',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/10',
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
