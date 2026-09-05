'use client'

import { upsertExecutive } from '@/actions/student-leadership'
import { Field, SelectField as Select } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'
import { ImageUpload } from '@/components/ui'

type DepartmentOption = { id: string; name: string }

type ExecutiveInput = {
  id?: string
  name: string
  position: string
  photoUrl?: string | null
  departmentId?: string | null
  ordering?: number
}

export function ExecutiveForm({
  academicYearId,
  departments,
  executive,
}: {
  academicYearId: string
  departments: DepartmentOption[]
  executive?: ExecutiveInput | null
}) {
  return (
    <form action={upsertExecutive} className="grid gap-4">
      {executive?.id && <input type="hidden" name="id" value={executive.id} />}
      <input type="hidden" name="academicYearId" value={academicYearId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" defaultValue={executive?.name} required />
        <Field
          label="Position"
          name="position"
          defaultValue={executive?.position}
          placeholder="e.g. President, Secretary"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Department"
          name="departmentId"
          defaultValue={executive?.departmentId ?? ''}
          options={[
            { value: '', label: 'No department' },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
          hint="The department this executive represents"
        />
        <Field
          label="Ordering"
          name="ordering"
          type="number"
          defaultValue={
            executive?.ordering != null ? String(executive.ordering) : '0'
          }
        />
      </div>

      <ImageUpload
        name="photoUrl"
        label="Photo"
        defaultValue={executive?.photoUrl}
        hint="Upload a portrait photo"
      />

      <div>
        <SubmitButton label={executive?.id ? 'Update executive' : 'Add executive'} />
      </div>
    </form>
  )
}
