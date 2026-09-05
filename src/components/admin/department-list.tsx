'use client'

import { useState } from 'react'
import { PencilSimple } from '@phosphor-icons/react'
import { deleteDepartment } from '@/actions/content'
import { useActionToast } from '@/hooks/use-action-toast'
import { Button, DataTable, PageHeader, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { FormModal } from '@/components/admin/form-modal'
import { DepartmentForm } from '@/components/admin/department-form'
import { ToastListener } from '@/components/admin/toast-listener'
import type { Department } from '@prisma/client'

interface DepartmentRow {
  id: string
  name: string
  slug: string
  shortName: string | null
  summary: string
  description: string
  ordering: number
  _count: { programmes: number }
}

export function DepartmentList({ departments }: { departments: DepartmentRow[] }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const { runAction, pending } = useActionToast()

  const editDept = departments.find((d) => d.id === editId) ?? null

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => deleteDepartment(fd), {
      success: 'Department deleted.',
      error: 'Failed to delete department.',
    })
  }

  const columns: Column<DepartmentRow>[] = [
    {
      key: 'name',
      header: 'Department',
      render: (d) => (
        <div>
          <p className="font-medium text-ink-900">{d.name}</p>
          <p className="text-xs text-ink-500">/{d.slug}</p>
        </div>
      ),
    },
    { key: 'programmes', header: 'Programmes', render: (d) => String(d._count.programmes) },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (d) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setEditId(d.id)}
            className="rounded-lg border border-ink-200 p-2 text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            aria-label="Edit"
          >
            <PencilSimple size={16} weight="duotone" />
          </button>
          <DeleteButton onClick={() => handleDelete(d.id)} disabled={pending} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <ToastListener />
      <PageHeader
        title="Departments"
        description="Manage academic departments."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            New department
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={departments}
        emptyMessage="No departments yet."
      />

      <FormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Department"
      >
        <DepartmentForm />
      </FormModal>

      <FormModal
        open={!!editId}
        onClose={() => setEditId(null)}
        title="Edit Department"
      >
        {editDept && (
          <DepartmentForm department={editDept as unknown as Department} />
        )}
      </FormModal>
    </div>
  )
}
