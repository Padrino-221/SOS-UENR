export const WASSCE_GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"] as const
export type WASSCEGrade = typeof WASSCE_GRADES[number]

// Revised Certificate II (TVET) grading system — Ref/revised_grading_system.md.
// Points mirror the WASSCE equivalents for the same mark ranges so the engine
// applies the same thresholds (C6-equivalent credit pass, D7-equivalent fails).
export const TVET_GRADES = ["A", "B+", "B-", "C+", "C-", "D", "E", "F"] as const
export type TVETGrade = typeof TVET_GRADES[number]

export type Grade = WASSCEGrade | TVETGrade

export const GRADE_POINTS: Record<Grade, number> = {
  A1: 1,
  B2: 2,
  B3: 3,
  C4: 4,
  C5: 5,
  C6: 6,
  D7: 7,
  E8: 8,
  F9: 9,
  A: 1,
  "B+": 2,
  "B-": 3,
  "C+": 4,
  "C-": 6,
  D: 7,
  E: 8,
  F: 9,
}

export function isPassingGrade(grade: string): boolean {
  const p = GRADE_POINTS[grade as Grade]
  return p !== undefined && p <= 6
}

export function isWASSCEPass(grade: Grade | string): boolean {
  return isPassingGrade(grade)
}

export const TVET_GRADE_LABELS: Record<TVETGrade, { remark: string; range: string }> = {
  A: { remark: "Distinction", range: "75 – 100" },
  "B+": { remark: "Upper Credit", range: "70 – 74" },
  "B-": { remark: "Upper Credit", range: "65 – 69" },
  "C+": { remark: "Credit", range: "55 – 64" },
  "C-": { remark: "Lower Credit", range: "50 – 54" },
  D: { remark: "Pass", range: "45 – 49" },
  E: { remark: "Pass", range: "40 – 44" },
  F: { remark: "Fail", range: "0 – 39" },
}

// Remarks shown to Certificate II students instead of letter grades. Each maps
// to a representative grade so the engine can still score the result.
export const TVET_REMARK_GRADES: { remark: string; grade: TVETGrade }[] = [
  { remark: "Distinction", grade: "A" },
  { remark: "Upper Credit", grade: "B+" },
  { remark: "Credit", grade: "C+" },
  { remark: "Lower Credit", grade: "C-" },
  { remark: "Pass", grade: "D" },
  { remark: "Fail", grade: "F" },
]

export const TVET_REMARK_ROWS: { remark: string; ranges: string }[] = [
  { remark: "Distinction", ranges: "75 – 100" },
  { remark: "Upper Credit", ranges: "70 – 74 · 65 – 69" },
  { remark: "Credit", ranges: "55 – 64" },
  { remark: "Lower Credit", ranges: "50 – 54" },
  { remark: "Pass", ranges: "45 – 49 · 40 – 44" },
  { remark: "Fail", ranges: "0 – 39" },
]

export function displayGrade(grade: Grade | string): string {
  const remark = (TVET_GRADE_LABELS as Record<string, { remark: string; range: string }>)[grade]
  return remark ? remark.remark : grade
}

export const CORE_SUBJECTS = [
  "English Language",
  "Core Mathematics",
  "Integrated Science",
  "Social Studies",
] as const

export const CORE_LABELS: Record<string, string> = {
  "English Language": "English Language",
  "Core Mathematics": "Mathematics",
  "Mathematics": "Mathematics",
  "Integrated Science": "Integrated Science",
  "Social Studies": "Social Studies",
}

// ── SHS Track categories ──
export type SHSTrack = "SCIENCE" | "ARTS" | "VISUAL_ARTS" | "BUSINESS" | "TECHNICAL" | "VOCATIONAL"

export const SHS_TRACKS: { value: SHSTrack; label: string }[] = [
  { value: "SCIENCE", label: "General Science" },
  { value: "ARTS", label: "General Arts" },
  { value: "VISUAL_ARTS", label: "Visual Arts" },
  { value: "BUSINESS", label: "Business" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "VOCATIONAL", label: "Vocational / Home Economics" },
]

export function isTVETTrack(track: SHSTrack): boolean {
  return track === "TECHNICAL" || track === "VOCATIONAL"
}

// Reference: Ref/WASSCE_Subjects_Structure.md
export const TRACK_ELECTIVES: Record<SHSTrack, readonly string[]> = {
  SCIENCE: [
    "Elective Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Geography",
    "General Agriculture",
    "ICT",
    "French",
    "Music",
  ],
  ARTS: [
    "Christian Religious Studies",
    "Islamic Religious Studies",
    "Literature in English",
    "History",
    "Government",
    "Geography",
    "Economics",
    "French",
    "Arabic",
    "Elective Mathematics",
    "ICT",
    "Ghanaian Language",
    "Music",
    "West African Traditional Religion",
  ],
  VISUAL_ARTS: [
    "General Knowledge in Art",
    "Graphic Design",
    "Picture Making",
    "Basketry",
    "Ceramics",
    "Jewellery",
    "Leatherwork",
    "Sculpture",
    "Textiles",
    "Biology",
    "Chemistry",
    "Physics",
    "Elective Mathematics",
    "Economics",
    "Literature in English",
    "ICT",
    "French",
    "Music",
  ],
  BUSINESS: [
    "Business Management",
    "Financial Accounting",
    "Economics",
    "Elective Mathematics",
    "Cost Accounting",
    "ICT",
    "French",
    "Music",
    "Typewriting",
    "Clerical Office Duties",
    "Literature in English",
  ],
  TECHNICAL: [
    "Technical Drawing",
    "Applied Electricity",
    "Auto Mechanics",
    "Building Construction",
    "Electronics and Computer Hardware",
    "Practical/Project",
    "Computer Practice and Networking",
    "Metalwork",
    "Woodwork",
    "ICT",
    "Chemistry",
    "Physics",
    "French",
  ],
  VOCATIONAL: [
    "Management in Living",
    "Clothing and Textiles",
    "Foods and Nutrition",
    "General Knowledge in Art",
    "Textiles",
    "Biology",
    "Chemistry",
    "Physics",
    "Elective Mathematics",
    "ICT",
    "Economics",
    "French",
    "Music",
  ],
}

