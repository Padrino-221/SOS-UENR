import { prisma } from '@/lib/db'
import { TenureList } from '@/components/admin/student-leadership/tenure-list'

export const dynamic = 'force-dynamic'

export default async function AdminStudentLeadershipPage() {
  const years = await prisma.academicYear.findMany({
    orderBy: { year: 'desc' },
    include: { _count: { select: { studentExecutives: true } } },
  })

  const tenures = years.map((y) => ({
    id: y.id,
    year: y.year,
    active: y.active,
    executiveCount: y._count.studentExecutives,
  }))

  return <TenureList tenures={tenures} />
}
