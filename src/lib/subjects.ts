export const WASSCE_GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"] as const
export type WASSCEGrade = typeof WASSCE_GRADES[number]

export const GRADE_POINTS: Record<WASSCEGrade, number> = {
  A1: 1,
  B2: 2,
  B3: 3,
  C4: 4,
  C5: 5,
  C6: 6,
  D7: 7,
  E8: 8,
  F9: 9,
}

export function isWASSCEPass(grade: WASSCEGrade | string): boolean {
  const p = GRADE_POINTS[grade as WASSCEGrade]
  return p !== undefined && p <= 6
}

export const CORE_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Integrated Science",
  "Social Studies",
] as const

export const ELECTIVE_SUBJECTS = [
  "Elective Mathematics",
  "Further Mathematics",
  "Business Mathematics",
  "Physics",
  "Applied Electricity",
  "Applied Electronics",
  "Chemistry",
  "Biology",
  "General Agriculture",
  "Forestry",
  "Fisheries",
  "Animal Husbandry",
  "Crop Husbandry",
  "Horticulture",
  "Agricultural Science",
  "Food and Nutrition",
  "Management in Living",
  "Geography",
  "Economics",
  "Government",
  "History",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Literature in English",
  "French",
  "Ghanaian Language",
  "ICT",
  "Computing",
  "Technical Drawing",
  "Auto Mechanics",
  "Metal Work",
  "Building Construction",
  "General Knowledge in Art",
  "Business Management",
  "Accounting",
  "Costing",
] as const

// All subjects shown in selectors — cores first then electives
export const ALL_SUBJECTS = [...CORE_SUBJECTS, ...ELECTIVE_SUBJECTS] as const

// Normalization map: lowercased trimmed -> canonical
const ALIAS_MAP: Record<string, string> = {
  "english": "English Language",
  "english language": "English Language",
  "core mathematics": "Mathematics",
  "mathematics": "Mathematics",
  "maths": "Mathematics",
  "elective mathematics": "Elective Mathematics",
  "elective maths": "Elective Mathematics",
  "further mathematics": "Further Mathematics",
  "business mathematics": "Business Mathematics",
  "integrated science": "Integrated Science",
  "general science": "Integrated Science",
  "social studies": "Social Studies",
  "physics": "Physics",
  "chemistry": "Chemistry",
  "biology": "Biology",
  "general agriculture": "General Agriculture",
  "agric science": "General Agriculture",
  "agricultural science": "General Agriculture",
  "forestry": "Forestry",
  "fisheries": "Fisheries",
  "geography": "Geography",
  "economics": "Economics",
  "government": "Government",
  "history": "History",
  "ict": "ICT",
  "computing": "Computing",
  "applied electricity": "Applied Electricity",
  "applied electronics": "Applied Electronics",
  "technical drawing": "Technical Drawing",
  "food and nutrition": "Food and Nutrition",
}

export function normalizeSubject(input: string): string {
  const key = input.trim().toLowerCase().replace(/\s+/g, " ")
  if (ALIAS_MAP[key]) return ALIAS_MAP[key]
  // Try to title-case if unknown but keep as-is for broad categories
  return input.trim()
}

export const GRADE_LABELS: Record<WASSCEGrade, string> = {
  A1: "A1 - Excellent",
  B2: "B2 - Very Good",
  B3: "B3 - Good",
  C4: "C4 - Credit",
  C5: "C5 - Credit",
  C6: "C6 - Credit (min pass)",
  D7: "D7 - Pass",
  E8: "E8 - Pass",
  F9: "F9 - Fail",
}
