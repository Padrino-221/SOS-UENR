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
    <Link
      href={`/staff/${id}`}
      className="group flex flex-col md:flex-row overflow-hidden border border-[#e5e5e0] bg-white transition-all duration-200 hover:border-brand-700 hover:-translate-y-1"
    >
      <Portrait src={photoUrl ?? null} alt={name} name={name} />
      <div className="flex flex-1 flex-col items-start justify-center p-7 md:p-8">
        <h3 className="mb-1.5 font-serif text-xl md:text-[1.35rem] text-ink-900 transition-colors duration-200 group-hover:text-brand-700">
          {name}
        </h3>
        <p className="mb-3 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-brand-700">
          {position}
        </p>
        {department && <p className="mb-4 text-xs text-ink-500">{department.name}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-ink-400 transition-colors duration-200 group-hover:text-brand-700">
          View profile
          <ArrowRight size={12} weight="duotone" className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
