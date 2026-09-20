import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function rule(level, cores, { coreAlternative = null, minGrade = "C6", electiveCount = 3, electiveGroups = [], requiresExam = false, aggregateCutOff = null, note = null } = {}) {
  return { level, cores, coreAlternative, minGrade, electiveCount, electiveGroups, requiresExam, aggregateCutOff, note }
}

// Canonical SHS elective lists (must match src/lib/subjects.ts)
const SCIENCE = ["Elective Mathematics", "Biology", "Chemistry", "Physics", "Geography", "General Agriculture", "ICT", "French", "Music"]
const ARTS = ["Christian Religious Studies", "Islamic Religious Studies", "Literature in English", "History", "Government", "Geography", "Economics", "French", "Arabic", "Elective Mathematics", "ICT", "Ghanaian Language", "Music", "West African Traditional Religion"]
const HOME_ECONOMICS = ["Management in Living", "Clothing and Textiles", "Foods and Nutrition", "General Knowledge in Art", "Textiles", "Biology", "Chemistry", "Physics", "Elective Mathematics", "ICT", "Economics", "French", "Music"]
const uniq = (a) => [...new Set(a)]

// Science + Agricultural + Home Economics + General Arts (Nursing)
const NURSING_ELECTIVES = uniq([...SCIENCE, ...HOME_ECONOMICS, ...ARTS])

const rules = {
  "bsc-actuarial-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics", "Business Mathematics"], label: "Elective Mathematics / Further Mathematics / Business Mathematics" },
    ],
    electiveCount: 3,
    note: "Any 3 electives including the required maths option.",
  }),

  "bsc-mathematics": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics"], label: "Elective Mathematics / Further Mathematics" },
    ],
    electiveCount: 3,
  }),

  "bsc-statistics": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics"], label: "Elective Mathematics / Further Mathematics" },
    ],
    electiveCount: 3,
  }),

  // Diploma Statistics — 5 subjects, 2 electives
  "diploma-statistics": rule("DIPLOMA", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    minGrade: "D7",
    electiveCount: 2,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Financial Accounting"], label: "Elective Mathematics or Business Mathematics" },
    ],
    note: "Diploma: 5 subjects total (3 cores + 2 electives) at Passes (D7 or better).",
  }),

  "bsc-biological-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Physics"], label: "Elective Mathematics or Physics" },
      { any: 1, from: ["Biology", "General Agriculture"], label: "Biology / General Agriculture / Forestry" },
    ],
    electiveCount: 3,
  }),

  "bsc-biochemistry": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Biology"], label: "Biology" },
      { any: 1, from: ["Physics", "Applied Electricity", "Elective Mathematics", "General Agriculture"], label: "Physics / Applied Electricity / Elective Mathematics / General Agriculture / Forestry" },
    ],
    electiveCount: 3,
  }),

  "bsc-chemistry": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Biology", "Elective Mathematics"], label: "Biology or Elective Mathematics" },
    ],
    electiveCount: 3,
  }),

  "bsc-computer-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 2, from: ["Physics", "Applied Electricity", "Chemistry", "Biology", "Geography"], label: "Two from Physics / Applied Electricity, Chemistry, Biology, Geography" },
    ],
    electiveCount: 3,
  }),

  "diploma-computer-science": rule("DIPLOMA", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    minGrade: "D7",
    electiveCount: 2,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Chemistry", "Physics", "Applied Electricity", "ICT", "Geography", "Biology", "General Agriculture"], label: "1 from Chemistry, Physics/Applied Electricity, ICT, Computing, Geography, Biology, General Agriculture" },
    ],
    note: "Diploma: 3 cores + Elective Math + 1 from Chemistry, Physics/Applied Electricity, ICT, Computing, Geography, Biology, General Agriculture",
  }),

  "bsc-engineering-physics": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Applied Electricity"], label: "Elective Mathematics or Applied Electricity" },
    ],
    electiveCount: 3,
  }),

  "bsc-information-technology": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [],
    electiveCount: 3,
    note: "Any 3 electives at C6 or better.",
  }),

  "bsc-medical-laboratory-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Physics"], label: "Elective Mathematics or Physics" },
      { any: 1, from: ["Biology", "General Agriculture"], label: "Biology / General Agriculture / Forestry" },
    ],
    electiveCount: 3,
    requiresExam: true,
    note: "Qualified applicants write an entrance exam and attend an interview.",
  }),

  "bsc-nursing": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveGroups: [
      { any: 3, from: NURSING_ELECTIVES, label: "3 electives from Science, Agricultural, Home Economics or General Arts options" },
    ],
    electiveCount: 3,
    requiresExam: true,
    note: "Electives from Science, Agricultural, Home Economics or General Arts options. Entrance exam and interview required.",
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
  console.log("\nDone.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