// Flat list of all elective subjects
export const ELECTIVE_SUBJECTS = [
  "Elective Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Geography",
  "General Agriculture",
  "ICT",
  "French",
  "Music",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Literature in English",
  "History",
  "Government",
  "Economics",
  "Arabic",
  "Ghanaian Language",
  "General Knowledge in Art",
  "Graphic Design",
  "Picture Making",
  "Basketry",
  "Ceramics",
  "Jewellery",
  "Leatherwork",
  "Sculpture",
  "Textiles",
  "Business Management",
  "Financial Accounting",
  "Cost Accounting",
  "Typewriting",
  "Clerical Office Duties",
  "Technical Drawing",
  "Applied Electricity",
  "Auto Mechanics",
  "Building Construction",
  "Electronics and Computer Hardware",
  "Practical/Project",
  "Computer Practice and Networking",
  "Metalwork",
  "Woodwork",
  "Management in Living",
  "Clothing and Textiles",
  "Foods and Nutrition",
  "West African Traditional Religion",
] as const

// All subjects shown in selectors — cores first then electives
export const ALL_SUBJECTS = [...CORE_SUBJECTS, ...ELECTIVE_SUBJECTS] as const

// Normalization map: lowercased trimmed -> canonical
const ALIAS_MAP: Record<string, string> = {
  "english": "English Language",
  "english language": "English Language",
  "core mathematics": "Core Mathematics",
  "mathematics": "Core Mathematics",
  "maths": "Core Mathematics",
  "integrated science": "Integrated Science",
  "general science": "Integrated Science",
  "social studies": "Social Studies",
  // Electives
  "elective mathematics": "Elective Mathematics",
  "elective maths": "Elective Mathematics",
  "further mathematics": "Elective Mathematics",
  "business mathematics": "Financial Accounting",
  "biology": "Biology",
  "chemistry": "Chemistry",
  "physics": "Physics",
  "geography": "Geography",
  "general agriculture": "General Agriculture",
  "agric science": "General Agriculture",
  "agricultural science": "General Agriculture",
  "ict": "ICT",
  "ict (elective)": "ICT",
  "computing": "ICT",
  "french": "French",
  "music": "Music",
  "christian religious studies": "Christian Religious Studies",
  "crs": "Christian Religious Studies",
  "islamic religious studies": "Islamic Religious Studies",
  "irs": "Islamic Religious Studies",
  "literature in english": "Literature in English",
  "literature": "Literature in English",
  "history": "History",
  "government": "Government",
  "economics": "Economics",
  "arabic": "Arabic",
  "ghanaian language": "Ghanaian Language",
  "west african traditional religion": "West African Traditional Religion",
  "watr": "West African Traditional Religion",
  "general knowledge in art": "General Knowledge in Art",
  "graphic design": "Graphic Design",
  "picture making": "Picture Making",
  "basketry": "Basketry",
  "ceramics": "Ceramics",
  "jewellery": "Jewellery",
  "jewelry": "Jewellery",
  "leatherwork": "Leatherwork",
  "sculpture": "Sculpture",
  "textiles": "Textiles",
  "clothing and textiles": "Clothing and Textiles",
  "business management": "Business Management",
  "financial accounting": "Financial Accounting",
  "accounting": "Financial Accounting",
  "cost accounting": "Cost Accounting",
  "costing": "Cost Accounting",
  "principles of costing": "Cost Accounting",
  "typewriting": "Typewriting",
  "clerical office duties": "Clerical Office Duties",
  "technical drawing": "Technical Drawing",
  "applied electricity": "Applied Electricity",
  "auto mechanics": "Auto Mechanics",
  "building construction": "Building Construction",
  "building technology": "Building Construction",
  "electronics": "Electronics and Computer Hardware",
  "electronics and computer hardware": "Electronics and Computer Hardware",
  "practical/project": "Practical/Project",
  "practical project": "Practical/Project",
  "computer practice and networking": "Computer Practice and Networking",
  "metalwork": "Metalwork",
  "metal work": "Metalwork",
  "woodwork": "Woodwork",
  "management in living": "Management in Living",
  "foods and nutrition": "Foods and Nutrition",
  "food and nutrition": "Foods and Nutrition",
  "drawing and painting": "General Knowledge in Art",
  "drawing": "General Knowledge in Art",
  "painting": "General Knowledge in Art",
  "engineering science": "Physics",
  "applied electronics": "Electronics and Computer Hardware",
  "elective ict": "ICT",
  "computer science": "ICT",
  "forestry": "General Agriculture",
  "fisheries": "Biology",
  "animal husbandry": "Biology",
  "crop husbandry": "General Agriculture",
  "horticulture": "General Agriculture",
  "dressmaking": "Clothing and Textiles",
}

export function normalizeSubject(input: string): string {
  const key = input.trim().toLowerCase().replace(/\s+/g, " ")
  if (ALIAS_MAP[key]) return ALIAS_MAP[key]
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

/** Get electives for a given SHS track, sorted alphabetically */
export function getElectivesForTrack(track: SHSTrack): string[] {
  return [...(TRACK_ELECTIVES[track] || [])].sort((a, b) => a.localeCompare(b))
}
