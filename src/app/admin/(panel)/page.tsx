import Link from 'next/link'
import {
  GraduationCap,
  Newspaper,
  Buildings,
  Users,
  Envelope,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Card, Badge, PageHeader } from '@/components/ui'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [programmes, posts, departments, staff, messages] =
    await Promise.all([
      prisma.programme.count(),
      prisma.post.count(),
      prisma.department.count(),
      prisma.staff.count(),
      prisma.contactMessage.count(),
    ])

  const recentPosts = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 5,
  })

  const recentMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const cards = [
    { label: 'Programmes', count: programmes, href: '/admin/programmes', icon: GraduationCap, color: 'bg-brand-50 text-brand-700' },
    { label: 'Departments', count: departments, href: '/admin/departments', icon: Buildings, color: 'bg-brand-50 text-brand-700' },
    { label: 'News & Events', count: posts, href: '/admin/posts', icon: Newspaper, color: 'bg-brand-50 text-brand-700' },
    { label: 'Staff', count: staff, href: '/admin/staff', icon: Users, color: 'bg-brand-50 text-brand-700' },
    { label: 'Messages', count: messages, href: '/admin/messages', icon: Envelope, color: 'bg-brand-50 text-brand-700' },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Manage content across the School of Sciences website."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon size={22} />
            </span>
            <div>
              <p className="text-2xl font-extrabold text-ink-900">{card.count}</p>
              <p className="text-sm text-ink-500">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-ink-900">Recent news & events</h3>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage <ArrowRight size={14} />
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
                    <p className="text-xs text-ink-500">
                      <Badge variant={p.published ? 'success' : 'default'} className="mr-1">
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
              View all <ArrowRight size={14} />
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
