'use client'

import { Warning } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui'

interface DeleteConfirmProps {
  title: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
  pending?: boolean
}

export function DeleteConfirm({ title, description, onConfirm, onCancel, pending }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white border border-ink-100">
        <div className="flex flex-col items-center px-6 pt-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Warning size={28} className="text-red-500" weight="duotone" />
          </div>
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-ink-500">{description}</p>
          )}
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6 pt-6">
          <Button variant="outline" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="rounded-[5px] bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {pending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
