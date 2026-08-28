'use client'

import { Field } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'
import { upsertDepartment } from '@/actions/content'
import type { Department } from '@prisma/client'

export function DepartmentForm({ department }: { department?: Department | null }) {
  return (
    <form
      action={upsertDepartment}
      className="grid max-w-3xl gap-6 rounded-2xl border border-ink-100 bg-white p-6"
    >
      {department && <input type="hidden" name="id" value={department.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Department name"
          name="name"
          defaultValue={department?.name}
          required
        />
        <Field
          label="Slug (URL)"
          name="slug"
          defaultValue={department?.slug}
          hint="Leave blank to auto-generate."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Short name"
          name="shortName"
          defaultValue={department?.shortName}
          hint="e.g. Chem. Sciences"
        />
        <Field
          label="Ordering"
          name="ordering"
          type="number"
          defaultValue={department?.ordering != null ? String(department.ordering) : '0'}
        />
      </div>

      <Field
        label="Summary"
        name="summary"
        defaultValue={department?.summary}
        textarea
        rows={3}
        required
        hint="A short description shown on cards."
      />
      <Field
        label="Full description"
        name="description"
        defaultValue={department?.description}
        textarea
        rows={8}
      />

      <div>
        <SubmitButton label={department ? 'Update department' : 'Create department'} />
      </div>
    </form>
  )
}
