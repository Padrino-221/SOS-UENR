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

      <section className="section-padding bg-[#f7f7f5]">
        <div className="container-premium">
          {staff.length === 0 ? (
            <div className="border border-dashed border-ink-300 bg-white p-12 text-center">
              <p className="font-serif text-ink-900">Profiles are being updated.</p>
              <p className="mt-2 text-sm text-ink-500">Please check back soon.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {[...sorted.entries()].map(([group, members]) => (
                <div key={group}>
                  <div className="mb-6 flex items-center gap-4">
                    <h2 className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-ink-900">{group}</h2>
                    <span aria-hidden className="h-[2px] w-8 bg-gold-400" />
                    <span aria-hidden className="h-px flex-1 bg-[#e5e5e0]" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
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
