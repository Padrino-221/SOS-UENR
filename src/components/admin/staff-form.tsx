'use client'

import { Field, Toggle, SelectField as Select } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'
import { ImageUpload } from '@/components/ui'
import { upsertStaff } from '@/actions/content'
import type { Staff } from '@prisma/client'

type DepartmentOption = { id: string; name: string }

export function StaffForm({
  staff,
  departments,
}: {
  staff?: Staff | null
  departments: DepartmentOption[]
}) {
  return (
    <form
      action={upsertStaff}
      className="grid max-w-3xl gap-6 rounded-lg border border-ink-100 bg-white p-6"
    >
      {staff && <input type="hidden" name="id" value={staff.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" defaultValue={staff?.name} required />
        <Field
          label="Title / Designation"
          name="title"
          defaultValue={staff?.title}
          placeholder="e.g. Professor"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Roles" name="roles" defaultValue={staff?.roles} placeholder="e.g. Dean, Head of Department" />
        <Select
          label="Staff Type"
          name="staffType"
          defaultValue={staff?.staffType ?? 'LECTURER'}
          options={[
            { value: 'LECTURER', label: 'Lecturer' },
            { value: 'REGISTRAR', label: 'Registrar' },
            { value: 'ADMINISTRATOR', label: 'Administrator' },
          ]}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ordering" name="ordering" type="number" defaultValue={staff?.ordering != null ? String(staff.ordering) : '0'} />
        <Field label="Email" name="email" type="email" defaultValue={staff?.email} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" defaultValue={staff?.phone} />
        <Select
          label="Department"
          name="departmentId"
          defaultValue={staff?.departmentId ?? ''}
          options={[
            { value: '', label: 'No department' },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
      </div>

      <Field
        label="Short bio"
        name="bio"
        defaultValue={staff?.bio}
        textarea
        rows={4}
      />

      <ImageUpload
        name="photoUrl"
        label="Photo"
        defaultValue={staff?.photoUrl}
        hint="Upload a staff photo"
      />

      <Toggle
        label="Show on public site"
        name="showOnPublic"
        defaultChecked={staff ? staff.showOnPublic : true}
      />

      <Toggle
        label="SPMS Access"
        name="spmsAccess"
        defaultChecked={staff?.spmsAccess ?? false}
        hint="Allow this staff member to log in to the Student Project Management System"
      />

      <div>
        <SubmitButton label={staff ? 'Update staff' : 'Create staff'} />
      </div>
    </form>
  )
}
