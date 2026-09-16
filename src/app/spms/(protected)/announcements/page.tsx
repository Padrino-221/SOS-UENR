import { prisma } from '@/lib/db'
import { requireSpmsAdmin } from '@/lib/spms-auth'
import { AnnouncementsClient } from './announcements-client'

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage() {
  await requireSpmsAdmin()

  const [announcements, recipientCount] = await Promise.all([
    prisma.spmsAnnouncement.findMany({
      include: { sender: { select: { name: true } } },
      orderBy: { sentAt: 'desc' },
      take: 20,
    }),
    prisma.staff.count({ where: { spmsAccess: true, email: { not: null } } }),
  ])

  return <AnnouncementsClient announcements={announcements} recipientCount={recipientCount} />
}
