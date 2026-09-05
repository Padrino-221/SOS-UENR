'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui'

export function useToastOnMount() {
  const { toast } = useToast()
  const params = useSearchParams()
  const message = params.get('toast')
  const firedRef = useRef(false)

  useEffect(() => {
    // Guard against React StrictMode double-invoking effects in dev,
    // which would otherwise show the same toast twice.
    if (!message || firedRef.current) return
    firedRef.current = true

    toast('success', message)
    const url = new URL(window.location.href)
    url.searchParams.delete('toast')
    window.history.replaceState({}, '', url.toString())
  }, [message, toast])
}
