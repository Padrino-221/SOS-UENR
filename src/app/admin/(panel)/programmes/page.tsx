import { prisma } from '@/lib/db'
import { ProgrammeList } from '@/components/admin/programme-list'

export const dynamic = 'force-dynamic'

export default async function AdminProgrammesPage() {
  const [raw, departments] = await Promise.all([
    prisma.programme.findMany({
      include: { department: true },
      orderBy: [{ level: 'asc' }, { ordering: 'asc' }],
    }),
    prisma.department.findMany({
      orderBy: { ordering: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  const programmes = raw.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    level: p.level,
    mode: p.mode,
    duration: p.duration,
    summary: p.summary,
    overview: p.overview,
    requirements: p.requirements,
    careerPaths: p.careerPaths,
    published: p.published,
    ordering: p.ordering,
    departmentId: p.departmentId,
    department: p.department,
  }))

  return <ProgrammeList programmes={programmes} departments={departments} />
}
