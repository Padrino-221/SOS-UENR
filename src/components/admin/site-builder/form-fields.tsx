'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  type?: string
}) {
  return (
    <Input
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      hint={hint}
      type={type}
    />
  )
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  rows?: number
}) {
  return (
    <Textarea
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      hint={hint}
      rows={rows}
    />
  )
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        onChange(data.url)
      }
    } catch {
      console.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
 <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>
      {value ? (
 <div className="relative inline-block">
 <div className="relative h-32 w-32 overflow-hidden border border-ink-200">
            <Image
              src={value}
              alt={label}
              fill
              sizes="128px"
 className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
 className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center bg-red-500 text-white hover:bg-red-600"
          >
            <X size={12} weight="duotone" />
          </button>
        </div>
      ) : (
        <label
 className={cn(
            'flex cursor-pointer flex-col items-center gap-2 border-2 border-dashed border-ink-200 bg-ink-50 p-6 transition hover:border-brand-400 hover:bg-brand-50',
            uploading && 'pointer-events-none opacity-60',
          )}
        >
 <Upload size={24} className="text-ink-400" weight="duotone" />
 <span className="text-xs font-medium text-ink-600">
            {uploading ? 'Uploading…' : 'Click to upload'}
          </span>
          <input
            type="file"
            accept="image/*"
 className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
 {hint && <p className="mt-0.5 text-[11px] text-ink-400">{hint}</p>}
    </div>
  )
}

export function MultiImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  hint?: string
}) {
  const [uploading, setUploading] = useState(false)
  const safeValue = Array.isArray(value) ? value.filter(Boolean) : []

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.url) uploaded.push(data.url)
      }
      if (uploaded.length > 0) onChange([...safeValue, ...uploaded])
    } catch {
      console.error('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
 <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>
      {safeValue.length > 0 && (
 <div className="mb-3 flex flex-wrap gap-3">
          {safeValue.map((src, idx) => (
 <div key={`${src}-${idx}`} className="relative h-24 w-24 overflow-hidden border border-ink-200">
 <Image src={src} alt={`${label} ${idx + 1}`} fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => onChange(safeValue.filter((_, i) => i !== idx))}
 className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-red-500 text-white hover:bg-red-600"
              >
                <X size={12} weight="duotone" />
              </button>
 <span className="absolute bottom-1 left-1 bg-black/60 px-1 py-0.5 text-[10px] font-bold text-white">{idx + 1}</span>
            </div>
          ))}
        </div>
      )}
      <label
 className={cn(
          'flex cursor-pointer flex-col items-center gap-2 border-2 border-dashed border-ink-200 bg-ink-50 p-4 transition hover:border-brand-400 hover:bg-brand-50',
          uploading && 'pointer-events-none opacity-60',
        )}
      >
 <Upload size={20} className="text-ink-400" weight="duotone" />
 <span className="text-xs font-medium text-ink-600">
          {uploading ? 'Uploading…' : safeValue.length === 0 ? 'Click to upload images' : 'Add more images'}
        </span>
 <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
      </label>
 {hint && <p className="mt-1 text-[11px] text-ink-400">{hint}</p>}
    </div>
  )
}

export function FieldGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
 <div className="border border-ink-200 bg-white p-5">
 <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink-400">
        {title}
      </h4>
 <div className="space-y-4">{children}</div>
    </div>
  )
}
