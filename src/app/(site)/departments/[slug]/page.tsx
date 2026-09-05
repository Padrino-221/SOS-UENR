import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GraduationCap, Users } from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getDepartment } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function DepartmentPage({
  params,
}: PageProps<'/departments/[slug]'>) {
  const { slug } = await params
  const dept = await getDepartment(slug)

  if (!dept) notFound()

  return (
    <>
      <PageHero
        title={dept.name}
        subtitle={dept.summary}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: dept.name },
        ]}
      />

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="kicker">Department</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-serif text-ink-900">About the department</h2>
              <div className="mt-4 whitespace-pre-line leading-relaxed text-ink-600">
                {dept.description || dept.summary}
              </div>

              {dept.programmes.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-serif text-ink-900">Programmes</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {dept.programmes.map((p) => (
                      <Link
                        key={p.id}
                        href={`/programmes/${p.slug}`}
                        className="group flex items-center gap-3 card-premium p-4"
                      >
                        <span className="h-10 w-10 grid place-items-center rounded-lg bg-brand-50 text-brand-700 shrink-0">
                          <GraduationCap size={18} weight="duotone" />
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm group-hover:text-brand-700 truncate">{p.name}</h4>
                          <p className="text-xs text-ink-500">{p.level.toLowerCase()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {dept.staff.length > 0 && (
              <aside className="lg:col-span-4">
                <div className="sticky top-24 card-premium p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <Users size={20} weight="duotone" className="text-brand-700" />
                    <h3 className="font-serif text-ink-900">Department Staff</h3>
                  </div>
                  <div className="space-y-3">
                    {dept.staff.map((s) => (
                      <Link key={s.id} href={`/staff/${s.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-ink-50 transition">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                          {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                        <div>
                          <h4 className="font-semibold text-sm text-ink-900">{s.name}</h4>
                          <p className="text-xs text-ink-500">{[s.roles, s.staffType !== 'REGISTRAR' && s.staffType !== 'ADMINISTRATOR' ? s.staffType.charAt(0) + s.staffType.slice(1).toLowerCase() : null].filter(Boolean).join(' · ')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
