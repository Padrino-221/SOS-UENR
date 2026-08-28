import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { DashboardClient } from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function SpmsDashboard() {
  const session = await requireSpmsAuth()
  const isAdmin = session.role === 'ADMIN'

  const where = isAdmin ? {} : { supervisorId: session.staffId }

  const [totalProjects, publishedProjects, recentProjects, department, deptCount] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.count({ where: { ...where, published: true } }),
    prisma.project.findMany({
      where,
      include: { supervisor: { select: { name: true } }, department: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    session.departmentId
      ? prisma.department.findUnique({ where: { id: session.departmentId } })
      : null,
    isAdmin ? prisma.department.count() : Promise.resolve(0),
  ])

  return (
    <DashboardClient
      session={session}
      department={department}
      totalProjects={totalProjects}
      publishedProjects={publishedProjects}
      recentProjects={recentProjects}
      deptCount={deptCount}
      isAdmin={isAdmin}
    />
  )
}
