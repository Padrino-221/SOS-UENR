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

/**
 * Ask Cloudinary to serve the image compressed on delivery:
 * auto format (WebP/AVIF), auto quality, and capped at 1000px wide.
 * Works retroactively for already-uploaded photos.
 */
function optimizedImage(src: string | null): string | null {
  if (!src) return null
  if (!src.includes('/image/upload/')) return src
  return src.replace(
    '/image/upload/',
    '/image/upload/f_auto,q_auto:good,w_1000,c_limit/',
  )
}

function Portrait({ src, alt, name }: { src: string | null; alt: string; name: string }) {
  return (
    <div className="relative shrink-0 aspect-[4/3] md:aspect-auto md:w-2/5 overflow-hidden bg-brand-50">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={optimizedImage(src) ?? undefined} alt={alt} className="absolute inset-0 h-full w-full object-cover object-top" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-3xl text-brand-300">{initials(name)}</span>
        </div>
      )}
    </div>
  )
}

export type PublicExecutive = {
  id: string
  name: string
  position: string
  photoUrl: string | null
  ordering: number
  academicYearId: string
  academicYear: { id: string; year: string }
  department: { name: string } | null
}

type YearOpt = { id: string; year: string; active: boolean }

function ExecutiveCard({ exec }: { exec: PublicExecutive }) {
  return (
    <div className="card-premium overflow-hidden flex flex-col md:flex-row">
      <Portrait src={exec.photoUrl} alt={exec.name} name={exec.name} />
      <div className="flex-1 p-7 md:p-8 flex flex-col justify-center">
        <h3 className="text-xl md:text-2xl font-serif text-ink-900 mb-1.5">{exec.name}</h3>
        <p className="text-brand-700 text-[11px] font-bold uppercase tracking-[0.18em] mb-2">
          {exec.position}
        </p>
        {exec.department && (
          <p className="mt-0.5 text-xs text-ink-500">{exec.department.name}</p>
        )}
      </div>
    </div>
  )
}

export function ExecutivesSection({
  executives,
  academicYears,
  defaultYearId,
}: {
  executives: PublicExecutive[]
  academicYears: YearOpt[]
  defaultYearId?: string | null
}) {
  const defaultFilter =
    defaultYearId && executives.some((e) => e.academicYearId === defaultYearId)
      ? defaultYearId
      : 'all'
  const [yearFilter, setYearFilter] = useState<string>(defaultFilter)

  const filtered =
    yearFilter === 'all' ? executives : executives.filter((e) => e.academicYearId === yearFilter)

  return (
    <section className="py-16 bg-ink-50">
      <div className="container-page max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="kicker">Executives</span>
            <h2 className="mt-3 text-2xl md:text-3xl font-serif text-ink-900">Student Executives</h2>
            <p className="mt-2 text-sm text-ink-600 max-w-xl">
              Student leaders grouped by their tenure — switch academic year to view past executives.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              options={[
                { value: 'all', label: `All Years (${executives.length})` },
                ...academicYears.map((y) => ({
                  value: y.id,
                  label: `${y.year}${y.active ? ' (Current)' : ''} (${executives.filter((ex) => ex.academicYearId === y.id).length})`,
                })),
              ]}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-white p-12 text-center">
            <p className="font-serif text-ink-900">
              {yearFilter === 'all' ? 'No executives yet.' : 'No executives for this tenure yet.'}
            </p>
            <p className="mt-2 text-sm text-ink-500">
              Executives are added by the school under Admin → Student Leadership.
            </p>
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
