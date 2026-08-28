import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GraduationCap, Users } from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getDepartment } from '@/lib/data'

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

      <section className="py-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold">About the department</h2>
              <div className="mt-4 whitespace-pre-line leading-relaxed text-ink-700">
                {dept.description || dept.summary}
              </div>

              {dept.programmes.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold">Programmes</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {dept.programmes.map((p) => (
                      <Link
                        key={p.id}
                        href={`/programmes/${p.slug}`}
                        className="group flex items-center gap-3 rounded-xl border border-ink-100 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
                      >
                        <GraduationCap
                          size={18}
                          className="shrink-0 text-brand-700"
                        />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm group-hover:text-brand-700 truncate">
                            {p.name}
                          </h3>
                          <p className="text-xs text-ink-500">
                            {p.level}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Staff */}
            {dept.staff.length > 0 && (
              <aside>
                <div className="sticky top-24 rounded-xl border border-ink-100 bg-white p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Users size={20} className="text-brand-700" />
                    <h2 className="text-lg font-bold">Department Staff</h2>
                  </div>
                  <div className="space-y-4">
                    {dept.staff.map((s) => (
                      <Link
                        key={s.id}
                        href={`/staff/${s.id}`}
                        className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-ink-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                          {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{s.name}</h3>
                          <p className="text-xs text-ink-500">
                            {[s.roles, s.staffType !== 'REGISTRAR' && s.staffType !== 'ADMINISTRATOR' ? s.staffType.charAt(0) + s.staffType.slice(1).toLowerCase() : null].filter(Boolean).join(' · ')}
                          </p>
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
