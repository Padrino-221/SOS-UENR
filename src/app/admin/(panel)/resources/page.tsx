import { prisma } from '@/lib/db'
import { ResourceList } from '@/components/admin/resource-list'

export const dynamic = 'force-dynamic'

export default async function AdminResourcesPage() {
  const [resources, academicYears] = await Promise.all([
    prisma.resource.findMany({
      include: { academicYear: { select: { year: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.academicYear.findMany({ orderBy: { year: 'desc' } }),
  ])

  const rows = resources.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    fileUrl: r.fileUrl,
    fileName: r.fileName,
    category: r.category,
    academicYearId: r.academicYearId,
    academicYear: r.academicYear,
    createdAt: r.createdAt,
  }))

  return <ResourceList resources={rows} academicYears={academicYears} />
}
