'use client'

import { createTenure } from '@/actions/student-leadership'
import { Field } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'

export function TenureForm() {
  return (
    <form action={createTenure} className="grid gap-4">
      <Field
        label="Academic year"
        name="year"
        placeholder="e.g. 2025/2026"
        required
        hint="The tenure label — executives added under it are tied to this academic year."
      />
      <div>
        <SubmitButton label="Create tenure" />
      </div>
    </form>
  )
}
