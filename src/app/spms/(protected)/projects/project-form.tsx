'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UploadSimple, FileText, CheckCircle, WarningCircle, Info, ClockCounterClockwise, Trash, DownloadSimple } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { createSpmsProject, updateSpmsProject } from '@/app/spms/(protected)/actions'
import { Input, Button, Select, Textarea } from '@/components/ui'

interface ProjectFormProps {
  project?: {
    id: string
    title: string
    abstract: string
    objective: string
    studentName: string | null
    groupMembers: string | null
    programme: string | null
    degreeLevel: string
    published: boolean
    documentUrl: string | null
    documentName: string | null
    githubLink: string | null
    academicYearId: string | null
    departmentId: string | null
    supervisorId: string | null
  }
  departments: { id: string; name: string }[]
  academicYears: { id: string; year: string }[]
  staff: { id: string; name: string; departmentId: string | null }[]
  programmes: { id: string; name: string }[]
  isAdmin: boolean
  currentUserId: string
}

const STEPS = ['Instructions', 'Document Upload', 'Project Details', 'Confirmation'] as const

export function ProjectForm({
  project,
  departments,
  academicYears,
  staff,
  programmes,
  isAdmin,
  currentUserId,
}: ProjectFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [step, setStep] = useState(project ? 1 : 0)
  const [instructionsAccepted, setInstructionsAccepted] = useState(false)

  const [title, setTitle] = useState(project?.title ?? '')
  const [studentName, setStudentName] = useState(project?.studentName ?? '')
  const [programme, setProgramme] = useState(project?.programme ?? '')
  const [degreeLevel, setDegreeLevel] = useState(project?.degreeLevel ?? 'BSc')
  const [academicYearId, setAcademicYearId] = useState(project?.academicYearId ?? '')
  const [departmentId, setDepartmentId] = useState(project?.departmentId ?? '')
  const [supervisorId, setSupervisorId] = useState(project?.supervisorId ?? currentUserId)
  const [abstract, setAbstract] = useState(project?.abstract ?? '')
  const [objective, setObjective] = useState(project?.objective ?? '')
  const [githubLink, setGithubLink] = useState(project?.githubLink ?? '')
  const [documentUrl, setDocumentUrl] = useState(project?.documentUrl ?? '')
  const [documentName, setDocumentName] = useState(project?.documentName ?? '')
  const [published, setPublished] = useState(project?.published ?? false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [autoFilled, setAutoFilled] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // --- Draft persistence (new projects only) ---
  const draftKey = `spms:draft:new:${currentUserId}`
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [showDraftBanner, setShowDraftBanner] = useState(false)
  const [draftMeta, setDraftMeta] = useState<{ updatedAt: number } | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey)
    } catch {}
    setShowDraftBanner(false)
    setDraftMeta(null)
    setLastSavedAt(null)
  }

  const applyDraft = (draft: Record<string, unknown>) => {
    const s = (v: unknown) => (typeof v === 'string' ? v : '')
    if (s(draft.title)) setTitle(s(draft.title))
    if (s(draft.studentName)) setStudentName(s(draft.studentName))
    if (s(draft.programme)) setProgramme(s(draft.programme))
    if (s(draft.degreeLevel)) setDegreeLevel(s(draft.degreeLevel))
    if (s(draft.academicYearId)) setAcademicYearId(s(draft.academicYearId))
    if (s(draft.departmentId)) setDepartmentId(s(draft.departmentId))
    if (s(draft.supervisorId)) setSupervisorId(s(draft.supervisorId))
    if (s(draft.abstract)) setAbstract(s(draft.abstract))
    if (s(draft.objective)) setObjective(s(draft.objective))
    if (s(draft.githubLink)) setGithubLink(s(draft.githubLink))
    if (s(draft.documentUrl)) setDocumentUrl(s(draft.documentUrl))
    if (s(draft.documentName)) setDocumentName(s(draft.documentName))
    if (typeof draft.step === 'number') setStep(draft.step as number)
    if (typeof draft.instructionsAccepted === 'boolean') setInstructionsAccepted(draft.instructionsAccepted as boolean)
    if (Array.isArray(draft.autoFilled)) setAutoFilled(draft.autoFilled as string[])
    setShowDraftBanner(false)
  }

  // Load draft on mount (new only)
  useEffect(() => {
    if (project) {
      setDraftLoaded(true)
      return
    }
    try {
      const raw = localStorage.getItem(draftKey)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>
        const hasContent =
          (parsed.title as string)?.trim() ||
          (parsed.studentName as string)?.trim() ||
          (parsed.abstract as string)?.trim() ||
          (parsed.objective as string)?.trim() ||
          (parsed.documentUrl as string)?.trim() ||
          (parsed.programme as string)?.trim()
        if (hasContent || typeof parsed.step === 'number' && (parsed.step as number) > 0) {
          setDraftMeta({ updatedAt: (parsed.updatedAt as number) || Date.now() })
          setShowDraftBanner(true)
          // keep parsed for apply, store temporarily in ref via draftMeta? store in state
          ;(window as unknown as Record<string, unknown>).__spms_draft = parsed
        }
      }
    } catch {}
    setDraftLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, draftKey])

  const handleContinueDraft = () => {
    try {
      const parsed = (window as unknown as Record<string, unknown>).__spms_draft as Record<string, unknown>
      if (parsed) applyDraft(parsed)
      else {
        const raw = localStorage.getItem(draftKey)
        if (raw) applyDraft(JSON.parse(raw))
      }
    } catch {}
  }

  const handleDiscardDraft = () => {
    clearDraft()
    try {
      delete (window as unknown as Record<string, unknown>).__spms_draft
    } catch {}
  }

  // Auto-save draft (debounced)
  useEffect(() => {
    if (project) return
    if (!draftLoaded) return
    if (showDraftBanner) return // don't overwrite while banner shown until user decides
    const hasContent =
      title.trim() ||
      studentName.trim() ||
      programme.trim() ||
      abstract.trim() ||
      objective.trim() ||
      documentUrl.trim() ||
      githubLink.trim() ||
      step > 0 ||
      instructionsAccepted
    if (!hasContent) {
      // if completely empty, remove stale draft
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.removeItem(draftKey)
          setLastSavedAt(null)
        } catch {}
      }, 600)
      return
    }
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      const draft = {
        title,
        studentName,
        programme,
        degreeLevel,
        academicYearId,
        departmentId,
        supervisorId,
        abstract,
        objective,
        githubLink,
        documentUrl,
        documentName,
        step,
        instructionsAccepted,
        autoFilled,
        updatedAt: Date.now(),
      }
      try {
        localStorage.setItem(draftKey, JSON.stringify(draft))
        setLastSavedAt(draft.updatedAt)
      } catch {}
    }, 600)
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [
    title,
    studentName,
    programme,
    degreeLevel,
    academicYearId,
    departmentId,
    supervisorId,
    abstract,
    objective,
    githubLink,
    documentUrl,
    documentName,
    step,
    instructionsAccepted,
    autoFilled,
    draftLoaded,
    project,
    draftKey,
    showDraftBanner,
  ])

  const allRequiredMet =
    title.trim() &&
    studentName.trim() &&
    programme.trim() &&
    degreeLevel &&
    academicYearId &&
    abstract.trim() &&
    objective.trim() &&
    documentUrl &&
    githubLink.trim() &&
    (!isAdmin || (departmentId.trim() && supervisorId.trim()))
  const missingFields = [
    !title.trim() && 'Project Topic',
    !studentName.trim() && 'Student Names',
    !programme.trim() && 'Programme',
    !degreeLevel && 'Degree Level',
    !academicYearId && 'Academic Year',
    !githubLink.trim() && 'GitHub Link',
    ...(isAdmin ? [!departmentId.trim() && 'Department', !supervisorId.trim() && 'Supervisor'] : []),
    !abstract.trim() && 'Abstract',
    !objective.trim() && 'Objective',
    !documentUrl && 'PDF Document',
  ].filter(Boolean) as string[]

  const findLabel = (options: { value: string; label: string }[], val: string) =>
    options.find((o) => o.value === val)?.label ?? (val || '—')

  const yearLabel = findLabel(
    [{ value: '', label: 'None' }, ...academicYears.map((y) => ({ value: y.id, label: y.year }))],
    academicYearId,
  )
  const programmeLabel = findLabel(
    [{ value: '', label: 'Select programme' }, ...programmes.map((p) => ({ value: p.name, label: p.name }))],
    programme,
  )
  const degreeLabel = findLabel(
    [
      { value: 'BSc', label: 'BSc' },
      { value: 'Diploma', label: 'Diploma' },
      { value: 'MSc', label: 'MSc' },
      { value: 'MPHIL', label: 'MPHIL' },
      { value: 'PHD', label: 'PHD' },
    ],
    degreeLevel,
  )
  const deptLabel = findLabel(
    [{ value: '', label: 'All Departments' }, ...departments.map((d) => ({ value: d.id, label: d.name }))],
    departmentId,
  )
  const supervisorLabel = findLabel(
    staff.map((s) => ({ value: s.id, label: s.name })),
    supervisorId,
  )

  const selectedYear = academicYears.find((y) => y.id === academicYearId)?.year || ''
  const yearStr = selectedYear ? selectedYear.replace(/\//g, '-') : ''
  const expectedFileName = yearStr && title.trim() ? `${yearStr}_${title.trim()}.pdf` : ''
  const normalizeFileName = (s: string) => s.toLowerCase().replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim()
  const fileNameCorrect = !documentName || !expectedFileName ? true : normalizeFileName(documentName) === normalizeFileName(expectedFileName)

  const action = project ? updateSpmsProject : createSpmsProject

  const applyExtracted = (fields: Record<string, unknown>) => {
    const filled: string[] = []
    const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
    if (str(fields.title)) { setTitle(str(fields.title)); filled.push('Project Topic') }
    if (str(fields.studentName)) { setStudentName(str(fields.studentName)); filled.push('Student Names') }
    if (str(fields.programme)) {
      const match = programmes.find((p) => p.name.toLowerCase() === str(fields.programme).toLowerCase())
      if (match) { setProgramme(match.name); filled.push('Programme') }
    }
    if (str(fields.academicYear)) {
      const match = academicYears.find((y) => y.year === str(fields.academicYear))
      if (match) { setAcademicYearId(match.id); filled.push('Academic Year') }
    }
    const dl = str(fields.degreeLevel)
    if (['BSc','Diploma','MSc','MPHIL','PHD'].includes(dl)) { setDegreeLevel(dl); filled.push('Degree Level') }
    if (str(fields.abstract)) { setAbstract(str(fields.abstract)); filled.push('Abstract') }
    if (str(fields.objective)) { setObjective(str(fields.objective)); filled.push('Objective') }
    if (str(fields.githubLink)) { setGithubLink(str(fields.githubLink)); filled.push('GitHub Link') }
    if (isAdmin && str(fields.department)) {
      const match = departments.find((d) => d.name.toLowerCase() === str(fields.department).toLowerCase())
      if (match) { setDepartmentId(match.id); filled.push('Department') }
    }
    if (isAdmin && str(fields.supervisor)) {
      const match = staff.find((s) => s.name.toLowerCase() === str(fields.supervisor).toLowerCase())
      if (match) { setSupervisorId(match.id); filled.push('Supervisor') }
    }
    setAutoFilled(filled)
  }

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed')
      return
    }
    setUploading(true)
    setUploadError('')
    setAutoFilled([])
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/spms/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => null)
      if (res.ok) {
        setDocumentUrl(data.url)
        setDocumentName(data.name || file.name)
        if (data.fields) applyExtracted(data.fields)
      } else {
        setUploadError(data?.error || 'Upload failed')
      }
    } catch {
      setUploadError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFile(file)
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    await handleFile(file)
  }

  const handleSubmit = () => {
    const fd = new FormData()
    if (project) fd.set('id', project.id)
    fd.set('title', title)
    fd.set('studentName', studentName)
    fd.set('programme', programme)
    fd.set('degreeLevel', degreeLevel)
    fd.set('academicYearId', academicYearId)
    fd.set('departmentId', departmentId)
    fd.set('supervisorId', supervisorId)
    fd.set('abstract', abstract)
    fd.set('objective', objective)
    fd.set('githubLink', githubLink)
    fd.set('documentUrl', documentUrl)
    fd.set('documentName', documentName)
    if (project) fd.set('published', published ? 'on' : '')
    startTransition(async () => {
      try {
        const result = (await action(null, fd)) as unknown as { error?: string } | undefined
        if (!result?.error) {
          clearDraft()
          try { delete (window as unknown as Record<string, unknown>).__spms_draft } catch {}
        }
      } catch (e: unknown) {
        const digest = (e as { digest?: string })?.digest || ''
        if (String(digest).includes('NEXT_REDIRECT')) {
          clearDraft()
          try { delete (window as unknown as Record<string, unknown>).__spms_draft } catch {}
        }
        throw e as never
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/spms/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          <ArrowLeft size={16} weight="duotone" /> Back to Projects
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{project ? 'Edit Project' : 'New Project'}</h1>
          <p className="mt-1 text-sm text-ink-500">{project ? 'Update project details' : 'Upload a new student project in 4 steps'}</p>
        </div>
        {mounted && !project && lastSavedAt && !showDraftBanner && (
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs text-ink-500" suppressHydrationWarning>
            <span className="inline-flex items-center gap-1.5"><ClockCounterClockwise size={12} weight="duotone" /> Autosaved {new Date(lastSavedAt).toLocaleTimeString()}</span>
            <button type="button" onClick={clearDraft} className="ml-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-ink-600 hover:bg-ink-100">Clear</button>
          </span>
        )}
      </div>

      {/* Draft banner */}
      {mounted && !project && showDraftBanner && draftMeta && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
              <ClockCounterClockwise size={18} weight="duotone" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-900">Draft found</p>
              <p className="text-xs text-brand-700">
                You left an unfinished project {new Date(draftMeta.updatedAt).toLocaleString()}. Continue where you left off?
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="inline-flex items-center gap-1.5 rounded-[5px] border border-ink-200 bg-white px-3 py-2 text-xs font-semibold text-ink-600 hover:bg-ink-50"
            >
              <Trash size={14} weight="duotone" /> Discard
            </button>
            <button
              type="button"
              onClick={handleContinueDraft}
              className="inline-flex items-center gap-1.5 rounded-[5px] bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800"
            >
              Continue draft
            </button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-ink-100 bg-white p-6">
        {/* Step indicator — Yedent style, no shadows */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {STEPS.map((s, i) => {
            const isCompleted = i < step
            const isCurrent = i === step
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition border',
                    isCompleted
                      ? 'bg-brand-700 text-white border-brand-700'
                      : isCurrent
                        ? 'bg-brand-700 text-white border-brand-700'
                        : 'border-ink-200 text-ink-400 bg-white',
                  )}
                >
                  {isCompleted ? <CheckCircle size={16} weight="duotone" /> : i + 1}
                </div>
                <span className={cn('text-sm font-semibold', isCurrent ? 'text-brand-700' : isCompleted ? 'text-ink-700' : 'text-ink-400')}>
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={cn('mx-2 h-px w-8', i < step ? 'bg-brand-700' : 'bg-ink-200')} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step 0: Instructions — simplified, full-width */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-ink-900">Before you upload</h3>
              <p className="mt-1 text-sm text-ink-500">Download the sample and match its format exactly — the system reads your first page to auto-fill the next steps.</p>
            </div>

            <a
              href="/sample-first-page.pdf"
              download
              className="flex items-center gap-4 rounded-lg border border-brand-200 bg-brand-50 p-4 hover:bg-brand-100 transition"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white border border-brand-200">
                <FileText size={22} weight="duotone" className="text-brand-700" />
              </span>
              <span className="flex-1 min-w-0 text-left">
                <span className="block text-sm font-bold text-ink-900">Sample first page — download</span>
                <span className="block text-xs text-ink-600">PDF with exact labels the system expects (Project Topic, Student Name(s), etc.)</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[5px] bg-brand-700 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
                <DownloadSimple size={14} weight="duotone" /> Download
              </span>
            </a>

            <div className="rounded-lg border border-ink-100 bg-white p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">1</span>
                  <span className="pt-0.5 text-ink-700"><span className="font-semibold text-ink-900">First page labels:</span> Project Topic, Student Name(s), Programme, Degree Level, Academic Year, Supervisor, Abstract, Objective — exactly as in the sample.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">2</span>
                  <span className="pt-0.5 text-ink-700"><span className="font-semibold text-ink-900">File name:</span> <span className="font-mono">AcademicYear_Project Topic.pdf</span> — topic must match the PDF. E.g. <span className="font-mono">2024-2025_Design of Smart Irrigation System.pdf</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">3</span>
                  <span className="pt-0.5 text-ink-700"><span className="font-semibold text-ink-900">PDF + GitHub:</span> Export your document as PDF; paste your GitHub repo link in Step 3.</span>
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-ink-200 bg-white px-4 py-3 cursor-pointer hover:border-brand-200 transition">
              <input
                type="checkbox"
                checked={instructionsAccepted}
                onChange={(e) => setInstructionsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-300 accent-brand-700"
              />
              <span className="text-sm text-ink-700">I will use the sample format and understand the file requirements.</span>
            </label>

            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push('/spms/projects')}>
                Cancel
              </Button>
              <Button type="button" disabled={!instructionsAccepted} onClick={() => setStep(1)}>
                Continue to Upload
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Document Upload — simplified, full-width */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-ink-900">Upload Project Document</h3>
              <p className="mt-1 text-sm text-ink-500">
                Drag & drop your PDF. Use the sample from Step 1 as a guide — file name topic must match the <span className="font-semibold">Project Topic</span> inside the PDF.
              </p>
            </div>

            <label
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition',
                isDragging ? 'border-brand-600 bg-brand-50' : 'border-ink-200 bg-ink-50 hover:border-brand-300 hover:bg-brand-50/50',
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-ink-200">
                <UploadSimple size={20} weight="duotone" className="text-brand-600" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">{uploading ? 'Reading document…' : isDragging ? 'Drop PDF now' : 'Drop your PDF here or click to browse'}</p>
                <p className="mt-1 text-xs text-ink-500">PDF only • Max 20MB</p>
              </div>
              <span className="mt-1 inline-flex items-center gap-2 rounded-[5px] bg-brand-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                {uploading ? 'Uploading…' : documentName || 'Choose PDF file'}
              </span>
              <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
            </label>
            <p className="text-center font-mono text-xs text-ink-500">AcademicYear_Project Topic.pdf</p>

            {documentUrl && (
              <div className="rounded-[5px] border border-green-200 bg-green-50 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-green-800">
                  <CheckCircle size={16} weight="duotone" /> Document uploaded
                </p>
                <p className="mt-1 truncate font-mono text-xs text-green-700">{documentName}</p>
                {autoFilled.length > 0 && (
                  <p className="mt-2 text-xs text-green-700">
                    Auto-filled: {autoFilled.join(', ')} — review and edit in the next step.
                  </p>
                )}
                {autoFilled.length === 0 && (
                  <p className="mt-2 text-xs text-amber-700">No fields were auto-detected. You can still fill them manually in the next step.</p>
                )}
              </div>
            )}
            {uploadError && <p className="text-sm text-red-600">✗ {uploadError}</p>}

            <div className="flex justify-between gap-3 border-t border-ink-100 pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(0)}>
                Previous
              </Button>
              <Button type="button" disabled={!documentUrl || uploading} onClick={() => setStep(2)}>
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Project Details (Auto-filled) */}
        {step === 2 && (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {autoFilled.length > 0 && (
              <div className="rounded-[5px] border border-brand-200 bg-brand-50 px-4 py-3 text-sm">
                <p className="flex items-center gap-2 font-semibold text-brand-800">
                  <Info size={16} weight="duotone" /> {autoFilled.length} fields auto-filled from your PDF
                </p>
                <p className="mt-1 text-brand-700">{autoFilled.join(', ')} — please verify and correct them.</p>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-5">
                <Input
                  label={<span>Project Topic <span className="text-red-500">*</span></span>}
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Design and Implementation of a University Portal"
                />
                <Input
                  label={<span>Student Names <span className="text-red-500">*</span></span>}
                  name="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  placeholder="e.g. John Smith, Ama Mensah"
                />
                <Select
                  label="Programme"
                  name="programme"
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  required
                  options={[{ value: '', label: 'Select programme' }, ...programmes.map((p) => ({ value: p.name, label: p.name }))]}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select
                    label="Degree Level"
                    name="degreeLevel"
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    required
                    options={[{ value: '', label: 'Select level' }, { value: 'BSc', label: 'BSc' }, { value: 'Diploma', label: 'Diploma' }, { value: 'MSc', label: 'MSc' }, { value: 'MPHIL', label: 'MPHIL' }, { value: 'PHD', label: 'PHD' }]}
                  />
                  <Select
                    label="Academic Year"
                    name="academicYearId"
                    value={academicYearId}
                    onChange={(e) => setAcademicYearId(e.target.value)}
                    required
                    options={[{ value: '', label: 'Select year' }, ...academicYears.map((y) => ({ value: y.id, label: y.year }))]}
                  />
                </div>
                {isAdmin && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Select
                      label="Department"
                      name="departmentId"
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      required
                      options={[{ value: '', label: 'Select department' }, ...departments.map((d) => ({ value: d.id, label: d.name }))]}
                    />
                    <Select
                      label="Supervisor"
                      name="supervisorId"
                      value={supervisorId}
                      onChange={(e) => setSupervisorId(e.target.value)}
                      required
                      options={[{ value: '', label: 'Select supervisor' }, ...staff.map((s) => ({ value: s.id, label: s.name }))]}
                    />
                  </div>
                )}
                <Input
                  label={<span>GitHub Link <span className="text-red-500">*</span></span>}
                  name="githubLink"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  required
                  placeholder="https://github.com/..."
                />
                {project && (
                  <label className="flex items-center gap-2 text-sm text-ink-700">
                    <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded border-ink-300 accent-brand-700" />
                    Published
                  </label>
                )}
              </div>

              <div className="space-y-5">
                <Textarea
                  label={<span>Abstract <span className="text-red-500">*</span></span>}
                  name="abstract"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  rows={8}
                  required
                  placeholder="Brief summary of the project..."
                />
                <Textarea
                  label={<span>Objective <span className="text-red-500">*</span></span>}
                  name="objective"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  rows={6}
                  required
                  placeholder="Main objective of the project..."
                />
                <div className="rounded-lg border border-ink-100 bg-ink-50 px-4 py-3 text-xs text-ink-600">
                  <p className="font-semibold text-ink-700">Document</p>
                  <p className="mt-1 truncate font-mono">{documentName || '—'}</p>
                  {!fileNameCorrect && documentName && (
                    <p className="mt-2 text-amber-700">Expected name: <span className="font-mono font-semibold">{expectedFileName}</span></p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3 border-t border-ink-100 pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Previous
              </Button>
              <Button type="button" disabled={!allRequiredMet} onClick={() => setStep(3)}>
                Review Confirmation
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation — full-width */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-ink-100 bg-ink-50 p-5 text-sm">
              <dl className="space-y-3">
                <Row label="Project Topic" value={title} />
                <Row label="Student Names" value={studentName} />
                <Row label="Programme" value={programmeLabel} />
                <Row label="Degree Level" value={degreeLabel} />
                <Row label="Academic Year" value={yearLabel} />
                {isAdmin && <Row label="Department" value={deptLabel} />}
                {isAdmin && <Row label="Supervisor" value={supervisorLabel} />}
                <Row label="GitHub Link" value={githubLink || '—'} />
                <Row label="Document" value={documentName || '—'} />
              </dl>
            </div>

            {documentName && !fileNameCorrect && (
              <div className="rounded-[5px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <p className="font-semibold">File name does not match the required format.</p>
                <p className="mt-1">Expected: <span className="font-mono font-semibold">{expectedFileName}</span></p>
                <p className="mt-0.5">Current: <span className="font-mono">{documentName}</span></p>
              </div>
            )}

            {abstract && (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">Abstract</h4>
                <p className="text-sm leading-relaxed text-ink-600 line-clamp-4">{abstract}</p>
              </div>
            )}
            {objective && (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">Objective</h4>
                <p className="text-sm leading-relaxed text-ink-600 line-clamp-3">{objective}</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-4">
              {missingFields.length > 0 ? (
                <p className="text-xs text-ink-400">Missing: {missingFields.join(', ')}</p>
              ) : !fileNameCorrect ? (
                <p className="text-xs font-medium text-amber-600 flex items-center gap-1"><WarningCircle size={14} weight="duotone" /> File name differs from expected — you can still create, but rename is recommended</p>
              ) : (
                <p className="text-xs font-medium text-green-600 flex items-center gap-1"><CheckCircle size={14} weight="duotone" /> All requirements met</p>
              )}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Previous
                </Button>
                <Button type="button" disabled={!allRequiredMet || pending || uploading} onClick={handleSubmit}>
                  {pending ? 'Saving…' : project ? 'Save changes' : 'Create project'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-ink-500">{label}</dt>
      <dd className="text-right font-semibold text-ink-900">{value}</dd>
    </div>
  )
}
