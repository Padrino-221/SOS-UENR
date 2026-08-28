import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'crypto'

const SESSION_COOKIE = 'sos_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7

export type SessionUser = {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR'
}

function sign(value: string, secret: string) {
  return createHash('sha256').update(`${value}.${secret}`).digest('hex')
}

function makeToken(user: SessionUser) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  }
  const base = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = sign(base, process.env.AUTH_SECRET || '')
  return `${base}.${sig}`
}

function verifyToken(token: string): SessionUser | null {
  try {
    const [base, sig] = token.split('.')
    const expected = sign(base, process.env.AUTH_SECRET || '')
    if (!sig || sig !== expected) return null

    const payload = JSON.parse(
      Buffer.from(base, 'base64url').toString('utf8'),
    ) as {
      sub: string
      email: string
      name: string
      role: 'ADMIN' | 'EDITOR'
      exp: number
    }
    if (payload.exp < Date.now()) return null

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    }
  } catch {
    return null
  }
}

export async function createSession(user: SessionUser) {
  const token = makeToken(user)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) return null
  return session
}

export function randomSessionId() {
  return randomBytes(32).toString('hex')
}
