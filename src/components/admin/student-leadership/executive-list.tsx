'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CaretLeft, PencilSimple } from '@phosphor-icons/react'
import { deleteExecutive } from '@/actions/student-leadership'
import { useActionToast } from '@/hooks/use-action-toast'
import { Button, DataTable, PageHeader, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { FormModal } from '@/components/admin/form-modal'
import { ExecutiveForm } from './executive-form'
import { ToastListener } from '@/components/admin/toast-listener'

interface ExecutiveRow {
  id: string
  name: string
  position: string
  photoUrl: string | null
  departmentId: string | null
  department: { name: string } | null
  ordering: number
}

export function ExecutiveList({
  yearId,
  yearLabel,
  isCurrent,
  departments,
  executives,
}: {
  yearId: string
  yearLabel: string
  isCurrent: boolean
  departments: { id: string; name: string }[]
  executives: ExecutiveRow[]
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const { runAction, pending } = useActionToast()

  const editExec = executives.find((e) => e.id === editId) ?? null

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    fd.set('academicYearId', yearId)
    runAction(() => deleteExecutive(fd), {
      success: 'Executive deleted.',
      error: 'Failed to delete executive.',
    })
  }

  const columns: Column<ExecutiveRow>[] = [
    { key: 'name', header: 'Name', render: (e) => <span className="font-medium text-ink-900">{e.name}</span> },
    { key: 'position', header: 'Position', render: (e) => e.position },
    {
      key: 'department',
      header: 'Department',
      render: (e) => e.department?.name ?? '—',
    },
    {
      key: 'ordering',
      header: 'Order',
      render: (e) => <span className="text-ink-500">{e.ordering || '—'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (e) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setEditId(e.id)}
            className="rounded-lg border border-ink-200 p-2 text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            aria-label="Edit"
          >
            <PencilSimple size={16} weight="duotone" />
          </button>
          <DeleteButton onClick={() => handleDelete(e.id)} disabled={pending} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <ToastListener />
      <Link
        href="/admin/student-leadership"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 transition hover:text-brand-700"
      >
        <CaretLeft size={14} weight="duotone" /> Tenures
      </Link>

      <PageHeader
        title={`${yearLabel} Executive Council`}
        description={`${executives.length} executive${executives.length !== 1 ? 's' : ''}${isCurrent ? ' in the current tenure.' : ' in this tenure.'}`}
        action={<Button onClick={() => setCreateOpen(true)}>Add executive</Button>}
      />

      <DataTable
        columns={columns}
        data={executives}
        emptyMessage={`No executives yet for ${yearLabel} — add the council members for this tenure.`}
      />

      <FormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add Executive"
        description={`Executive for the ${yearLabel} tenure`}
      >
        <ExecutiveForm academicYearId={yearId} departments={departments} />
      </FormModal>

      <FormModal
        open={!!editId}
        onClose={() => setEditId(null)}
        title="Edit Executive"
      >
        {editExec && (
          <ExecutiveForm academicYearId={yearId} departments={departments} executive={editExec} />
        )}
      </FormModal>
    </div>
  )
}
