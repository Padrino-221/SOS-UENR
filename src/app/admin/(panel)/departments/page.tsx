import { prisma } from '@/lib/db'
import { DepartmentList } from '@/components/admin/department-list'

export const dynamic = 'force-dynamic'

export default async function AdminDepartmentsPage() {
  const raw = await prisma.department.findMany({
    include: { _count: { select: { programmes: true } } },
    orderBy: { ordering: 'asc' },
  })

  const departments = raw.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    shortName: d.shortName,
    summary: d.summary,
    description: d.description,
    ordering: d.ordering,
    _count: d._count,
  }))

  return <DepartmentList departments={departments} />
}
