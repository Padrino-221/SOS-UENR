import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PostForm } from '@/components/admin/post-form'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({
  params,
}: PageProps<'/admin/posts/[id]/edit'>) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })

  if (!post) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit post</h2>
        <p className="mt-1 text-sm text-ink-700">{post.title}</p>
      </div>
      <PostForm post={post} />
    </div>
  )
}
