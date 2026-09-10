import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHmac, timingSafeEqual } from 'crypto'

const SPMS_COOKIE = 'school_sciences_spms_session'
const SPMS_TTL_MS = 1000 * 60 * 60 * 24 * 7

export interface SpmsSession {
  staffId: string
  email: string
  name: string
  departmentId: string | null
  role: 'LECTURER' | 'ADMIN'
}

function spmsSign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('hex')
}

function makeSpmsToken(session: SpmsSession): string {
  const payload = {
    ...session,
    iat: Date.now(),
    exp: Date.now() + SPMS_TTL_MS,
  }
  const base = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = spmsSign(base, process.env.AUTH_SECRET || '')
  return `${base}.${sig}`
}

function verifySpmsToken(token: string): SpmsSession | null {
  try {
    const [base, sig] = token.split('.')
    if (!base || !sig) return null
    const expected = spmsSign(base, process.env.AUTH_SECRET || '')
    // timing-safe comparison to prevent timing attacks
    const sigBuf = Buffer.from(sig, 'utf8')
    const expBuf = Buffer.from(expected, 'utf8')
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null

    const payload = JSON.parse(Buffer.from(base, 'base64url').toString('utf8')) as SpmsSession & {
      exp: number
    }
    if (payload.exp < Date.now()) return null
    return {
      staffId: payload.staffId,
      email: payload.email,
      name: payload.name,
      departmentId: payload.departmentId,
      role: payload.role,
    }
  } catch {
    return null
  }
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

  const token = makeSpmsToken(session)
  const cookieStore = await cookies()
  cookieStore.set(SPMS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SPMS_TTL_MS / 1000,
  })
}

export async function getSpmsSession(): Promise<SpmsSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SPMS_COOKIE)?.value
  if (!raw) return null

  // Try signed token first
  const verified = verifySpmsToken(raw)
  if (verified) return verified

  // Legacy unsigned JSON cookie — invalidate it (prevents tampering)
  // If it looks like plain JSON, delete it and force re-login
  try {
    const legacy = JSON.parse(raw) as SpmsSession
    if (legacy && typeof legacy.staffId === 'string') {
      const store = await cookies()
      // Delete legacy cookie asynchronously; caller will see null and redirect
      store.delete(SPMS_COOKIE)
    }
  } catch {
    // not JSON, ignore
  }
  return null
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
