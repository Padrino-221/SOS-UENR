import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function rule(level, cores, { coreAlternative = null, minGrade = "C6", electiveCount = 3, electiveGroups = [], requiresExam = false, aggregateCutOff = null, note = null } = {}) {
  return { level, cores, coreAlternative, minGrade, electiveCount, electiveGroups, requiresExam, aggregateCutOff, note }
}

const rules = {
  "bsc-actuarial-science": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics","Further Mathematics","Business Mathematics"], label: "Elective Mathematics / Further Mathematics / Business Mathematics" },
    ],
    electiveCount: 3,
    note: "Any 3 electives from General Science, Business or Arts including the required maths option.",
  }),

  "bsc-mathematics": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics","Further Mathematics"], label: "Elective Mathematics or Further Mathematics" },
    ],
    electiveCount: 3,
  }),

  "bsc-statistics": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics","Further Mathematics"], label: "Elective Mathematics or Further Mathematics" },
    ],
    electiveCount: 3,
  }),

  // Diploma Statistics — 5 subjects, 2 electives
  "diploma-statistics": rule("DIPLOMA", ["English Language","Mathematics","Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 2,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics","Business Mathematics"], label: "Elective Mathematics or Business Mathematics" },
    ],
    note: "Diploma: 5 subjects total (3 cores + 2 electives) at A1-C6.",
  }),

  "bsc-biological-sciences": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics","Physics"], label: "Elective Mathematics or Physics" },
      { any: 1, from: ["Biology","General Agriculture","Forestry"], label: "Biology / General Agriculture / Forestry" },
    ],
    electiveCount: 3,
  }),

  "bsc-biochemistry": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Biology"], label: "Biology" },
      { any: 1, from: ["Physics","Applied Electricity","Elective Mathematics","General Agriculture","Forestry"], label: "Physics / Applied Electricity / Elective Mathematics / General Agriculture / Forestry" },
    ],
    electiveCount: 3,
  }),

  "bsc-chemistry": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Biology","Elective Mathematics"], label: "Biology or Elective Mathematics" },
    ],
    electiveCount: 3,
  }),

  "bsc-computer-science": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 2, from: ["Physics","Applied Electricity","Chemistry","Biology","Geography"], label: "Two from Physics / Applied Electricity, Chemistry, Biology, Geography" },
    ],
    electiveCount: 3,
  }),

  "diploma-computer-science": rule("DIPLOMA", ["English Language","Mathematics","Integrated Science"], {
    electiveCount: 2,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
    ],
    note: "Diploma: 5 subjects, any other elective from Chemistry, Physics/Applied Electricity, ICT/Computing, Geography, Biology, General Agriculture",
  }),

  "bsc-engineering-physics": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics","Applied Electricity"], label: "Elective Mathematics or Applied Electricity" },
    ],
    electiveCount: 3,
  }),

  "bsc-information-technology": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [],
    electiveCount: 3,
    note: "Any 3 electives at C6 or better.",
  }),

  "bsc-medical-laboratory-science": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics","Physics"], label: "Elective Mathematics or Physics" },
      { any: 1, from: ["Biology","General Agriculture","Forestry"], label: "Biology / General Agriculture / Forestry" },
    ],
    electiveCount: 3,
    requiresExam: true,
    note: "Qualified applicants write an entrance exam and attend an interview.",
  }),

  "bsc-nursing": rule("DEGREE", ["English Language","Mathematics","Integrated Science"], {
    electiveGroups: [],
    electiveCount: 3,
    requiresExam: true,
    note: "Electives may be from Science, Agriculture, Home Economics or General Arts as listed — any 3 passed at C6 qualifies for the checker, but you will also sit an entrance exam and interview.",
  }),

  // Postgraduate — not WASSCE based
  "msc-computer-science": rule("POSTGRADUATE", [], { electiveCount: 0, note: "Postgraduate: BSc Second-Class Lower or better required." }),
  "mphil-computer-science": rule("POSTGRADUATE", [], { electiveCount: 0 }),
  "mphil-applied-mathematics": rule("POSTGRADUATE", [], { electiveCount: 0 }),
  "phd-computer-science": rule("POSTGRADUATE", [], { electiveCount: 0 }),
}

async function main() {
  for (const [slug, r] of Object.entries(rules)) {
    const exists = await prisma.programme.findUnique({ where: { slug } })
    if (!exists) {
      console.log(`→ Skip ${slug} (not in DB)`)
      continue
    }
    await prisma.programme.update({
      where: { slug },
      data: { eligibilityRule: r },
    })
    console.log(`✓ Updated ${slug}`)
  }
  // Also try to find diploma variants that may have different slugs
  const all = await prisma.programme.findMany({ select: { slug: true, name: true } })
  console.log("\nAll programme slugs in DB:")
  for (const p of all) console.log(` - ${p.slug} :: ${p.name}`)
  console.log("\nDone.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
