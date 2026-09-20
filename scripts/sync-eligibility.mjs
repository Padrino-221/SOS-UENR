/**
 * SYNC: Force-apply the canonical eligibility rules (from fix-programmes-from-ref.mjs)
 * to every programme, and create any programme that is missing but has a rule.
 *
 * Safe by design:
 *  - only writes `eligibilityRule` on existing programmes (never name/level/department/etc.)
 *  - never deletes anything
 *  - creates a missing programme ONLY when its metadata is known in META below
 *
 * Run against any database via DATABASE_URL (local or production):
 *   node scripts/sync-eligibility.mjs
 */
import { PrismaClient } from "@prisma/client"
import { rules } from "./fix-programmes-from-ref.mjs"

const prisma = new PrismaClient()

// Metadata for SoS programmes (deptSlug per sync-sos-depts.mjs). Other schools'
// programmes are expected to exist already on every environment.
const META = {
  "bsc-actuarial-science": { name: "BSc Actuarial Science", duration: "4 Years", deptSlug: "mathematics-and-statistics" },
  "bsc-mathematics": { name: "BSc Mathematics", duration: "4 Years", deptSlug: "mathematics-and-statistics" },
  "bsc-statistics": { name: "BSc Statistics", duration: "4 Years", deptSlug: "mathematics-and-statistics" },
  "diploma-statistics": { name: "Diploma in Statistics", duration: "2 Years", deptSlug: "mathematics-and-statistics" },
  "bsc-biological-science": { name: "BSc Biological Science", duration: "4 Years", deptSlug: "basic-and-applied-biology" },
  "bsc-biochemistry": { name: "BSc Biochemistry", duration: "4 Years", deptSlug: "chemical-sciences" },
  "bsc-chemistry": { name: "BSc Chemistry", duration: "4 Years", deptSlug: "chemical-sciences" },
  "bsc-engineering-physics": { name: "BSc Engineering Physics", duration: "4 Years", deptSlug: "chemical-sciences" },
  "bsc-computer-science": { name: "BSc Computer Science", duration: "4 Years", deptSlug: "computer-science-and-informatics" },
  "diploma-computer-science": { name: "Diploma in Computer Science", duration: "2 Years", deptSlug: "computer-science-and-informatics" },
  "bsc-information-technology": { name: "BSc Information Technology", duration: "4 Years", deptSlug: "information-technology-and-decision-sciences" },
  "diploma-information-technology": { name: "Diploma in Information Technology", duration: "2 Years", deptSlug: "information-technology-and-decision-sciences" },
  "bsc-medical-laboratory-science": { name: "BSc Medical Laboratory Science", duration: "4 Years", deptSlug: "medical-laboratory-science" },
  "bsc-nursing": { name: "BSc Nursing", duration: "4 Years", deptSlug: "nursing" },
}

async function main() {
  const deptRows = await prisma.department.findMany({ select: { slug: true, id: true } })
  const deptIdBySlug = new Map(deptRows.map((d) => [d.slug, d.id]))

  let updated = 0
  let created = 0
  let skipped = 0

  for (const [slug, rule] of Object.entries(rules)) {
    const existing = await prisma.programme.findUnique({ where: { slug } })
    if (existing) {
      await prisma.programme.update({ where: { slug }, data: { eligibilityRule: rule } })
      updated++
      console.log(`rule  ✓ ${slug}`)
      continue
    }

    const meta = META[slug]
    if (!meta) {
      skipped++
      console.log(`skip  ? ${slug} — not in DB and no known metadata`)
      continue
    }

    const departmentId = deptIdBySlug.get(meta.deptSlug) ?? null
    await prisma.programme.create({
      data: {
        slug,
        name: meta.name,
        level: rule.level,
        mode: "Regular",
        duration: meta.duration,
        departmentId,
        summary: `${meta.name} programme at the University of Energy and Natural Resources.`,
        published: true,
        eligibilityRule: rule,
      },
    })
    created++
    console.log(`prog  + ${slug} (${meta.name}${departmentId ? "" : " — no department found"})`)
  }

  console.log(`\nDone. rules updated: ${updated}, programmes created: ${created}, skipped: ${skipped}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })