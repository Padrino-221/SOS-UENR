'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DepartmentFilterProps {
  departments: { id: string; name: string }[]
  active: string
}

export function DepartmentFilter({ departments, active }: DepartmentFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href="/staff"
        className={cn(
          'rounded-full px-4 py-2 text-sm font-medium transition',
          !active
            ? 'bg-brand-700 text-white'
            : 'border border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-700',
        )}
      >
        All
      </Link>
      {departments.map((dept) => (
        <Link
          key={dept.id}
          href={`/staff?department=${dept.id}`}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition',
            active === dept.id
              ? 'bg-brand-700 text-white'
              : 'border border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-700',
          )}
        >
          {dept.name}
        </Link>
      ))}
    </div>
  )
}
