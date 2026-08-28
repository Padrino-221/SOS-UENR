import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DepartmentForm } from '@/components/admin/department-form'

export const dynamic = 'force-dynamic'

export default async function EditDepartmentPage({
  params,
}: PageProps<'/admin/departments/[id]/edit'>) {
  const { id } = await params
  const department = await prisma.department.findUnique({ where: { id } })

  if (!department) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit department</h2>
        <p className="mt-1 text-sm text-ink-700">{department.name}</p>
      </div>
      <DepartmentForm department={department} />
    </div>
  )
}
