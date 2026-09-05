'use client'

import { Field, SelectField as Select } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'
import { upsertResource } from '@/actions/content'
import type { Resource } from '@prisma/client'
import { useState } from 'react'
import { UploadSimple } from '@phosphor-icons/react'

type YearOption = { id: string; year: string }

export function ResourceForm({
  resource,
  academicYears,
}: {
  resource?: Resource | null
  academicYears: YearOption[]
}) {
  const [fileUrl, setFileUrl] = useState(resource?.fileUrl ?? '')
  const [fileName, setFileName] = useState(resource?.fileName ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setFileUrl(data.url)
        setFileName(data.name || file.name)
      } else {
        setUploadError(data.error || 'Upload failed')
      }
    } catch {
      setUploadError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={upsertResource} className="grid max-w-3xl gap-6 rounded-lg border border-ink-100 bg-white p-6">
      {resource && <input type="hidden" name="id" value={resource.id} />}
      <input type="hidden" name="fileUrl" value={fileUrl} />
      <input type="hidden" name="fileName" value={fileName} />

      <Field label="Title" name="title" defaultValue={resource?.title} required placeholder="e.g. Student Handbook 2024/2025" />
      <Field label="Description" name="description" defaultValue={resource?.description} textarea rows={3} placeholder="Short description" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Category"
          name="category"
          defaultValue={resource?.category ?? 'HANDBOOK'}
          required
          options={[
            { value: 'HANDBOOK', label: 'Handbook' },
            { value: 'STUDENT_LIST', label: 'Student List (Final Year)' },
            { value: 'OTHER', label: 'Other' },
          ]}
        />
        <Select
          label="Academic Year"
          name="academicYearId"
          defaultValue={resource?.academicYearId ?? ''}
          options={[
            { value: '', label: 'No year' },
            ...academicYears.map((y) => ({ value: y.id, label: y.year })),
          ]}
          hint="For filtering student lists by year"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-900">File (PDF) *</label>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-ink-200 bg-ink-50 p-6 text-center hover:border-brand-300 hover:bg-brand-50/50">
          <UploadSimple size={20} weight="duotone" className="text-brand-600" />
          <span className="text-sm font-semibold text-ink-700">{uploading ? 'Uploading…' : fileName || 'Click to upload PDF'}</span>
          <span className="text-xs text-ink-500">PDF, DOCX, etc. — uploaded to Cloudinary</span>
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {fileUrl && <p className="mt-2 truncate font-mono text-xs text-green-700">{fileName} — {fileUrl}</p>}
        {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
        {!fileUrl && <p className="mt-1 text-xs text-amber-600">File is required — upload a document</p>}
      </div>

      <div>
        <SubmitButton label={resource ? 'Update resource' : 'Create resource'} />
      </div>
    </form>
  )
}
