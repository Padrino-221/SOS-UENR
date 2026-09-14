'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type Project = {
  id: string
  slug: string
  title: string
  programme: string | null
  academicYear: { year: string } | null
}

const PAGE_SIZE = 10

export function StaffProjectsTable({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(projects.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const paged = projects.slice(start, start + PAGE_SIZE)

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-brand-950 text-white text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">#</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">Project Topic</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">Programme</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {paged.map((project, idx) => (
                <tr key={project.id} className="hover:bg-ink-50/50">
                  <td className="px-4 py-3 text-ink-500">{start + idx + 1}</td>
                  <td className="max-w-xs px-4 py-3">
                    <Link href={`/projects/${project.slug}`} className="font-medium text-ink-900 hover:text-brand-700 line-clamp-1">
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{project.programme || '—'}</td>
                  <td className="px-4 py-3 text-ink-600">{project.academicYear?.year || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm text-ink-500">
          <span>Showing {start + 1}–{Math.min(start + PAGE_SIZE, projects.length)} of {projects.length}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1.5 font-medium text-ink-600 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-40 disabled:pointer-events-none"
            >
              <CaretLeft size={12} weight="duotone" /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'h-8 w-8 rounded-lg text-xs font-medium transition',
                  p === page
                    ? 'bg-brand-700 text-white'
                    : 'text-ink-600 hover:bg-ink-100',
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1.5 font-medium text-ink-600 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-40 disabled:pointer-events-none"
            >
              Next <CaretRight size={12} weight="duotone" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
