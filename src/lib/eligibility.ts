import { CORE_SUBJECTS, GRADE_POINTS, isWASSCEPass, normalizeSubject, displayGrade, type WASSCEGrade, type Grade } from "./subjects"

export type SubjectResult = {
  subject: string // canonical e.g. "Elective Mathematics"
  grade: Grade
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
  /** OR-alternatives: each entry is a full alternative set of elective groups —
   *  satisfying the base set OR any alternative fulfils the elective requirement */
  electiveGroupAlternatives?: ElectiveGroup[][]
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
  failedGradeSubjects: { subject: string; grade: Grade }[]
  aggregate: number | null // sum of best 6 points if calculable
  score: number // 0-100 for ranking
  details: string // friendly line
  requiresExam: boolean
}

function gradeOk(grade: Grade, minGrade: WASSCEGrade): boolean {
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

type GroupSetOutcome = {
  missing: { label: string; options: string[] }[]
  extraMissing: number
  satisfied: boolean
}

function evaluateGroupSet(
  groups: ElectiveGroup[],
  rule: EligibilityRule,
  passedElectives: SubjectResult[],
  electivePool: SubjectResult[],
  countFailedAsCovered = true,
): GroupSetOutcome {
  const missing: { label: string; options: string[] }[] = []
  const usedIndices = new Set<number>()
  let matchedAll = true

  for (const group of groups) {
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
      matchedAll = false
      // Only suppress the "missing" report when failed grades account for the
      // whole shortfall — otherwise the subject is genuinely absent.
      const failedEntries = electivePool.filter(
        (r) => subjectMatchesAny(r, group.from) && !gradeOk(r.grade, rule.minGrade),
      ).length
      if (!countFailedAsCovered || satisfied + failedEntries < group.any) {
        missing.push({
          label: group.label || group.from.join(" / "),
          options: group.from,
        })
      }
    }
  }

  const groupsAnyTotal = groups.reduce((sum, g) => sum + g.any, 0)
  const remainingNeeded = rule.electiveCount - groupsAnyTotal
  let extraMissing = 0
  if (remainingNeeded > 0) {
    const remainingAvailable = passedElectives.length - usedIndices.size
    if (remainingAvailable < remainingNeeded) {
      extraMissing = remainingNeeded - remainingAvailable
    }
  }

  return { missing, extraMissing, satisfied: matchedAll && extraMissing === 0 }
}

function shortfallOf(outcome: GroupSetOutcome): number {
  return outcome.missing.length + outcome.extraMissing
}

