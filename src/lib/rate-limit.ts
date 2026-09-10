type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

/**
 * Simple in-memory sliding window rate limiter.
 * Works per server instance — sufficient for single-instance deployments.
 * For multi-instance, replace with Redis/Upstash.
 */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number } = { limit: 5, windowMs: 60_000 },
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + opts.windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: opts.limit - 1, resetAt }
  }

  if (entry.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: opts.limit - entry.count, resetAt: entry.resetAt }
}

// Cleanup expired entries periodically (prevent unbounded growth)
if (typeof setInterval !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any
  if (!g.__rateLimitCleanup) {
    g.__rateLimitCleanup = setInterval(
      () => {
        const now = Date.now()
        for (const [k, v] of store.entries()) {
          if (v.resetAt <= now) store.delete(k)
        }
      },
      5 * 60 * 1000,
    )
    // Allow process to exit even if interval is active
    if (g.__rateLimitCleanup.unref) g.__rateLimitCleanup.unref()
  }
}

export function getClientKey(request?: Request, fallback = 'unknown'): string {
  if (!request) return fallback
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return fallback
}
