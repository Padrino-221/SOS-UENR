import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { ProfilePageClient } from './profile-page-client'

export const dynamic = 'force-dynamic'

export default async function SpmsProfilePage() {
  const session = await requireSpmsAuth()

  const staff = await prisma.staff.findUnique({
    where: { id: session.staffId },
    select: {
      id: true,
      name: true,
      title: true,
      email: true,
      phone: true,
      bio: true,
      researchAreas: true,
      staffType: true,
      photoUrl: true,
      department: { select: { name: true } },
    },
  })

  if (!staff) notFound()

  return <ProfilePageClient staff={staff} />
}
