import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { ProfilePageClient } from '@/components/admin/profile-page-client'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, role: true, createdAt: true },
  })

  if (!user) redirect('/admin/login')

  return (
    <ProfilePageClient
      user={{
        ...user,
        createdAt: formatDate(user.createdAt),
      }}
    />
  )
}
