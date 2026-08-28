import { prisma } from '@/lib/db'
import { requireSpmsAdmin } from '@/lib/spms-auth'
import { SettingsPageClient } from './settings-page-client'

export const dynamic = 'force-dynamic'

export default async function SpmsSettingsPage() {
  await requireSpmsAdmin()

  const years = await prisma.academicYear.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { year: 'desc' },
  })

  return <SettingsPageClient years={years} />
}
