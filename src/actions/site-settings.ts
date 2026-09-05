'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSiteSections } from '@/lib/site-content'

async function guard() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function saveSiteSection(
  sectionKey: string,
  data: Record<string, unknown>,
) {
  await guard()
  const key = `section_${sectionKey}`
  const value = JSON.stringify(data)

  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  })

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/programmes')
  revalidatePath('/news')
  revalidatePath('/staff')
  revalidatePath('/contact')
  revalidatePath('/projects')
  revalidatePath('/student-leadership')

  return { success: true }
}

export async function getSiteSectionsAction() {
  await guard()
  return getSiteSections()
}
