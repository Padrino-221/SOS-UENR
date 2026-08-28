'use client'

import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from './button'
import { cn } from '@/lib/utils'

export function SubmitButton({
  children,
  className,
  ...props
}: Omit<ButtonProps, 'type' | 'disabled'> & { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(className)}
      {...props}
    >
      {pending ? 'Saving…' : children}
    </Button>
  )
}
