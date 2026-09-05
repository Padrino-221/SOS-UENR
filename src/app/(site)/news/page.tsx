import Link from 'next/link'
import { Flask, Megaphone, CalendarBlank } from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { getPosts } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'
import { formatDate, cn, truncate } from '@/lib/utils'
import type { PostCategory } from '@prisma/client'

const categoryMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  NEWS: { label: 'News', icon: <Flask size={16} weight="duotone" /> },
  ANNOUNCEMENT: { label: 'Announcement', icon: <Megaphone size={16} weight="duotone" /> },
  EVENT: { label: 'Event', icon: <CalendarBlank size={16} weight="duotone" /> },
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

  const [posts, sections] = await Promise.all([getPosts({ category }), getSiteSections()])

  const { news } = sections

  return (
    <>
      <PageHero title={news.heroTitle} subtitle={news.heroSubtitle} crumbs={[{ label: 'Home', href: '/' }, { label: 'News & Events' }]} />

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="mb-10 flex flex-wrap gap-3">
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
                  'rounded-lg px-5 py-2.5 text-sm font-bold transition',
                  category === (tab.key ? tab.key.toUpperCase() : null)
                    ? 'bg-brand-700 text-white'
                    : 'border border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="text-center py-12 text-ink-600">No posts in this category yet.</p>
          ) : (
            <div className="grid gap-4 sm:gap-8 grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="card-premium overflow-hidden group flex flex-col h-full">
                  <div className="h-32 sm:h-56 bg-gradient-to-br from-brand-100 to-brand-300 grid place-items-center">
                    <Flask size={28} weight="duotone" className="sm:hidden text-brand-700" />
                    <Flask size={40} weight="duotone" className="hidden sm:block text-brand-700" />
                  </div>
                  <div className="p-4 sm:p-7 flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
                        {categoryMeta[post.category]?.icon} {categoryMeta[post.category]?.label}
                      </span>
                      <span className="text-xs text-ink-500">{formatDate(post.publishedAt)}</span>
                    </div>
                    <h3 className="mt-2 sm:mt-3 font-serif text-sm sm:text-base text-ink-900 group-hover:text-brand-700 leading-relaxed line-clamp-2">{post.title}</h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-ink-600 line-clamp-2 sm:line-clamp-3 flex-1 hidden sm:block">{truncate(post.excerpt, 100)}</p>
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
