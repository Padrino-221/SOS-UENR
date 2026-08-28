import { prisma } from '@/lib/db'
import { requireSpmsAuth } from '@/lib/spms-auth'
import { PageHeader } from '@/components/ui'
import { RecordsList } from './records-list'

export const dynamic = 'force-dynamic'

export default async function SpmsRecordsPage() {
  const session = await requireSpmsAuth()
  const isAdmin = session.role === 'ADMIN'

  const records = await prisma.project.groupBy({
    by: ['supervisorId', 'academicYearId', 'degreeLevel'],
    _count: { id: true },
    where: isAdmin ? {} : { supervisorId: session.staffId },
  })

  const supervisorIds = records.map((r) => r.supervisorId).filter(Boolean) as string[]
  const yearIds = records.map((r) => r.academicYearId).filter(Boolean) as string[]

  const [supervisors, academicYears] = await Promise.all([
    supervisorIds.length > 0
      ? prisma.staff.findMany({ where: { id: { in: [...new Set(supervisorIds)] } }, select: { id: true, name: true } })
      : [],
    prisma.academicYear.findMany({ orderBy: { year: 'desc' }, select: { id: true, year: true, active: true } }),
  ])

  const supervisorMap = new Map(supervisors.map((s) => [s.id, s.name]))
  const yearMap = new Map(academicYears.map((y) => [y.id, y.year]))
  const activeYearId = academicYears.find((y) => y.active)?.id

  interface FlatRecord {
    id: string
    supervisorId: string | null
    academicYearId: string | null
    degreeLevels: string
    count: number
    supervisorName: string
    yearName: string
  }

  const grouped = new Map<string, FlatRecord>()

  for (const r of records) {
    const key = `${r.supervisorId ?? 'none'}-${r.academicYearId ?? 'none'}`
    const existing = grouped.get(key)
    if (existing) {
      existing.degreeLevels += `, ${r.degreeLevel}`
      existing.count += r._count.id
    } else {
      grouped.set(key, {
        id: key,
        supervisorId: r.supervisorId,
        academicYearId: r.academicYearId,
        degreeLevels: r.degreeLevel,
        count: r._count.id,
        supervisorName: r.supervisorId ? (supervisorMap.get(r.supervisorId) ?? '—') : '—',
        yearName: r.academicYearId ? (yearMap.get(r.academicYearId) ?? '—') : '—',
      })
    }
  }

  const flat = [...grouped.values()].sort((a, b) => {
    const aActive = a.academicYearId === activeYearId ? 0 : 1
    const bActive = b.academicYearId === activeYearId ? 0 : 1
    if (aActive !== bActive) return aActive - bActive
    if (a.yearName !== b.yearName) return b.yearName.localeCompare(a.yearName)
    if (a.supervisorName !== b.supervisorName) return a.supervisorName.localeCompare(b.supervisorName)
    return 0
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Records"
        description="Supervisor project counts by academic year and degree level"
      />
      <RecordsList records={flat} academicYears={academicYears} isAdmin={isAdmin} />
    </div>
  )
}
