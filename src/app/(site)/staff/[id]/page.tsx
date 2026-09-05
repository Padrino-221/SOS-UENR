import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { getStaffMember } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [member, sections] = await Promise.all([getStaffMember(id), getSiteSections()])

  if (!member || !member.showOnPublic) notFound()

  return (
    <>
      <section className="section-padding bg-ink-50 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-brand-100/50 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gold-100/40 blur-3xl pointer-events-none" />
        <div className="container-page relative max-w-5xl">
          <Link href="/staff" className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-900 mb-10 transition-colors">
            <ArrowLeft size={16} weight="duotone" /> Back to Staff
          </Link>

          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 lg:gap-14 items-start">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-50 border border-ink-100">
              {member.photoUrl ? (
                <Image src={member.photoUrl} alt={member.name} fill priority sizes="(max-width:1024px) 100vw, 40vw" className="object-cover object-top" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-6xl text-brand-300">{initials(member.name)}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-[0.18em] mb-4">{member.title || member.roles || member.department?.name || 'Faculty'}</p>
              <h1 className="text-4xl md:text-5xl font-serif text-ink-900 leading-[1.05] mb-6">{member.name}</h1>
              {member.department && <p className="text-brand-700 text-sm font-bold uppercase tracking-[0.18em] mb-4">{member.department.name}</p>}
              {member.bio ? (
                <div className="space-y-4">
                  {member.bio.split(/\n\s*\n/).map((para, i) => (
                    <p key={i} className="text-ink-600 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-ink-600 leading-relaxed">Profile details coming soon.</p>
              )}
              {member.researchAreas && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-ink-900 mb-2">Research Areas</h3>
                  <p className="leading-relaxed text-ink-600">{member.researchAreas}</p>
                </div>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-sm font-bold text-white hover:bg-brand-800 transition">
                  {member.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {member.projects && member.projects.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-page">
            <h2 className="text-2xl font-serif text-ink-900 mb-6">Supervised Projects</h2>
            <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-brand-950 text-white text-left">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest"> #</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">Project Topic</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">Programme</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {member.projects.map((project, idx) => (
                      <tr key={project.id} className="hover:bg-ink-50/50">
                        <td className="px-4 py-3 text-ink-500">{idx + 1}</td>
                        <td className="max-w-xs px-4 py-3">
                          <Link href={`/projects/${project.slug}`} className="font-medium text-ink-900 hover:text-brand-700 line-clamp-1">
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
