import { prisma } from '@/lib/db'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui'
import { YearProjectsList } from './year-projects-list'

export const dynamic = 'force-dynamic'

export default async function SpmsYearRecordsPage({
  params,
}: {
  params: Promise<{ yearId: string }>
}) {
  const { yearId } = await params
  const session = await requireSpmsAuth()
  const isAdmin = session.role === 'ADMIN'

  const year = await prisma.academicYear.findUnique({
    where: { id: yearId },
    select: { id: true, year: true },
  })

  if (!year) notFound()

  const projects = await prisma.project.findMany({
    where: {
      academicYearId: yearId,
      ...(isAdmin ? {} : { supervisorId: session.staffId }),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      studentName: true,
      programme: true,
      degreeLevel: true,
      published: true,
      createdAt: true,
      documentUrl: true,
      githubLink: true,
      supervisor: { select: { id: true, name: true } },
      department: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Projects — ${year.year}`}
        description={`${projects.length} project${projects.length !== 1 ? 's' : ''} in this academic year`}
      />
      <YearProjectsList projects={projects} />
    </div>
  )
}
