'use client'

import Link from 'next/link'
import { FolderOpen, GraduationCap, Buildings, ArrowSquareOut, Plus, ArrowRight } from '@phosphor-icons/react'
import { Card, PageHeader, Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { SpmsSession } from '@/lib/spms-auth'

interface RecentProject {
  id: string
  title: string
  published: boolean
  createdAt: Date
  supervisor: { name: string } | null
  department: { name: string } | null
}

export function DashboardClient({
  session,
  department,
  totalProjects,
  publishedProjects,
  recentProjects,
  deptCount,
  isAdmin,
}: {
  session: SpmsSession
  department: { name: string } | null
  totalProjects: number
  publishedProjects: number
  recentProjects: RecentProject[]
  deptCount: number
  isAdmin: boolean
}) {
  const firstName = session.name.split(' ')[0]

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={department ? `${department.name} — Student Project Management` : 'Student Project Management System'}
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-10">
        <Link href="/spms/projects" className="rounded-lg border border-ink-100 bg-white p-5 hover:border-brand-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Total Projects</span>
            <FolderOpen size={20} weight="duotone" className="text-gold-600" />
          </div>
          <p className="text-3xl font-bold leading-none text-ink-900">{totalProjects}</p>
        </Link>

        <div className="rounded-lg border border-ink-100 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Published</span>
            <GraduationCap size={20} weight="duotone" className="text-gold-600" />
          </div>
          <p className="text-3xl font-bold leading-none text-ink-900">{publishedProjects}</p>
          <p className="text-xs text-ink-500 mt-1.5">{publishedProjects} of {totalProjects} published</p>
        </div>

        {isAdmin && (
          <div className="rounded-lg border border-ink-100 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Departments</span>
              <Buildings size={20} weight="duotone" className="text-gold-600" />
            </div>
            <p className="text-3xl font-bold leading-none text-ink-900">{deptCount}</p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-ink-100 bg-white p-6 mb-6">
        <h2 className="text-lg font-bold text-ink-900 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'New project', href: '/spms/projects/new' },
            { label: 'Browse projects', href: '/spms/projects' },
            { label: 'View records', href: '/spms/records' },
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

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-ink-900">Recent Projects</h3>
          <Link href="/spms/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all <ArrowRight size={14} weight="duotone" />
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <p className="text-sm text-ink-500">No projects yet. Create your first project.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {recentProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-900">{p.title}</p>
                  <p className="text-xs text-ink-500 flex items-center gap-1.5 mt-1">
                    <Badge variant={p.published ? 'success' : 'default'}>
                      {p.published ? 'Published' : 'Draft'}
                    </Badge>
                    <span>{p.supervisor?.name}</span>
                    {p.department && <span>· {p.department.name}</span>}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-ink-500">{formatDate(p.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
