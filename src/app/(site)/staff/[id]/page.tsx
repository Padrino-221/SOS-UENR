import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Envelope } from '@phosphor-icons/react/dist/ssr'
import { getStaffMember } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [member, sections] = await Promise.all([
    getStaffMember(id),
    getSiteSections(),
  ])

  if (!member || !member.showOnPublic) notFound()

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="container-page py-12">
          <Link
            href="/staff"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            <ArrowLeft size={16} /> Back to Staff
          </Link>

          <div className="grid items-start gap-10 md:grid-cols-[280px_1fr]">
            <div className="relative mx-auto w-full max-w-[280px]">
              <div className="relative h-[320px] overflow-hidden rounded-xl bg-brand-50">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    priority
                    sizes="280px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-7xl font-bold text-brand-300">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                Faculty Profile
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                {member.name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                {member.roles && (
                  <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                    {member.roles}
                  </span>
                )}
                {member.title && (
                  <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                    {member.title}
                  </span>
                )}
              </div>

              {member.department && (
                <p className="mt-2 text-sm text-ink-500">{member.department.name}</p>
              )}

              {member.bio && (
                <p className="mt-5 max-w-3xl leading-relaxed text-ink-600">
                  {member.bio}
                </p>
              )}

              {member.researchAreas && (
                <div className="mt-5">
                  <h3 className="text-sm font-bold text-ink-900">Research Areas</h3>
                  <p className="mt-1 max-w-3xl leading-relaxed text-ink-600">
                    {member.researchAreas}
                  </p>
                </div>
              )}

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-800"
                >
                  <Envelope size={16} />
                  {member.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Supervised Projects */}
      {member.projects && member.projects.length > 0 && (
        <section className="bg-ink-50">
          <div className="container-page py-12">
            <h2 className="text-2xl font-bold text-ink-900">Supervised Projects</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
                      <th className="w-12 px-4 py-3">#</th>
                      <th className="px-4 py-3">Project Topic</th>
                      <th className="px-4 py-3">Programme</th>
                      <th className="px-4 py-3">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {member.projects.map((project, idx) => (
                      <tr key={project.id} className="cursor-pointer transition hover:bg-ink-50">
                        <td className="px-4 py-3 text-ink-500">{idx + 1}</td>
                        <td className="max-w-xs px-4 py-3">
                          <Link href={`/projects/${project.slug}`} className="line-clamp-1 font-medium text-ink-900 hover:text-brand-700 transition">
                            {project.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-ink-600">{project.programme || '—'}</td>
                        <td className="px-4 py-3 text-ink-600">{project.academicYear?.year || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
