'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { deleteTenure, setCurrentTenure } from '@/actions/student-leadership'
import { useActionToast } from '@/hooks/use-action-toast'
import { Button, Badge, DataTable, PageHeader, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { FormModal } from '@/components/admin/form-modal'
import { TenureForm } from './tenure-form'
import { ToastListener } from '@/components/admin/toast-listener'

interface TenureRow {
  id: string
  year: string
  active: boolean
  executiveCount: number
}

export function TenureList({ tenures }: { tenures: TenureRow[] }) {
  const [createOpen, setCreateOpen] = useState(false)
  const { runAction, pending } = useActionToast()

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => deleteTenure(fd), {
      success: 'Tenure deleted.',
      error: 'Failed to delete tenure.',
    })
  }

  const handleSetCurrent = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => setCurrentTenure(fd), {
      success: 'Current tenure updated.',
      error: 'Failed to update current tenure.',
    })
  }

  const columns: Column<TenureRow>[] = [
    { key: 'year', header: 'Academic Year', render: (t) => <span className="font-medium text-ink-900">{t.year}</span> },
    {
      key: 'executiveCount',
      header: 'Executives',
      render: (t) => (
        <Badge variant={t.executiveCount > 0 ? 'info' : 'default'}>
          {t.executiveCount}
        </Badge>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (t) => (t.active ? <Badge variant="success">Current</Badge> : <span className="text-ink-400">—</span>),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (t) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/student-leadership/${t.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 text-xs font-bold text-brand-700 transition hover:border-brand-300 hover:bg-brand-100"
          >
            Manage
            <ArrowRight size={12} weight="duotone" />
          </Link>
          {!t.active && (
            <button
              type="button"
              disabled={pending}
              onClick={() => handleSetCurrent(t.id)}
              className="rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs font-semibold text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
            >
              Set current
            </button>
          )}
          <DeleteButton onClick={() => handleDelete(t.id)} disabled={pending} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <ToastListener />
      <PageHeader
        title="Student Leadership"
        description="Tenures (academic years) and the student executives who served during each one."
        action={<Button onClick={() => setCreateOpen(true)}>New tenure</Button>}
      />

      <DataTable
        columns={columns}
        data={tenures}
        emptyMessage="No tenures yet — create the current academic year to start adding executives."
      />

      <FormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Tenure"
        description="Create an academic year — executives added under it will be tied to this tenure."
      >
        <TenureForm />
      </FormModal>
    </div>
  )
}
