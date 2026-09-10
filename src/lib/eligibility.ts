import { GRADE_POINTS, isWASSCEPass, normalizeSubject, type WASSCEGrade } from "./subjects"

export type SubjectResult = {
  subject: string // canonical e.g. "Elective Mathematics"
  grade: WASSCEGrade
}

export type ProgrammeForCheck = {
  slug: string
  name: string
  level: "DIPLOMA" | "DEGREE" | "POSTGRADUATE"
  summary: string
  department?: { name: string } | null
  eligibilityRule?: EligibilityRule | null
  requirements: string // legacy text fallback
}

export type ElectiveGroup = {
  /** How many subjects from `from` must be covered (usually 1) */
  any: number
  /** Options — within group, any match counts (e.g. Elective Maths/Physics) */
  from: string[]
  /** Human label for UI e.g. "Chemistry" */
  label?: string
}

export type EligibilityRule = {
  level: "DIPLOMA" | "DEGREE" | "POSTGRADUATE"
  /** Core subjects required — e.g. ["English Language","Mathematics","Integrated Science"] */
  cores: string[]
  /** If set, allows this as alternative for last core (usually "Social Studies" for Integrated Science) */
  coreAlternative?: string | null
  /** Minimum passing grade — WASSCE: usually C6 */
  minGrade: WASSCEGrade
  /** Total elective slots required (3 for degree, 2 for diploma) */
  electiveCount: number
  /** Specific elective constraints — remaining slots are "any elective" */
  electiveGroups: ElectiveGroup[]
  /** If true, even if eligible, show exam note */
  requiresExam?: boolean
  /** Optional cut-off aggregate (sum 6 best) — null = no cut-off */
  aggregateCutOff?: number | null
  note?: string
}

export type CheckResult = {
  eligible: boolean
  tier: "ELIGIBLE" | "ALMOST" | "NOT"
  missingCores: string[]
  missingGroups: { label: string; options: string[] }[]
  failedGradeSubjects: { subject: string; grade: WASSCEGrade }[]
  aggregate: number | null // sum of best 6 points if calculable
  score: number // 0-100 for ranking
  details: string // friendly line
  requiresExam: boolean
}

function gradeOk(grade: WASSCEGrade, minGrade: WASSCEGrade): boolean {
  const g = GRADE_POINTS[grade]
  const m = GRADE_POINTS[minGrade]
  return g !== undefined && m !== undefined && g <= m
}

function findResultForSubject(
  results: SubjectResult[],
  subject: string,
): SubjectResult | undefined {
  const norm = normalizeSubject(subject)
  return results.find((r) => normalizeSubject(r.subject) === norm)
}

function subjectMatchesAny(result: SubjectResult, options: string[]): boolean {
  return options.some((opt) => normalizeSubject(result.subject) === normalizeSubject(opt))
}

function calculateAggregate(results: SubjectResult[]): number | null {
  const passed = results.filter((r) => isWASSCEPass(r.grade))
  if (passed.length < 6) return null
  const points = passed.map((r) => GRADE_POINTS[r.grade]).sort((a, b) => a - b)
  return points.slice(0, 6).reduce((a, b) => a + b, 0)
}

function coreDisplay(cores: string[], alt: string | null | undefined): string {
  if (alt) return `${cores.join(", ")} (or ${alt} in place of ${cores[cores.length - 1]})`
  return cores.join(", ")
}

