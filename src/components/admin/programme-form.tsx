'use client'

import { Field, Toggle, SelectField as Select } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'
import { upsertProgramme } from '@/actions/content'
import type { Programme } from '@prisma/client'

type DepartmentOption = { id: string; name: string }

export function ProgrammeForm({
  programme,
  departments,
}: {
  programme?: Programme | null
  departments: DepartmentOption[]
}) {
  return (
    <form
      action={upsertProgramme}
      className="grid max-w-3xl gap-6 rounded-lg border border-ink-100 bg-white p-6"
    >
      {programme && <input type="hidden" name="id" value={programme.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            label="Programme name"
            name="name"
            defaultValue={programme?.name}
            required
            placeholder="e.g. BSc. Computer Science"
          />
        </div>
        <Field
          label="Slug (URL)"
          name="slug"
          defaultValue={programme?.slug}
          hint="Leave blank to auto-generate from the name."
        />
        <Field label="Code" name="code" defaultValue={programme?.code} placeholder="e.g. CS" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Level"
          name="level"
          defaultValue={programme?.level ?? 'DEGREE'}
          options={[
            { value: 'DEGREE', label: 'Degree' },
            { value: 'DIPLOMA', label: 'Diploma' },
            { value: 'POSTGRADUATE', label: 'Postgraduate' },
          ]}
        />
        <Field label="Duration" name="duration" defaultValue={programme?.duration} placeholder="e.g. 4 Years" />
        <Field label="Mode" name="mode" defaultValue={programme?.mode} placeholder="e.g. Regular / Weekend" />
      </div>

      <Select
        label="Department"
        name="departmentId"
        defaultValue={programme?.departmentId ?? ''}
        options={[
          { value: '', label: 'No department' },
          ...departments.map((d) => ({ value: d.id, label: d.name })),
        ]}
      />

      <Field
        label="Short summary"
        name="summary"
        defaultValue={programme?.summary}
        textarea
        rows={3}
        required
      />
      <Field
        label="Overview"
        name="overview"
        defaultValue={programme?.overview}
        textarea
        rows={6}
        hint="Full programme description."
      />
      <Field
        label="Entry requirements"
        name="requirements"
        defaultValue={programme?.requirements}
        textarea
        rows={5}
        hint="One requirement per line."
      />
      <Field
        label="Career paths"
        name="careerPaths"
        defaultValue={programme?.careerPaths}
        textarea
        rows={4}
        hint="One career option per line."
      />

      <div className="flex flex-wrap gap-6">
        <Toggle
          label="Published"
          name="published"
          defaultChecked={programme ? programme.published : true}
        />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton label={programme ? 'Update programme' : 'Create programme'} />
      </div>
    </form>
  )
}
