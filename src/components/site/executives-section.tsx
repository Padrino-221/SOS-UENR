'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/select'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Portrait({ src, alt, name }: { src: string | null; alt: string; name: string }) {
  return (
    <div className="relative shrink-0 aspect-[4/3] md:aspect-auto md:w-[38%] overflow-hidden bg-brand-50">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-top" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-3xl text-brand-300">{initials(name)}</span>
        </div>
      )}
    </div>
  )
}

type Exec = {
  id: string
  name: string
  title: string | null
  roles: string | null
  photoUrl: string | null
  department: { name: string } | null
  executiveYearId: string | null
  executiveYear: { id: string; year: string } | null
}

type YearOpt = { id: string; year: string }

function ExecutiveCard({ exec }: { exec: Exec }) {
  const position = exec.title || exec.roles || exec.department?.name || 'Executive'
  return (
    <div className="card-premium overflow-hidden flex flex-col md:flex-row">
      <Portrait src={exec.photoUrl} alt={exec.name} name={exec.name} />
      <div className="flex-1 p-7 md:p-8 flex flex-col justify-center">
        <h3 className="text-xl md:text-2xl font-serif text-ink-900 mb-1.5">{exec.name}</h3>
        <p className="text-brand-700 text-[11px] font-bold uppercase tracking-[0.18em] mb-2">{position}</p>
        {exec.executiveYear && (
          <span className="inline-flex items-center rounded-full bg-ink-50 border border-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600 mb-3">
            {exec.executiveYear.year}
          </span>
        )}
        {exec.department && <p className="text-ink-500 text-xs">{exec.department.name}</p>}
      </div>
    </div>
  )
}

export function ExecutivesSection({ executives, academicYears }: { executives: Exec[]; academicYears: YearOpt[] }) {
  const [yearFilter, setYearFilter] = useState<string>('all')

  const filtered =
    yearFilter === 'all' ? executives : executives.filter((e) => e.executiveYearId === yearFilter)

  return (
    <section className="py-16 bg-ink-50">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="kicker">Executives</span>
            <h2 className="mt-3 text-2xl md:text-3xl font-serif text-ink-900">Executive Leadership</h2>
            <p className="mt-2 text-sm text-ink-600 max-w-xl">Past and present executives — filter by academic year to view previous tenures.</p>
          </div>
          <div className="w-full sm:w-64">
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              options={[
                { value: 'all', label: `All Years (${executives.length})` },
                ...academicYears.map((y) => ({
                  value: y.id,
                  label: `${y.year} (${executives.filter((ex) => ex.executiveYearId === y.id).length})`,
                })),
              ]}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-white p-12 text-center">
            <p className="font-serif text-ink-900">
              {yearFilter === 'all' ? 'No executives found.' : 'No executives for this year.'}
            </p>
            <p className="mt-2 text-sm text-ink-500">Executives marked as “Executive” in Admin → Staff with an academic year will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((ex) => (
              <ExecutiveCard key={ex.id} exec={ex} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
