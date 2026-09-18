'use client'

import Link from 'next/link'
import { Clock } from '@phosphor-icons/react/dist/ssr'
import { DataTable, type Column } from '@/components/ui'
import type { ProgrammeLevel } from '@prisma/client'

export type ProgrammeRow = {
  id: string
  slug: string
  name: string
  level: ProgrammeLevel
  duration: string | null
  summary: string
  departmentName: string | null
}

const levelLabels: Record<ProgrammeLevel, string> = {
  DEGREE: 'Degree',
  DIPLOMA: 'Diploma',
  POSTGRADUATE: 'Postgraduate',
}

const columns: Column<ProgrammeRow>[] = [
  {
    key: 'name',
    header: 'Programme',
    render: (p) => (
      <div className="min-w-0">
        <Link
          href={`/programmes/${p.slug}`}
          className="font-medium text-ink-900 transition hover:text-brand-700"
        >
          {p.name}
        </Link>
        <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-ink-500">{p.summary}</p>
      </div>
    ),
  },
  {
    key: 'level',
    header: 'Level',
    render: (p) => (
      <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
        {levelLabels[p.level]}
      </span>
    ),
  },
  {
    key: 'department',
    header: 'Department',
    className: 'hidden md:table-cell',
    render: (p) => <span className="text-ink-600">{p.departmentName ?? '—'}</span>,
  },
  {
    key: 'duration',
    header: 'Duration',
    className: 'hidden sm:table-cell',
    render: (p) =>
      p.duration ? (
        <span className="inline-flex items-center gap-1.5 text-ink-600">
          <Clock size={13} weight="duotone" /> {p.duration}
        </span>
      ) : (
        <span className="text-ink-400">—</span>
      ),
  },
  {
    key: 'view',
    header: '',
    className: 'text-right',
    render: (p) => (
      <Link
        href={`/programmes/${p.slug}`}
        className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition hover:text-brand-800"
      >
        View
        <span aria-hidden>→</span>
      </Link>
    ),
  },
]

export function ProgrammesTable({ programmes }: { programmes: ProgrammeRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={programmes}
      pageSize={10}
      emptyMessage="No programmes found in this category yet."
    />
  )
}
