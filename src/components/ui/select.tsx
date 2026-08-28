'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  defaultValue?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  placeholder?: string
  label?: React.ReactNode
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export function Select({
  options,
  defaultValue,
  value: controlledValue,
  onChange,
  name,
  placeholder = 'Select…',
  label,
  hint,
  error,
  disabled,
  required,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const selected = options.find((o) => o.value === value)
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const handleSelect = useCallback((val: string) => {
    if (controlledValue === undefined) {
      setInternalValue(val)
    }
    if (onChange) {
      onChange({ target: { value: val } } as React.ChangeEvent<HTMLInputElement>)
    }
    setOpen(false)
    setQuery('')
  }, [controlledValue, onChange])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && options.length > 6) inputRef.current?.focus()
  }, [open, options.length])

  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-ink-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {name && <input type="hidden" name={name} value={value} readOnly />}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setOpen((o) => !o)
          }}
          className={cn(
            'flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-left text-sm transition',
            open
              ? 'border-system-400 ring-1 ring-system-400'
              : 'border-ink-200 hover:border-ink-300',
            disabled && 'cursor-not-allowed bg-ink-50 text-ink-500',
            error && 'border-red-400',
            className,
          )}
        >
          <span className={cn(!selected && 'text-ink-400')}>
            {selected?.label ?? placeholder}
          </span>
          <CaretDown
            size={14}
            className={cn(
              'shrink-0 text-ink-400 transition-transform',
              open && 'rotate-180',
            )}
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-ink-200 bg-white shadow-lg">
            {options.length > 6 && (
              <div className="border-b border-ink-100 p-2">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-system-400 focus:outline-none"
                />
              </div>
            )}
            <ul className="max-h-60 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-xs text-ink-400">No options found</li>
              ) : (
                filtered.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                        option.value === value
                          ? 'bg-system-50 text-system-700 font-medium'
                          : 'text-ink-700 hover:bg-ink-50',
                      )}
                    >
                      <span>{option.label}</span>
                      {option.value === value && (
                        <Check size={14} className="shrink-0 text-system-600" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {hint && !error && <p className="mt-0.5 text-[11px] text-ink-400">{hint}</p>}
      {error && <p className="mt-0.5 text-[11px] text-red-600">{error}</p>}
    </div>
  )
}
