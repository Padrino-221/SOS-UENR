'use client'

import { useState } from 'react'
import { PencilSimple } from '@phosphor-icons/react'
import { deletePost } from '@/actions/content'
import { useActionToast } from '@/hooks/use-action-toast'
import { formatDate } from '@/lib/utils'
import { Button, Badge, DataTable, PageHeader, type Column } from '@/components/ui'
import { DeleteButton } from '@/components/ui/delete-button'
import { FormModal } from '@/components/admin/form-modal'
import { PostForm } from '@/components/admin/post-form'
import { ToastListener } from '@/components/admin/toast-listener'
import type { Post } from '@prisma/client'

interface PostRow {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  coverImage: string | null
  published: boolean
  featured: boolean
  publishedAt: Date | null
}

export function PostList({ posts }: { posts: PostRow[] }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const { runAction, pending } = useActionToast()

  const editPost = posts.find((p) => p.id === editId) ?? null

  const handleDelete = (id: string) => {
    const fd = new FormData()
    fd.set('id', id)
    runAction(() => deletePost(fd), {
      success: 'Post deleted.',
      error: 'Failed to delete post.',
    })
  }

  const columns: Column<PostRow>[] = [
    { key: 'title', header: 'Title', render: (p) => <span className="font-medium text-ink-900">{p.title}</span> },
    { key: 'category', header: 'Category', render: (p) => <span className="capitalize">{p.category.replace('_', ' ').toLowerCase()}</span> },
    { key: 'date', header: 'Date', render: (p) => formatDate(p.publishedAt ?? new Date()) },
    {
      key: 'published',
      header: 'Status',
      render: (p) => (
        <Badge variant={p.published ? 'success' : 'default'}>
          {p.published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setEditId(p.id)}
            className="rounded-lg border border-ink-200 p-2 text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            aria-label="Edit"
          >
            <PencilSimple size={16} weight="duotone" />
          </button>
          <DeleteButton onClick={() => handleDelete(p.id)} disabled={pending} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <ToastListener />
      <PageHeader
        title="News & Events"
        description="Manage news, announcements and events."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            New post
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={posts}
        emptyMessage="No posts yet. Create your first post."
      />

      <FormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Post"
      >
        <PostForm />
      </FormModal>

      <FormModal
        open={!!editId}
        onClose={() => setEditId(null)}
        title="Edit Post"
      >
        {editPost && (
          <PostForm post={editPost as unknown as Post} />
        )}
      </FormModal>
    </div>
  )
}