export function evaluateProgramme(
  results: SubjectResult[],
  rule: EligibilityRule | null,
  programme: ProgrammeForCheck,
): CheckResult {
  // POSTGRADUATE is not WASSCE-based — short, unambiguous
  if (rule?.level === "POSTGRADUATE" || programme.level === "POSTGRADUATE") {
    return {
      eligible: false,
      tier: "NOT",
      missingCores: [],
      missingGroups: [],
      failedGradeSubjects: [],
      aggregate: null,
      score: 0,
      details: "Postgraduate requires degree class. See programme page.",
      requiresExam: false,
    }
  }

  // If no structured rule, manual review
  if (!rule) {
    const passCount = results.filter((r) => isWASSCEPass(r.grade)).length
    const needed = programme.level === "DIPLOMA" ? 5 : 6
    const eligible = passCount >= needed
    return {
      eligible: false,
      tier: eligible ? "ALMOST" : "NOT",
      missingCores: [],
      missingGroups: [],
      failedGradeSubjects: [],
      aggregate: calculateAggregate(results),
      score: eligible ? 45 : 20,
      details: "No checker data for this programme. Check programme page.",
      requiresExam: false,
    }
  }

  const missingCores: string[] = []
  const failedGradeSubjects: { subject: string; grade: WASSCEGrade }[] = []

  // Check cores
  for (const core of rule.cores) {
    const isLastCore = core === rule.cores[rule.cores.length - 1]
    const alt = isLastCore ? rule.coreAlternative : null
    let res = findResultForSubject(results, core)
    let usedAlt = false
    if (!res && alt) {
      res = findResultForSubject(results, alt)
      usedAlt = !!res
    }
    if (!res) {
      missingCores.push(alt ? `${core} (or ${alt})` : core)
      continue
    }
    if (!gradeOk(res.grade, rule.minGrade)) {
      failedGradeSubjects.push({ subject: usedAlt ? alt! : core, grade: res.grade })
    }
  }

  // Check grades for all results that are part of cores/electives — already above for cores
  // Also fail if any core grade is D7/E8/F9

  // Electives: need to allocate subjects distinctively
  // First, collect eligible elective results (exclude cores that were already counted as core)
  const coreNorms = new Set(rule.cores.map(normalizeSubject))
  if (rule.coreAlternative) coreNorms.add(normalizeSubject(rule.coreAlternative))
  // Don't double-exclude: cores are separate pool; electives are non-core subjects only
  const electivePool = results.filter((r) => !coreNorms.has(normalizeSubject(r.subject)))

  // Filter pool to only passed subjects with required min grade for counting toward requirements
  const passedElectives = electivePool.filter((r) => gradeOk(r.grade, rule.minGrade))

  const missingGroups: { label: string; options: string[] }[] = []
  const usedIndices = new Set<number>()

  for (const group of rule.electiveGroups) {
    let satisfied = 0
    for (let need = 0; need < group.any; need++) {
      const idx = passedElectives.findIndex(
        (r, i) => !usedIndices.has(i) && subjectMatchesAny(r, group.from),
      )
      if (idx !== -1) {
        usedIndices.add(idx)
        satisfied++
      }
    }
    if (satisfied < group.any) {
      missingGroups.push({
        label: group.label || group.from.join(" / "),
        options: group.from,
      })
    }
  }

  // Remaining elective slots: total - groups satisfied count
  const groupsAnyTotal = rule.electiveGroups.reduce((sum, g) => sum + g.any, 0)
  const remainingNeeded = rule.electiveCount - groupsAnyTotal
  let extraMissing = 0
  if (remainingNeeded > 0) {
    const remainingAvailable = passedElectives.length - usedIndices.size
    if (remainingAvailable < remainingNeeded) {
      extraMissing = remainingNeeded - remainingAvailable
    }
  }

  // Total subjects needed check (for diploma vs degree)
  const totalNeeded = rule.level === "DIPLOMA" ? 5 : 6
  const totalPassCount = results.filter((r) => isWASSCEPass(r.grade) && gradeOk(r.grade, rule.minGrade)).length
  const notEnoughTotal = totalPassCount < totalNeeded

  const aggregate = calculateAggregate(results)
  const failedCores = missingCores.length > 0 || failedGradeSubjects.length > 0
  const failedGroups = missingGroups.length > 0 || extraMissing > 0

  let eligible = !failedCores && !failedGroups && !notEnoughTotal
  // If aggregate cut-off exists, check it
  if (eligible && rule.aggregateCutOff && aggregate !== null) {
    if (aggregate > rule.aggregateCutOff) eligible = false
  }

  let tier: CheckResult["tier"] = "NOT"
  if (eligible) tier = "ELIGIBLE"
  else if (
    missingCores.length <= 1 &&
    missingGroups.length <= 1 &&
    extraMissing === 0 &&
    failedGradeSubjects.length === 0 &&
    !notEnoughTotal
  )
    tier = "ALMOST"

  const score = (() => {
    if (eligible) {
      // Higher score for lower aggregate (better grades)
      const aggBonus = aggregate ? Math.max(0, 20 - (aggregate - 6) * 1) : 0
      return Math.min(100, 80 + aggBonus)
    }
    if (tier === "ALMOST") return 62
    // Partial: count how many requirements met
    const coreMet = rule.cores.length - missingCores.length - failedGradeSubjects.length
    const groupMet = rule.electiveGroups.length - missingGroups.length
    const base = (coreMet / Math.max(1, rule.cores.length)) * 35 + (groupMet / Math.max(1, rule.electiveGroups.length)) * 35
    return Math.max(10, Math.round(base))
  })()

  let details = ""
  if (eligible) {
    details = `Eligible — cores (${coreDisplay(rule.cores, rule.coreAlternative)}) and electives met at ${rule.minGrade}.`
    if (rule.requiresExam) details += " Entrance exam required."
  } else if (tier === "ALMOST") {
    const whatsMissing = [...missingCores, ...missingGroups.map((g) => g.label)].join(", ")
    if (failedGradeSubjects.length > 0) {
      details = `Not eligible — grade below ${rule.minGrade}: ${failedGradeSubjects.map((f) => `${f.subject} ${f.grade}`).join(", ")}.`
    } else {
      details = `Not eligible — missing: ${whatsMissing || "1 requirement"}.`
    }
    if (rule.requiresExam) details += " (Requires exam if eligible.)"
  } else {
    const parts: string[] = []
    if (missingCores.length) parts.push(`Core: ${missingCores.join(", ")}`)
    if (failedGradeSubjects.length) parts.push(`Below ${rule.minGrade}: ${failedGradeSubjects.map((f) => `${f.subject} ${f.grade}`).join(", ")}`)
    if (missingGroups.length) parts.push(`Elective: ${missingGroups.map((g) => g.label).join(", ")}`)
    if (extraMissing > 0) parts.push(`${extraMissing} more elective(s)`)
    details = `Not eligible — ${parts.join(" · ") || "requirements not met"}.`
  }

  return {
    eligible,
    tier,
    missingCores,
    missingGroups,
    failedGradeSubjects,
    aggregate,
    score,
    details,
    requiresExam: !!rule.requiresExam,
  }
}

