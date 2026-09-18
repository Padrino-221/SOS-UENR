import { EligibilityChecker } from '@/components/site/eligibility-checker'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function EligibilityCheckerPage() {
  const programmes = await prisma.programme.findMany({
    where: { published: true, level: { not: 'POSTGRADUATE' } },
    include: { department: { select: { name: true, school: true } } },
    orderBy: [{ level: 'asc' }, { ordering: 'asc' }],
  })

  const serialised = programmes.map((p) => ({
    slug: p.slug,
    name: p.name,
    level: p.level,
    summary: p.summary,
    department: p.department,
    requirements: p.requirements,
    eligibilityRule: (p.eligibilityRule as unknown) as import('@/lib/eligibility').EligibilityRule | null,
  }))

  return <EligibilityChecker programmes={serialised} />
}
