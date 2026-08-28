import Link from 'next/link'
import { Envelope, Phone } from '@phosphor-icons/react/dist/ssr'

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

export function StaffCard({ id, name, title, email, phone, roles, photoUrl, department }: StaffCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link
      href={`/staff/${id}`}
      className="group rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-300"
    >
      <div className="flex items-center gap-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
            <span className="text-lg font-bold">{initials}</span>
          </span>
        )}
        <div>
          <h3 className="font-bold text-ink-900 group-hover:text-brand-700">{name}</h3>
          <p className="text-sm text-ink-700">{title}</p>
        </div>
      </div>
      {roles && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-700">
          {roles}
        </p>
      )}
      {department && (
        <p className="mt-1 text-xs text-ink-500">{department.name}</p>
      )}
      <div className="mt-3 space-y-1 text-sm text-ink-700">
        {email && (
          <p className="flex items-center gap-2">
            <Envelope size={14} className="shrink-0" />
            {email}
          </p>
        )}
        {phone && (
          <p className="flex items-center gap-2">
            <Phone size={14} className="shrink-0" />
            {phone}
          </p>
        )}
      </div>
    </Link>
  )
}
