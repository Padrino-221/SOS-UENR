import { prisma } from '@/lib/db'
import { requireSpmsAdmin } from '@/lib/spms-auth'
import { DemoProjectForm } from '@/components/spms/demo-project-form'

export const dynamic = 'force-dynamic'

export default async function SpmsDemoFlowPage() {
  const session = await requireSpmsAdmin()

  const [departments, academicYears, staff, programmes] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: 'asc' } }),
    prisma.academicYear.findMany({ orderBy: { year: 'desc' } }),
    prisma.staff.findMany({
      where: { staffType: 'LECTURER' },
      select: { id: true, name: true, departmentId: true },
      orderBy: { name: 'asc' },
    }),
    prisma.programme.findMany({
      where: { published: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <DemoProjectForm
      departments={departments}
      academicYears={academicYears}
      staff={staff}
      programmes={programmes}
      currentUserId={session.staffId}
    />
  )
}