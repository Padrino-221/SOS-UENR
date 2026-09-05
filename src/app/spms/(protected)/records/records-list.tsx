'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Badge, EmptyState, DataTable, Button, Select } from '@/components/ui'

interface Record {
  id: string
  supervisorId: string | null
  academicYearId: string | null
  degreeLevels: string
  count: number
  supervisorName: string
  yearName: string
}

interface AcademicYear {
  id: string
  year: string
}

interface RecordsListProps {
  records: Record[]
  academicYears: AcademicYear[]
  isAdmin: boolean
}

export function RecordsList({ records, academicYears, isAdmin }: RecordsListProps) {
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')

  const filtered = records.filter((r) => {
    if (yearFilter !== 'all' && r.academicYearId !== yearFilter) return false
    if (levelFilter !== 'all' && !r.degreeLevels.includes(levelFilter)) return false
    return true
  })

  const levels = [...new Set(records.flatMap((r) => r.degreeLevels.split(', ')))].sort()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-56">
          <Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Years' },
              ...academicYears.map((y) => ({ value: y.id, label: y.year })),
            ]}
          />
        </div>

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
          title="No records"
          description="No project records match your filters."
        />
      ) : (
        <DataTable
          data={filtered}
          columns={[
            {
              key: 'supervisorName',
              header: 'Supervisor',
              render: (r) => (
                <span className="font-medium text-ink-900">{r.supervisorName}</span>
              ),
            },
            {
              key: 'yearName',
              header: 'Academic Year',
              render: (r) => <Badge variant="default">{r.yearName}</Badge>,
            },
            {
              key: 'degreeLevels',
              header: 'Degree Level',
              render: (r) => <Badge variant="success">{r.degreeLevels}</Badge>,
            },
            {
              key: 'count',
              header: 'Projects',
              render: (r) => (
                <span className="font-bold text-brand-700">{r.count}</span>
              ),
            },
            {
              key: 'id',
              header: '',
              render: (r) => (
                <Link href={r.academicYearId ? `/spms/records/${r.academicYearId}` : '#'}>
                  <Button variant="outline" className="gap-1.5" disabled={!r.academicYearId}>
                    View <ArrowRight size={14} weight="duotone" />
                  </Button>
                </Link>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
