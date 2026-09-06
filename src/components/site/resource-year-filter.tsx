'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SelectDropdown, type SelectOption } from '@/components/ui/select-dropdown'

export function ResourceYearFilter({
  years,
  currentYear,
}: {
  years: { id: string; label: string }[]
  currentYear: string | null
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const options: SelectOption[] = [
    { value: '', label: 'All years' },
    ...years.map((y) => ({ value: y.label, label: y.label })),
  ]

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val) params.set('year', val)
    else params.delete('year')
    const qs = params.toString()
    router.push(qs ? `/resources?${qs}` : '/resources')
  }

  return (
    <div className="w-full sm:w-56">
      <SelectDropdown
        options={options}
        value={currentYear ?? ''}
        onChange={handleChange}
        placeholder="All years"
        className="rounded-[10px]"
      />
    </div>
  )
}