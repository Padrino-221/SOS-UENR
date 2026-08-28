import { prisma } from '@/lib/db'
import { PostList } from '@/components/admin/post-list'

export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
  const raw = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
  })

  const posts = raw.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    excerpt: p.excerpt,
    content: p.content,
    coverImage: p.coverImage,
    published: p.published,
    featured: p.featured,
    publishedAt: p.publishedAt,
  }))

  return <PostList posts={posts} />
}
