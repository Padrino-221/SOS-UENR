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
    <article className="section-padding bg-white">
      <div className="container-premium max-w-3xl">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
          <ArrowLeft size={16} weight="duotone" /> Back to news
        </Link>

        <div className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700">
            {post.category.toLowerCase().replace('_', ' ')}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-serif text-ink-900 leading-tight">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <UserCircle size={18} weight="duotone" className="text-brand-700" />
              {post.author?.name ?? 'School of Sciences'}
            </span>
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <div className="mt-8 card-premium p-8 whitespace-pre-line leading-relaxed text-ink-700">
          {post.content || post.excerpt}
        </div>
      </div>
    </article>
  )
}
