'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  name: string
  label: string
  defaultValue?: string | null
  hint?: string
  className?: string
}

export function ImageUpload({ name, label, defaultValue = '', hint, className }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultValue || '')
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
        setPreview(data.url)
        if (inputRef.current) {
          inputRef.current.value = data.url
        }
      }
    } catch {
      console.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleClear() {
    setPreview('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>
      <input type="hidden" name={name} ref={inputRef} defaultValue={preview} />

      {preview ? (
        <div className="relative inline-block">
          <div className="relative h-32 w-32 overflow-xl rounded-xl border border-ink-200">
            <Image
              src={preview}
              alt={label}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <X size={12} weight="duotone" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 p-6 transition hover:border-brand-400 hover:bg-brand-50',
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
