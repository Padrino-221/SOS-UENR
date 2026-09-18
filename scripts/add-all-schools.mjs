/**
 * Migration: Add all UENR schools/programmes from the 2026/2027 admission PDF.
 * Fixes SoS issues (missing programmes, name, department assignments).
 * Adds all other schools and programmes with eligibility rules.
 *
 * Run: node scripts/add-all-schools.mjs
 * Safe to re-run (upserts by slug).
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const departments = [
  // ── School of Sciences (existing, fix assignments) ──
  { slug: "chemical-sciences", name: "Department of Chemical Sciences", shortName: "Chem. Sciences", school: "School of Sciences", ordering: 1 },
  { slug: "computer-science-and-informatics", name: "Department of Computer Science", shortName: "Computer Science", school: "School of Sciences", ordering: 2 },
  { slug: "information-technology-and-decision-sciences", name: "Department of Information Technology and Decision Sciences", shortName: "IT & Decision Sciences", school: "School of Sciences", ordering: 3 },
  { slug: "mathematics-and-statistics", name: "Department of Mathematics and Statistics", shortName: "Maths & Statistics", school: "School of Sciences", ordering: 4 },
  { slug: "basic-and-applied-biology", name: "Department of Basic and Applied Biology", shortName: "Biological Science", school: "School of Sciences", ordering: 5 },
  { slug: "medical-laboratory-science", name: "Department of Medical Laboratory Science", shortName: "Medical Lab Science", school: "School of Sciences", ordering: 6 },
  { slug: "nursing", name: "Department of Nursing", shortName: "Nursing", school: "School of Sciences", ordering: 7 },
  { slug: "physics", name: "Department of Physics", shortName: "Physics", school: "School of Sciences", ordering: 8 },

  // ── School of Agriculture and Technology ──
  { slug: "agriculture", name: "Department of Agriculture", shortName: "Agriculture", school: "School of Agriculture and Technology", ordering: 10 },
  { slug: "agricultural-economics", name: "Department of Agricultural Economics and Extension", shortName: "Agric Economics", school: "School of Agriculture and Technology", ordering: 11 },
  { slug: "agronomy", name: "Department of Agronomy", shortName: "Agronomy", school: "School of Agriculture and Technology", ordering: 12 },

  // ── School of Geosciences ──
  { slug: "geology", name: "Department of Geology", shortName: "Geology", school: "School of Geosciences", ordering: 20 },
  { slug: "environmental-science", name: "Department of Environmental Science", shortName: "Environmental Science", school: "School of Geosciences", ordering: 21 },
  { slug: "planning", name: "Department of Planning", shortName: "Planning", school: "School of Geosciences", ordering: 22 },

  // ── School of Arts and Social Sciences ──
  { slug: "economics", name: "Department of Economics", shortName: "Economics", school: "School of Arts and Social Sciences", ordering: 30 },
  { slug: "governance-and-public-administration", name: "Department of Governance and Public Administration", shortName: "Gov. & Public Admin", school: "School of Arts and Social Sciences", ordering: 31 },
  { slug: "languages-and-general-studies", name: "Department of Languages and General Studies", shortName: "Languages", school: "School of Arts and Social Sciences", ordering: 32 },
  { slug: "social-science", name: "Department of Social Science", shortName: "Social Science", school: "School of Arts and Social Sciences", ordering: 33 },
  { slug: "social-work", name: "Department of Social Work", shortName: "Social Work", school: "School of Arts and Social Sciences", ordering: 34 },

  // ── School of Engineering ──
  { slug: "agricultural-engineering", name: "Department of Agricultural Engineering", shortName: "Agric Engineering", school: "School of Engineering", ordering: 40 },
  { slug: "chemical-engineering", name: "Department of Chemical Engineering", shortName: "Chemical Engineering", school: "School of Engineering", ordering: 41 },
  { slug: "civil-engineering", name: "Department of Civil Engineering", shortName: "Civil Engineering", school: "School of Engineering", ordering: 42 },
  { slug: "computer-engineering", name: "Department of Computer Engineering", shortName: "Computer Engineering", school: "School of Engineering", ordering: 43 },
  { slug: "electrical-and-electronics-engineering", name: "Department of Electrical and Electronics Engineering", shortName: "Electrical Engineering", school: "School of Engineering", ordering: 44 },
  { slug: "mechanical-engineering", name: "Department of Mechanical Engineering", shortName: "Mechanical Engineering", school: "School of Engineering", ordering: 45 },

  // ── School of Energy ──
  { slug: "borehole", name: "Department of Borehole Science and Technology", shortName: "Borehole Science", school: "School of Energy", ordering: 50 },

  // ── School of Mines and Built Environment ──
  { slug: "mining-engineering", name: "Department of Mining Engineering", shortName: "Mining Engineering", school: "School of Mines and Built Environment", ordering: 60 },
  { slug: "geomatic-engineering", name: "Department of Geomatic Engineering", shortName: "Geomatic Engineering", school: "School of Mines and Built Environment", ordering: 61 },
  { slug: "metallurgy", name: "Department of Metallurgy", shortName: "Metallurgy", school: "School of Mines and Built Environment", ordering: 62 },
  { slug: "architecture", name: "Department of Architecture", shortName: "Architecture", school: "School of Mines and Built Environment", ordering: 63 },
  { slug: "building-technology", name: "Department of Building Technology", shortName: "Building Technology", school: "School of Mines and Built Environment", ordering: 64 },
  { slug: "estate-management", name: "Department of Estate Management", shortName: "Estate Management", school: "School of Mines and Built Environment", ordering: 65 },
  { slug: "quantity-surveying", name: "Department of Quantity Surveying", shortName: "Quantity Surveying", school: "School of Mines and Built Environment", ordering: 66 },
  { slug: "urban-and-transport-planning", name: "Department of Urban and Transport Planning", shortName: "Urban & Transport Planning", school: "School of Mines and Built Environment", ordering: 67 },

  // ── School of Natural Resources ──
  { slug: "ecotourism-and-wildlife-management", name: "Department of Ecotourism and Wildlife Management", shortName: "Ecotourism & Wildlife", school: "School of Natural Resources", ordering: 70 },
  { slug: "fisheries-and-aquatic-science", name: "Department of Fisheries and Aquatic Science", shortName: "Fisheries & Aquatic Science", school: "School of Natural Resources", ordering: 71 },
  { slug: "forestry-and-forest-ecosystems-management", name: "Department of Forestry and Forest Ecosystems Management", shortName: "Forestry", school: "School of Natural Resources", ordering: 72 },
  { slug: "forest-industries-technology", name: "Department of Forest Industries Technology", shortName: "Forest Industries", school: "School of Natural Resources", ordering: 73 },
  { slug: "wood-science-and-technology", name: "Department of Wood Science and Technology", shortName: "Wood Science", school: "School of Natural Resources", ordering: 74 },
  { slug: "soil-and-land-science", name: "Department of Soil and Land Science", shortName: "Soil & Land Science", school: "School of Natural Resources", ordering: 75 },
  { slug: "agroforestry", name: "Department of Agroforestry", shortName: "Agroforestry", school: "School of Natural Resources", ordering: 76 },
]

// All programmes from the PDF (excluding POSTGRADUATE — not part of eligibility checker)
const programmes = [
  // ── School of Sciences ──
  { slug: "bsc-actuarial-science", name: "BSc Actuarial Science", code: "ACT", level: "DEGREE", duration: "4 Years", deptSlug: "mathematics-and-statistics", school: "School of Sciences" },
  { slug: "bsc-mathematics", name: "BSc Mathematics", code: "MTH", level: "DEGREE", duration: "4 Years", deptSlug: "mathematics-and-statistics", school: "School of Sciences" },
  { slug: "bsc-statistics", name: "BSc Statistics", code: "STA", level: "DEGREE", duration: "4 Years", deptSlug: "mathematics-and-statistics", school: "School of Sciences" },
  { slug: "diploma-statistics", name: "Diploma in Statistics", code: "DSTA", level: "DIPLOMA", duration: "2 Years", deptSlug: "mathematics-and-statistics", school: "School of Sciences" },
  { slug: "bsc-biological-science", name: "BSc Biological Science", code: "BIO", level: "DEGREE", duration: "4 Years", deptSlug: "basic-and-applied-biology", school: "School of Sciences" },
  { slug: "bsc-biochemistry", name: "BSc Biochemistry", code: "BCH", level: "DEGREE", duration: "4 Years", deptSlug: "chemical-sciences", school: "School of Sciences" },
  { slug: "bsc-chemistry", name: "BSc Chemistry", code: "CHM", level: "DEGREE", duration: "4 Years", deptSlug: "chemical-sciences", school: "School of Sciences" },
  { slug: "bsc-computer-science", name: "BSc Computer Science", code: "CS", level: "DEGREE", duration: "4 Years", deptSlug: "computer-science-and-informatics", school: "School of Sciences" },
  { slug: "diploma-computer-science", name: "Diploma in Computer Science", code: "DCS", level: "DIPLOMA", duration: "2 Years", deptSlug: "computer-science-and-informatics", school: "School of Sciences" },
  { slug: "bsc-engineering-physics", name: "BSc Engineering Physics", code: "EPH", level: "DEGREE", duration: "4 Years", deptSlug: "physics", school: "School of Sciences" },
  { slug: "bsc-information-technology", name: "BSc Information Technology", code: "IT", level: "DEGREE", duration: "4 Years", deptSlug: "information-technology-and-decision-sciences", school: "School of Sciences" },
  { slug: "bsc-medical-laboratory-science", name: "BSc Medical Laboratory Science", code: "MLS", level: "DEGREE", duration: "4 Years", deptSlug: "medical-laboratory-science", school: "School of Sciences" },
  { slug: "bsc-nursing", name: "BSc Nursing", code: "NUR", level: "DEGREE", duration: "4 Years", deptSlug: "nursing", school: "School of Sciences" },

  // ── School of Agriculture and Technology ──
  { slug: "bsc-agriculture", name: "BSc Agriculture", code: "AGR", level: "DEGREE", duration: "4 Years", deptSlug: "agriculture", school: "School of Agriculture and Technology" },
  { slug: "bsc-agricultural-economics-and-extension", name: "BSc Agricultural Economics and Extension", code: "AEE", level: "DEGREE", duration: "4 Years", deptSlug: "agricultural-economics", school: "School of Agriculture and Technology" },
  { slug: "bsc-agronomy", name: "BSc Agronomy", code: "AGN", level: "DEGREE", duration: "4 Years", deptSlug: "agronomy", school: "School of Agriculture and Technology" },

  // ── School of Geosciences ──
  { slug: "bsc-environmental-science", name: "BSc Environmental Science", code: "ENS", level: "DEGREE", duration: "4 Years", deptSlug: "environmental-science", school: "School of Geosciences" },
  { slug: "bsc-geology", name: "BSc Geology", code: "GEO", level: "DEGREE", duration: "4 Years", deptSlug: "geology", school: "School of Geosciences" },
  { slug: "bsc-planning", name: "BSc Planning", code: "PLN", level: "DEGREE", duration: "4 Years", deptSlug: "planning", school: "School of Geosciences" },

  // ── School of Arts and Social Sciences ──
  { slug: "ba-economics", name: "BA Economics", code: "ECO", level: "DEGREE", duration: "4 Years", deptSlug: "economics", school: "School of Arts and Social Sciences" },
  { slug: "ba-governance-and-public-administration", name: "BA Governance and Public Administration", code: "GPA", level: "DEGREE", duration: "4 Years", deptSlug: "governance-and-public-administration", school: "School of Arts and Social Sciences" },
  { slug: "ba-english", name: "BA English", code: "ENG", level: "DEGREE", duration: "4 Years", deptSlug: "languages-and-general-studies", school: "School of Arts and Social Sciences" },
  { slug: "ba-linguistics", name: "BA Linguistics", code: "LIN", level: "DEGREE", duration: "4 Years", deptSlug: "languages-and-general-studies", school: "School of Arts and Social Sciences" },
  { slug: "ba-geography", name: "BA Geography", code: "GEO", level: "DEGREE", duration: "4 Years", deptSlug: "social-science", school: "School of Arts and Social Sciences" },
  { slug: "ba-sociology", name: "BA Sociology", code: "SOC", level: "DEGREE", duration: "4 Years", deptSlug: "social-science", school: "School of Arts and Social Sciences" },
  { slug: "ba-social-work", name: "BA Social Work", code: "SWK", level: "DEGREE", duration: "4 Years", deptSlug: "social-work", school: "School of Arts and Social Sciences" },

  // ── School of Engineering ──
  { slug: "bsc-agricultural-engineering", name: "BSc Agricultural Engineering", code: "AGE", level: "DEGREE", duration: "4 Years", deptSlug: "agricultural-engineering", school: "School of Engineering" },
  { slug: "beng-chemical-engineering", name: "BEng Chemical Engineering", code: "CHE", level: "DEGREE", duration: "4 Years", deptSlug: "chemical-engineering", school: "School of Engineering" },
  { slug: "beng-civil-engineering", name: "BEng Civil Engineering", code: "CVE", level: "DEGREE", duration: "4 Years", deptSlug: "civil-engineering", school: "School of Engineering" },
  { slug: "beng-computer-engineering", name: "BEng Computer Engineering", code: "CPE", level: "DEGREE", duration: "4 Years", deptSlug: "computer-engineering", school: "School of Engineering" },
  { slug: "beng-electrical-and-electronics-engineering", name: "BEng Electrical and Electronics Engineering", code: "EEE", level: "DEGREE", duration: "4 Years", deptSlug: "electrical-and-electronics-engineering", school: "School of Engineering" },
  { slug: "beng-mechanical-engineering", name: "BEng Mechanical Engineering", code: "MCE", level: "DEGREE", duration: "4 Years", deptSlug: "mechanical-engineering", school: "School of Engineering" },

  // ── School of Energy ──
  { slug: "bsc-borehole-science-and-technology", name: "BSc Borehole Science and Technology", code: "BST", level: "DEGREE", duration: "4 Years", deptSlug: "borehole", school: "School of Energy" },

  // ── School of Mines and Built Environment ──
  { slug: "bsc-mining-engineering", name: "BSc Mining Engineering", code: "MNE", level: "DEGREE", duration: "4 Years", deptSlug: "mining-engineering", school: "School of Mines and Built Environment" },
  { slug: "bsc-geomatic-engineering", name: "BSc Geomatic Engineering", code: "GME", level: "DEGREE", duration: "4 Years", deptSlug: "geomatic-engineering", school: "School of Mines and Built Environment" },
  { slug: "bsc-metallurgy", name: "BSc Metallurgy", code: "MET", level: "DEGREE", duration: "4 Years", deptSlug: "metallurgy", school: "School of Mines and Built Environment" },
  { slug: "bsc-architecture", name: "BSc Architecture", code: "ARC", level: "DEGREE", duration: "4 Years", deptSlug: "architecture", school: "School of Mines and Built Environment" },
  { slug: "bsc-building-technology", name: "BSc Building Technology", code: "BLD", level: "DEGREE", duration: "4 Years", deptSlug: "building-technology", school: "School of Mines and Built Environment" },
  { slug: "bsc-estate-management", name: "BSc Estate Management", code: "EST", level: "DEGREE", duration: "4 Years", deptSlug: "estate-management", school: "School of Mines and Built Environment" },
  { slug: "bsc-quantity-surveying", name: "BSc Quantity Surveying", code: "QSV", level: "DEGREE", duration: "4 Years", deptSlug: "quantity-surveying", school: "School of Mines and Built Environment" },
  { slug: "bsc-urban-and-transport-planning", name: "BSc Urban and Transport Planning", code: "UTP", level: "DEGREE", duration: "4 Years", deptSlug: "urban-and-transport-planning", school: "School of Mines and Built Environment" },

  // ── School of Natural Resources ──
  { slug: "bsc-ecotourism-and-wildlife-management", name: "BSc Ecotourism and Wildlife Management", code: "EWM", level: "DEGREE", duration: "4 Years", deptSlug: "ecotourism-and-wildlife-management", school: "School of Natural Resources" },
  { slug: "bsc-fisheries-and-aquatic-science", name: "BSc Fisheries and Aquatic Science", code: "FAS", level: "DEGREE", duration: "4 Years", deptSlug: "fisheries-and-aquatic-science", school: "School of Natural Resources" },
  { slug: "bsc-forestry-and-forest-ecosystems-management", name: "BSc Forestry and Forest Ecosystems Management", code: "FFM", level: "DEGREE", duration: "4 Years", deptSlug: "forestry-and-forest-ecosystems-management", school: "School of Natural Resources" },
  { slug: "bsc-forest-industries-technology", name: "BSc Forest Industries Technology", code: "FIT", level: "DEGREE", duration: "4 Years", deptSlug: "forest-industries-technology", school: "School of Natural Resources" },
  { slug: "bsc-wood-science-and-technology", name: "BSc Wood Science and Technology", code: "WST", level: "DEGREE", duration: "4 Years", deptSlug: "wood-science-and-technology", school: "School of Natural Resources" },
  { slug: "bsc-soil-and-land-science", name: "BSc Soil and Land Science", code: "SLS", level: "DEGREE", duration: "4 Years", deptSlug: "soil-and-land-science", school: "School of Natural Resources" },
  { slug: "bsc-agroforestry", name: "BSc Agroforestry", code: "AFR", level: "DEGREE", duration: "4 Years", deptSlug: "agroforestry", school: "School of Natural Resources" },
]

// Eligibility rules extracted from 2026/2027 admission PDF
function rule(level, cores, { coreAlternative = null, minGrade = "C6", electiveCount = 3, electiveGroups = [], requiresExam = false, note = null } = {}) {
  return { level, cores, coreAlternative, minGrade, electiveCount, electiveGroups, requiresExam, note }
}

const rules = {
  // ── School of Sciences ──
  "bsc-actuarial-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics", "Business Mathematics"], label: "Elective Mathematics / Further Mathematics / Business Mathematics" },
    ],
    note: "Any 3 electives from General Science, Business or Arts including the required maths option.",
  }),
  "bsc-mathematics": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics"], label: "Elective Mathematics or Further Mathematics" },
    ],
  }),
  "bsc-statistics": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics"], label: "Elective Mathematics or Further Mathematics" },
    ],
  }),
  "diploma-statistics": rule("DIPLOMA", ["English Language", "Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 2,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Business Mathematics"], label: "Elective Mathematics or Business Mathematics" },
    ],
    note: "Diploma: 5 subjects total (3 cores + 2 electives) at A1-C6.",
  }),
  "bsc-biological-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Physics"], label: "Elective Mathematics or Physics" },
      { any: 1, from: ["Biology", "General Agriculture", "Forestry"], label: "Biology / General Agriculture / Forestry" },
    ],
  }),
  "bsc-biochemistry": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Biology"], label: "Biology" },
      { any: 1, from: ["Physics", "Applied Electricity", "Elective Mathematics", "General Agriculture", "Forestry"], label: "Physics / Applied Electricity / Elective Mathematics / General Agriculture / Forestry" },
    ],
  }),
  "bsc-chemistry": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Biology", "Elective Mathematics"], label: "Biology or Elective Mathematics" },
    ],
  }),
  "bsc-computer-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 2, from: ["Physics", "Applied Electricity", "Chemistry", "Biology", "Geography"], label: "Two from Physics / Applied Electricity, Chemistry, Biology, Geography" },
    ],
  }),
  "diploma-computer-science": rule("DIPLOMA", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 2,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
    ],
    note: "Diploma: 5 subjects, any other elective from Chemistry, Physics/Applied Electricity, ICT, Geography, Biology, General Agriculture.",
  }),
  "bsc-engineering-physics": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Applied Electricity"], label: "Elective Mathematics or Applied Electricity" },
    ],
  }),
  "bsc-information-technology": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-medical-laboratory-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Physics"], label: "Elective Mathematics or Physics" },
      { any: 1, from: ["Biology", "General Agriculture", "Forestry"], label: "Biology / General Agriculture / Forestry" },
    ],
    requiresExam: true,
    note: "Qualified applicants write an entrance exam and attend an interview.",
  }),
  "bsc-nursing": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    requiresExam: true,
    note: "Electives from Science, Agriculture, Home Economics or General Arts — any 3 passed at C6 qualifies, but you will also sit an entrance exam.",
  }),

  // ── School of Agriculture and Technology ──
  "bsc-agriculture": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry", "General Agriculture"], label: "Chemistry or General Agriculture" },
    ],
    note: "Any 3 electives including Chemistry or General Agriculture.",
  }),
  "bsc-agricultural-economics-and-extension": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry", "General Agriculture", "Economics", "Government"], label: "Chemistry / General Agriculture / Economics / Government" },
    ],
    note: "Any 3 electives including at least one from Chemistry, General Agriculture, Economics, or Government.",
  }),
  "bsc-agronomy": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry", "General Agriculture"], label: "Chemistry or General Agriculture" },
    ],
    note: "Any 3 electives including Chemistry or General Agriculture.",
  }),

  // ── School of Geosciences ──
  "bsc-environmental-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry", "Physics", "Geography", "Biology"], label: "One from Chemistry / Physics / Geography / Biology" },
    ],
    note: "Any 3 electives including at least one from Chemistry, Physics, Geography, or Biology.",
  }),
  "bsc-geology": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry", "Physics"], label: "Chemistry or Physics" },
    ],
    note: "Any 3 electives including Chemistry or Physics.",
  }),
  "bsc-planning": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),

  // ── School of Arts and Social Sciences ──
  "ba-economics": rule("DEGREE", ["English Language", "Core Mathematics", "Social Studies"], {
    coreAlternative: "Integrated Science",
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Economics", "Geography", "Government"], label: "One from Economics / Geography / Government" },
    ],
    note: "Any 3 electives including at least one from Economics, Geography, or Government.",
  }),
  "ba-governance-and-public-administration": rule("DEGREE", ["English Language", "Core Mathematics", "Social Studies"], {
    coreAlternative: "Integrated Science",
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Government", "Economics", "Geography"], label: "One from Government / Economics / Geography" },
    ],
    note: "Any 3 electives including at least one from Government, Economics, or Geography.",
  }),
  "ba-english": rule("DEGREE", ["English Language", "Core Mathematics", "Social Studies"], {
    coreAlternative: "Integrated Science",
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "ba-linguistics": rule("DEGREE", ["English Language", "Core Mathematics", "Social Studies"], {
    coreAlternative: "Integrated Science",
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "ba-geography": rule("DEGREE", ["English Language", "Core Mathematics", "Social Studies"], {
    coreAlternative: "Integrated Science",
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Geography", "Economics"], label: "Geography or Economics" },
    ],
    note: "Any 3 electives including Geography or Economics.",
  }),
  "ba-sociology": rule("DEGREE", ["English Language", "Core Mathematics", "Social Studies"], {
    coreAlternative: "Integrated Science",
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "ba-social-work": rule("DEGREE", ["English Language", "Core Mathematics", "Social Studies"], {
    coreAlternative: "Integrated Science",
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),

  // ── School of Engineering ──
  "bsc-agricultural-engineering": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Applied Electricity", "General Agriculture"], label: "Elective Mathematics / Applied Electricity / General Agriculture" },
    ],
  }),
  "beng-chemical-engineering": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Applied Electricity"], label: "Elective Mathematics or Applied Electricity" },
    ],
  }),
  "beng-civil-engineering": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Applied Electricity"], label: "Elective Mathematics or Applied Electricity" },
    ],
  }),
  "beng-computer-engineering": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Applied Electricity", "Chemistry", "Computer Science"], label: "Applied Electricity / Chemistry / Computer Science" },
    ],
  }),
  "beng-electrical-and-electronics-engineering": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Elective Mathematics", "Chemistry"], label: "Elective Mathematics or Chemistry" },
      { any: 1, from: ["Applied Electricity"], label: "Applied Electricity" },
    ],
  }),
  "beng-mechanical-engineering": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Applied Electricity"], label: "Elective Mathematics or Applied Electricity" },
    ],
  }),

  // ── School of Energy ──
  "bsc-borehole-science-and-technology": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics", "Chemistry"], label: "Physics or Chemistry" },
    ],
    note: "Any 3 electives including Physics or Chemistry.",
  }),

  // ── School of Mines and Built Environment ──
  "bsc-mining-engineering": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Geography", "Applied Electricity"], label: "Elective Mathematics / Geography / Applied Electricity" },
    ],
  }),
  "bsc-geomatic-engineering": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Geography"], label: "Elective Mathematics or Geography" },
    ],
  }),
  "bsc-metallurgy": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Applied Electricity"], label: "Elective Mathematics or Applied Electricity" },
    ],
  }),
  "bsc-architecture": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-building-technology": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-estate-management": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-quantity-surveying": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-urban-and-transport-planning": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),

  // ── School of Natural Resources ──
  "bsc-ecotourism-and-wildlife-management": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-fisheries-and-aquatic-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-forestry-and-forest-ecosystems-management": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-forest-industries-technology": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-wood-science-and-technology": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-soil-and-land-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
  "bsc-agroforestry": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [],
    note: "Any 3 electives at C6 or better.",
  }),
}

async function main() {
  console.log("=== UENR Full University Migration ===\n")

  // 1) Upsert departments
  console.log("── Departments ──")
  const deptMap = {}
  for (const d of departments) {
    const created = await prisma.department.upsert({
      where: { slug: d.slug },
      update: { name: d.name, shortName: d.shortName, school: d.school },
      create: { slug: d.slug, name: d.name, shortName: d.shortName, ordering: d.ordering, school: d.school, summary: `Department of ${d.name.replace("Department of ", "")}` },
    })
    deptMap[d.slug] = created.id
    console.log(`  ✓ ${d.name}`)
  }

  // 2) Fix existing programmes that need department/name changes
  console.log("\n── Fixing SoS programmes ──")
  // Rename BSc Biological Sciences → BSc Biological Science
  const bioSciences = await prisma.programme.findUnique({ where: { slug: "bsc-biological-sciences" } })
  if (bioSciences) {
    await prisma.programme.delete({ where: { slug: "bsc-biological-sciences" } })
    console.log("  ✓ Deleted old slug bsc-biological-sciences")
  }
  // BSc Medical Laboratory Science → own department
  const mls = await prisma.programme.findUnique({ where: { slug: "bsc-medical-laboratory-science" } })
  if (mls) {
    await prisma.programme.update({
      where: { slug: "bsc-medical-laboratory-science" },
      data: { departmentId: deptMap["medical-laboratory-science"] },
    })
    console.log("  ✓ Moved BSc Medical Laboratory Science to own department")
  }

  // 3) Upsert programmes
  console.log("\n── Programmes ──")
  for (const p of programmes) {
    const deptId = deptMap[p.deptSlug] ?? null
    const summary = `${p.name} programme at the University of Energy and Natural Resources.`
    const data = {
      name: p.name,
      code: p.code,
      level: p.level,
      mode: "Regular",
      duration: p.duration,
      departmentId: deptId,
      published: true,
      summary,
    }
    try {
      await prisma.programme.upsert({
        where: { slug: p.slug },
        update: { name: p.name, code: p.code, level: p.level, mode: "Regular", duration: p.duration, departmentId: deptId, published: true },
        create: { slug: p.slug, ...data },
      })
      console.log(`  ✓ ${p.name}`)
    } catch (e) {
      console.log(`  ✗ ${p.slug}: ${e.message}`)
    }
  }

  // 4) Apply eligibility rules
  console.log("\n── Eligibility Rules ──")
  for (const [slug, r] of Object.entries(rules)) {
    try {
      await prisma.programme.update({
        where: { slug },
        data: { eligibilityRule: r },
      })
      console.log(`  ✓ ${slug}`)
    } catch (e) {
      console.log(`  ✗ ${slug}: ${e.message}`)
    }
  }

  // 5) Summary
  const totalDepts = await prisma.department.count()
  const totalProgrammes = await prisma.programme.count()
  const withRules = await prisma.programme.count({ where: { eligibilityRule: { not: null } } })
  console.log(`\n=== Done ===`)
  console.log(`  Departments: ${totalDepts}`)
  console.log(`  Programmes:  ${totalProgrammes}`)
  console.log(`  With rules:  ${withRules}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
