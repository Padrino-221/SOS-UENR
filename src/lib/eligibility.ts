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
  department?: { name: string; school?: string | null } | null
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

/** Shortens a list for one-line UI copy: "A, B +2 more" */
function shortList(items: string[], max = 2): string {
  if (items.length === 0) return ""
  const head = items.slice(0, max).join(", ")
  return items.length > max ? `${head} +${items.length - max} more` : head
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
      details: "Postgraduate entry is based on degree class.",
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
      details: "No checker data acquired — see the programme page.",
      requiresExam: false,
    }
  }

  const missingCores: string[] = []
  const failedCoreGrades: { subject: string; grade: WASSCEGrade }[] = []

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
      failedCoreGrades.push({ subject: usedAlt ? alt! : core, grade: res.grade })
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

  // Track electives with failing grades (entered but below min)
  const failedElectiveGrades: { subject: string; grade: WASSCEGrade }[] = []
  for (const r of electivePool) {
    if (!gradeOk(r.grade, rule.minGrade)) {
      failedElectiveGrades.push({ subject: r.subject, grade: r.grade })
    }
  }

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
      // Check if user entered any of these subjects but with a failing grade
      const enteredButFailed = electivePool.some(
        (r) => subjectMatchesAny(r, group.from) && !gradeOk(r.grade, rule.minGrade),
      )
      if (!enteredButFailed) {
        missingGroups.push({
          label: group.label || group.from.join(" / "),
          options: group.from,
        })
      }
    }
  }

  // Combine core and elective failures for the result
  const failedGradeSubjects = [...failedCoreGrades, ...failedElectiveGrades]

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
  const hasCoreProblems = missingCores.length > 0 || failedCoreGrades.length > 0
  const hasElectiveProblems = missingGroups.length > 0 || extraMissing > 0

  let eligible = !hasCoreProblems && !hasElectiveProblems && !notEnoughTotal
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
    failedCoreGrades.length === 0 &&
    !notEnoughTotal
  )
    tier = "ALMOST"

  const score = (() => {
    if (eligible) {
      const aggBonus = aggregate ? Math.max(0, 20 - (aggregate - 6) * 1) : 0
      return Math.min(100, 80 + aggBonus)
    }
    if (tier === "ALMOST") return 62
    // Partial: count how many requirements met
    const coreMet = rule.cores.length - missingCores.length - failedCoreGrades.length
    const groupMet = rule.electiveGroups.length - missingGroups.length
    const base = (coreMet / Math.max(1, rule.cores.length)) * 35 + (groupMet / Math.max(1, rule.electiveGroups.length)) * 35
    return Math.max(10, Math.round(base))
  })()

  // One short summary line
  let details = ""
  if (eligible) {
    details = `All requirements met at ${rule.minGrade} or better.`
    if (rule.requiresExam) details += " Entrance exam required."
  } else if (tier === "ALMOST") {
    if (failedGradeSubjects.length > 0) {
      details = `Grade too low: ${shortList(failedGradeSubjects.map((f) => `${f.subject} is ${f.grade}`), 2)}. Need ${rule.minGrade} or better.`
    } else {
      const whatsMissing = [...missingCores, ...missingGroups.map((g) => g.label)]
      details = `Missing: ${shortList(whatsMissing) || "1 requirement"}.`
    }
    if (rule.requiresExam) details += " Exam if admitted."
  } else {
    const parts: string[] = []
    if (missingCores.length) parts.push(`Missing core: ${shortList(missingCores)}`)
    if (failedCoreGrades.length) parts.push(`Core grade too low: ${shortList(failedCoreGrades.map((f) => `${f.subject} is ${f.grade}`), 2)}`)
    if (missingGroups.length) parts.push(`Missing elective: ${shortList(missingGroups.map((g) => g.label))}`)
    if (failedElectiveGrades.length) parts.push(`Elective grade too low: ${shortList(failedElectiveGrades.map((f) => `${f.subject} is ${f.grade}`), 2)}`)
    if (extraMissing > 0) parts.push(`${extraMissing} more elective(s) needed`)
    details = `${parts.slice(0, 3).join(". ") || "Requirements not met"}.`
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
  result: CheckResult,
  results: SubjectResult[],
): string {
  const strongSubjects = results
    .filter((r) => GRADE_POINTS[r.grade] <= 3)
    .map((r) => `${r.subject} ${r.grade}`)
    .slice(0, 2)
    .join(", ")

  if (result.tier === "ELIGIBLE") {
    const exam = result.requiresExam ? " Entrance exam required." : ""
    return `All requirements met.${strongSubjects ? ` Strongest: ${strongSubjects}.` : ""}${exam}`
  }
  if (result.tier === "ALMOST") {
    const whatsMissing = [...result.missingCores, ...result.missingGroups.map((g) => g.label)]
    if (result.failedGradeSubjects.length > 0) {
      const lowGrades = result.failedGradeSubjects.map((f) => f.subject).join(", ")
      return `Closest match — grades too low in ${lowGrades}.`
    }
    const missing = shortList(whatsMissing, 1) || "1 requirement"
    return `Closest match — missing ${missing}.`
  }
  if (result.score >= 40) {
    const whatsMissing = [...result.missingCores, ...result.missingGroups.map((g) => g.label)]
    const missing = shortList(whatsMissing, 1)
    return missing ? `Nearest alternative — needs ${missing}.` : "Nearest alternative that fits these grades."
  }
  return "Requirements not met — check alternate pathways."
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
  const reason = buildRecommendationReason(top.result, results)
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
