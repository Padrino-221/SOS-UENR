import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProjectDetail } from './project-detail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { title: true, abstract: true },
  })
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Student Projects`,
    description: project.abstract?.slice(0, 160),
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      supervisor: { select: { id: true, name: true, title: true } },
      department: { select: { name: true, slug: true } },
      academicYear: { select: { year: true } },
    },
  })

  if (!project) notFound()

  return <ProjectDetail project={project} />
}
