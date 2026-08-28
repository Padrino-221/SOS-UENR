'use client'

import { SubmitButton as UISubmitButton } from '@/components/ui/submit-button'

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  return (
    <UISubmitButton variant="primary" size="lg">
      {label}
    </UISubmitButton>
  )
}
