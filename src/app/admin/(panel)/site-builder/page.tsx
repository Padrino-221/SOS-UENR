'use client'

import { useState } from 'react'
import { Gear } from '@phosphor-icons/react'
import { SiteBuilder } from '@/components/admin/site-builder'
import { getSiteSectionsAction } from '@/actions/site-settings'
import type { SiteSections } from '@/data/siteDefaults'

export default function SiteBuilderPage() {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState<SiteSections | null>(null)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  async function handleOpen() {
    setLoading(true)
    setError(null)
    try {
      const data = await getSiteSectionsAction()
      setSections(data)
      setOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load site settings.')
    } finally {
      setLoading(false)
    }
  }

  if (open && sections) {
    return <SiteBuilder initialSections={sections} onClose={() => setOpen(false)} />
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="rounded-3xl border border-ink-100 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
          <Gear size={28} className="text-brand-700" />
        </div>
        <h1 className="mb-2 text-xl font-extrabold text-ink-900">Site Builder</h1>
        <p className="mb-6 max-w-md text-sm text-ink-500">
          Edit every section of the website — hero, about, departments, programmes,
          news, contact, navigation, footer, and more.
        </p>
        <button
          onClick={handleOpen}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-50"
        >
          <Gear size={16} />
          {loading ? 'Loading…' : 'Open Site Builder'}
        </button>
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}
