import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { PageHero } from '@/components/site/page-hero'
import { ProjectsTable } from '@/components/site/projects-table'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Student Projects',
  description: 'Browse student project works from the School of Sciences, UENR.',
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    include: {
      supervisor: { select: { name: true } },
      department: { select: { name: true } },
      academicYear: { select: { year: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <PageHero
        title="Student Projects"
        subtitle="Browse student project works from the School of Sciences — BSc, Diploma, MSc, MPHIL, and PhD projects."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense>
          <ProjectsTable projects={projects} />
        </Suspense>
      </section>
    </>
  )
}
