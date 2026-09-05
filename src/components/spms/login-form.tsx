'use client'

import { useActionState, useState } from 'react'
import { spmsLogin } from '@/app/spms/(protected)/actions'
import { Envelope, LockKey, Eye, EyeSlash } from '@phosphor-icons/react'

const initialState = { error: '' }

export function SpmsLoginForm() {
  const [state, formAction, pending] = useActionState(spmsLogin, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-ink-900 mb-1.5">Email address</label>
        <div className="relative">
          <Envelope size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" weight="duotone" />
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-ink-200 rounded-[5px] focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 placeholder:text-ink-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-ink-900 mb-1.5">
          Password
        </label>
        <div className="relative">
          <LockKey size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" weight="duotone" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full pl-10 pr-11 py-2.5 text-sm bg-white border border-ink-200 rounded-[5px] focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 placeholder:text-ink-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-ink-400 hover:text-ink-700 transition-colors"
          >
            {showPassword ? <EyeSlash size={16} weight="duotone" /> : <Eye size={16} weight="duotone" />}
          </button>
        </div>
      </div>

      {state.error && (
        <div className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wide bg-brand-900 text-white rounded-[5px] hover:bg-brand-800 disabled:opacity-50 transition"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
