'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GithubLogo, Globe, DownloadSimple } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Badge, EmptyState, DataTable, Select, Tooltip } from '@/components/ui'

interface Project {
  id: string
  title: string
  slug: string
  studentName: string | null
  programme: string | null
  degreeLevel: string
  published: boolean
  createdAt: Date
  documentUrl: string | null
  githubLink: string | null
  supervisor: { id: string; name: string } | null
  department: { id: string; name: string } | null
}

interface YearProjectsListProps {
  projects: Project[]
}

export function YearProjectsList({ projects }: YearProjectsListProps) {
  const [levelFilter, setLevelFilter] = useState<string>('all')

  const levels = [...new Set(projects.map((p) => p.degreeLevel))].sort()

  const filtered = projects.filter((p) => {
    if (levelFilter !== 'all' && p.degreeLevel !== levelFilter) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-56">
          <Select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Levels' },
              ...levels.map((l) => ({ value: l, label: l })),
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects"
          description="No projects found for this academic year."
        />
      ) : (
        <DataTable
          data={filtered}
          columns={[
            {
              key: 'title',
              header: 'Title',
              render: (p) => (
                <div>
                  <p className="font-medium text-ink-900">{p.title}</p>
                  {p.studentName && (
                    <p className="text-xs text-ink-500">{p.studentName}</p>
                  )}
                </div>
              ),
            },
            {
              key: 'degreeLevel',
              header: 'Level',
              render: (p) => <Badge variant="success">{p.degreeLevel}</Badge>,
            },
            {
              key: 'supervisor',
              header: 'Supervisor',
              render: (p) => p.supervisor?.name ?? '—',
            },
            {
              key: 'department',
              header: 'Department',
              render: (p) => <span className="block max-w-[200px] truncate" title={p.department?.name ?? ''}>{p.department?.name ?? '—'}</span>,
            },
            {
              key: 'published',
              header: 'Status',
              render: (p) => (
                <Badge variant={p.published ? 'success' : 'default'}>
                  {p.published ? 'Published' : 'Draft'}
                </Badge>
              ),
            },
            {
              key: 'id',
              header: '',
              render: (p) => (
                <div className="flex items-center gap-1">
                  <Tooltip content="GitHub">
                    <a
                      href={p.githubLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'rounded-lg p-1.5 transition',
                        p.githubLink
                          ? 'text-ink-500 hover:bg-brand-50 hover:text-brand-700'
                          : 'text-ink-300 pointer-events-none',
                      )}
                    >
                      <GithubLogo size={15} weight="duotone" />
                    </a>
                  </Tooltip>
                  <Tooltip content="View on website">
                    <a
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-ink-500 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Globe size={15} weight="duotone" />
                    </a>
                  </Tooltip>
                  <Tooltip content="Download PDF">
                    <a
                      href={p.documentUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'rounded-lg p-1.5 transition',
                        p.documentUrl
                          ? 'text-ink-500 hover:bg-brand-50 hover:text-brand-700'
                          : 'text-ink-300 pointer-events-none',
                      )}
                    >
                      <DownloadSimple size={15} weight="duotone" />
                    </a>
                  </Tooltip>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
