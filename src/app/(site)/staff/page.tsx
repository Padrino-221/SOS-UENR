import { PageHero } from '@/components/site/page-hero'
import { prisma } from '@/lib/db'
import { StaffCard } from '@/components/site/staff-card'
import { DepartmentFilter } from '@/components/site/department-filter'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>
}) {
  const { department } = await searchParams

  const [allStaff, departments, sections] = await Promise.all([
    prisma.staff.findMany({
      where: {
        showOnPublic: true,
        staffType: 'LECTURER',
        ...(department ? { departmentId: department } : {}),
      },
      include: { department: true },
      orderBy: [{ ordering: 'asc' }, { name: 'asc' }],
    }),
    prisma.department.findMany({
      orderBy: { ordering: 'asc' },
      select: { id: true, name: true },
    }),
    getSiteSections(),
  ])

  const { staff: staffContent } = sections

  return (
    <>
      <PageHero
        title={staffContent.heroTitle}
        subtitle={staffContent.heroSubtitle}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Staff' }]}
      />

      <section className="py-16 bg-white">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="kicker justify-center">Our People</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-ink-900">Academic Staff</h2>
            <p className="mt-3 text-ink-600 leading-relaxed">Meet the dedicated lecturers driving teaching and research across the School of Sciences.</p>
          </div>

          <DepartmentFilter departments={departments} active={department ?? ''} />

          {allStaff.length === 0 ? (
            <p className="text-ink-700 text-center py-12">No staff found for this department. Please check back soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {allStaff.map((m) => (
                <StaffCard
                  key={m.id}
                  id={m.id}
                  name={m.name}
                  title={m.title}
                  email={m.email}
                  phone={m.phone}
                  roles={m.roles}
                  photoUrl={m.photoUrl}
                  department={m.department}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
