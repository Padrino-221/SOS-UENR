'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { slugify, unwrapList } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { sendSpmsAccessEmail, sendSpmsAccessRevokedEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import type { ProgrammeLevel } from '@prisma/client'
import crypto from 'crypto'

async function guard() {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
}

// ---------- Programmes ----------

export async function upsertProgramme(formData: FormData) {
  const session = await guard()
  void session

  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim() || slugify(name)
  const code = String(formData.get('code') ?? '').trim() || null
  const level = String(formData.get('level') ?? 'DEGREE') as ProgrammeLevel
  const mode = String(formData.get('mode') ?? '').trim() || null
  const duration = String(formData.get('duration') ?? '').trim() || null
  const summary = String(formData.get('summary') ?? '').trim()
  const overview = String(formData.get('overview') ?? '').trim()
  const requirements = unwrapList(String(formData.get('requirements') ?? ''))
  const careerPaths = unwrapList(String(formData.get('careerPaths') ?? ''))
  const departmentId = String(formData.get('departmentId') ?? '') || null
  const published = String(formData.get('published') ?? '') === 'on'

  const data = {
    slug,
    name,
    code,
    level,
    mode,
    duration,
    summary,
    overview,
    requirements,
    careerPaths,
    departmentId,
    published,
  }

  if (id) {
    await prisma.programme.update({ where: { id }, data })
  } else {
    await prisma.programme.create({ data })
  }

  revalidatePath('/admin/programmes')
  revalidatePath('/programmes')
  redirect('/admin/programmes?toast=' + encodeURIComponent(id ? 'Programme updated.' : 'Programme created.'))
}

export async function deleteProgramme(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.programme.delete({ where: { id } })
  }
  revalidatePath('/admin/programmes')
  revalidatePath('/programmes')
}

// ---------- Posts ----------

export async function upsertPost(formData: FormData) {
  const session = await guard()
  const id = String(formData.get('id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim() || slugify(title)
  const category = String(formData.get('category') ?? 'NEWS') as
    | 'NEWS'
    | 'ANNOUNCEMENT'
    | 'EVENT'
  const excerpt = String(formData.get('excerpt') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const coverImage = String(formData.get('coverImage') ?? '').trim() || null
  const featured = String(formData.get('featured') ?? '') === 'on'
  const published = String(formData.get('published') ?? '') === 'on'

  const data = {
    slug,
    title,
    category,
    excerpt,
    content,
    coverImage,
    featured,
    published,
    authorId: session.id,
  }

  if (id) {
    await prisma.post.update({ where: { id }, data })
  } else {
    await prisma.post.create({
      data: { ...data, publishedAt: new Date() },
    })
  }

  revalidatePath('/admin/posts')
  revalidatePath('/news')
  redirect('/admin/posts?toast=' + encodeURIComponent(id ? 'Post updated.' : 'Post created.'))
}

export async function deletePost(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.post.delete({ where: { id } })
  }
  revalidatePath('/admin/posts')
  revalidatePath('/news')
}

// ---------- Departments ----------

export async function upsertDepartment(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim() || slugify(name)
  const shortName = String(formData.get('shortName') ?? '').trim() || null
  const summary = String(formData.get('summary') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const ordering = Number(formData.get('ordering') ?? 0) || 0

  const data = {
    slug,
    name,
    shortName,
    summary,
    description,
    ordering,
  }

  if (id) {
    await prisma.department.update({ where: { id }, data })
  } else {
    await prisma.department.create({ data })
  }

  revalidatePath('/admin/departments')
  revalidatePath('/about')
  redirect('/admin/departments?toast=' + encodeURIComponent(id ? 'Department updated.' : 'Department created.'))
}

export async function deleteDepartment(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.department.delete({ where: { id } })
  }
  revalidatePath('/admin/departments')
  revalidatePath('/about')
}

// ---------- Staff ----------

export async function upsertStaff(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim() || null
  const email = String(formData.get('email') ?? '').trim() || null
  const phone = String(formData.get('phone') ?? '').trim() || null
  const bio = String(formData.get('bio') ?? '').trim()
  const roles = String(formData.get('roles') ?? '').trim() || null
  const staffType = String(formData.get('staffType') ?? 'LECTURER') as 'LECTURER' | 'REGISTRAR' | 'ADMINISTRATOR'
  const departmentId = String(formData.get('departmentId') ?? '') || null
  const photoUrl = String(formData.get('photoUrl') ?? '').trim() || null
  const showOnPublic = String(formData.get('showOnPublic') ?? '') === 'on'
  const spmsAccess = String(formData.get('spmsAccess') ?? '') === 'on'


  const ordering = Number(formData.get('ordering') ?? 0) || 0

  // Check if spmsAccess is changing (for email notification)
  let prevSpmsAccess = false
  let prevEmail: string | null = null
  let prevName = name
  if (id) {
    const existing = await prisma.staff.findUnique({ where: { id }, select: { spmsAccess: true, email: true, name: true } })
    if (existing) {
      prevSpmsAccess = existing.spmsAccess
      prevEmail = existing.email
      prevName = existing.name
    }
  }

  const data: Record<string, unknown> = {
    name,
    title,
    email,
    phone,
    bio,
    roles,
    staffType,
    departmentId,
    photoUrl,
    showOnPublic,
    spmsAccess,
    ordering,
  }

  // If SPMS access is being granted and staff has an email, generate reset token
  if (spmsAccess && !prevSpmsAccess && email) {
    const token = crypto.randomUUID()
    const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
    data.spmsResetToken = token
    data.spmsResetExpiry = expiry
    data.spmsPasswordChanged = false

    // Send email (non-blocking)
    sendSpmsAccessEmail({ name, email, token }).catch((err) => {
      console.error('[SPMS] Failed to send access email:', err)
    })
  }

  // If SPMS access is being revoked, clear token and notify
  if (!spmsAccess && prevSpmsAccess && prevEmail) {
    data.spmsResetToken = null
    data.spmsResetExpiry = null
    data.spmsPasswordChanged = false

    sendSpmsAccessRevokedEmail({ name: prevName, email: prevEmail }).catch((err) => {
      console.error('[SPMS] Failed to send revoked email:', err)
    })
  }

  if (id) {
    await prisma.staff.update({ where: { id }, data: data as any })
  } else {
    await prisma.staff.create({ data: data as any })
  }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
  revalidatePath('/leadership')
  redirect('/admin/staff?toast=' + encodeURIComponent(id ? 'Staff updated.' : 'Staff created.'))
}

export async function deleteStaff(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.staff.delete({ where: { id } })
  }
  revalidatePath('/admin/staff')
  revalidatePath('/staff')
}

// ---------- Research ----------

export async function upsertResearch(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim() || slugify(title)
  const summary = String(formData.get('summary') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const published = String(formData.get('published') ?? '') === 'on'
  const ordering = Number(formData.get('ordering') ?? 0) || 0

  const data = { slug, title, summary, content, published, ordering }

  if (id) {
    await prisma.researchArea.update({ where: { id }, data })
  } else {
    await prisma.researchArea.create({ data })
  }

  revalidatePath('/admin/research')
  revalidatePath('/research')
  redirect('/admin/research?toast=' + encodeURIComponent(id ? 'Research updated.' : 'Research created.'))
}

export async function deleteResearch(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.researchArea.delete({ where: { id } })
  }
  revalidatePath('/admin/research')
  revalidatePath('/research')
}

// ---------- Resources ----------

export async function upsertResource(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const fileUrl = String(formData.get('fileUrl') ?? '').trim()
  const fileName = String(formData.get('fileName') ?? '').trim() || null
  const category = String(formData.get('category') ?? 'HANDBOOK') as 'HANDBOOK' | 'STUDENT_LIST' | 'OTHER'
  const academicYearId = String(formData.get('academicYearId') ?? '') || null

  if (!title || !fileUrl) {
    redirect('/admin/resources?toast=' + encodeURIComponent('Title and file are required.'))
  }

  const data = {
    title,
    description,
    fileUrl,
    fileName,
    category,
    academicYearId,
  }

  if (id) {
    await prisma.resource.update({ where: { id }, data })
  } else {
    await prisma.resource.create({ data })
  }

  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  redirect('/admin/resources?toast=' + encodeURIComponent(id ? 'Resource updated.' : 'Resource created.'))
}

export async function deleteResource(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.resource.delete({ where: { id } })
  }
  revalidatePath('/admin/resources')
  revalidatePath('/resources')
}

