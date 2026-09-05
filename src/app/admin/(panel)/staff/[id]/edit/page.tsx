import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { StaffForm } from '@/components/admin/staff-form'

export const dynamic = 'force-dynamic'

export default async function EditStaffPage({
  params,
}: PageProps<'/admin/staff/[id]/edit'>) {
  const { id } = await params
  const [staff, departments, academicYears] = await Promise.all([
    prisma.staff.findUnique({ where: { id } }),
    prisma.department.findMany({ orderBy: { name: 'asc' } }),
    prisma.academicYear.findMany({ orderBy: { year: 'desc' } }),
  ])

  if (!staff) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit staff</h2>
        <p className="mt-1 text-sm text-ink-700">{staff.name}</p>
      </div>
      <StaffForm staff={staff} departments={departments} academicYears={academicYears} />
    </div>
  )
}
