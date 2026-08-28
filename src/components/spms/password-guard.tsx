'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function PasswordGuard({
  spmsPasswordChanged,
  children,
}: {
  spmsPasswordChanged: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const isChangePasswordPage = pathname === '/spms/change-password'

  useEffect(() => {
    if (!spmsPasswordChanged && !isChangePasswordPage) {
      router.replace('/spms/change-password')
    }
  }, [spmsPasswordChanged, isChangePasswordPage, router])

  // Don't render content until password is set (except on change-password page)
  if (!spmsPasswordChanged && !isChangePasswordPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="text-sm text-ink-500">Redirecting…</div>
      </div>
    )
  }

  return <>{children}</>
}
