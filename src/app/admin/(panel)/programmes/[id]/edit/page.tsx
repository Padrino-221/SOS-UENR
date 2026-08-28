import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProgrammeForm } from '@/components/admin/programme-form'

export const dynamic = 'force-dynamic'

export default async function EditProgrammePage({
  params,
}: PageProps<'/admin/programmes/[id]/edit'>) {
  const { id } = await params
  const [programme, departments] = await Promise.all([
    prisma.programme.findUnique({ where: { id } }),
    prisma.department.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!programme) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit programme</h2>
        <p className="mt-1 text-sm text-ink-700">{programme.name}</p>
      </div>
      <ProgrammeForm programme={programme} departments={departments} />
    </div>
  )
}
