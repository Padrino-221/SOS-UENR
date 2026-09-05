import { PageHero } from '@/components/site/page-hero'
import { prisma } from '@/lib/db'
import { ExecutivesSection } from '@/components/site/executives-section'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function StudentLeadershipPage() {
  const [sections, years] = await Promise.all([
    getSiteSections(),
    prisma.academicYear.findMany({
      orderBy: { year: 'desc' },
      include: {
        studentExecutives: {
          include: { department: { select: { name: true } } },
          orderBy: [{ ordering: 'asc' }, { name: 'asc' }],
        },
      },
    }),
  ])

  const executives = years.flatMap((y) =>
    y.studentExecutives.map((e) => ({
      id: e.id,
      name: e.name,
      position: e.position,
      photoUrl: e.photoUrl,
      ordering: e.ordering,
      academicYearId: e.academicYearId,
      academicYear: { id: y.id, year: y.year },
      department: e.department ? { name: e.department.name } : null,
    })),
  )

  const activeYearId = years.find((y) => y.active)?.id ?? null
  const { studentLeadership } = sections

  return (
    <>
      <PageHero
        title={studentLeadership.heroTitle}
        subtitle={studentLeadership.heroSubtitle}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Student Leadership' }]}
      />

      <ExecutivesSection
        executives={executives}
        academicYears={years.map((y) => ({ id: y.id, year: y.year, active: y.active }))}
        defaultYearId={activeYearId}
      />
    </>
  )
}
