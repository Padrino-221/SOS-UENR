import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { getStaffMember } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'
import { StaffProjectsTable } from '@/components/site/staff-projects-table'

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
      <section className="section-padding bg-[#f7f7f5] relative overflow-hidden">
        <div className="container-premium relative max-w-5xl">
          <Link href="/staff" className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-900 mb-10 transition-colors">
            <ArrowLeft size={16} weight="duotone" /> Back to Staff
          </Link>

          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 lg:gap-14 items-start">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-50 border border-[#e5e5e0]">
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
                <a href={`mailto:${member.email}`} className="mt-8 inline-flex items-center gap-2 bg-brand-700 px-6 py-3.5 text-[0.75rem] font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-800">
                  Email {member.name.split(' ')[0]}
                <ArrowRight size={14} weight="duotone" />
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
            <StaffProjectsTable projects={member.projects} />
          </div>
        </section>
      )}
    </>
  )
}
