import { prisma } from '@/lib/db'
import { StaffList } from '@/components/admin/staff-list'

export const dynamic = 'force-dynamic'

export default async function AdminStaffPage() {
  const [raw, departments, academicYears] = await Promise.all([
    prisma.staff.findMany({
      include: { department: true },
      orderBy: [{ ordering: 'asc' }, { name: 'asc' }],
    }),
    prisma.department.findMany({
      orderBy: { ordering: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.academicYear.findMany({ orderBy: { year: 'desc' } }),
  ])

  const staff = raw.map((s) => ({
    id: s.id,
    name: s.name,
    title: s.title,
    email: s.email,
    phone: s.phone,
    bio: s.bio,
    roles: s.roles,
    staffType: s.staffType,
    spmsAccess: s.spmsAccess,
    photoUrl: s.photoUrl,
    ordering: s.ordering,
    showOnPublic: s.showOnPublic,
    isExecutive: (s as unknown as { isExecutive?: boolean }).isExecutive ?? false,
    executiveYearId: (s as unknown as { executiveYearId?: string | null }).executiveYearId ?? null,
    departmentId: s.departmentId,
    department: s.department,
  }))

  return <StaffList staff={staff} departments={departments} academicYears={academicYears} />
}
