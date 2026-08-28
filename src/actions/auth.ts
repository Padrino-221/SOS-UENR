'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createSession, destroySession, getSession } from '@/lib/auth'

export async function loginAction(prev: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.active) {
    return { error: 'Invalid credentials.' }
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return { error: 'Invalid credentials.' }
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  redirect('/admin')
}

export async function logoutAction() {
  await destroySession()
  redirect('/admin/login')
}

export async function getUserForAdmin() {
  return getSession()
}

export async function revalidatePublic() {
  revalidatePath('/')
  revalidatePath('/programmes')
  revalidatePath('/news')
  revalidatePath('/research')
  revalidatePath('/staff')
  revalidatePath('/about')
}

export async function requestPasswordReset(
  prev: unknown,
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email) {
    return { error: 'Email is required.', success: false }
  }
  // Always show success to prevent email enumeration
  return { error: '', success: true }
}
