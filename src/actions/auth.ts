'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createSession, destroySession, getSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

// Dummy hash to mitigate timing attacks when user not found
const DUMMY_HASH = '$2b$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

export async function loginAction(prev: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  // Rate limit: 5 attempts per 15 minutes per email
  const rl = rateLimit(`admin:login:${email}`, { limit: 5, windowMs: 15 * 60 * 1000 })
  if (!rl.allowed) {
    const retrySec = Math.ceil((rl.resetAt - Date.now()) / 1000)
    return { error: `Too many attempts. Try again in ${retrySec}s.` }
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.active) {
    // Burn time with a fake compare to avoid user-enumeration via timing
    await bcrypt.compare(password, DUMMY_HASH).catch(() => null)
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

  const rl = rateLimit(`admin:reset:${email}`, { limit: 3, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) {
    // Still return success to avoid enumeration, but rate-limited internally
    return { error: '', success: true }
  }

  // Currently no User reset-token flow is implemented (no column on User).
  // We intentionally return success to prevent email enumeration.
  // TODO: implement proper reset by adding resetToken/resetExpiry to User and sending email via Resend.
  // For now, lookup is done to keep timing consistent if we add it later.
  await prisma.user.findUnique({ where: { email } }).catch(() => null)

  return { error: '', success: true }
}
