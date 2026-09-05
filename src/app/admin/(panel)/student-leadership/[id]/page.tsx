import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ExecutiveList } from '@/components/admin/student-leadership/executive-list'

export const dynamic = 'force-dynamic'

export default async function AdminTenurePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [year, departments] = await Promise.all([
    prisma.academicYear.findUnique({
      where: { id },
      select: { id: true, year: true, active: true },
    }),
    prisma.department.findMany({
      orderBy: [{ ordering: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true },
    }),
  ])

  if (!year) notFound()

  const executives = await prisma.studentExecutive.findMany({
    where: { academicYearId: year.id },
    include: { department: { select: { name: true } } },
    orderBy: [{ ordering: 'asc' }, { name: 'asc' }],
  })

  return (
    <ExecutiveList
      yearId={year.id}
      yearLabel={year.year}
      isCurrent={year.active}
      departments={departments}
      executives={executives.map((e) => ({
        id: e.id,
        name: e.name,
        position: e.position,
        photoUrl: e.photoUrl,
        departmentId: e.departmentId,
        department: e.department,
        ordering: e.ordering,
      }))}
    />
  )
}
