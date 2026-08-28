'use client'

import { useActionState } from 'react'
import { changeSpmsPassword } from '@/app/spms/(protected)/actions'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'

const initialState = { error: '' }

export function ChangePasswordForm({ staffName }: { staffName: string }) {
  const [state, formAction, pending] = useActionState(changeSpmsPassword, initialState)

  return (
    <div className="text-center">
      <h1 className="text-xl font-extrabold text-ink-900">Welcome, {staffName}</h1>
      <p className="mt-1 text-sm text-ink-500">
        Before you can continue, please set your password.
      </p>

      <form action={formAction} className="mt-6 space-y-4 text-left">
        <PasswordInput
          label="New Password"
          name="newPassword"
          placeholder="Enter a new password"
          required
          autoComplete="new-password"
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
        />

        {state.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {state.error}
          </div>
        )}

        <Button type="submit" disabled={pending} className="w-full" size="lg">
          {pending ? 'Setting password…' : 'Set Password'}
        </Button>
      </form>
    </div>
  )
}
