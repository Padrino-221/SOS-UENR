'use client'

import { Plus, Trash } from '@phosphor-icons/react'

interface FieldDef {
  key: string
  label: string
  placeholder?: string
}

export function ArrayItems({
  label,
  items,
  onChange,
  fields,
}: {
  label: string
  items: Record<string, string>[]
  onChange: (v: Record<string, string>[]) => void
  fields: FieldDef[]
}) {
  function update(index: number, key: string, value: string) {
    const next = items.map((item, i) =>
      i === index ? { ...item, [key]: value } : item,
    )
    onChange(next)
  }

  function add() {
    const empty: Record<string, string> = {}
    for (const f of fields) empty[f.key] = ''
    onChange([...items, empty])
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold text-ink-700">{label}</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-700 hover:bg-brand-100"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-xl border border-ink-100 bg-ink-50/50 p-3"
          >
            <div className="flex-1 space-y-2">
              {fields.map((f) => (
                <input
                  key={f.key}
                  value={item[f.key] || ''}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  placeholder={f.placeholder || f.label}
                  className="w-full rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 focus:outline-none"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-1 rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
