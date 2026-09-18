'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface DepartmentFilterProps {
  departments: { id: string; name: string }[]
  active: string
}

export function DepartmentFilter({ departments, active }: DepartmentFilterProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = useCallback(() => {
    const el = rowRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    const el = rowRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [departments, update])

  const scroll = (dir: number) =>
    rowRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' })

  const tabClass = (isActive: boolean) =>
    cn(
      'shrink-0 border px-4 py-2 text-[0.8rem] font-bold transition-colors duration-150',
      isActive
        ? 'border-brand-700 bg-brand-700 text-white'
        : 'border-[#e5e5e0] bg-white text-ink-600 hover:border-brand-700 hover:text-brand-700',
    )

  return (
    <div className="mb-8 flex items-center gap-3">
      {/* Left arrow — flanks the row, reserved slot keeps layout stable */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Show previous departments"
        tabIndex={canLeft ? 0 : -1}
        className={cn(
          'hidden h-8 w-8 shrink-0 place-items-center border text-ink-700 transition-colors hover:border-brand-700 hover:text-brand-700 lg:grid',
          canLeft ? 'visible border-[#e5e5e0] bg-white' : 'invisible border-transparent bg-transparent',
        )}
      >
        <CaretLeft size={14} weight="bold" />
      </button>

      <div ref={rowRef} className="ck-tabs flex min-w-0 flex-1 gap-2">
        <Link href="/staff" className={tabClass(!active)}>
          All
        </Link>
        {departments.map((dept) => (
          <Link key={dept.id} href={`/staff?department=${dept.id}`} className={tabClass(active === dept.id)}>
            {dept.name}
          </Link>
        ))}
      </div>

      {/* Right arrow — flanks the row on the other side */}
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Show more departments"
        tabIndex={canRight ? 0 : -1}
        className={cn(
          'hidden h-8 w-8 shrink-0 place-items-center border text-ink-700 transition-colors hover:border-brand-700 hover:text-brand-700 lg:grid',
          canRight ? 'visible border-[#e5e5e0] bg-white' : 'invisible border-transparent bg-transparent',
        )}
      >
        <CaretRight size={14} weight="bold" />
      </button>
    </div>
  )
}
