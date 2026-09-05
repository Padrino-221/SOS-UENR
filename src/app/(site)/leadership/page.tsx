import { PageHero } from '@/components/site/page-hero'
import { prisma } from '@/lib/db'
import { StaffCard } from '@/components/site/staff-card'
import { ExecutivesSection } from '@/components/site/executives-section'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function LeadershipPage() {
  const [staff, sections, executives, academicYears] = await Promise.all([
    prisma.staff.findMany({
      where: {
        showOnPublic: true,
        OR: [
          { staffType: 'REGISTRAR' },
          { staffType: 'ADMINISTRATOR' },
          { roles: { contains: 'Dean' } },
          { roles: { contains: 'Head' } },
        ],
      },
      include: { department: true },
      orderBy: [{ ordering: 'asc' }, { name: 'asc' }],
    }),
    getSiteSections(),
    prisma.staff.findMany({
      where: { isExecutive: true },
      include: { department: true, executiveYear: true },
      orderBy: [{ ordering: 'asc' }, { name: 'asc' }],
    }),
    prisma.academicYear.findMany({ orderBy: { year: 'desc' } }),
  ])

  const { leadership } = sections

  const grouped = new Map<string, typeof staff>()
  for (const member of staff) {
    let key: string
    if (member.staffType === 'REGISTRAR' || member.staffType === 'ADMINISTRATOR') {
      key = 'Administration'
    } else if (member.roles?.includes('Dean')) {
      key = 'Dean'
    } else if (member.roles?.includes('Head')) {
      key = 'Heads of Department'
    } else {
      key = member.department?.name ?? 'Other'
    }
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(member)
  }

  const sorted = new Map<string, typeof staff>()
  const order = ['Dean', 'Heads of Department', 'Administration']
  for (const key of order) {
    if (grouped.has(key)) {
      sorted.set(key, grouped.get(key)!)
      grouped.delete(key)
    }
  }
  for (const [key, value] of grouped) {
    sorted.set(key, value)
  }

  return (
    <>
      <PageHero
        title={leadership.heroTitle}
        subtitle={leadership.heroSubtitle}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Leadership' }]}
      />

      <section className="py-16 bg-white">
        <div className="container-page">
          {staff.length === 0 ? (
            <p className="text-ink-700">Profiles are being updated. Please check back soon.</p>
          ) : (
            <div className="space-y-12">
              {[...sorted.entries()].map(([group, members]) => (
                <div key={group}>
                  <div className="mb-6">
                    <span className="kicker">{group}</span>
                    <h2 className="mt-3 text-2xl md:text-3xl font-serif text-ink-900">{group}</h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {members.map((m) => (
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ExecutivesSection executives={executives} academicYears={academicYears} />
    </>
  )
}
