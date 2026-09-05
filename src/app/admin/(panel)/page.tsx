import Link from 'next/link'
import {
  GraduationCap,
  Newspaper,
  Buildings,
  Users,
  Envelope,
  ArrowSquareOut,
  Plus,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { Card, Badge, PageHeader } from '@/components/ui'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [session, counts, recentPosts, recentMessages] = await Promise.all([
    getSession(),
    Promise.all([
      prisma.programme.count(),
      prisma.post.count(),
      prisma.department.count(),
      prisma.staff.count(),
      prisma.contactMessage.count(),
    ]).then(([programmes, posts, departments, staff, messages]) => ({
      programmes,
      posts,
      departments,
      staff,
      messages,
    })),
    prisma.post.findMany({ orderBy: { publishedAt: 'desc' }, take: 5 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  const firstName = session?.name?.split(' ')[0] ?? 'Admin'

  const cards = [
    { label: 'Programmes', count: counts.programmes, href: '/admin/programmes', icon: GraduationCap },
    { label: 'Departments', count: counts.departments, href: '/admin/departments', icon: Buildings },
    { label: 'News & Events', count: counts.posts, href: '/admin/posts', icon: Newspaper },
    { label: 'Staff', count: counts.staff, href: '/admin/staff', icon: Users },
    { label: 'Messages', count: counts.messages, href: '/admin/messages', icon: Envelope },
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Manage all the content that powers the School of Sciences website."
        action={
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-[5px] border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-brand-900 hover:text-white hover:border-brand-900 transition"
          >
            <ArrowSquareOut size={16} weight="duotone" /> View live site
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 mb-10">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-ink-100 bg-white p-5 hover:border-brand-200 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{card.label}</span>
              <card.icon size={20} weight="duotone" className="text-gold-600" />
            </div>
            <p className="text-3xl font-bold leading-none text-ink-900">{card.count}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-ink-100 bg-white p-6 mb-6">
        <h2 className="text-lg font-bold text-ink-900 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Add a programme', href: '/admin/programmes' },
            { label: 'Add news story', href: '/admin/posts' },
            { label: 'Add staff member', href: '/admin/staff' },
            { label: 'Manage departments', href: '/admin/departments' },
            { label: 'View messages', href: '/admin/messages' },
            { label: 'Site Builder', href: '/admin/site-builder' },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="inline-flex items-center justify-between gap-2 rounded-[5px] border border-ink-200 px-4 py-3 text-sm font-semibold text-ink-700 hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700 transition"
            >
              {a.label}
              <Plus size={16} weight="duotone" className="text-gold-600" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-ink-900">Recent news & events</h3>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage <ArrowRight size={14} weight="duotone" />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-ink-500">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recentPosts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{p.title}</p>
                    <p className="text-xs text-ink-500 flex items-center gap-1.5 mt-1">
                      <Badge variant={p.published ? 'success' : 'default'}>
                        {p.published ? 'Published' : 'Draft'}
                      </Badge>
                      {formatDate(p.publishedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-ink-900">Recent messages</h3>
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight size={14} weight="duotone" />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-ink-500">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{m.subject}</p>
                    <p className="text-xs text-ink-500">
                      {m.name} · {m.email}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-500">
                    {formatDate(m.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
