'use client'

import { useState } from 'react'
import { PencilSimple } from '@phosphor-icons/react'
import { deleteResource } from '@/actions/content'
import { useActionToast } from '@/hooks/use-action-toast'
import { Button, Badge, DataTable, PageHeader, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { FormModal } from '@/components/admin/form-modal'
import { ResourceForm } from '@/components/admin/resource-form'
import { ToastListener } from '@/components/admin/toast-listener'
import type { Resource } from '@prisma/client'

type YearOption = { id: string; year: string }

interface ResourceRow {
  id: string
  title: string
  description: string
  fileUrl: string
  fileName: string | null
  category: string
  academicYearId: string | null
  academicYear?: { year: string } | null
  createdAt: Date
}

export function ResourceList({
  resources,
  academicYears,
}: {
  resources: ResourceRow[]
  academicYears: YearOption[]
}) {
  const [editId, setEditId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const { runAction, pending } = useActionToast()

  const editResource = resources.find((r) => r.id === editId) ?? null

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => deleteResource(fd), {
      success: 'Resource deleted.',
      error: 'Failed to delete resource.',
    })
  }

  const columns: Column<ResourceRow>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium text-ink-900 line-clamp-2">{r.title}</span> },
    {
      key: 'category',
      header: 'Category',
      render: (r) => (
        <Badge variant={r.category === 'HANDBOOK' ? 'info' : r.category === 'STUDENT_LIST' ? 'success' : 'default'}>
          {r.category === 'HANDBOOK' ? 'Handbook' : r.category === 'STUDENT_LIST' ? 'Student List' : r.category}
        </Badge>
      ),
    },
    { key: 'year', header: 'Year', render: (r) => r.academicYear?.year ?? '—' },
    {
      key: 'file',
      header: 'File',
      render: (r) => (
        <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline truncate max-w-[200px] inline-block">
          {r.fileName || r.fileUrl}
        </a>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setEditId(r.id)}
            className="rounded-lg border border-ink-200 p-2 text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            aria-label="Edit"
          >
            <PencilSimple size={16} weight="duotone" />
          </button>
          <DeleteButton onClick={() => handleDelete(r.id)} disabled={pending} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <ToastListener />
      <PageHeader
        title="Resources"
        description="Upload handbooks and final year student group lists — same flow as other documents."
        action={
          <Button onClick={() => setCreateOpen(true)}>New resource</Button>
        }
      />

      <DataTable columns={columns} data={resources} emptyMessage="No resources yet. Upload your first document." />

      <FormModal open={createOpen} onClose={() => setCreateOpen(false)} title="New Resource">
        <ResourceForm academicYears={academicYears} />
      </FormModal>

      <FormModal open={!!editId} onClose={() => setEditId(null)} title="Edit Resource">
        {editResource && <ResourceForm resource={editResource as unknown as Resource} academicYears={academicYears} />}
      </FormModal>
    </div>
  )
}
