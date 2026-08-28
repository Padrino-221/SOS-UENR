'use client'

import { useState, useTransition } from 'react'
import { Trash } from '@phosphor-icons/react'
import { createAcademicYear, deleteAcademicYear, toggleActiveYear } from '../actions'
import { useToast } from '@/components/ui'
import { PageHeader, Card, Button, Input } from '@/components/ui'

interface AcademicYear {
  id: string
  year: string
  active: boolean
  _count: { projects: number }
}

export function SettingsPageClient({ years }: { years: AcademicYear[] }) {
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage academic years and system settings" />

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-ink-900">Academic Years</h3>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            {showForm ? 'Cancel' : 'Add Year'}
          </Button>
        </div>

        {showForm && (
          <form
            action={async (formData) => {
              const result = await createAcademicYear(null, formData)
              if (result?.error) {
                toast('error', result.error)
              } else {
                toast('success', 'Academic year created.')
                setShowForm(false)
              }
            }}
            className="mb-4 flex gap-2"
          >
            <Input
              name="year"
              placeholder="e.g. 2025/2026"
              required
              className="flex-1"
            />
            <Button type="submit">Save</Button>
          </form>
        )}

        {years.length === 0 ? (
          <p className="text-sm text-ink-500">No academic years defined.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {years.map((y) => (
              <li key={y.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-ink-900">{y.year}</span>
                  {y.active && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Active
                    </span>
                  )}
                  <span className="text-xs text-ink-500">{y._count.projects} projects</span>
                </div>
                <div className="flex items-center gap-1">
                  {!y.active && (
                    <form action={toggleActiveYear} className="inline">
                      <input type="hidden" name="id" value={y.id} />
                      <button
                        type="submit"
                        className="rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                      >
                        Set active
                      </button>
                    </form>
                  )}
                  <form action={deleteAcademicYear} className="inline">
                    <input type="hidden" name="id" value={y.id} />
                    <button
                      type="submit"
                      className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash size={14} />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