export function rankProgrammes(
  results: SubjectResult[],
  programmes: ProgrammeForCheck[],
): Array<{ programme: ProgrammeForCheck; result: CheckResult }> {
  return programmes
    .map((p) => ({
      programme: p,
      result: evaluateProgramme(results, (p.eligibilityRule as EligibilityRule | null) ?? null, p),
    }))
    .sort((a, b) => {
      // ELIGIBLE first, then ALMOST, then NOT; within, higher score
      const tierOrder = { ELIGIBLE: 0, ALMOST: 1, NOT: 2 } as const
      if (tierOrder[a.result.tier] !== tierOrder[b.result.tier]) return tierOrder[a.result.tier] - tierOrder[b.result.tier]
      return b.result.score - a.result.score
    })
}

export type Recommendation = {
  programme: ProgrammeForCheck
  result: CheckResult
  reason: string
  confidence: "HIGH" | "MEDIUM" | "LOW"
  alternatives: Array<{ programme: ProgrammeForCheck; result: CheckResult }>
}

function buildRecommendationReason(
  programme: ProgrammeForCheck,
  result: CheckResult,
  results: SubjectResult[],
): string {
  const strongSubjects = results
    .filter((r) => GRADE_POINTS[r.grade] <= 3)
    .map((r) => `${r.subject} ${r.grade}`)
    .slice(0, 2)
    .join(", ")

  if (result.tier === "ELIGIBLE") {
    const exam = result.requiresExam ? " Exam required." : ""
    return `Best match — all requirements met.${strongSubjects ? ` Strength: ${strongSubjects}.` : ""}${exam}`
  }
  if (result.tier === "ALMOST") {
    const missing = [...result.missingCores, ...result.missingGroups.map((g) => g.label)].join(", ") || "1 requirement"
    return `Closest match — missing: ${missing}.`
  }
  if (result.score >= 40) {
    const missing = [...result.missingCores, ...result.missingGroups.map((g) => g.label)].slice(0, 2).join(", ")
    return `Closest option: ${programme.name}${missing ? ` — needs ${missing}` : ""}.`
  }
  return `Closest available: ${programme.name}. Check requirements for alternate pathway.`
}

export function getTopRecommendation(
  results: SubjectResult[],
  programmes: ProgrammeForCheck[],
): Recommendation | null {
  const ranked = rankProgrammes(results, programmes)
  // Only recommend programmes that will actually accept the results
  const eligibleOnly = ranked.filter((r) => r.result.tier === "ELIGIBLE")
  if (eligibleOnly.length === 0) return null
  const top = eligibleOnly[0]
  if (!top) return null

  const confidence: Recommendation["confidence"] = "HIGH"
  const reason = buildRecommendationReason(top.programme, top.result, results)
  const alternatives = eligibleOnly.slice(1, 4)

  return { programme: top.programme, result: top.result, reason, confidence, alternatives }
}

// Helper to parse legacy JSON from DB
export function parseEligibilityRule(raw: unknown): EligibilityRule | null {
  if (!raw || typeof raw !== "object") return null
  try {
    const r = raw as EligibilityRule
    if (!r.cores || !Array.isArray(r.cores)) return null
    return r
  } catch {
    return null
  }
}
