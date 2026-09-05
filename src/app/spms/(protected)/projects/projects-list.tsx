'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Badge, EmptyState, Button, DataTable } from '@/components/ui'
import { deleteSpmsProject } from '@/app/spms/(protected)/actions'
import { DeleteConfirm } from '@/components/spms/delete-confirm'

interface Project {
  id: string
  title: string
  slug: string
  abstract: string
  objective: string
  studentName: string | null
  groupMembers: string | null
  programme: string | null
  degreeLevel: string
  published: boolean
  createdAt: Date
  documentUrl: string | null
  documentName: string | null
  githubLink: string | null
  supervisorId: string | null
  departmentId: string | null
  academicYearId: string | null
  supervisor: { id: string; name: string } | null
  department: { id: string; name: string } | null
  academicYear: { id: string; year: string } | null
}

interface ProjectsListProps {
  projects: Project[]
  isAdmin: boolean
  currentUserId: string
}

export function ProjectsList({
  projects,
  isAdmin,
  currentUserId,
}: ProjectsListProps) {
  const [filter, setFilter] = useState<'all' | 'mine'>('all')
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [pending, startTransition] = useTransition()

  const displayed = isAdmin && filter === 'mine'
    ? projects.filter((p) => p.supervisorId === currentUserId)
    : projects

  const handleDelete = () => {
    if (!deleteTarget) return
    const fd = new FormData()
    fd.set('id', deleteTarget.id)
    startTransition(async () => {
      await deleteSpmsProject(fd)
      setDeleteTarget(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                filter === 'all' ? 'bg-brand-700 text-white' : 'text-ink-600 hover:bg-ink-100',
              )}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilter('mine')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                filter === 'mine' ? 'bg-brand-700 text-white' : 'text-ink-600 hover:bg-ink-100',
              )}
            >
              My Projects ({projects.filter((p) => p.supervisorId === currentUserId).length})
            </button>
          </div>
        )}
        {!isAdmin && (
          <p className="text-sm text-ink-500">Your supervised projects</p>
        )}
        <Link href="/spms/projects/new">
          <Button>
            <Plus size={16} className="mr-1.5" weight="duotone" /> New Project
          </Button>
        </Link>
      </div>

      {displayed.length === 0 ? (
        <EmptyState
          title="No projects"
          description="Create your first student project."
        />
      ) : (
        <DataTable
          data={displayed}
          columns={[
            {
              key: 'title',
              header: 'Title',
              render: (p) => (
                <div>
                  <p className="font-medium text-ink-900">{p.title}</p>
                  {p.studentName && (
                    <p className="text-xs text-ink-500">{p.studentName}</p>
                  )}
                </div>
              ),
            },
            {
              key: 'degreeLevel',
              header: 'Level',
              render: (p) => <Badge variant="default">{p.degreeLevel}</Badge>,
            },
            ...(isAdmin
              ? [{
                  key: 'supervisor',
                  header: 'Supervisor',
                  render: (p: Project) => p.supervisor?.name ?? '—',
                }]
              : []),
            {
              key: 'academicYear',
              header: 'Year',
              render: (p) => p.academicYear?.year ?? '—',
            },
            {
              key: 'published',
              header: 'Status',
              render: (p) => (
                <Badge variant={p.published ? 'success' : 'default'}>
                  {p.published ? 'Published' : 'Draft'}
                </Badge>
              ),
            },
            {
              key: 'id',
              header: '',
              render: (p) => (
                <div className="flex items-center gap-1">
                  <Link
                    href={`/spms/projects/${p.id}/edit`}
                    className="rounded-lg p-1.5 text-ink-500 hover:bg-brand-50 hover:text-brand-700"
                    title="Edit"
                  >
                    <PencilSimple size={15} weight="duotone" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="rounded-lg p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash size={15} weight="duotone" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          title="Delete Project"
          description={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          pending={pending}
        />
      )}
    </div>
  )
}
