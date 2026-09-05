'use client'

import { useState, useMemo, Fragment } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CaretRight, FileText, MagnifyingGlass } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const DEGREE_LABELS: Record<string, string> = {
  BSc: 'BSc',
  Diploma: 'Diploma',
  MSc: 'MSc',
  MPHIL: 'MPHIL',
  PHD: 'PHD',
}

type ProjectRow = {
  id: string
  slug: string
  title: string
  studentName: string | null
  programme: string | null
  degreeLevel: string
  academicYear: { year: string } | null
  abstract: string | null
  objective: string | null
  groupMembers: string | null
  githubLink: string | null
  documentUrl: string | null
  documentName: string | null
  department: { name: string } | null
  supervisor: { name: string } | null
}

const PAGE_SIZE = 10

export function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const searchParams = useSearchParams()
  const initialLevel = searchParams.get('level')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [level, setLevel] = useState(initialLevel && DEGREE_LABELS[initialLevel] ? initialLevel : 'ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = projects
    if (level !== 'ALL') {
      result = result.filter((p) => p.degreeLevel === level)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.studentName?.toLowerCase().includes(q) ||
          p.supervisor?.name.toLowerCase().includes(q) ||
          p.programme?.toLowerCase().includes(q) ||
          p.department?.name.toLowerCase().includes(q),
      )
    }
    return result
  }, [projects, search, level])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const startEntry = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const endEntry = Math.min(safePage * PAGE_SIZE, filtered.length)

  const levels = ['ALL', 'BSc', 'Diploma', 'MSc', 'MPHIL', 'PHD']

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => { setLevel(l); setPage(1) }}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-semibold transition',
              level === l
                ? 'bg-brand-700 text-white'
                : 'border border-ink-200 bg-white text-ink-600 hover:border-brand-300',
            )}
          >
            {l === 'ALL' ? 'All Levels' : l}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search projects…"
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3">Project Topic</th>
                <th className="px-4 py-3">Supervisor</th>
                <th className="px-4 py-3">Programme</th>
                <th className="px-4 py-3">Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-ink-400">
                    No projects found.
                  </td>
                </tr>
              ) : (
                paged.map((project, idx) => {
                  const isExpanded = expandedId === project.id
                  return (
                    <Fragment key={project.id}>
                      <tr
                        className={cn(
                          'cursor-pointer transition hover:bg-ink-50',
                          isExpanded && 'bg-ink-50',
                        )}
                        onClick={() => setExpandedId(isExpanded ? null : project.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-brand-700 text-brand-700 transition-transform',
                                isExpanded && 'rotate-90',
                              )}
                            >
                              <CaretRight size={12} weight="bold" />
                            </button>
                            <span className="text-ink-500">{startEntry + idx}</span>
                          </div>
                        </td>
                        <td className="max-w-xs px-4 py-3">
                          <span className="line-clamp-1 font-medium text-ink-900">{project.title}</span>
                        </td>
                        <td className="px-4 py-3 text-ink-600">{project.supervisor?.name ?? '—'}</td>
                        <td className="px-4 py-3 text-ink-600">{project.programme ?? '—'}</td>
                        <td className="px-4 py-3 text-ink-600">{project.academicYear?.year ?? '—'}</td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="border-b border-ink-100 bg-ink-50/60 px-4 py-5">
                            <div className="grid gap-6 sm:grid-cols-3">
                              <div className="sm:col-span-2 space-y-4">
                                {project.objective && (
                                  <div>
                                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">Objective</h4>
                                    <p className="text-sm leading-relaxed text-ink-600 line-clamp-3">{project.objective}</p>
                                  </div>
                                )}
                                {project.studentName && (
                                  <div>
                                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">Student(s)</h4>
                                    <p className="text-sm leading-relaxed text-ink-600">{project.studentName}</p>
                                  </div>
                                )}
                                {project.groupMembers && (
                                  <div>
                                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">Group Members</h4>
                                    <p className="text-sm leading-relaxed text-ink-600">{project.groupMembers}</p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-3">
                                <Detail label="Degree" value={DEGREE_LABELS[project.degreeLevel] ?? project.degreeLevel} />
                                {project.department && <Detail label="Department" value={project.department.name} />}
                                <div className="pt-2">
                                  <Link
                                    href={`/projects/${project.slug}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-800"
                                  >
                                    <FileText size={14} weight="duotone" /> View Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-500">
          <span>Showing {startEntry} to {endEntry} of {filtered.length} entries</span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-ink-300 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 7) pageNum = i + 1
                else if (safePage <= 4) pageNum = i + 1
                else if (safePage >= totalPages - 3) pageNum = totalPages - 6 + i
                else pageNum = safePage - 3 + i
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'min-w-[32px] rounded-lg px-2 py-1.5 text-xs font-semibold transition',
                      pageNum === safePage
                        ? 'bg-brand-700 text-white'
                        : 'border border-ink-200 bg-white text-ink-600 hover:border-ink-300',
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-ink-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</h4>
      <p className="text-sm font-medium text-ink-700">{value}</p>
    </div>
  )
}
