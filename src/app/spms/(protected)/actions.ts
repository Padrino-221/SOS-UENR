'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'
import {
  createSpmsSession,
  destroySpmsSession,
  requireSpmsAuth,
  requireSpmsAdmin,
} from '@/lib/spms-auth'
import type { DegreeLevel } from '@prisma/client'

// ---------- Auth ----------

export async function spmsLogin(prev: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const staff = await prisma.staff.findFirst({
    where: { email, spmsAccess: true },
  })

  if (!staff) {
    return { error: 'Invalid credentials.' }
  }

  // Check password: try bcrypt hash first, fall back to default scheme
  let valid = false
  if (staff.passwordHash) {
    valid = await bcrypt.compare(password, staff.passwordHash)
  } else {
    // Default scheme: email prefix + "123"
    const defaultPassword = email.split('@')[0] + '123'
    valid = password === defaultPassword
  }

  if (!valid) {
    return { error: 'Invalid credentials.' }
  }

  await createSpmsSession({
    id: staff.id,
    email: staff.email ?? '',
    name: staff.name,
    departmentId: staff.departmentId,
  })

  // If password not yet set, redirect to change-password page
  if (!staff.spmsPasswordChanged) {
    redirect('/spms/change-password')
  }

  redirect('/spms/dashboard')
}

export async function spmsLogout() {
  await destroySpmsSession()
  redirect('/spms/login')
}

// ---------- Password Management ----------

