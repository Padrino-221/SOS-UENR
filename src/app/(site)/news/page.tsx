import Link from 'next/link'
import { Flask, Megaphone, CalendarBlank } from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getPosts } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'
import { formatDate, cn } from '@/lib/utils'
import type { PostCategory } from '@prisma/client'

const categoryMeta: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  NEWS: { label: 'News', icon: <Flask size={16} /> },
  ANNOUNCEMENT: { label: 'Announcement', icon: <Megaphone size={16} /> },
  EVENT: { label: 'Event', icon: <CalendarBlank size={16} /> },
}

export const dynamic = 'force-dynamic'

export default async function NewsPage({
  searchParams,
}: PageProps<'/news'>) {
  const sp = await searchParams
  const catRaw = Array.isArray(sp.category) ? sp.category[0] : sp.category
  const category: PostCategory | null =
    catRaw === 'news' || catRaw === 'announcement' || catRaw === 'event'
      ? (catRaw.toUpperCase() as PostCategory)
      : null

  const [posts, sections] = await Promise.all([
    getPosts({ category }),
    getSiteSections(),
  ])

  const { news } = sections

  return (
    <>
      <PageHero
        title={news.heroTitle}
        subtitle={news.heroSubtitle}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'News & Events' }]}
      />

      <section className="py-16">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap gap-2">
            {[
              { key: null, label: 'All' },
              { key: 'news' as const, label: 'News' },
              { key: 'announcement' as const, label: 'Announcements' },
              { key: 'event' as const, label: 'Events' },
            ].map((tab) => (
              <Link
                key={tab.key ?? 'all'}
                href={tab.key ? `/news?category=${tab.key}` : '/news'}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-semibold transition',
                  category === (tab.key ? tab.key.toUpperCase() : null)
                    ? 'bg-brand-700 text-white'
                    : 'border border-ink-100 text-ink-700 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="text-ink-700">No posts in this category yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-ink-100 transition hover:-translate-y-1"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-100 to-brand-300">
                    <Flask size={40} className="text-brand-700" weight="duotone" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
                        {categoryMeta[post.category]?.label}
                      </span>
                      <span className="text-xs text-ink-700">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className="mt-3 font-semibold group-hover:text-brand-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-700">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
