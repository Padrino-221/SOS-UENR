'use client'

import { useActionState } from 'react'
import { createUser } from '@/actions/content'
import { Field, SelectField as Select } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'

const initialState = { error: '', success: false }

export function CreateUserForm() {
  const [state, formAction] = useActionState(createUser, initialState)

  return (
    <form
      action={formAction}
      className="max-w-xl space-y-4 rounded-2xl border border-ink-100 bg-white p-6"
    >
      <h3 className="font-bold">Create a user</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Password"
          name="password"
          type="password"
          required
          hint="At least 8 characters."
        />
        <Select
          label="Role"
          name="role"
          defaultValue="EDITOR"
          options={[
            { value: 'EDITOR', label: 'Editor' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          User created successfully.
        </p>
      )}

      <SubmitButton label="Create user" />
    </form>
  )
}
