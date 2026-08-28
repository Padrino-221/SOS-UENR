'use client'

import { deleteUser } from '@/actions/content'
import { useActionToast } from '@/hooks/use-action-toast'
import { formatDate } from '@/lib/utils'
import { Badge, DataTable, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { ToastListener } from '@/components/admin/toast-listener'

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  isCurrent: boolean
}

export function UserTable({ users }: { users: UserRow[] }) {
  const { runAction, pending } = useActionToast()

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => deleteUser(fd), {
      success: 'User deleted.',
      error: 'Failed to delete user.',
    })
  }

  const columns: Column<UserRow>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (u) => (
        <span className="font-medium text-ink-900">
          {u.name}
          {u.isCurrent && (
            <Badge variant="info" className="ml-2">you</Badge>
          )}
        </span>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <Badge variant={u.role === 'ADMIN' ? 'info' : 'default'}>
          {u.role}
        </Badge>
      ),
    },
    { key: 'date', header: 'Created', render: (u) => formatDate(u.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex justify-end">
          {!u.isCurrent && (
            <DeleteButton onClick={() => handleDelete(u.id)} disabled={pending} />
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <ToastListener />
      <DataTable
        columns={columns}
        data={users}
        emptyMessage="No users found."
      />
    </>
  )
}
