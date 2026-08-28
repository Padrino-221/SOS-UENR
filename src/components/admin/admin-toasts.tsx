'use client'

import { ToastProvider } from '@/components/ui'

export function AdminToasts({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
