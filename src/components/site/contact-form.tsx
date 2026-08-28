'use client'

import { useState } from 'react'
import { CheckCircle } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
        }),
      })
      if (!res.ok) throw new Error('error')
      setStatus('done')
      ;(e.currentTarget as HTMLFormElement).reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl bg-brand-50 p-10 text-center">
        <CheckCircle size={48} className="mx-auto text-brand-600" />
        <h3 className="mt-4 text-xl font-bold text-brand-800">Message sent</h3>
        <p className="mt-2 text-brand-700">
          Thank you for reaching out. We will get back to you shortly.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" name="name" required />
        <Input label="Email address" name="email" type="email" required />
      </div>
      <Input label="Subject" name="subject" required />
      <Textarea label="Your message" name="message" rows={5} required />
      <Button
        type="submit"
        disabled={status === 'sending'}
        className="w-full"
        size="lg"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </Button>
      {status === 'error' && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
