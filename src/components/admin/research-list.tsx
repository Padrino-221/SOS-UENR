'use client'

import { useState } from 'react'
import { PencilSimple } from '@phosphor-icons/react'
import { deleteResearch } from '@/actions/content'
import { Button, Badge, DataTable, PageHeader, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { FormModal } from '@/components/admin/form-modal'
import { ResearchForm } from '@/components/admin/research-form'
import type { ResearchArea } from '@prisma/client'

interface ResearchRow {
  id: string
  title: string
  published: boolean
}

export function ResearchList({ areas }: { areas: ResearchRow[] }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const editArea = areas.find((a) => a.id === editId) ?? null

  const columns: Column<ResearchRow>[] = [
    { key: 'title', header: 'Title', render: (a) => <span className="font-medium text-ink-900">{a.title}</span> },
    {
      key: 'published',
      header: 'Status',
      render: (a) => (
        <Badge variant={a.published ? 'success' : 'default'}>
          {a.published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setEditId(a.id)}
            className="rounded-lg border border-ink-200 p-2 text-ink-600 transition hover:border-system-300 hover:bg-system-50 hover:text-system-700"
            aria-label="Edit"
          >
            <PencilSimple size={16} />
          </button>
          <form action={deleteResearch}>
            <input type="hidden" name="id" value={a.id} />
            <DeleteButton />
          </form>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Research Areas"
        description="Manage research areas & centres."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            New research area
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={areas}
        emptyMessage="No research areas yet."
      />

      <FormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Research Area"
      >
        <ResearchForm />
      </FormModal>

      <FormModal
        open={!!editId}
        onClose={() => setEditId(null)}
        title="Edit Research Area"
      >
        {editArea && (
          <ResearchForm area={editArea as unknown as ResearchArea} />
        )}
      </FormModal>
    </div>
  )
}
