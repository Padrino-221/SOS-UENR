import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/ui'
import { MessageList } from '@/components/admin/message-list'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Messages submitted through the contact form."
      />
      <MessageList messages={messages} />
    </div>
  )
}
