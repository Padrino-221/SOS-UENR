/**
 * FIX: Sync programmes with Ref/2026_2027_UENR_Admission_Requirements.md
 * Deletes incorrect programmes and creates the correct ones.
 *
 * Run: node scripts/fix-programmes-from-ref.mjs
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ── Programmes to DELETE (not in reference doc) ──
const DELETE_SLUGS = [
  // School of Agriculture and Technology — wrong names
  "bsc-agricultural-economics-and-extension",
  "bsc-agronomy",
  // School of Geosciences — wrong names
  "bsc-environmental-science",
  "bsc-geology",
  "bsc-planning",
  // School of Arts and Social Sciences — wrong names (BA not BSc)
  "ba-economics",
  "ba-governance-and-public-administration",
  "ba-english",
  "ba-linguistics",
  "ba-geography",
  "ba-sociology",
  "ba-social-work",
  // School of Engineering — wrong names
  "beng-chemical-engineering",
  "beng-computer-engineering",
  "beng-electrical-and-electronics-engineering",
  // School of Energy — wrong programme
  "bsc-borehole-science-and-technology",
  // School of Mines and Built Environment — wrong programmes
  "bsc-mining-engineering",
  "bsc-geomatic-engineering",
  "bsc-metallurgy",
  "bsc-architecture",
  "bsc-building-technology",
  "bsc-estate-management",
  "bsc-quantity-surveying",
  "bsc-urban-and-transport-planning",
  // School of Natural Resources — wrong names
  "bsc-ecotourism-and-wildlife-management",
  "bsc-fisheries-and-aquatic-science",
  "bsc-forestry-and-forest-ecosystems-management",
  "bsc-forest-industries-technology",
  "bsc-wood-science-and-technology",
  "bsc-soil-and-land-science",
  "bsc-agroforestry",
  // Departments to delete (wrong ones)
  "agricultural-economics",
  "agronomy",
  "geology",
  "environmental-science",
  "planning",
  "economics",
  "governance-and-public-administration",
  "languages-and-general-studies",
  "social-science",
  "social-work",
  "chemical-engineering",
  "computer-engineering",
  "electrical-and-electronics-engineering",
  "borehole",
  "mining-engineering",
  "geomatic-engineering",
  "metallurgy",
  "architecture",
  "building-technology",
  "estate-management",
  "quantity-surveying",
  "urban-and-transport-planning",
  "ecotourism-and-wildlife-management",
  "fisheries-and-aquatic-science",
  "forestry-and-forest-ecosystems-management",
  "forest-industries-technology",
  "wood-science-and-technology",
  "soil-and-land-science",
  "agroforestry",
]

// ── Correct departments (from reference) ──
const departments = [
  // School of Agriculture and Technology
  { slug: "agriculture", name: "Department of Agriculture", shortName: "Agriculture", school: "School of Agriculture and Technology" },
  { slug: "agribusiness", name: "Department of Agribusiness", shortName: "Agribusiness", school: "School of Agriculture and Technology" },
  { slug: "agricultural-and-resource-economics", name: "Department of Agricultural and Resource Economics", shortName: "Agri & Resource Economics", school: "School of Agriculture and Technology" },
  { slug: "food-technology", name: "Department of Food Technology", shortName: "Food Technology", school: "School of Agriculture and Technology" },

  // School of Geosciences
  { slug: "applied-meteorology-and-climate-science", name: "Department of Applied Meteorology and Climate Science", shortName: "Applied Meteorology", school: "School of Geosciences" },
  { slug: "climate-change-and-sustainable-development", name: "Department of Climate Change and Sustainable Development", shortName: "Climate Change", school: "School of Geosciences" },
  { slug: "geo-environmental-science", name: "Department of Geo-Environmental Science", shortName: "Geo-Environmental Science", school: "School of Geosciences" },
  { slug: "geoinformation-science", name: "Department of Geoinformation Science", shortName: "Geoinformation Science", school: "School of Geosciences" },
  { slug: "geomatics", name: "Department of Geomatics", shortName: "Geomatics", school: "School of Geosciences" },
  { slug: "planning-and-sustainability", name: "Department of Planning and Sustainability", shortName: "Planning & Sustainability", school: "School of Geosciences" },

  // School of Arts and Social Sciences
  { slug: "accounting", name: "Department of Accounting", shortName: "Accounting", school: "School of Arts and Social Sciences" },
  { slug: "economics", name: "Department of Economics", shortName: "Economics", school: "School of Arts and Social Sciences" },
  { slug: "resource-enterprise-and-entrepreneurship", name: "Department of Resource Enterprise and Entrepreneurship", shortName: "Resource Enterprise", school: "School of Arts and Social Sciences" },

  // School of Engineering
  { slug: "agricultural-engineering", name: "Department of Agricultural Engineering", shortName: "Agricultural Engineering", school: "School of Engineering" },
  { slug: "civil-engineering", name: "Department of Civil Engineering", shortName: "Civil Engineering", school: "School of Engineering" },
  { slug: "computer-engineering", name: "Department of Computer Engineering", shortName: "Computer Engineering", school: "School of Engineering" },
  { slug: "electrical-and-electronic-engineering", name: "Department of Electrical and Electronic Engineering", shortName: "Electrical & Electronic Engineering", school: "School of Engineering" },
  { slug: "environmental-engineering", name: "Department of Environmental Engineering", shortName: "Environmental Engineering", school: "School of Engineering" },
  { slug: "mechanical-engineering", name: "Department of Mechanical Engineering", shortName: "Mechanical Engineering", school: "School of Engineering" },

  // School of Energy
  { slug: "petroleum-engineering", name: "Department of Petroleum Engineering", shortName: "Petroleum Engineering", school: "School of Energy" },
  { slug: "renewable-energy-engineering", name: "Department of Renewable Energy Engineering", shortName: "Renewable Energy Engineering", school: "School of Energy" },

  // School of Mines and Built Environment
  { slug: "mines-and-built-environment", name: "School of Mines and Built Environment", shortName: "Mines & Built Env", school: "School of Mines and Built Environment" },

  // School of Natural Resources
  { slug: "aquaculture-and-aquatic-resources", name: "Department of Aquaculture and Aquatic Resources Management", shortName: "Aquaculture", school: "School of Natural Resources" },
  { slug: "fire-safety-and-disaster-management", name: "Department of Fire, Safety and Disaster Management", shortName: "Fire Safety", school: "School of Natural Resources" },
  { slug: "hospitality-management", name: "Department of Hospitality Management", shortName: "Hospitality Management", school: "School of Natural Resources" },
  { slug: "natural-resources-management", name: "Department of Natural Resources Management", shortName: "Natural Resources Mgmt", school: "School of Natural Resources" },
  { slug: "environmental-resources-management", name: "Department of Environmental Resources Management and Sustainability", shortName: "Environmental Resources Mgmt", school: "School of Natural Resources" },
]

// ── Correct programmes (from reference doc) ──
const programmes = [
  // ── Diploma Programmes ──
  { slug: "diploma-fire-safety", name: "Diploma in Fire, Safety & Disaster Management", code: "DFS", level: "DIPLOMA", duration: "2 Years", deptSlug: "fire-safety-and-disaster-management", school: "School of Natural Resources" },
  { slug: "diploma-natural-resources-management", name: "Diploma in Natural Resources Management", code: "DNRM", level: "DIPLOMA", duration: "2 Years", deptSlug: "natural-resources-management", school: "School of Natural Resources" },
  { slug: "diploma-geoinformation-science", name: "Diploma in Geoinformation Science", code: "DGIS", level: "DIPLOMA", duration: "2 Years", deptSlug: "geoinformation-science", school: "School of Geosciences" },
  { slug: "diploma-geomatics", name: "Diploma in Geomatics", code: "DGM", level: "DIPLOMA", duration: "2 Years", deptSlug: "geomatics", school: "School of Geosciences" },
  { slug: "diploma-statistics", name: "Diploma in Statistics", code: "DSTA", level: "DIPLOMA", duration: "2 Years", deptSlug: "mathematics-and-statistics", school: "School of Sciences" },
  { slug: "diploma-computer-science", name: "Diploma in Computer Science", code: "DCS", level: "DIPLOMA", duration: "2 Years", deptSlug: "computer-science-and-informatics", school: "School of Sciences" },

  // ── School of Agriculture and Technology ──
  { slug: "bsc-agriculture", name: "BSc Agriculture", code: "AGR", level: "DEGREE", duration: "4 Years", deptSlug: "agriculture", school: "School of Agriculture and Technology" },
  { slug: "bsc-agribusiness", name: "BSc Agribusiness", code: "ABZ", level: "DEGREE", duration: "4 Years", deptSlug: "agribusiness", school: "School of Agriculture and Technology" },
  { slug: "bsc-agricultural-and-resource-economics", name: "BSc Agricultural and Resource Economics", code: "ARE", level: "DEGREE", duration: "4 Years", deptSlug: "agricultural-and-resource-economics", school: "School of Agriculture and Technology" },
  { slug: "bsc-food-technology", name: "BSc Food Technology", code: "FTC", level: "DEGREE", duration: "4 Years", deptSlug: "food-technology", school: "School of Agriculture and Technology" },

  // ── School of Geosciences ──
  { slug: "bsc-applied-meteorology-and-climate-science", name: "BSc Applied Meteorology and Climate Science", code: "AMC", level: "DEGREE", duration: "4 Years", deptSlug: "applied-meteorology-and-climate-science", school: "School of Geosciences" },
  { slug: "bsc-climate-change-and-sustainable-development", name: "BSc Climate Change and Sustainable Development", code: "CCS", level: "DEGREE", duration: "4 Years", deptSlug: "climate-change-and-sustainable-development", school: "School of Geosciences" },
  { slug: "bsc-geo-environmental-science", name: "BSc Geo-Environmental Science", code: "GES", level: "DEGREE", duration: "4 Years", deptSlug: "geo-environmental-science", school: "School of Geosciences" },
  { slug: "bsc-geoinformation-science", name: "BSc Geoinformation Science", code: "GIS", level: "DEGREE", duration: "4 Years", deptSlug: "geoinformation-science", school: "School of Geosciences" },
  { slug: "bsc-geomatics", name: "BSc Geomatics", code: "GMT", level: "DEGREE", duration: "4 Years", deptSlug: "geomatics", school: "School of Geosciences" },
  { slug: "bsc-planning-and-sustainability", name: "BSc Planning and Sustainability", code: "PLS", level: "DEGREE", duration: "4 Years", deptSlug: "planning-and-sustainability", school: "School of Geosciences" },

  // ── School of Arts and Social Sciences ──
  { slug: "bsc-accounting", name: "BSc Accounting", code: "ACC", level: "DEGREE", duration: "4 Years", deptSlug: "accounting", school: "School of Arts and Social Sciences" },
  { slug: "bsc-economics", name: "BSc Economics", code: "ECN", level: "DEGREE", duration: "4 Years", deptSlug: "economics", school: "School of Arts and Social Sciences" },
  { slug: "bsc-resource-enterprise-and-entrepreneurship", name: "BSc Resource Enterprise and Entrepreneurship", code: "REE", level: "DEGREE", duration: "4 Years", deptSlug: "resource-enterprise-and-entrepreneurship", school: "School of Arts and Social Sciences" },

  // ── School of Engineering ──
  { slug: "bsc-agricultural-engineering", name: "BSc Agricultural Engineering", code: "AGE", level: "DEGREE", duration: "4 Years", deptSlug: "agricultural-engineering", school: "School of Engineering" },
  { slug: "bsc-civil-engineering", name: "BSc Civil Engineering", code: "CVE", level: "DEGREE", duration: "4 Years", deptSlug: "civil-engineering", school: "School of Engineering" },
  { slug: "bsc-computer-engineering", name: "BSc Computer Engineering", code: "CPE", level: "DEGREE", duration: "4 Years", deptSlug: "computer-engineering", school: "School of Engineering" },
  { slug: "bsc-electrical-and-electronic-engineering", name: "BSc Electrical and Electronic Engineering", code: "EEE", level: "DEGREE", duration: "4 Years", deptSlug: "electrical-and-electronic-engineering", school: "School of Engineering" },
  { slug: "bsc-environmental-engineering", name: "BSc Environmental Engineering", code: "EVE", level: "DEGREE", duration: "4 Years", deptSlug: "environmental-engineering", school: "School of Engineering" },
  { slug: "bsc-mechanical-engineering", name: "BSc Mechanical Engineering", code: "MCE", level: "DEGREE", duration: "4 Years", deptSlug: "mechanical-engineering", school: "School of Engineering" },

  // ── School of Energy ──
  { slug: "bsc-petroleum-engineering", name: "BSc Petroleum Engineering", code: "PTE", level: "DEGREE", duration: "4 Years", deptSlug: "petroleum-engineering", school: "School of Energy" },
  { slug: "bsc-renewable-energy-engineering", name: "BSc Renewable Energy Engineering", code: "REE", level: "DEGREE", duration: "4 Years", deptSlug: "renewable-energy-engineering", school: "School of Energy" },

  // ── School of Mines and Built Environment ──
  { slug: "bsc-sustainable-land-management", name: "BSc Sustainable Land Management", code: "SLM", level: "DEGREE", duration: "4 Years", deptSlug: "mines-and-built-environment", school: "School of Mines and Built Environment" },
  { slug: "bsc-development-minerals-mining", name: "BSc Development Minerals Mining", code: "DMM", level: "DEGREE", duration: "4 Years", deptSlug: "mines-and-built-environment", school: "School of Mines and Built Environment" },
  { slug: "bsc-urban-mining", name: "BSc Urban Mining", code: "UBM", level: "DEGREE", duration: "4 Years", deptSlug: "mines-and-built-environment", school: "School of Mines and Built Environment" },
  { slug: "bsc-sustainable-mining", name: "BSc Sustainable Mining", code: "SMM", level: "DEGREE", duration: "4 Years", deptSlug: "mines-and-built-environment", school: "School of Mines and Built Environment" },
  { slug: "bsc-resource-and-development-planning", name: "BSc Resource and Development Planning", code: "RDP", level: "DEGREE", duration: "4 Years", deptSlug: "mines-and-built-environment", school: "School of Mines and Built Environment" },

  // ── School of Natural Resources ──
  { slug: "bsc-aquaculture-and-aquatic-resources", name: "BSc Aquaculture and Aquatic Resources Management", code: "AQU", level: "DEGREE", duration: "4 Years", deptSlug: "aquaculture-and-aquatic-resources", school: "School of Natural Resources" },
  { slug: "bsc-fire-safety-and-disaster-management", name: "BSc Fire, Safety and Disaster Management", code: "FSD", level: "DEGREE", duration: "4 Years", deptSlug: "fire-safety-and-disaster-management", school: "School of Natural Resources" },
  { slug: "bsc-hospitality-management", name: "BSc Hospitality Management", code: "HSM", level: "DEGREE", duration: "4 Years", deptSlug: "hospitality-management", school: "School of Natural Resources" },
  { slug: "bsc-natural-resources-management", name: "BSc Natural Resources Management", code: "NRM", level: "DEGREE", duration: "4 Years", deptSlug: "natural-resources-management", school: "School of Natural Resources" },
  { slug: "bsc-environmental-resources-management", name: "BSc Environmental Resources Management and Sustainability", code: "ERM", level: "DEGREE", duration: "4 Years", deptSlug: "environmental-resources-management", school: "School of Natural Resources" },
]

// ── Eligibility rules from Ref/2026_2027_UENR_Admission_Requirements.md ──
function rule(level, cores, { coreAlternative = null, minGrade = "C6", electiveCount = 3, electiveGroups = [], electiveGroupAlternatives = null, requiresExam = false, note = null } = {}) {
  const r = { level, cores, coreAlternative, minGrade, electiveCount, electiveGroups, requiresExam, note }
  if (electiveGroupAlternatives) r.electiveGroupAlternatives = electiveGroupAlternatives
  return r
}

// Canonical SHS elective lists (must match src/lib/subjects.ts)
const SCIENCE = ["Elective Mathematics", "Biology", "Chemistry", "Physics", "Geography", "General Agriculture", "ICT", "French", "Music"]
const ARTS = ["Christian Religious Studies", "Islamic Religious Studies", "Literature in English", "History", "Government", "Geography", "Economics", "French", "Arabic", "Elective Mathematics", "ICT", "Ghanaian Language", "Music", "West African Traditional Religion"]
const HOME_ECONOMICS = ["Management in Living", "Clothing and Textiles", "Foods and Nutrition", "General Knowledge in Art", "Textiles", "Biology", "Chemistry", "Physics", "Elective Mathematics", "ICT", "Economics", "French", "Music"]
const BUSINESS = ["Business Management", "Financial Accounting", "Cost Accounting", "Economics", "Elective Mathematics", "ICT", "French", "Music", "Typewriting", "Clerical Office Duties", "Literature in English"]
const VISUAL_ARTS = ["General Knowledge in Art", "Graphic Design", "Picture Making", "Basketry", "Ceramics", "Jewellery", "Leatherwork", "Sculpture", "Textiles", "Biology", "Chemistry", "Physics", "Elective Mathematics", "Economics", "Literature in English", "ICT", "French", "Music"]
const uniq = (a) => [...new Set(a)]

// Science + Agricultural + Home Economics + General Arts (Nursing)
const NURSING_ELECTIVES = uniq([...SCIENCE, ...HOME_ECONOMICS, ...ARTS])
// Science + Agricultural + Business + General Arts + Home Economics + Visual Arts
const BROAD_ELECTIVES = uniq([...SCIENCE, ...ARTS, ...HOME_ECONOMICS, ...BUSINESS, ...VISUAL_ARTS])
// Business + Sciences (Accounting base option)
const BUSINESS_SCIENCE = uniq([...BUSINESS, ...SCIENCE])
// General Arts + General Agriculture + Business + Science (Sustainable Land Management)
const LAND_MGMT_ELECTIVES = uniq([...ARTS, ...BUSINESS, ...SCIENCE])

const rules = {
  // ── Diploma Programmes ──
  "diploma-fire-safety": rule("DIPLOMA", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 2,
    electiveGroups: [],
    note: "Diploma: 3 cores + 2 electives. Or GCE 'A' Level (3 passes, 1 at D+). Or Certificate in Forestry/Agriculture.",
  }),
  "diploma-natural-resources-management": rule("DIPLOMA", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 2,
    electiveGroups: [],
    note: "Diploma: 3 cores + 2 electives. Or GCE 'A' Level. Or Certificate in Forestry/Agriculture.",
  }),
  "diploma-geoinformation-science": rule("DIPLOMA", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 2,
    electiveGroups: [
      { any: 2, from: ["Chemistry", "Physics", "Biology", "General Agriculture", "Elective Mathematics", "Geography", "Economics", "History", "Government", "ICT", "Building Construction"], label: "2 electives from Chemistry, Physics, Biology/General Agriculture/Forestry, Elective Math, Geography, Economics, History, Government, ICT, Building Technology" },
    ],
    note: "Diploma: 3 cores + 2 electives from Chemistry, Physics, Biology/General Agriculture/Forestry, Elective Math, Geography, Economics, History, Government, ICT, Building Technology.",
  }),
  "diploma-geomatics": rule("DIPLOMA", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 2,
    electiveGroups: [
      { any: 2, from: ["Chemistry", "Physics", "Biology", "General Agriculture"], label: "2 Science electives (Chemistry, Physics, Biology, General Agriculture/Forestry)" },
    ],
    electiveGroupAlternatives: [
      [
        { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
        { any: 1, from: ["Geography"], label: "Geography" },
      ],
    ],
    note: "Diploma: 3 cores + 2 electives in Science (Chemistry, Physics, Biology/General Agriculture/Forestry) or General Arts (Elective Math + Geography).",
  }),
  "diploma-statistics": rule("DIPLOMA", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 2,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Financial Accounting"], label: "Elective Mathematics or Business Mathematics" },
    ],
    note: "Diploma: 5 subjects total (3 cores + 2 electives) at A1-C6.",
  }),
  "diploma-computer-science": rule("DIPLOMA", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 2,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Chemistry", "Physics", "Applied Electricity", "ICT", "Geography", "Biology", "General Agriculture"], label: "1 from Chemistry, Physics/Applied Electricity, ICT, Computing, Geography, Biology, General Agriculture" },
    ],
    note: "Diploma: 3 cores + Elective Math + 1 from Chemistry, Physics/Applied Electricity, ICT, Computing, Geography, Biology, General Agriculture.",
  }),

  // ── School of Agriculture and Technology ──
  "bsc-agriculture": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Biology", "General Agriculture"], label: "Biology or General Agriculture/Forestry" },
      { any: 1, from: ["Physics", "Elective Mathematics"], label: "Physics or Elective Mathematics" },
    ],
    note: "Option 1: Biology, Chemistry, Physics/Elective Math. Option 2: General Agriculture/Forestry, Chemistry, Physics/Elective Math.",
  }),
  "bsc-agribusiness": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: BROAD_ELECTIVES, label: "3 electives from Science, General Agriculture, Business, General Arts, Home Economics or Visual Arts" },
    ],
    note: "Credit passes in 3 cores + 3 electives from Science, General Agriculture, Business, General Arts, Home Economics, or Visual Arts.",
  }),
  "bsc-agricultural-and-resource-economics": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: BROAD_ELECTIVES, label: "3 electives from Science, Agricultural Science, General Arts, Visual Arts, Business, or Home Economics" },
    ],
    note: "Credit passes in 3 cores + 3 electives from General Science, Agricultural Science, General Arts, Visual Arts, Business, or Home Economics.",
  }),
  "bsc-food-technology": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Elective Mathematics", "Physics", "Chemistry", "Biology", "General Agriculture", "Foods and Nutrition"], label: "3 electives from Elective Math/Physics, Chemistry, Biology, General Agriculture, Animal/Crop Husbandry, Horticulture, Fisheries, Forestry, Food & Nutrition" },
    ],
    note: "Credit passes in 3 cores + 3 electives from Elective Math/Physics, Chemistry, Biology, General Agriculture, Animal/Crop Husbandry, Horticulture, Fisheries, Forestry, Food & Nutrition.",
  }),

  // ── School of Geosciences ──
  "bsc-applied-meteorology-and-climate-science": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Chemistry", "Physics", "Elective Mathematics", "Biology", "General Agriculture"], label: "3 electives from Chemistry, Physics, Elective Math, Biology/General Agriculture/Forestry" },
    ],
  }),
  "bsc-climate-change-and-sustainable-development": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Chemistry", "Physics", "Biology", "General Agriculture", "Elective Mathematics", "Geography", "Economics", "History", "Government"], label: "3 electives from Chemistry, Physics, Biology/General Agriculture/Forestry, Elective Math, Geography, Economics, History, Government" },
    ],
  }),
  "bsc-geo-environmental-science": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Physics", "Chemistry", "Biology", "Geography", "Elective Mathematics"], label: "3 electives from Physics, Chemistry, Biology, Geography, Elective Math" },
    ],
  }),
  "bsc-geoinformation-science": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Chemistry", "Physics", "Elective Mathematics", "Biology", "General Agriculture", "Geography"], label: "Science: 3 electives from Chemistry, Physics, Elective Math, Biology/General Agriculture/Forestry, Geography" },
    ],
    electiveGroupAlternatives: [
      [
        { any: 1, from: ["Geography"], label: "General Arts: Geography" },
        { any: 2, from: ["History", "Government", "Economics"], label: "2 from History, Government, Economics" },
      ],
    ],
    note: "Science background: 3 electives from Chemistry, Physics, Elective Math, Biology/General Agriculture/Forestry, Geography. General Arts background: Geography + 2 from History, Government, Economics.",
  }),
  "bsc-geomatics": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 2, from: ["Physics", "Chemistry", "Biology", "General Agriculture", "Geography"], label: "2 Science electives (Physics, Chemistry, Biology, General Agriculture/Forestry, Geography)" },
    ],
    electiveGroupAlternatives: [
      [
        { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
        { any: 1, from: ["Geography"], label: "Geography" },
        { any: 1, from: ["History", "Government", "Economics"], label: "1 from History, Government, Economics" },
      ],
    ],
    note: "Science: Elective Math + 2 Science electives (Physics, Chemistry, Biology/General Agriculture/Forestry, Geography). General Arts: Elective Math + Geography + 1 from History, Government, Economics.",
  }),
  "bsc-planning-and-sustainability": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Geography", "Economics", "Elective Mathematics", "Government", "History", "Financial Accounting", "Business Management", "Cost Accounting"], label: "3 electives from Geography, Economics, Elective Math, Government, History, Accounting, Business Management, Costing" },
    ],
  }),

  // ── School of Arts and Social Sciences ──
  "bsc-accounting": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: BUSINESS_SCIENCE, label: "3 electives from Business or Sciences" },
    ],
    electiveGroupAlternatives: [
      [
        { any: 1, from: ["Elective Mathematics", "Economics"], label: "Elective Mathematics or Economics" },
        { any: 2, from: ARTS, label: "2 more General Arts electives" },
      ],
      [
        { any: 1, from: ["Elective Mathematics", "Economics"], label: "Elective Mathematics or Economics" },
        { any: 2, from: HOME_ECONOMICS, label: "2 more Home Economics electives" },
      ],
    ],
    note: "3 electives from Business or Sciences; or General Arts / Home Economics including Elective Math or Economics.",
  }),
  "bsc-economics": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: BROAD_ELECTIVES, label: "3 electives from Science, General Arts, Home Economics, Business, Agriculture, or Visual Arts" },
    ],
  }),
  "bsc-resource-enterprise-and-entrepreneurship": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: BROAD_ELECTIVES, label: "3 electives from Science, General Arts, Home Economics, Business, Agriculture, or Visual Arts" },
    ],
  }),

  // ── School of Engineering ──
  "bsc-agricultural-engineering": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry", "Technical Drawing", "Auto Mechanics", "Metal Work"], label: "Chemistry / Technical Drawing / Auto Mechanics / Metal Work" },
    ],
  }),
  "bsc-civil-engineering": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Chemistry", "Biology", "Geography", "Technical Drawing"], label: "Chemistry / Biology / Geography / Technical Drawing" },
    ],
  }),
  "bsc-computer-engineering": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry", "Applied Electricity", "Applied Electronics", "Elective ICT"], label: "Chemistry / Applied Electricity / Applied Electronics / Elective ICT" },
    ],
  }),
  "bsc-electrical-and-electronic-engineering": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry", "Applied Electricity", "Applied Electronics"], label: "Chemistry / Applied Electricity / Applied Electronics" },
    ],
  }),
  "bsc-environmental-engineering": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Chemistry", "Biology", "Technical Drawing", "Geography"], label: "Chemistry / Biology / Technical Drawing / Geography" },
    ],
  }),
  "bsc-mechanical-engineering": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry", "Technical Drawing", "Auto Mechanics", "Metal Work", "Applied Electricity"], label: "Chemistry / Technical Drawing / Auto Mechanics / Metal Work / Applied Electricity" },
    ],
  }),

  // ── School of Energy ──
  "bsc-petroleum-engineering": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
    ],
  }),
  "bsc-renewable-energy-engineering": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
      { any: 1, from: ["Chemistry", "Technical Drawing"], label: "Chemistry or Technical Drawing" },
    ],
  }),

  // ── School of Mines and Built Environment ──
  "bsc-sustainable-land-management": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: LAND_MGMT_ELECTIVES, label: "3 electives from General Arts, General Agriculture, Business, or Science" },
    ],
  }),
  "bsc-development-minerals-mining": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
    ],
    note: "3 electives in Chemistry, Physics, and Mathematics or relevant science subjects.",
  }),
  "bsc-urban-mining": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
    ],
    note: "3 electives in Chemistry, Physics, and Mathematics or relevant science subjects.",
  }),
  "bsc-sustainable-mining": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Physics"], label: "Physics" },
      { any: 1, from: ["Elective Mathematics"], label: "Elective Mathematics" },
    ],
    note: "3 electives in Chemistry, Physics, and Mathematics or relevant science subjects.",
  }),
  "bsc-resource-and-development-planning": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Geography", "Economics", "Elective Mathematics", "Government", "History", "Christian Religious Studies", "Islamic Religious Studies", "Literature in English", "West African Traditional Religion", "Financial Accounting", "Cost Accounting", "Business Management", "Clerical Office Duties", "Typewriting"], label: "3 electives from the listed subjects" },
    ],
    note: "3 electives from Geography, Economics, Elective Math, Government, History, CRS, IRS, Literature-in-English, West African Traditional Religion, Financial Accounting, Cost Accounting, Business Management, Clerical Office Duties, Typewriting.",
  }),

  // ── School of Natural Resources ──
  "bsc-aquaculture-and-aquatic-resources": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Biology", "General Agriculture", "Geography", "Economics", "Chemistry", "Physics", "Elective Mathematics"], label: "3 electives from Biology/General Agriculture/Forestry/Fisheries, Geography/Economics, Chemistry, Physics, Mathematics" },
    ],
  }),
  "bsc-fire-safety-and-disaster-management": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [],
    note: "3 electives from Science, General Arts, Home Economics, Business, Visual Arts, or Technical programmes.",
  }),
  "bsc-hospitality-management": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: BROAD_ELECTIVES, label: "3 electives from Science, General Arts, Home Economics, Business, Agriculture, Visual Arts" },
    ],
  }),
  "bsc-natural-resources-management": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Chemistry", "Physics", "Elective Mathematics", "Biology", "General Agriculture"], label: "3 electives from Chemistry, Physics, Elective Math, Biology/Agriculture/Forestry" },
    ],
    note: "Options: Ecotourism, Fisheries & Aquaculture, Forest Resources Management, Land Reclamation & Restoration, Social Forestry. Home Economics requires Biology/Chemistry.",
  }),
  "bsc-environmental-resources-management": rule("DEGREE", ["English Language", "Core Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: ["Elective Mathematics", "Physics", "Chemistry", "Biology", "General Agriculture", "Economics", "Geography", "Government", "Business Management"], label: "3 electives from Elective Math, Physics, Chemistry, Biology, General Agriculture, Economics, Geography, Government, Business Management" },
    ],
  }),

  // ── School of Sciences ──
  "bsc-actuarial-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    coreAlternative: "Social Studies",
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics", "Business Mathematics"], label: "Elective Mathematics / Further Mathematics / Business Mathematics" },
    ],
    note: "Any 3 electives including the required maths option.",
  }),
  "bsc-mathematics": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics"], label: "Elective Mathematics / Further Mathematics" },
    ],
  }),
  "bsc-statistics": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Elective Mathematics", "Further Mathematics"], label: "Elective Mathematics / Further Mathematics" },
    ],
  }),
  "bsc-biological-science": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Elective Mathematics", "Physics"], label: "Elective Mathematics or Physics" },
      { any: 1, from: ["Biology", "General Agriculture"], label: "Biology / General Agriculture / Forestry" },
    ],
  }),
  "bsc-biochemistry": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 1, from: ["Chemistry"], label: "Chemistry" },
      { any: 1, from: ["Biology"], label: "Biology" },
      { any: 1, from: ["Physics", "Applied Electricity", "Elective Mathematics", "General Agriculture"], label: "Physics / Applied Electricity / Elective Mathematics / General Agriculture / Forestry" },
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
      { any: 1, from: ["Biology", "General Agriculture"], label: "Biology / General Agriculture / Forestry" },
    ],
    requiresExam: true,
    note: "Qualified applicants write an entrance exam and attend an interview.",
  }),
  "bsc-nursing": rule("DEGREE", ["English Language", "Mathematics", "Integrated Science"], {
    electiveCount: 3,
    electiveGroups: [
      { any: 3, from: NURSING_ELECTIVES, label: "3 electives from Science, Agricultural, Home Economics or General Arts options" },
    ],
    requiresExam: true,
    note: "Electives from Science, Agricultural, Home Economics or General Arts options. Entrance exam and interview required.",
  }),
}

async function main() {
  console.log("=== Fix Programmes from Reference ===\n")

  // 1) Delete programmes not in reference
  console.log("── Deleting incorrect programmes ──")
  for (const slug of DELETE_SLUGS) {
    try {
      // Check if it's a programme or department
      const prog = await prisma.programme.findUnique({ where: { slug } })
      if (prog) {
        await prisma.programme.delete({ where: { slug } })
        console.log(`  ✓ Deleted programme: ${slug}`)
        continue
      }
    } catch (e) {
      // Try department
    }
    try {
      const dept = await prisma.department.findUnique({ where: { slug } })
      if (dept) {
        // Check if dept has programmes
        const progCount = await prisma.programme.count({ where: { departmentId: dept.id } })
        if (progCount > 0) {
          console.log(`  ⚠ Skipped dept ${slug} (has ${progCount} programmes)`)
        } else {
          await prisma.department.delete({ where: { slug } })
          console.log(`  ✓ Deleted department: ${slug}`)
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 2) Upsert departments
  console.log("\n── Departments ──")
  const deptMap = {}
  for (const d of departments) {
    const existing = await prisma.department.findUnique({ where: { slug: d.slug } })
    if (existing) {
      await prisma.department.update({
        where: { slug: d.slug },
        data: { name: d.name, shortName: d.shortName, school: d.school },
      })
      deptMap[d.slug] = existing.id
      console.log(`  ✓ Updated: ${d.name}`)
    } else {
      const created = await prisma.department.create({
        data: { slug: d.slug, name: d.name, shortName: d.shortName, school: d.school, summary: d.name },
      })
      deptMap[d.slug] = created.id
      console.log(`  ✓ Created: ${d.name}`)
    }
  }

  // 3) Upsert programmes
  console.log("\n── Programmes ──")
  for (const p of programmes) {
    const deptId = deptMap[p.deptSlug] ?? null
    try {
      const existing = await prisma.programme.findUnique({ where: { slug: p.slug } })
      if (existing) {
        await prisma.programme.update({
          where: { slug: p.slug },
          data: { name: p.name, level: p.level, mode: "Regular", duration: p.duration, departmentId: deptId },
        })
        console.log(`  ✓ Updated: ${p.name}`)
      } else {
        await prisma.programme.create({
          data: { slug: p.slug, name: p.name, level: p.level, mode: "Regular", duration: p.duration, departmentId: deptId, summary: `${p.name} programme at the University of Energy and Natural Resources.`, published: true },
        })
        console.log(`  ✓ Created: ${p.name}`)
      }
    } catch (e) {
      console.log(`  ✗ ${p.slug}: ${e.message}`)
    }
  }

  // 4) Apply eligibility rules
  console.log("\n── Eligibility Rules ──")
  for (const [slug, r] of Object.entries(rules)) {
    try {
      await prisma.programme.update({ where: { slug }, data: { eligibilityRule: r } })
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
