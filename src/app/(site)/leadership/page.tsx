import { PageHero } from '@/components/site/page-hero'
import { prisma } from '@/lib/db'
import { StaffCard } from '@/components/site/staff-card'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function LeadershipPage() {
  const [staff, sections] = await Promise.all([
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
  ])

  const { leadership } = sections

  const grouped = new Map<string, typeof staff>()
  for (const member of staff) {
    let key: string
    if (member.staffType === 'REGISTRAR') {
      key = 'Administration'
    } else if (member.staffType === 'ADMINISTRATOR') {
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

  // Ensure order: Deans, HODs, Administration
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

      <section className="py-16">
        <div className="container-page">
          {staff.length === 0 ? (
            <p className="text-ink-700">
              Profiles are being updated. Please check back soon.
            </p>
          ) : (
            <div className="space-y-14">
              {[...sorted.entries()].map(([group, members]) => (
                <div key={group}>
                  <h2 className="mb-6 text-xl font-bold">{group}</h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  )
}
