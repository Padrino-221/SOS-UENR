'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { X, Eye, FloppyDisk, CaretLeft, CaretRight } from '@phosphor-icons/react'
import type { SiteSections, SiteSectionKey } from '@/data/siteDefaults'
import { saveSiteSection } from '@/actions/site-settings'
import { useToast } from '@/components/ui'
import { SectionForm } from './content-forms'

const SECTIONS: { group: string; items: { key: SiteSectionKey; label: string }[] }[] = [
  {
    group: 'Pages',
    items: [
      { key: 'hero', label: 'Hero' },
      { key: 'home', label: 'Home Page' },
      { key: 'about', label: 'About' },
      { key: 'programmes', label: 'Programmes' },
      { key: 'news', label: 'News & Events' },
      { key: 'leadership', label: 'Leadership' },
      { key: 'staff', label: 'Staff' },
      { key: 'contact', label: 'Contact' },
      { key: 'projects', label: 'Projects' },
    ],
  },
  {
    group: 'Global',
    items: [
      { key: 'navigation', label: 'Navigation' },
      { key: 'footer', label: 'Footer' },
      { key: 'branding', label: 'Branding' },
    ],
  },
]

export function SiteBuilder({
  initialSections,
  onClose,
}: {
  initialSections: SiteSections
  onClose: () => void
}) {
  const [sections, setSections] = useState<SiteSections>(initialSections)
  const [active, setActive] = useState<SiteSectionKey>('hero')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [dirty, setDirty] = useState(false)
  const savedRef = useRef(initialSections)
  const { toast } = useToast()

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await saveSiteSection(active, sections[active] as unknown as Record<string, unknown>)
      savedRef.current = sections
      setDirty(false)
      setSavedMsg(true)
      toast('success', 'Section saved.')
      setTimeout(() => setSavedMsg(false), 2000)
    } catch {
      toast('error', 'Failed to save section.')
    } finally {
      setSaving(false)
    }
  }, [active, sections, toast])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  function updateSection(data: unknown) {
    setSections((prev) => ({ ...prev, [active]: data }))
    setDirty(true)
  }

  return (
    <div className="fixed inset-0 z-[999] flex bg-white">
      {/* Sidebar */}
      <div
        className={`flex h-full flex-col border-r border-ink-100 bg-ink-50 transition-all ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
          {!collapsed && (
            <span className="text-sm font-bold text-ink-900">Site Builder</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"
          >
            {collapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}
          </button>
        </div>

        {!collapsed && (
          <nav className="flex-1 overflow-y-auto p-3">
            {SECTIONS.map((group) => (
              <div key={group.group} className="mb-4">
                <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-ink-400">
                  {group.group}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      active === item.key
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-ink-900">
              {SECTIONS.flatMap((g) => g.items).find((i) => i.key === active)?.label}
            </h2>
            {dirty && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                Unsaved
              </span>
            )}
            {savedMsg && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-700"
            >
              <Eye size={14} /> Preview
            </a>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-50"
            >
              <FloppyDisk size={14} />
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-ink-100 p-8">
          <div className="mx-auto max-w-[860px]">
            <SectionForm
              sectionKey={active}
              data={sections[active]}
              onChange={updateSection}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