// ---------- User management ----------

type UserFormState = { error: string; success: boolean }

export async function createUser(
  prev: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const session = await guard()
  if (session.role !== 'ADMIN') {
    return { error: 'Only admins can create users.', success: false }
  }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const role = String(formData.get('role') ?? 'EDITOR') as 'ADMIN' | 'EDITOR'
  const password = String(formData.get('password') ?? '')

  if (!email || !password || password.length < 8) {
    return {
      error: 'A valid email and a password of at least 8 characters are required.',
      success: false,
    }
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return { error: 'A user with that email already exists.', success: false }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { email, name, role, passwordHash } })
  revalidatePath('/admin/users')
  return { error: '', success: true }
}

export async function deleteUser(formData: FormData) {
  const session = await guard()
  const id = String(formData.get('id') ?? '')
  if (session.role !== 'ADMIN') return
  if (id === session.id) return
  await prisma.user.delete({ where: { id } }).catch(() => null)
  revalidatePath('/admin/users')
}

// ---------- Contact messages ----------

export async function deleteContactMessage(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.contactMessage.delete({ where: { id } }).catch(() => null)
  }
  revalidatePath('/admin/messages')
}

// ---------- Profile ----------

type ProfileFormState = { error: string; success: boolean }

export async function updateProfileName(
  prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await guard()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) {
    return { error: 'Name is required.', success: false }
  }
  await prisma.user.update({ where: { id: session.id }, data: { name } })
  revalidatePath('/admin/profile')
  revalidatePath('/admin')
  return { error: '', success: true }
}

export async function updateProfilePassword(
  prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await guard()
  const current = String(formData.get('currentPassword') ?? '')
  const newPass = String(formData.get('newPassword') ?? '')
  const confirm = String(formData.get('confirmPassword') ?? '')

  if (!current || !newPass) {
    return { error: 'All fields are required.', success: false }
  }
  if (newPass.length < 8) {
    return { error: 'New password must be at least 8 characters.', success: false }
  }
  if (newPass !== confirm) {
    return { error: 'New passwords do not match.', success: false }
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) return { error: 'User not found.', success: false }

  const valid = await bcrypt.compare(current, user.passwordHash)
  if (!valid) {
    return { error: 'Current password is incorrect.', success: false }
  }

  const passwordHash = await bcrypt.hash(newPass, 10)
  await prisma.user.update({ where: { id: session.id }, data: { passwordHash } })
  return { error: '', success: true }
}
