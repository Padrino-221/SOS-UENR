'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { useToast } from '@/components/ui'

export function useActionToast() {
  const { toast } = useToast()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const runAction = useCallback(
    async (
      action: () => Promise<void>,
      messages: { success: string; error?: string },
    ) => {
      startTransition(async () => {
        try {
          await action()
          toast('success', messages.success)
          router.refresh()
        } catch (err) {
          const msg = err instanceof Error ? err.message : messages.error ?? 'Something went wrong.'
          toast('error', msg)
        }
      })
    },
    [toast, router],
  )

  return { runAction, pending }
}
