import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

const SPMS_COOKIE = 'school_sciences_spms_session'

export interface SpmsSession {
  staffId: string
  email: string
  name: string
  departmentId: string | null
  role: 'LECTURER' | 'ADMIN'
}

export async function createSpmsSession(staff: {
  id: string
  email: string
  name: string
  departmentId: string | null
}) {
  const session: SpmsSession = {
    staffId: staff.id,
    email: staff.email,
    name: staff.name,
    departmentId: staff.departmentId,
    role: staff.departmentId ? 'LECTURER' : 'ADMIN',
  }

  const cookieStore = await cookies()
  cookieStore.set(SPMS_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSpmsSession(): Promise<SpmsSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SPMS_COOKIE)?.value
  if (!raw) return null

  try {
    return JSON.parse(raw) as SpmsSession
  } catch {
    return null
  }
}

export async function destroySpmsSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SPMS_COOKIE)
}

export async function requireSpmsAuth() {
  const session = await getSpmsSession()
  if (!session) {
    redirect('/spms/login')
  }
  return session
}

export async function requireSpmsAdmin() {
  const session = await requireSpmsAuth()
  if (session.role !== 'ADMIN') {
    redirect('/spms/dashboard')
  }
  return session
}
