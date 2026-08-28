'use client'

import { useActionState } from 'react'
import { spmsLogin } from '@/app/spms/(protected)/actions'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'

const initialState = { error: '' }

export function SpmsLoginForm() {
  const [state, formAction, pending] = useActionState(spmsLogin, initialState)

  return (
    <form action={formAction} className="w-full max-w-sm space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Log in to SPMS</h1>
        <p className="mt-1 text-sm text-ink-500">
          Welcome back! Please enter your details.
        </p>
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        required
        autoComplete="email"
      />

      <div>
        <label htmlFor="password" className="text-xs font-semibold text-ink-700">
          Password
        </label>
        <PasswordInput
          name="password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          className="mt-1"
        />
      </div>

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full"
        size="lg"
      >
        {pending ? 'Signing in…' : 'Login'}
      </Button>
    </form>
  )
}
