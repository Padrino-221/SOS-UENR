type RouteParams = {
  '/programmes/[slug]': { slug: string }
  '/news/[slug]': { slug: string }
  '/departments/[slug]': { slug: string }
  '/research/[slug]': { slug: string }
  '/admin/programmes/[id]/edit': { id: string }
  '/admin/posts/[id]/edit': { id: string }
  '/admin/departments/[id]/edit': { id: string }
  '/admin/staff/[id]/edit': { id: string }
  '/admin/research/[id]/edit': { id: string }
  '/news': Record<string, never>
  '/programmes': Record<string, never>
}

type PageProps<T extends keyof RouteParams> = {
  params: Promise<RouteParams[T]>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
