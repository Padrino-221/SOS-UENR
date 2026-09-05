import { getDepartments, getProgrammes, getFeaturedPosts } from '@/lib/data'
import { getSiteSections } from '@/lib/site-content'
import { PreviewClient } from './preview-client'

export const dynamic = 'force-dynamic'

export default async function PreviewPage() {
  const [departments, featuredPosts, programmes, sections] = await Promise.all([
    getDepartments(),
    getFeaturedPosts(3),
    getProgrammes(),
    getSiteSections(),
  ])

  return (
    <PreviewClient
      liveDepartments={departments}
      liveFeaturedPosts={featuredPosts}
      liveProgrammes={programmes}
      liveSections={sections}
    />
  )
}
