import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { ProjectForm } from '../project-form'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
  const session = await requireSpmsAuth()
  const isAdmin = session.role === 'ADMIN'

  const [departments, academicYears, staff, programmes] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: 'asc' } }),
    prisma.academicYear.findMany({ orderBy: { year: 'desc' } }),
    prisma.staff.findMany({
      where: { staffType: 'LECTURER' },
      select: { id: true, name: true, departmentId: true },
      orderBy: { name: 'asc' },
    }),
    prisma.programme.findMany({
      where: {
        published: true,
        ...(isAdmin ? {} : { departmentId: session.departmentId }),
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <ProjectForm
      departments={departments}
      academicYears={academicYears}
      staff={staff}
      programmes={programmes}
      isAdmin={isAdmin}
      currentUserId={session.staffId}
    />
  )
}
