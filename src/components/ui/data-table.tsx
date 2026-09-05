'use client'

import { useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  className?: string
  render?: (item: T) => React.ReactNode
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  pageSize?: number
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = 'No items found.',
  pageSize = 10,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(data.length / pageSize)
  const start = (page - 1) * pageSize
  const paged = data.slice(start, start + pageSize)

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-500',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-ink-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-system-50/30"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-5 py-3.5 text-ink-700', col.className)}>
                      {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {data.length > 0 && (
            <tfoot>
              <tr className="border-t border-ink-100 bg-ink-50/50">
                <td colSpan={columns.length} className="px-5 py-3">
                  <div className="flex items-center justify-between text-xs text-ink-500">
                    <span>
                      Showing {start + 1}–{Math.min(start + pageSize, data.length)} of {data.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1.5 font-medium text-ink-600 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <CaretLeft size={12} weight="duotone" /> Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={cn(
                            'h-8 w-8 rounded-lg text-xs font-medium transition',
                            p === page
                              ? 'bg-brand-700 text-white'
                              : 'text-ink-600 hover:bg-ink-100',
                          )}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1.5 font-medium text-ink-600 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Next <CaretRight size={12} weight="duotone" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
