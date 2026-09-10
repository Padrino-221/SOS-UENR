import { PageHero } from '@/components/site/page-hero'
import { EligibilityChecker } from '@/components/site/eligibility-checker'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function EligibilityCheckerPage() {
  const programmes = await prisma.programme.findMany({
    where: { published: true, level: { not: 'POSTGRADUATE' } },
    include: { department: { select: { name: true } } },
    orderBy: [{ level: 'asc' }, { ordering: 'asc' }],
  })

  // Serialize for client (Prisma Json)
  const serialised = programmes.map((p) => ({
    slug: p.slug,
    name: p.name,
    level: p.level,
    summary: p.summary,
    department: p.department,
    requirements: p.requirements,
    eligibilityRule: (p.eligibilityRule as unknown) as import('@/lib/eligibility').EligibilityRule | null,
  }))

  return (
    <>
      <PageHero
        title="Check Your Eligibility"
        subtitle="Enter your WASSCE grades and see which School of Sciences programmes fit you best — instantly, privately on your device."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Programmes', href: '/programmes' }, { label: 'Eligibility Checker' }]}
      />
      <section className="section-padding bg-ink-50">
        <div className="container-premium">
          <EligibilityChecker programmes={serialised} />
        </div>
      </section>
    </>
  )
}
