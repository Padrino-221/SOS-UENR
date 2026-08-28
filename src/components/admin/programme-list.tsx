'use client'

import { useState } from 'react'
import { PencilSimple } from '@phosphor-icons/react'
import { deleteProgramme } from '@/actions/content'
import { useActionToast } from '@/hooks/use-action-toast'
import { Button, Badge, DataTable, PageHeader, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { FormModal } from '@/components/admin/form-modal'
import { ProgrammeForm } from '@/components/admin/programme-form'
import { ToastListener } from '@/components/admin/toast-listener'
import type { Programme } from '@prisma/client'

type DepartmentOption = { id: string; name: string }

interface ProgrammeRow {
  id: string
  name: string
  slug: string
  code: string | null
  level: string
  mode: string | null
  duration: string | null
  summary: string
  overview: string
  requirements: string
  careerPaths: string
  published: boolean
  ordering: number
  departmentId: string | null
  department: { name: string } | null
}

export function ProgrammeList({
  programmes,
  departments,
}: {
  programmes: ProgrammeRow[]
  departments: DepartmentOption[]
}) {
  const [editId, setEditId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const { runAction, pending } = useActionToast()

  const editProgramme = programmes.find((p) => p.id === editId) ?? null

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => deleteProgramme(fd), {
      success: 'Programme deleted.',
      error: 'Failed to delete programme.',
    })
  }

  const columns: Column<ProgrammeRow>[] = [
    { key: 'name', header: 'Programme', render: (p) => <span className="font-medium text-ink-900">{p.name}</span> },
    { key: 'level', header: 'Level', render: (p) => <span className="capitalize">{p.level.toLowerCase()}</span> },
    { key: 'department', header: 'Department', render: (p) => p.department?.name ?? '—' },
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
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setEditId(p.id)}
            className="rounded-lg border border-ink-200 p-2 text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            aria-label="Edit"
          >
            <PencilSimple size={16} />
          </button>
          <DeleteButton onClick={() => handleDelete(p.id)} disabled={pending} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <ToastListener />
      <PageHeader
        title="Programmes"
        description="Manage degree, diploma and postgraduate programmes."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            New programme
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={programmes}
        emptyMessage="No programmes yet. Create your first programme."
      />

      <FormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Programme"
      >
        <ProgrammeForm departments={departments} />
      </FormModal>

      <FormModal
        open={!!editId}
        onClose={() => setEditId(null)}
        title="Edit Programme"
      >
        {editProgramme && (
          <ProgrammeForm
            programme={editProgramme as unknown as Programme}
            departments={departments}
          />
        )}
      </FormModal>
    </div>
  )
}
