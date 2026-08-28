import { prisma } from '@/lib/db'
import type { ProgrammeLevel, PostCategory } from '@prisma/client'

export async function getSiteSetting(key: string) {
  const row = await prisma.siteSetting.findUnique({ where: { key } })
  return row?.value ?? ''
}

export async function getDepartments() {
  return prisma.department.findMany({
    orderBy: { ordering: 'asc' },
    include: { _count: { select: { programmes: true } } },
  })
}

export async function getDepartment(slug: string) {
  return prisma.department.findUnique({
    where: { slug },
    include: {
      programmes: { where: { published: true }, orderBy: { ordering: 'asc' } },
      staff: { where: { showOnPublic: true }, orderBy: { ordering: 'asc' } },
    },
  })
}

export async function getProgrammes(filters?: {
  level?: ProgrammeLevel | null
  departmentId?: string | null
}) {
  return prisma.programme.findMany({
    where: {
      published: true,
      ...(filters?.level ? { level: filters.level } : {}),
      ...(filters?.departmentId
        ? { departmentId: filters.departmentId }
        : {}),
    },
    include: { department: true },
    orderBy: [{ level: 'asc' }, { ordering: 'asc' }],
  })
}

export async function getProgramme(slug: string) {
  return prisma.programme.findUnique({
    where: { slug },
    include: { department: true },
  })
}

export async function getPosts(filters?: { category?: PostCategory | null }) {
  return prisma.post.findMany({
    where: {
      published: true,
      ...(filters?.category ? { category: filters.category } : {}),
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
  })
}

export async function getFeaturedPosts(limit = 3) {
  return prisma.post.findMany({
    where: { published: true, featured: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })
}

export async function getStaffMember(id: string) {
  return prisma.staff.findUnique({
    where: { id },
    include: {
      department: true,
      projects: {
        where: { published: true },
        include: {
          department: { select: { name: true } },
          academicYear: { select: { year: true } },
        },
        orderBy: { academicYear: { year: 'desc' } },
      },
    },
  })
}

export async function getResearchAreas() {
  return prisma.researchArea.findMany({
    where: { published: true },
    orderBy: [{ ordering: 'asc' }, { title: 'asc' }],
  })
}

export async function getResearchArea(slug: string) {
  return prisma.researchArea.findUnique({ where: { slug } })
}

export async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug, published: true } })
}
