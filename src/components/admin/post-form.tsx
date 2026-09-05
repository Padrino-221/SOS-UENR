'use client'

import { Field, Toggle, SelectField as Select } from '@/components/admin/fields'
import { SubmitButton } from '@/components/admin/submit-button'
import { ImageUpload } from '@/components/ui'
import { upsertPost } from '@/actions/content'
import type { Post } from '@prisma/client'

export function PostForm({ post }: { post?: Post | null }) {
  return (
    <form
      action={upsertPost}
      className="grid max-w-3xl gap-6 rounded-lg border border-ink-100 bg-white p-6"
    >
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            label="Title"
            name="title"
            defaultValue={post?.title}
            required
          />
        </div>
        <Field
          label="Slug (URL)"
          name="slug"
          defaultValue={post?.slug}
          hint="Leave blank to auto-generate from the title."
        />
        <Select
          label="Category"
          name="category"
          defaultValue={post?.category ?? 'NEWS'}
          options={[
            { value: 'NEWS', label: 'News' },
            { value: 'ANNOUNCEMENT', label: 'Announcement' },
            { value: 'EVENT', label: 'Event' },
          ]}
        />
      </div>

      <Field
        label="Excerpt"
        name="excerpt"
        defaultValue={post?.excerpt}
        textarea
        rows={3}
        hint="A short summary shown on listing pages."
      />
      <Field
        label="Content"
        name="content"
        defaultValue={post?.content}
        textarea
        rows={10}
        hint="Full article body. Line breaks are preserved."
      />

      <ImageUpload
        name="coverImage"
        label="Cover Image"
        defaultValue={post?.coverImage}
        hint="Upload a cover image for this post"
      />

      <div className="flex flex-wrap gap-6">
        <Toggle
          label="Published"
          name="published"
          defaultChecked={post ? post.published : true}
        />
        <Toggle
          label="Featured"
          name="featured"
          defaultChecked={post?.featured ?? false}
          hint="Featured posts appear on the homepage."
        />
      </div>

      <div>
        <SubmitButton label={post ? 'Update post' : 'Create post'} />
      </div>
    </form>
  )
}
