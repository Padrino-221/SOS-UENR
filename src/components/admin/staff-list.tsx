'use client'

import { useState } from 'react'
import { PencilSimple } from '@phosphor-icons/react'
import { deleteStaff } from '@/actions/content'
import { useActionToast } from '@/hooks/use-action-toast'
import { Button, Badge, DataTable, PageHeader, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { FormModal } from '@/components/admin/form-modal'
import { StaffForm } from '@/components/admin/staff-form'
import { ToastListener } from '@/components/admin/toast-listener'
import type { Staff } from '@prisma/client'

type DepartmentOption = { id: string; name: string }
type YearOption = { id: string; year: string }

interface StaffRow {
  id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  bio: string
  roles: string | null
  staffType: string
  spmsAccess: boolean
  photoUrl: string | null
  ordering: number
  showOnPublic: boolean
  isExecutive: boolean
  executiveYearId: string | null
  departmentId: string | null
  department: { name: string } | null
}

export function StaffList({
  staff,
  departments,
  academicYears,
}: {
  staff: StaffRow[]
  departments: DepartmentOption[]
  academicYears: YearOption[]
}) {
  const [editId, setEditId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const { runAction, pending } = useActionToast()

  const editStaff = staff.find((s) => s.id === editId) ?? null

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => deleteStaff(fd), {
      success: 'Staff deleted.',
      error: 'Failed to delete staff.',
    })
  }

  const columns: Column<StaffRow>[] = [
    { key: 'name', header: 'Name', render: (s) => <span className="font-medium text-ink-900">{s.name}</span> },
    { key: 'title', header: 'Title', render: (s) => s.title ?? '—' },
    { key: 'department', header: 'Department', render: (s) => s.department?.name ?? '—' },
    {
      key: 'staffType',
      header: 'Type',
      render: (s) => (
        <Badge variant={s.staffType === 'REGISTRAR' ? 'info' : s.staffType === 'ADMINISTRATOR' ? 'warning' : 'default'}>
          {s.staffType === 'REGISTRAR' ? 'Registrar' : s.staffType === 'ADMINISTRATOR' ? 'Administrator' : 'Lecturer'}
        </Badge>
      ),
    },
    {
      key: 'isExecutive',
      header: 'Executive',
      render: (s) => (
        <Badge variant={s.isExecutive ? 'info' : 'default'}>{s.isExecutive ? 'Yes' : '—'}</Badge>
      ),
    },
    {
      key: 'showOnPublic',
      header: 'Visible',
      render: (s) => (
        <Badge variant={s.showOnPublic ? 'success' : 'default'}>
          {s.showOnPublic ? 'Visible' : 'Hidden'}
        </Badge>
      ),
    },
    {
      key: 'spmsAccess',
      header: 'SPMS',
      render: (s) => (
        <Badge variant={s.spmsAccess ? 'info' : 'default'}>
          {s.spmsAccess ? 'Enabled' : 'Disabled'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setEditId(s.id)}
            className="rounded-lg border border-ink-200 p-2 text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            aria-label="Edit"
          >
            <PencilSimple size={16} weight="duotone" />
          </button>
          <DeleteButton onClick={() => handleDelete(s.id)} disabled={pending} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <ToastListener />
      <PageHeader
        title="Staff"
        description="Manage faculty and administrative staff."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            New staff
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={staff}
        emptyMessage="No staff yet."
      />

      <FormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Staff"
      >
        <StaffForm departments={departments} academicYears={academicYears} />
      </FormModal>

      <FormModal
        open={!!editId}
        onClose={() => setEditId(null)}
        title="Edit Staff"
      >
        {editStaff && (
          <StaffForm
            staff={editStaff as unknown as Staff}
            departments={departments}
            academicYears={academicYears}
          />
        )}
      </FormModal>
    </div>
  )
}
