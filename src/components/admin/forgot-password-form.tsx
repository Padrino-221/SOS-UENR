'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'

const initialState = { error: '', success: false }

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState)

  if (state.success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-4 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle size={28} className="text-green-600" />
          </span>
        </div>
        <h2 className="text-xl font-bold text-ink-900">Check your email</h2>
        <p className="mt-2 text-sm text-ink-500">
          If an account exists with that email, we&apos;ve sent password reset instructions.
        </p>
        <Link
          href="/admin/login"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="w-full max-w-sm space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Forgot password?</h1>
        <p className="mt-1 text-sm text-ink-500">
          No worries, we&apos;ll send you reset instructions.
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
        {pending ? 'Sending…' : 'Reset password'}
      </Button>

      <p className="text-center text-sm text-ink-500">
        <Link href="/admin/login" className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </p>
    </form>
  )
}
