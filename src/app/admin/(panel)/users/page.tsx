import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { CreateUserForm } from '@/components/admin/create-user-form'
import { UserTable } from '@/components/admin/user-table'
import { PageHeader } from '@/components/ui'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const session = await getSession()
  if (session?.role !== 'ADMIN') notFound()

  const raw = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })

  const users = raw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    isCurrent: u.id === session!.id,
  }))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="Manage admin and editor accounts. Only admins can access this page."
      />

      <CreateUserForm />

      <UserTable users={users} />
    </div>
  )
}
