'use client'

import { Field, Toggle } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'
import { upsertResearch } from '@/actions/content'
import type { ResearchArea } from '@prisma/client'

export function ResearchForm({ area }: { area?: ResearchArea | null }) {
  return (
    <form
      action={upsertResearch}
      className="grid max-w-3xl gap-6 rounded-2xl border border-ink-100 bg-white p-6"
    >
      {area && <input type="hidden" name="id" value={area.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={area?.title} required />
        <Field
          label="Slug (URL)"
          name="slug"
          defaultValue={area?.slug}
          hint="Leave blank to auto-generate."
        />
      </div>
      <Field
        label="Summary"
        name="summary"
        defaultValue={area?.summary}
        textarea
        rows={3}
        required
      />
      <Field
        label="Full content"
        name="content"
        defaultValue={area?.content}
        textarea
        rows={8}
      />
      <div className="flex flex-wrap items-end gap-6">
        <Toggle
          label="Published"
          name="published"
          defaultChecked={area ? area.published : true}
        />
        <div className="w-40">
          <Field
            label="Ordering"
            name="ordering"
            type="number"
            defaultValue={area?.ordering != null ? String(area.ordering) : '0'}
          />
        </div>
      </div>

      <div>
        <SubmitButton label={area ? 'Update research area' : 'Create research area'} />
      </div>
    </form>
  )
}
