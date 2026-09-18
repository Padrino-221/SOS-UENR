import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Flask, Megaphone, CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
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

const PAGE_SIZE = 9

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

  const pageRaw = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const page = Math.max(1, Number.parseInt(pageRaw ?? '1', 10) || 1)

  const [{ posts, total, totalPages, page: currentPage }, sections] = await Promise.all([
    getPosts({ category, page, pageSize: PAGE_SIZE }),
    getSiteSections(),
  ])

  const { news } = sections

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category.toLowerCase())
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/news?${qs}` : '/news'
  }

  if (currentPage > totalPages) redirect(buildHref(totalPages))

  const tabClass = (isActive: boolean) =>
    cn(
      'border px-4 py-2 text-[0.8rem] font-bold transition-colors duration-150',
      isActive
        ? 'border-brand-700 bg-brand-700 text-white'
        : 'border-[#e5e5e0] bg-white text-ink-600 hover:border-brand-700 hover:text-brand-700',
    )

  const pageBtnClass = (isActive: boolean) =>
    cn(
      'inline-flex h-9 w-9 items-center justify-center text-[0.78rem] font-bold transition-colors duration-150',
      isActive
        ? 'bg-brand-700 text-white'
        : 'border border-[#e5e5e0] bg-white text-ink-600 hover:border-brand-700 hover:text-brand-700',
    )

  return (
    <>
      <PageHero title={news.heroTitle} subtitle={news.heroSubtitle} crumbs={[{ label: 'Home', href: '/' }, { label: 'News & Events' }]} />

      <section className="section-padding bg-[#f7f7f5]">
        <div className="container-premium">
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
                className={tabClass(category === (tab.key ? tab.key.toUpperCase() : null))}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="border border-dashed border-ink-300 bg-white p-12 text-center">
              <p className="font-serif text-ink-900">No posts in this category yet.</p>
              <p className="mt-2 text-sm text-ink-500">Check back soon for the latest updates.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/news/${post.slug}`} className="warm-card overflow-hidden group flex flex-col h-full">
                    {/* Cover — gradient + category icon, as on the landing page */}
                    <div className="h-44 sm:h-56 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-300 grid place-items-center">
                        {categoryMeta[post.category]?.icon ?? <Flask size={40} weight="duotone" className="text-brand-700" />}
                      </div>
                    </div>
                    <div className="p-7 flex-1 flex flex-col">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
                        {categoryMeta[post.category]?.icon} {categoryMeta[post.category]?.label}
                        <span aria-hidden className="text-ink-300">•</span>
                        <span className="text-ink-500">{formatDate(post.publishedAt)}</span>
                      </span>
                      <h3 className="mt-3 font-serif text-ink-900 group-hover:text-brand-700 line-clamp-2 leading-relaxed">{post.title}</h3>
                      <p className="mt-3 text-sm text-ink-600 line-clamp-3 flex-1 leading-7">{truncate(post.excerpt, 100)}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-14 flex flex-col items-center gap-4" aria-label="Pagination">
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {currentPage > 1 ? (
                      <Link
                        href={buildHref(currentPage - 1)}
                        rel="prev"
                        className="inline-flex items-center gap-1.5 border border-[#e5e5e0] bg-white px-3.5 py-2 text-[0.78rem] font-bold text-ink-600 transition-colors duration-150 hover:border-brand-700 hover:text-brand-700"
                      >
                        <CaretLeft size={12} weight="duotone" /> Prev
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 border border-[#e5e5e0] bg-white px-3.5 py-2 text-[0.78rem] font-bold text-ink-300 cursor-not-allowed">
                        <CaretLeft size={12} weight="duotone" /> Prev
                      </span>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={buildHref(p)}
                        aria-current={p === currentPage ? 'page' : undefined}
                        className={pageBtnClass(p === currentPage)}
                      >
                        {p}
                      </Link>
                    ))}

                    {currentPage < totalPages ? (
                      <Link
                        href={buildHref(currentPage + 1)}
                        rel="next"
                        className="inline-flex items-center gap-1.5 border border-[#e5e5e0] bg-white px-3.5 py-2 text-[0.78rem] font-bold text-ink-600 transition-colors duration-150 hover:border-brand-700 hover:text-brand-700"
                      >
                        Next <CaretRight size={12} weight="duotone" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 border border-[#e5e5e0] bg-white px-3.5 py-2 text-[0.78rem] font-bold text-ink-300 cursor-not-allowed">
                        Next <CaretRight size={12} weight="duotone" />
                      </span>
                    )}
                  </div>

                  <p className="text-[0.75rem] text-ink-400">
                    Page {currentPage} of {totalPages} · {total} {total === 1 ? 'post' : 'posts'}
                  </p>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
