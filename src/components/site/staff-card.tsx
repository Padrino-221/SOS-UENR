import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Portrait({ src, alt, name }: { src: string | null; alt: string; name: string }) {
  return (
    <div className="relative shrink-0 aspect-[4/3] md:aspect-auto md:w-[38%] overflow-hidden bg-brand-50">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-top" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-3xl text-brand-300">{initials(name)}</span>
        </div>
      )}
    </div>
  )
}

interface StaffCardProps {
  id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  roles: string | null
  photoUrl?: string | null
  department?: { name: string } | null
}

export function StaffCard({ id, name, title, roles, photoUrl, department }: StaffCardProps) {
  const position = title || roles || department?.name || 'Faculty'
  return (
    <Link href={`/staff/${id}`} className="card-premium overflow-hidden group flex flex-col md:flex-row">
      <Portrait src={photoUrl ?? null} alt={name} name={name} />
      <div className="flex-1 p-7 md:p-8 flex flex-col justify-center items-start">
        <h3 className="text-xl md:text-2xl font-serif text-ink-900 mb-1.5 group-hover:text-brand-700 transition-colors">{name}</h3>
        <p className="text-brand-700 text-[11px] font-bold uppercase tracking-[0.18em] mb-4">{position}</p>
        {department && <p className="text-ink-500 text-xs mb-3">{department.name}</p>}
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 group-hover:text-brand-700 transition-colors">
          View profile <ArrowRight size={14} weight="duotone" className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
