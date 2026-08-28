import { prisma } from '@/lib/db'
import { siteDefaults, type SiteSections, type SiteSectionKey } from '@/data/siteDefaults'

/* eslint-disable @typescript-eslint/no-explicit-any */
function deepMerge(defaults: any, saved: any): any {
  if (!saved || typeof saved !== 'object') return defaults
  if (!defaults || typeof defaults !== 'object') return saved
  const result: any = { ...defaults }
  for (const key of Object.keys(saved)) {
    const savedVal = saved[key]
    const defaultVal = defaults[key]
    if (
      savedVal !== null &&
      savedVal !== undefined &&
      typeof savedVal === 'object' &&
      !Array.isArray(savedVal) &&
      typeof defaultVal === 'object' &&
      defaultVal !== null &&
      !Array.isArray(defaultVal)
    ) {
      result[key] = deepMerge(defaultVal, savedVal)
    } else if (savedVal !== undefined) {
      result[key] = savedVal
    }
  }
  return result
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getSiteSections(): Promise<SiteSections> {
  const rows = await prisma.siteSetting.findMany()
  const saved: Record<string, unknown> = {}
  for (const row of rows) {
    try {
      saved[row.key] = JSON.parse(row.value)
    } catch {
      saved[row.key] = row.value
    }
  }

  const sections = { ...siteDefaults }
  for (const key of Object.keys(siteDefaults) as SiteSectionKey[]) {
    const sectionKey = `section_${key}`
    if (saved[sectionKey]) {
      ;(sections as any)[key] = deepMerge(siteDefaults[key], saved[sectionKey])
    }
  }

  return sections
}

export async function getSiteSection<K extends SiteSectionKey>(
  key: K,
): Promise<SiteSections[K]> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: `section_${key}` },
  })
  if (!row) return siteDefaults[key]
  try {
    const parsed = JSON.parse(row.value)
    return deepMerge(siteDefaults[key], parsed)
  } catch {
    return siteDefaults[key]
  }
}
