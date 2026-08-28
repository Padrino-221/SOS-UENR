import { prisma } from '@/lib/db'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { PageHeader } from '@/components/ui'
import { ToastListener } from '@/components/admin/toast-listener'
import { ProjectsList } from './projects-list'

export const dynamic = 'force-dynamic'

export default async function SpmsProjectsPage() {
  const session = await requireSpmsAuth()
  const isAdmin = session.role === 'ADMIN'

  const where = isAdmin ? {} : { supervisorId: session.staffId }

  const projects = await prisma.project.findMany({
    where,
    include: {
      supervisor: { select: { id: true, name: true } },
      department: { select: { id: true, name: true } },
      academicYear: { select: { id: true, year: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <ToastListener />
      <PageHeader
        title="Projects"
        description={isAdmin ? 'All student projects across departments' : 'Your supervised projects'}
      />
      <ProjectsList
        projects={projects}
        isAdmin={isAdmin}
        currentUserId={session.staffId}
      />
    </div>
  )
}