/** Picks the best (least shortfall) OR-alternative group set. */
function bestGroupSetOutcome(
  groupSets: ElectiveGroup[][],
  rule: EligibilityRule,
  passedElectives: SubjectResult[],
  electivePool: SubjectResult[],
  countFailedAsCovered = true,
): GroupSetOutcome {
  const outcomes = groupSets.map((g) => evaluateGroupSet(g, rule, passedElectives, electivePool, countFailedAsCovered))
  let chosen = outcomes[0]
  for (const o of outcomes) {
    if (o.satisfied) {
      chosen = o
      break
    }
    if (shortfallOf(o) < shortfallOf(chosen)) chosen = o
  }
  return chosen
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
  const failedCoreGrades: { subject: string; grade: Grade }[] = []

  // Check cores. When a rule allows an alternative (e.g. Integrated Science OR
  // Social Studies) and the student entered both, use whichever grade is better.
  for (const core of rule.cores) {
    const isLastCore = core === rule.cores[rule.cores.length - 1]
    const alt = isLastCore ? rule.coreAlternative : null
    const coreRes = findResultForSubject(results, core)
    const altRes = alt ? findResultForSubject(results, alt) : undefined

    let res = coreRes
    let usedAlt = false
    if (coreRes && altRes) {
      if (GRADE_POINTS[altRes.grade] < GRADE_POINTS[coreRes.grade]) {
        res = altRes
        usedAlt = true
      }
    } else if (!coreRes && altRes) {
      res = altRes
      usedAlt = true
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

  // Electives: need to allocate subjects distinctively.
  // Exclude every core subject (English, Maths, Science, Social) from the pool —
  // cores are never counted as electives, even if a rule doesn't list them.
  const coreNorms = new Set<string>(CORE_SUBJECTS.map(normalizeSubject))
  for (const c of rule.cores) coreNorms.add(normalizeSubject(c))
  if (rule.coreAlternative) coreNorms.add(normalizeSubject(rule.coreAlternative))
  const electivePool = results.filter((r) => !coreNorms.has(normalizeSubject(r.subject)))

  // Filter pool to only passed subjects with required min grade for counting toward requirements
  const passedElectives = electivePool.filter((r) => gradeOk(r.grade, rule.minGrade))

  // Elective requirement: the base group set, or any alternative set for
  // programmes with "Science option OR Arts option" style requirements.
  const groupSets: ElectiveGroup[][] =
    rule.electiveGroupAlternatives && rule.electiveGroupAlternatives.length > 0
      ? [rule.electiveGroups, ...rule.electiveGroupAlternatives]
      : [rule.electiveGroups]
  const chosenOutcome = bestGroupSetOutcome(groupSets, rule, passedElectives, electivePool)
  const missingGroups = chosenOutcome.missing
  const extraMissing = chosenOutcome.extraMissing

  // Track electives with failing grades (entered but below min).
  // Only report the ones that are load-bearing: upgrading that subject must
  // shrink the elective shortfall, otherwise it's an extra the student entered
  // beyond what the programme needs (e.g. D7 Physics when Elective Math already
  // satisfies the Physics/Elective Math group).
  const failedElectiveGrades: { subject: string; grade: Grade }[] = []
  for (const r of electivePool) {
    if (!gradeOk(r.grade, rule.minGrade)) {
      // Compare against outcomes that DON'T count failed grades as covering the
      // shortfall, so a low grade is only reported as a blocker when upgrading
      // it would genuinely close remaining requirement gaps.
      const before = shortfallOf(bestGroupSetOutcome(groupSets, rule, passedElectives, electivePool, false))
      const after = shortfallOf(
        bestGroupSetOutcome(groupSets, rule, [...passedElectives, r], electivePool, false),
      )
      if (after < before) failedElectiveGrades.push({ subject: r.subject, grade: r.grade })
    }
  }

  // Combine core and elective failures for the result
  const failedGradeSubjects = [...failedCoreGrades, ...failedElectiveGrades]

  // Total subjects needed check (for diploma vs degree).
  // Counts any subject at/above the rule's min grade (diplomas allow passes, i.e. D7+).
  const totalNeeded = rule.level === "DIPLOMA" ? 5 : 6
  const totalPassCount = results.filter((r) => gradeOk(r.grade, rule.minGrade)).length
  const notEnoughTotal = totalPassCount < totalNeeded

  const aggregate = calculateAggregate(results)
  const hasCoreProblems = missingCores.length > 0 || failedCoreGrades.length > 0

  let eligible = !hasCoreProblems && chosenOutcome.satisfied && !notEnoughTotal
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
      details = `Grade too low: ${shortList(failedGradeSubjects.map((f) => `${f.subject} is ${displayGrade(f.grade)}`), 2)}. Need ${rule.minGrade} or better.`
    } else {
      const whatsMissing = [...missingCores, ...missingGroups.map((g) => g.label)]
      details = `Missing: ${shortList(whatsMissing) || "1 requirement"}.`
    }
    if (rule.requiresExam) details += " Exam if admitted."
  } else {
    const parts: string[] = []
    if (missingCores.length) parts.push(`Missing core: ${shortList(missingCores)}`)
    if (failedCoreGrades.length) parts.push(`Core grade too low: ${shortList(failedCoreGrades.map((f) => `${f.subject} is ${displayGrade(f.grade)}`), 2)}`)
    if (missingGroups.length) parts.push(`Missing elective: ${shortList(missingGroups.map((g) => g.label))}`)
    if (failedElectiveGrades.length) parts.push(`Elective grade too low: ${shortList(failedElectiveGrades.map((f) => `${f.subject} is ${displayGrade(f.grade)}`), 2)}`)
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
      // ELIGIBLE first, then ALMOST, then NOT; within, DEGREE before DIPLOMA before POSTGRADUATE, then higher score
      const tierOrder = { ELIGIBLE: 0, ALMOST: 1, NOT: 2 } as const
      if (tierOrder[a.result.tier] !== tierOrder[b.result.tier]) return tierOrder[a.result.tier] - tierOrder[b.result.tier]
      const levelOrder = { DEGREE: 0, DIPLOMA: 1, POSTGRADUATE: 2 } as const
      if (levelOrder[a.programme.level] !== levelOrder[b.programme.level]) return levelOrder[a.programme.level] - levelOrder[b.programme.level]
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
