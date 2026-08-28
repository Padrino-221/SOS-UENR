'use client'

import Link from 'next/link'
import { FolderOpen, GraduationCap, Buildings } from '@phosphor-icons/react'
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
  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${session.name.split(' ')[0]}`}
        description={department ? `${department.name} — Student Project Management` : 'Student Project Management System'}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/spms/projects" className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <FolderOpen size={22} />
          </span>
          <div>
            <p className="text-2xl font-extrabold text-ink-900">{totalProjects}</p>
            <p className="text-sm text-ink-500">Total Projects</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <GraduationCap size={22} />
          </span>
          <div>
            <p className="text-2xl font-extrabold text-ink-900">{publishedProjects}</p>
            <p className="text-sm text-ink-500">Published</p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Buildings size={22} />
            </span>
            <div>
              <p className="text-2xl font-extrabold text-ink-900">{deptCount}</p>
              <p className="text-sm text-ink-500">Departments</p>
            </div>
          </div>
        )}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-ink-900">Recent Projects</h3>
          <Link href="/spms/projects" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all →
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
                  <p className="text-xs text-ink-500">
                    <Badge variant={p.published ? 'success' : 'default'}>
                      {p.published ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="ml-2">{p.supervisor?.name}</span>
                    {p.department && <span className="ml-2">· {p.department.name}</span>}
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
