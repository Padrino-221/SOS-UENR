'use client'

import { useState, useTransition } from 'react'
import { Megaphone, PaperPlaneTilt } from '@phosphor-icons/react'
import { PageHeader, Button, Input, Textarea, Badge } from '@/components/ui'
import { useToast } from '@/components/ui'
import { sendSpmsAnnouncement } from '../actions'
import { formatDate } from '@/lib/utils'

interface Announcement {
  id: string
  subject: string
  body: string
  recipientCount: number
  sentAt: Date
  sender: { name: string } | null
}

export function AnnouncementsClient({
  announcements,
  recipientCount,
}: {
  announcements: Announcement[]
  recipientCount: number
}) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await sendSpmsAnnouncement(null, formData)
      if (result?.error) {
        toast('error', result.error)
      } else if (result?.success) {
        toast('success', `Announcement sent to ${result.sent} of ${result.total} staff members.`)
        setSubject('')
        setBody('')
      }
    })
  }

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Send a one-way email broadcast to all staff with SPMS access."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Compose */}
        <div className="border border-ink-100 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Megaphone size={20} weight="duotone" className="text-brand-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-700">Compose Announcement</h2>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <Input
              label="Subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="e.g. Deadline Extension Notice"
            />
            <Textarea
              label="Message"
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={6}
              placeholder="Write your announcement message here..."
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-500">
                Will be sent to <strong>{recipientCount}</strong> staff member{recipientCount !== 1 ? 's' : ''}
              </p>
              <Button type="submit" disabled={pending || !subject.trim() || !body.trim()}>
                <PaperPlaneTilt size={16} weight="duotone" className="mr-1.5" />
                {pending ? 'Sending...' : 'Send Announcement'}
              </Button>
            </div>
          </form>
        </div>

        {/* History */}
        <div className="border border-ink-100 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-700 mb-5">Recent Announcements</h2>

          {announcements.length === 0 ? (
            <p className="text-sm text-ink-400 py-8 text-center">No announcements sent yet.</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {announcements.map((a) => (
                <div key={a.id} className="border border-ink-100 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-ink-900">{a.subject}</h3>
                    <Badge variant="info">{a.recipientCount} sent</Badge>
                  </div>
                  <p className="text-xs text-ink-500 mb-2">
                    By {a.sender?.name ?? 'Unknown'} &middot; {formatDate(a.sentAt)}
                  </p>
                  <p className="text-sm text-ink-600 line-clamp-3">{a.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
