import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, UserCircle } from '@phosphor-icons/react/dist/ssr'
import { getPost } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function NewsDetailPage({
  params,
}: PageProps<'/news/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  return (
    <article className="py-16">
      <div className="container-page max-w-3xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft size={16} /> Back to news
        </Link>

        <div className="mt-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
            {post.category.toLowerCase().replace('_', ' ')}
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-ink-700">
            <span className="inline-flex items-center gap-1.5">
              <UserCircle size={18} />
              {post.author?.name ?? 'School of Sciences'}
            </span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <div className="mt-8 whitespace-pre-line leading-relaxed text-ink-700">
          {post.content || post.excerpt}
        </div>
      </div>
    </article>
  )
}
