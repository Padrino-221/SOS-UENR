'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui'

export function useToastOnMount() {
  const { toast } = useToast()
  const params = useSearchParams()
  const message = params.get('toast')

  useEffect(() => {
    if (message) {
      toast('success', message)
      const url = new URL(window.location.href)
      url.searchParams.delete('toast')
      window.history.replaceState({}, '', url.toString())
    }
  }, [message, toast])
}