export async function setSpmsPassword(prev: unknown, formData: FormData) {
  const token = String(formData.get('token') ?? '')
  const newPassword = String(formData.get('newPassword') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  if (!token) return { error: 'Invalid request.' }

  if (!newPassword) return { error: 'Password is required.' }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  if (newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const staff = await prisma.staff.findFirst({
    where: {
      spmsResetToken: token,
      spmsAccess: true,
    },
  })

  if (!staff) return { error: 'Invalid or expired link.' }
  if (!staff.spmsResetExpiry || staff.spmsResetExpiry < new Date()) {
    return { error: 'This link has expired. Please contact your administrator.' }
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)

  await prisma.staff.update({
    where: { id: staff.id },
    data: {
      passwordHash,
      spmsPasswordChanged: true,
      spmsResetToken: null,
      spmsResetExpiry: null,
    },
  })

  redirect('/spms/login?toast=' + encodeURIComponent('Password set successfully. You can now log in.'))
}

export async function changeSpmsPassword(prev: unknown, formData: FormData) {
  const session = await requireSpmsAuth()

  const newPassword = String(formData.get('newPassword') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  if (!newPassword) return { error: 'Password is required.' }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  if (newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)

  await prisma.staff.update({
    where: { id: session.staffId },
    data: {
      passwordHash,
      spmsPasswordChanged: true,
    },
  })

  redirect('/spms/dashboard')
}

// ---------- Projects ----------

export async function createSpmsProject(prev: unknown, formData: FormData) {
  const session = await requireSpmsAuth()

  const title = String(formData.get('title') ?? '').trim()
  const abstract = String(formData.get('abstract') ?? '').trim()
  const objective = String(formData.get('objective') ?? '').trim()
  const studentName = String(formData.get('studentName') ?? '').trim() || null
  const groupMembers = String(formData.get('groupMembers') ?? '').trim() || null
  const programme = String(formData.get('programme') ?? '').trim() || null
  const degreeLevel = String(formData.get('degreeLevel') ?? 'BSc') as DegreeLevel
  const academicYearId = String(formData.get('academicYearId') ?? '') || null
  const departmentId = String(formData.get('departmentId') ?? '') || session.departmentId
  const supervisorId = String(formData.get('supervisorId') ?? '') || session.staffId
  const documentUrl = String(formData.get('documentUrl') ?? '').trim() || null
  const documentName = String(formData.get('documentName') ?? '').trim() || null
  const githubLink = String(formData.get('githubLink') ?? '').trim() || null

  if (!title) {
    return { error: 'Title is required.' }
  }

  const slug = slugify(title)

  await prisma.project.create({
    data: {
      slug,
      title,
      abstract,
      objective,
      studentName,
      groupMembers,
      programme,
      degreeLevel,
      academicYearId,
      departmentId,
      supervisorId,
      documentUrl,
      documentName,
      githubLink,
    },
  })

  revalidatePath('/spms/projects')
  revalidatePath('/projects')
  redirect('/spms/projects?toast=' + encodeURIComponent('Project created.'))
}

export async function updateSpmsProject(prev: unknown, formData: FormData) {
  const session = await requireSpmsAuth()
  const id = String(formData.get('id') ?? '')

  if (!id) return { error: 'Project ID is required.' }

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) return { error: 'Project not found.' }
  if (session.role !== 'ADMIN' && existing.supervisorId !== session.staffId) {
    return { error: 'Not authorized.' }
  }

  const title = String(formData.get('title') ?? '').trim()
  const abstract = String(formData.get('abstract') ?? '').trim()
  const objective = String(formData.get('objective') ?? '').trim()
  const studentName = String(formData.get('studentName') ?? '').trim() || null
  const groupMembers = String(formData.get('groupMembers') ?? '').trim() || null
  const programme = String(formData.get('programme') ?? '').trim() || null
  const degreeLevel = String(formData.get('degreeLevel') ?? 'BSc') as DegreeLevel
  const academicYearId = String(formData.get('academicYearId') ?? '') || null
  const departmentId = String(formData.get('departmentId') ?? '') || existing.departmentId
  const supervisorId = session.role === 'ADMIN'
    ? (String(formData.get('supervisorId') ?? '') || existing.supervisorId)
    : session.staffId
  const documentUrl = String(formData.get('documentUrl') ?? '').trim() || null
  const documentName = String(formData.get('documentName') ?? '').trim() || null
  const githubLink = String(formData.get('githubLink') ?? '').trim() || null
  const published = String(formData.get('published') ?? '') === 'on'

  await prisma.project.update({
    where: { id },
    data: {
      title,
      abstract,
      objective,
      studentName,
      groupMembers,
      programme,
      degreeLevel,
      academicYearId,
      departmentId,
      supervisorId,
      documentUrl,
      documentName,
      githubLink,
      published,
    },
  })

  revalidatePath('/spms/projects')
  revalidatePath('/projects')
  redirect('/spms/projects?toast=' + encodeURIComponent('Project updated.'))
}

export async function deleteSpmsProject(formData: FormData) {
  const session = await requireSpmsAuth()
  const id = String(formData.get('id') ?? '')

  if (!id) return

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) return
  if (session.role !== 'ADMIN' && existing.supervisorId !== session.staffId) {
    return
  }

  await prisma.project.delete({ where: { id } })
  revalidatePath('/spms/projects')
  revalidatePath('/projects')
}

// ---------- Academic Years ----------

export async function createAcademicYear(prev: unknown, formData: FormData) {
  await requireSpmsAdmin()
  const year = String(formData.get('year') ?? '').trim()

  if (!year) return { error: 'Year is required.' }

  const exists = await prisma.academicYear.findUnique({ where: { year } })
  if (exists) return { error: 'Academic year already exists.' }

  await prisma.academicYear.create({ data: { year } })
  revalidatePath('/spms/settings')
  return { error: '', success: true }
}

export async function deleteAcademicYear(formData: FormData) {
  await requireSpmsAdmin()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.academicYear.delete({ where: { id } }).catch(() => null)
  }
  revalidatePath('/spms/settings')
}

export async function toggleActiveYear(formData: FormData) {
  await requireSpmsAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.academicYear.updateMany({ data: { active: false } })
  await prisma.academicYear.update({ where: { id }, data: { active: true } })
  revalidatePath('/spms/settings')
}

// ---------- Profile ----------

export async function updateSpmsProfile(prev: unknown, formData: FormData) {
  const session = await requireSpmsAuth()

  const name = String(formData.get('name') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim() || null
  const phone = String(formData.get('phone') ?? '').trim() || null
  const bio = String(formData.get('bio') ?? '').trim()
  const researchAreas = String(formData.get('researchAreas') ?? '').trim()
  const photoUrl = String(formData.get('photoUrl') ?? '').trim() || null

  if (!name) return { error: 'Name is required.' }

  await prisma.staff.update({
    where: { id: session.staffId },
    data: { name, title, phone, bio, researchAreas, photoUrl },
  })

  revalidatePath('/spms/profile')
  revalidatePath('/spms/dashboard')
  return { success: true }
}
