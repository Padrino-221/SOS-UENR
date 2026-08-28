'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { UploadSimple } from '@phosphor-icons/react'
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

const STEPS = ['Instructions', 'Project Upload', 'Confirm Detail']

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

  const allRequiredMet = title.trim() && studentName.trim() && programme.trim() && degreeLevel && academicYearId && abstract.trim() && objective.trim() && documentUrl
  const missingFields = [
    !title.trim() && 'Project Topic',
    !studentName.trim() && 'Student Names',
    !programme.trim() && 'Programme',
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

  const yearStr = yearLabel !== '—' ? yearLabel.replace(/\//g, '-') : ''
  const expectedFileName = yearStr && title.trim()
    ? `${yearStr}_${title.trim()}.pdf`
    : ''
  const fileNameCorrect = !documentName || !expectedFileName
    ? true
    : documentName.toLowerCase().replace(/\s+/g, ' ').trim() === expectedFileName.toLowerCase().replace(/\s+/g, ' ').trim()

  const action = project ? updateSpmsProject : createSpmsProject

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/spms/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const data = await res.json()
      setDocumentUrl(data.url)
      setDocumentName(file.name)
    } else {
      const data = await res.json().catch(() => ({ error: 'Upload failed' }))
      setUploadError(data.error || 'Upload failed')
    }
    setUploading(false)
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
      await action(null, fd)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/spms/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-ink-900">
          {project ? 'Edit Project' : 'New Project'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {project ? 'Update project details' : 'Add a new student project'}
        </p>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-6">
        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition',
                  i <= step
                    ? 'bg-brand-700 text-white'
                    : 'border-2 border-ink-200 text-ink-400',
                )}
              >
                {i + 1}
              </div>
              <span
                className={cn(
                  'text-sm font-semibold transition',
                  i === step ? 'text-brand-700' : i < step ? 'text-ink-700' : 'text-ink-400',
                )}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={cn('mx-1 h-px w-6', i < step ? 'bg-brand-700' : 'bg-ink-200')} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Instructions */}
        {step === 0 && (
          <div className="max-w-2xl space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-red-500">
              Notes for Project Work Upload
            </h3>
            <ol className="space-y-4 text-sm leading-relaxed text-ink-700">
              <li>
                <span className="mr-2 font-bold text-red-500">#1:</span>
                Project Work File Should be in <span className="font-semibold">PDF Format</span>
              </li>
              <li>
                <span className="mr-2 font-bold text-red-500">#2:</span>
                File Name Format Should be: <span className="font-semibold">AcademicYear_Project Topic.pdf</span>. Eg: 2023-2024_ITDS Student Project Management System.pdf
              </li>
              <li>
                <span className="mr-2 font-bold text-red-500">#3:</span>
                Project Codes should be uploaded on <span className="font-semibold">GitHub</span> and not directly here. Simply provide the link to the project GitHub repository in the provided GitHub text box.
              </li>
            </ol>

            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={instructionsAccepted}
                onChange={(e) => setInstructionsAccepted(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 accent-brand-700"
              />
              I have read and understood the instructions
            </label>

            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push('/spms/projects')}>
                Cancel
              </Button>
              <Button type="button" disabled={!instructionsAccepted} onClick={() => setStep(1)}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Project Upload */}
        {step === 1 && (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
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
                  label={<span>Programme <span className="text-red-500">*</span></span>}
                  name="programme"
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  required
                  options={[
                    { value: '', label: 'Select programme' },
                    ...programmes.map((p) => ({ value: p.name, label: p.name })),
                  ]}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Select
                    label={<span>Degree Level <span className="text-red-500">*</span></span>}
                    name="degreeLevel"
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    required
                    options={[
                      { value: '', label: 'Select level' },
                      { value: 'BSc', label: 'BSc' },
                      { value: 'Diploma', label: 'Diploma' },
                      { value: 'MSc', label: 'MSc' },
                      { value: 'MPHIL', label: 'MPHIL' },
                      { value: 'PHD', label: 'PHD' },
                    ]}
                  />
                  <Select
                    label={<span>Academic Year <span className="text-red-500">*</span></span>}
                    name="academicYearId"
                    value={academicYearId}
                    onChange={(e) => setAcademicYearId(e.target.value)}
                    required
                    options={[
                      { value: '', label: 'Select year' },
                      ...academicYears.map((y) => ({ value: y.id, label: y.year })),
                    ]}
                  />
                </div>

                {isAdmin && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Select
                      label="Department"
                      name="departmentId"
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      options={[
                        { value: '', label: 'All Departments' },
                        ...departments.map((d) => ({ value: d.id, label: d.name })),
                      ]}
                    />
                    <Select
                      label="Supervisor"
                      name="supervisorId"
                      value={supervisorId}
                      onChange={(e) => setSupervisorId(e.target.value)}
                      options={staff.map((s) => ({ value: s.id, label: s.name }))}
                    />
                  </div>
                )}

                <Input
                  label="GitHub Link"
                  name="githubLink"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="https://github.com/..."
                />

                {project && (
                  <label className="flex items-center gap-2 text-sm text-ink-700">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4 rounded border-ink-300 accent-brand-700"
                    />
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

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                    Project Document (PDF) <span className="text-red-500">*</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-600 transition hover:border-brand-300 hover:bg-brand-50">
                    <UploadSimple size={16} />
                    {uploading ? 'Uploading…' : documentName || 'Choose PDF'}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </label>
                  {documentUrl && (
                    <p className="mt-1 text-xs text-green-600">✓ Document uploaded</p>
                  )}
                  {uploadError && (
                    <p className="mt-1 text-xs text-red-600">✗ {uploadError}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(0)}>
                Previous
              </Button>
              <Button
                type="button"
                disabled={!title.trim() || !studentName.trim() || !programme.trim() || !degreeLevel || !academicYearId || !abstract.trim() || !objective.trim() || !documentUrl}
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Confirm Detail */}
        {step === 2 && (
          <div className="max-w-2xl space-y-4">
            <div className="rounded-xl border border-ink-100 bg-ink-50 p-5 text-sm">
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
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <p className="font-semibold">File name does not match the required format.</p>
                <p className="mt-1">
                  Expected: <span className="font-mono font-semibold">{expectedFileName}</span>
                </p>
                <p className="mt-0.5">
                  Current: <span className="font-mono">{documentName}</span>
                </p>
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
                <p className="text-xs text-ink-400">
                  Missing: {missingFields.join(', ')}
                </p>
              ) : (
                <p className="text-xs text-green-600">All requirements met</p>
              )}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Previous
                </Button>
                <Button type="button" disabled={!allRequiredMet || !fileNameCorrect || pending || uploading} onClick={handleSubmit}>
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
