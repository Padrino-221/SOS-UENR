'use client'

import { deleteContactMessage } from '@/actions/content'
import { useActionToast } from '@/hooks/use-action-toast'
import { formatDate } from '@/lib/utils'
import { Card, EmptyState } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { ToastListener } from '@/components/admin/toast-listener'
import { Envelope } from '@phosphor-icons/react'

interface Message {
  id: string
  subject: string
  name: string
  email: string
  message: string
  createdAt: Date
}

export function MessageList({ messages }: { messages: Message[] }) {
  const { runAction, pending } = useActionToast()

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => deleteContactMessage(fd), {
      success: 'Message deleted.',
      error: 'Failed to delete message.',
    })
  }

  return (
    <div className="space-y-6">
      <ToastListener />
      {messages.length === 0 ? (
        <EmptyState
          icon={<Envelope size={28} />}
          title="No messages yet"
          description="Messages from the contact form will appear here."
        />
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-ink-900">{m.subject}</h3>
                  <p className="text-sm text-ink-500">
                    {m.name} · {m.email} · {formatDate(m.createdAt)}
                  </p>
                </div>
                <DeleteButton onClick={() => handleDelete(m.id)} disabled={pending} />
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-ink-700">
                {m.message}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
