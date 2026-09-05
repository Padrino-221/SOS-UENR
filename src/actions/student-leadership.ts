'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function guard() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

function revalidateLeadership() {
  revalidatePath('/admin/student-leadership')
  revalidatePath('/student-leadership')
}

// ---------- Tenures (academic years) ----------

export async function createTenure(formData: FormData) {
  await guard()
  const year = String(formData.get('year') ?? '').trim()

  if (!year) {
    redirect('/admin/student-leadership?toast=' + encodeURIComponent('A year is required.'))
  }

  const exists = await prisma.academicYear.findUnique({ where: { year } })
  if (exists) {
    redirect('/admin/student-leadership?toast=' + encodeURIComponent('That academic year already exists.'))
  }

  // First tenure becomes the current one automatically.
  const activeCount = await prisma.academicYear.count({ where: { active: true } })
  await prisma.academicYear.create({ data: { year, active: activeCount === 0 } })

  revalidateLeadership()
  redirect('/admin/student-leadership?toast=' + encodeURIComponent('Tenure created.'))
}

export async function setCurrentTenure(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.academicYear.updateMany({ data: { active: false } })
  await prisma.academicYear.update({ where: { id }, data: { active: true } })
  revalidateLeadership()
}

export async function deleteTenure(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  // Executives tied to this tenure are removed with it.
  await prisma.academicYear.delete({ where: { id } }).catch(() => null)
  revalidateLeadership()
}

// ---------- Executives ----------

export async function upsertExecutive(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  const academicYearId = String(formData.get('academicYearId') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const position = String(formData.get('position') ?? '').trim()
  const photoUrl = String(formData.get('photoUrl') ?? '').trim() || null
  const departmentId = String(formData.get('departmentId') ?? '') || null
  const ordering = Number(formData.get('ordering') ?? 0) || 0

  const listPath = `/admin/student-leadership/${academicYearId}`

  if (!academicYearId || !name || !position) {
    redirect(listPath + '?toast=' + encodeURIComponent('Name and position are required.'))
  }

  const yearExists = await prisma.academicYear.findUnique({
    where: { id: academicYearId },
    select: { id: true },
  })
  if (!yearExists) {
    redirect('/admin/student-leadership?toast=' + encodeURIComponent('Tenure not found.'))
  }

  const data = { name, position, photoUrl, departmentId, ordering, academicYearId }

  if (id) {
    await prisma.studentExecutive.update({ where: { id }, data })
  } else {
    await prisma.studentExecutive.create({ data })
  }

  revalidateLeadership()
  revalidatePath(listPath)
  redirect(listPath + '?toast=' + encodeURIComponent(id ? 'Executive updated.' : 'Executive added.'))
}

export async function deleteExecutive(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  const academicYearId = String(formData.get('academicYearId') ?? '')
  if (!id) return

  await prisma.studentExecutive.delete({ where: { id } }).catch(() => null)

  revalidatePath('/admin/student-leadership')
  if (academicYearId) revalidatePath(`/admin/student-leadership/${academicYearId}`)
  revalidatePath('/student-leadership')
}
