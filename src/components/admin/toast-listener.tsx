'use client'

import { Suspense } from 'react'
import { useToastOnMount } from '@/hooks/use-toast-on-mount'

function ToastEffect() {
  useToastOnMount()
  return null
}

export function ToastListener() {
  return (
    <Suspense>
      <ToastEffect />
    </Suspense>
  )
}
