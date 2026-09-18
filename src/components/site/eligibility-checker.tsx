'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  PencilSimple,
  Sparkle,
  Star,
  Trophy,
} from '@phosphor-icons/react'
import { WASSCE_GRADES, GRADE_POINTS, normalizeSubject, type WASSCEGrade, type SHSTrack, SHS_TRACKS, getElectivesForTrack } from '@/lib/subjects'
import { evaluateProgramme, rankProgrammes, getTopRecommendation, type ProgrammeForCheck, type SubjectResult, type EligibilityRule } from '@/lib/eligibility'
import { SelectDropdown } from '@/components/ui/select-dropdown'

type Props = {
  programmes: ProgrammeForCheck[]
}

type ResultRow = { subject: string; grade: WASSCEGrade | '' }

const CORE_OPTIONS = ["Integrated Science", "Social Studies"] as const

const STEPS = [
  { label: "Track", hint: "Your SHS background" },
  { label: "Core", hint: "English, Maths, Science/Social Studies" },
  { label: "Electives", hint: "Your best three subjects" },
  { label: "Results", hint: "Programmes you qualify for" },
] as const

function GradeSelect({ value, onChange }: { value: string; onChange: (v: WASSCEGrade | '') => void }) {
  const options = WASSCE_GRADES.map((g) => ({ value: g, label: g }))
  return (
    <SelectDropdown
      options={options}
      value={value}
      onChange={(v) => onChange(v as WASSCEGrade | '')}
      placeholder="Grade"
      className="ck-input"
    />
  )
}

function SubjectSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string }) {
  const uniqueOptions = [...new Set(options)].map((s) => ({ value: s, label: s }))
  return (
    <SelectDropdown
      options={uniqueOptions}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="ck-input"
    />
  )
}

function MobileStepper({ step }: { step: number }) {
  return (
    <div className="ck-stepper mb-4 lg:hidden">
      <span className="ck-stepper-bar" style={{ width: `${(step / (STEPS.length - 1)) * 75}%` }} aria-hidden />
      {STEPS.map((s, i) => (
        <div key={s.label} className="ck-stepper-item">
          <span className={`ck-stepper-dot ${i < step ? 'is-done' : i === step ? 'is-active' : ''}`}>
            {i < step ? <CheckCircle size={13} weight="duotone" /> : i + 1}
          </span>
          <span className={`ck-stepper-label ${i <= step ? 'is-current' : ''}`}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function StepRail({
  step,
  onJump,
  mode,
  programmeName,
  aggregate,
  eligible,
  checked,
}: {
  step: number
  onJump: (i: number) => void
  mode: 'specific' | 'best'
  programmeName?: string
  aggregate: number | null
  eligible: number
  checked: number
}) {
  return (
    <aside className="ck-rail hidden lg:sticky lg:top-8 lg:block">
      <p className="ck-rail-head">Your progress</p>
      <ol>
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => onJump(i)}
                disabled={!done}
                aria-current={active ? 'step' : undefined}
                className={`ck-rail-item ${active ? 'is-active' : ''}`}
              >
                <span className={`ck-rail-dot ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}>
                  {done ? <CheckCircle size={14} weight="duotone" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-ink-900">{s.label}</span>
                  <span className="block text-xs leading-snug text-ink-500">{s.hint}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="ck-rail-foot">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
          {mode === 'best' ? 'Best fit' : 'Specific programme'}
        </p>
        {mode === 'specific' && programmeName && (
          <p className="mt-1.5 text-xs font-medium leading-snug text-ink-700">{programmeName}</p>
        )}
        <dl className="mt-3 space-y-1.5 border-t border-ink-200 pt-3">
          {aggregate !== null && (
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-xs text-ink-500">Best-6</dt>
              <dd className="text-sm font-bold text-ink-900">{aggregate}</dd>
            </div>
          )}
          {step === 3 && (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-xs text-ink-500">Eligible</dt>
                <dd className="text-sm font-bold text-brand-700">{eligible}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-xs text-ink-500">Checked</dt>
                <dd className="text-sm font-bold text-ink-900">{checked}</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </aside>
  )
}

export function EligibilityChecker({ programmes }: Props) {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<"specific" | "best">("specific")
  const [selectedProgrammeSlug, setSelectedProgrammeSlug] = useState<string>("")
  const [shsTrack, setShsTrack] = useState<SHSTrack>("SCIENCE")
  const [coreThird, setCoreThird] = useState<"Integrated Science" | "Social Studies">("Integrated Science")
  const [cores, setCores] = useState<ResultRow[]>([
    { subject: "English Language", grade: "" },
    { subject: "Core Mathematics", grade: "" },
    { subject: "Integrated Science", grade: "" },
  ])
  const [electives, setElectives] = useState<ResultRow[]>([
    { subject: "", grade: "" },
    { subject: "", grade: "" },
    { subject: "", grade: "" },
  ])
  const [submitted, setSubmitted] = useState(false)
  const [levelFilter, setLevelFilter] = useState<"ALL" | "DEGREE" | "DIPLOMA">("ALL")
  const [schoolFilter, setSchoolFilter] = useState<string>("ALL")

  const electivesForTrack = useMemo(() => getElectivesForTrack(shsTrack), [shsTrack])

  const handleTrackChange = (track: SHSTrack) => {
    setShsTrack(track)
    setElectives([{ subject: "", grade: "" }, { subject: "", grade: "" }, { subject: "", grade: "" }])
  }

  const handleCoreThirdChange = (alt: "Integrated Science" | "Social Studies") => {
    setCoreThird(alt)
    setCores((prev) => {
      const copy = [...prev]
      copy[2] = { ...copy[2], subject: alt }
      return copy
    })
  }

  const eligibleProgrammes = useMemo(() => programmes.filter((p) => p.level !== "POSTGRADUATE"), [programmes])

  const schools = useMemo(() => {
    const schoolSet = new Set<string>()
    for (const p of eligibleProgrammes) {
      if (p.department?.school) schoolSet.add(p.department.school)
    }
    return ["ALL", ...Array.from(schoolSet).sort()]
  }, [eligibleProgrammes])

  const results: SubjectResult[] = useMemo(() => {
    const all: SubjectResult[] = []
    for (const c of cores) if (c.subject && c.grade) all.push({ subject: normalizeSubject(c.subject), grade: c.grade as WASSCEGrade })
    for (const e of electives) if (e.subject && e.grade) all.push({ subject: normalizeSubject(e.subject), grade: e.grade as WASSCEGrade })
    return all
  }, [cores, electives])

  const aggregate = useMemo(() => {
    const passed = results.filter((r) => GRADE_POINTS[r.grade] <= 6)
    if (passed.length < 6) return null
    const pts = passed.map((r) => GRADE_POINTS[r.grade]).sort((a, b) => a - b).slice(0, 6)
    return pts.reduce((a, b) => a + b, 0)
  }, [results])

  const canSubmit = cores.every((c) => c.grade) && electives.filter((e) => e.subject && e.grade).length >= 2 && (mode === "best" || !!selectedProgrammeSlug)

  const ranked = useMemo(() => {
    if (!submitted) return []
    const withParsed = eligibleProgrammes.map((p) => ({
      ...p,
      eligibilityRule: (p.eligibilityRule as EligibilityRule | null) ?? null,
    }))
    return rankProgrammes(results, withParsed)
  }, [submitted, results, eligibleProgrammes])

  const filtered = useMemo(() => {
    let result = ranked.filter((r) => r.result.tier === "ELIGIBLE")
    if (levelFilter !== "ALL") result = result.filter((r) => r.programme.level === levelFilter)
    if (schoolFilter !== "ALL") result = result.filter((r) => r.programme.department?.school === schoolFilter)
    return result.slice(0, 3)
  }, [ranked, levelFilter, schoolFilter])

  const summary = useMemo(() => {
    if (!submitted || ranked.length === 0) return null
    const eligible = ranked.filter((r) => r.result.tier === "ELIGIBLE").length
    return { eligible, total: ranked.length }
  }, [ranked, submitted])

  const topRecommendation = useMemo(() => {
    if (!submitted || mode !== "best") return null
    let pool = eligibleProgrammes
    if (levelFilter !== "ALL") pool = pool.filter((p) => p.level === levelFilter)
    if (schoolFilter !== "ALL") pool = pool.filter((p) => p.department?.school === schoolFilter)
    const withParsed = pool.map((p) => ({
      ...p,
      eligibilityRule: (p.eligibilityRule as EligibilityRule | null) ?? null,
    }))
    return getTopRecommendation(results, withParsed as ProgrammeForCheck[])
  }, [submitted, results, eligibleProgrammes, levelFilter, schoolFilter, mode])

  const specificProgramme = useMemo(() => eligibleProgrammes.find((p) => p.slug === selectedProgrammeSlug) ?? null, [eligibleProgrammes, selectedProgrammeSlug])
  const specificResult = useMemo(() => {
    if (!submitted || mode !== "specific" || !specificProgramme) return null
    return evaluateProgramme(results, (specificProgramme.eligibilityRule as EligibilityRule | null) ?? null, specificProgramme as ProgrammeForCheck)
  }, [submitted, mode, specificProgramme, results])

  const resetAll = () => {
    setStep(0)
    setMode("specific")
    setSelectedProgrammeSlug("")
    setShsTrack("SCIENCE")
    setCoreThird("Integrated Science")
    setCores([
      { subject: "English Language", grade: "" },
      { subject: "Core Mathematics", grade: "" },
      { subject: "Integrated Science", grade: "" },
    ])
    setElectives([{ subject: "", grade: "" }, { subject: "", grade: "" }, { subject: "", grade: "" }])
    setSubmitted(false)
    setLevelFilter("ALL")
    setSchoolFilter("ALL")
  }

  const goNext = () => {
    if (step === 2) setSubmitted(true)
    setStep((s) => Math.min(s + 1, 3))
  }
  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const schoolOptions = schools.map((s) => ({ value: s, label: s === "ALL" ? "All schools" : s }))

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="ck-header">
        <div className="ck-container relative">
          <p className="ck-kicker">UENR Admissions</p>
          <h1 className="font-display text-ink-900">Check Your Eligibility</h1>
          <p className="ck-lede">
            Enter your SHS background and WASSCE grades to see which programmes you qualify for.
          </p>
        </div>
      </header>

      <div className="ck-container ck-section">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">
          <StepRail
            step={step}
            onJump={setStep}
            mode={mode}
            programmeName={specificProgramme?.name}
            aggregate={aggregate}
            eligible={summary?.eligible ?? 0}
            checked={summary?.total ?? 0}
          />

          <div className="min-w-0">
            <MobileStepper step={step} />

            {/* Step 0 — track & programme */}
            {step === 0 && (
              <section className="ck-card">
                <h2 className="font-display text-xl text-ink-900">What did you study?</h2>
                <p className="mt-1.5 text-sm text-ink-500">
                  Your track sets the electives you can pick.
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <label className="ck-field-label">SHS track</label>
                    <SelectDropdown
                      options={SHS_TRACKS.map((t) => ({ value: t.value, label: t.label }))}
                      value={shsTrack}
                      onChange={(v) => handleTrackChange(v as SHSTrack)}
                      placeholder="Select track"
                      className="ck-input"
                    />
                  </div>

                  <div>
                    <span className="ck-field-label">What are you here to check?</span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setMode("specific")}
                        aria-pressed={mode === "specific"}
                        className={`ck-choice ${mode === "specific" ? "is-active" : ""}`}
                      >
                        <span className="ck-choice-title">Specific programme</span>
                        <span className="ck-choice-hint">One programme you already have in mind</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("best")}
                        aria-pressed={mode === "best"}
                        className={`ck-choice ${mode === "best" ? "is-active" : ""}`}
                      >
                        <span className="ck-choice-title">Find best fit</span>
                        <span className="ck-choice-hint">Rank everything you qualify for</span>
                      </button>
                    </div>
                  </div>

                  {mode === "specific" && (
                    <div>
                      <label className="ck-field-label">Programme</label>
                      <SelectDropdown
                        options={[...eligibleProgrammes]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((p) => ({ value: p.slug, label: p.name }))}
                        value={selectedProgrammeSlug}
                        onChange={setSelectedProgrammeSlug}
                        placeholder="Select programme"
                        className="ck-input"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    disabled={mode === "specific" && !selectedProgrammeSlug}
                    onClick={goNext}
                    className="ck-btn ck-btn-primary w-full sm:w-auto"
                  >
                    Next <ArrowRight size={14} weight="duotone" />
                  </button>
                </div>
              </section>
            )}

            {/* Step 1 — core subjects */}
            {step === 1 && (
              <section className="ck-card">
                <h2 className="font-display text-xl text-ink-900">Core subjects</h2>
                <p className="mt-1.5 text-sm text-ink-500">
                  Select your grade for all three.
                </p>

                <div className="mt-5 space-y-3">
                  {cores.slice(0, 2).map((c, idx) => (
                    <div key={c.subject} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                      <span className="flex-1 truncate border border-ink-100 bg-ink-50 px-3 py-2.5 text-sm font-medium text-ink-800">
                        {c.subject}
                      </span>
                      <div className="w-full sm:w-28 sm:shrink-0">
                        <GradeSelect value={c.grade} onChange={(v) => setCores((prev) => { const cp = [...prev]; cp[idx] = { ...cp[idx], grade: v }; return cp })} />
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <SubjectSelect value={coreThird} onChange={(v) => handleCoreThirdChange(v as typeof coreThird)} options={CORE_OPTIONS} placeholder="3rd core" />
                    </div>
                    <div className="w-full sm:w-28 sm:shrink-0">
                      <GradeSelect value={cores[2].grade} onChange={(v) => setCores((prev) => { const cp = [...prev]; cp[2] = { ...cp[2], grade: v }; return cp })} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <button type="button" onClick={goBack} className="ck-btn ck-btn-secondary w-full sm:w-auto">
                    <ArrowLeft size={14} weight="duotone" /> Back
                  </button>
                  <button type="button" disabled={!cores.every((c) => c.grade)} onClick={goNext} className="ck-btn ck-btn-primary w-full sm:w-auto">
                    Next <ArrowRight size={14} weight="duotone" />
                  </button>
                </div>
              </section>
            )}

            {/* Step 2 — electives */}
            {step === 2 && (
              <section className="ck-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-xl text-ink-900">Electives</h2>
                  <button
                    type="button"
                    onClick={() => setElectives((prev) => prev.length < 5 ? [...prev, { subject: "", grade: "" }] : prev)}
                    disabled={electives.length >= 5}
                    className="text-sm font-bold text-brand-700 hover:text-brand-800 disabled:opacity-40"
                  >
                    + Add subject
                  </button>
                </div>
                <p className="mt-1.5 text-sm text-ink-500">
                  Pick at least two — add up to five for a sharper match.
                </p>

                <div className="mt-5 space-y-3">
                  {electives.map((e, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                      <div className="min-w-0 flex-1">
                        <SubjectSelect value={e.subject} onChange={(v) => setElectives((prev) => { const cp = [...prev]; cp[idx] = { ...cp[idx], subject: v }; return cp })} options={electivesForTrack} placeholder={`Elective ${idx + 1}`} />
                      </div>
                      <div className="flex w-full gap-2 sm:w-auto">
                        <div className="flex-1 sm:w-28 sm:flex-none sm:shrink-0">
                          <GradeSelect value={e.grade} onChange={(v) => setElectives((prev) => { const cp = [...prev]; cp[idx] = { ...cp[idx], grade: v }; return cp })} />
                        </div>
                        {electives.length > 2 && (
                          <button
                            type="button"
                            aria-label={`Remove elective ${idx + 1}`}
                            onClick={() => setElectives((prev) => prev.filter((_, i) => i !== idx))}
                            className="shrink-0 self-center px-2 text-lg text-ink-300 hover:text-red-500 sm:px-1"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {aggregate !== null && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="ck-tile">
                      <p className="ck-stat-num accent">{aggregate}</p>
                      <p className="ck-stat-label">Best-6 aggregate</p>
                    </div>
                    <div className="ck-tile">
                      <p className="ck-stat-num">{results.filter((r) => GRADE_POINTS[r.grade] <= 6).length}</p>
                      <p className="ck-stat-label">Credit passes</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <button type="button" onClick={goBack} className="ck-btn ck-btn-secondary w-full sm:w-auto">
                    <ArrowLeft size={14} weight="duotone" /> Back
                  </button>
                  <button type="button" disabled={!canSubmit} onClick={goNext} className="ck-btn ck-btn-primary w-full sm:w-auto">
                    <Sparkle size={14} weight="duotone" /> Show results
                  </button>
                </div>
                {!canSubmit && (
                  <p className="ck-note ck-note-warn mt-3">
                    Add all 3 cores and 2 electives to continue.
                  </p>
                )}
              </section>
            )}

            {/* Step 3 — results */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="ck-card">
                  <div className="grid grid-cols-3 gap-1">
                    {([{ k: "ALL", l: "All" }, { k: "DEGREE", l: "Degree" }, { k: "DIPLOMA", l: "Diploma" }] as const).map((tab) => (
                      <button
                        key={tab.k}
                        type="button"
                        onClick={() => setLevelFilter(tab.k)}
                        className={`ck-tab ${levelFilter === tab.k ? "active" : ""}`}
                      >
                        {tab.l}
                      </button>
                    ))}
                  </div>
                  {schools.length > 2 && (
                    <div className="mt-3">
                      <label className="ck-field-label">School</label>
                      <SelectDropdown
                        options={schoolOptions}
                        value={schoolFilter}
                        onChange={setSchoolFilter}
                        placeholder="All schools"
                        className="ck-input"
                      />
                    </div>
                  )}
                </div>

                {/* Summary tiles */}
                {summary && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="ck-tile">
                      <p className="ck-stat-num accent">{summary.eligible}</p>
                      <p className="ck-stat-label">Eligible</p>
                    </div>
                    <div className="ck-tile">
                      <p className="ck-stat-num">{summary.total}</p>
                      <p className="ck-stat-label">Checked</p>
                    </div>
                    {aggregate !== null && (
                      <div className="ck-tile col-span-2 sm:col-span-1">
                        <p className="ck-stat-num">{aggregate}</p>
                        <p className="ck-stat-label">Best-6 aggregate</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Specific result */}
                {mode === "specific" && specificProgramme && specificResult && (
                  <article className={`ck-card ck-card-flush ${specificResult.tier === "ELIGIBLE" ? "border-emerald-200" : ""}`}>
                    <div className={`ck-card-head ${specificResult.tier === "ELIGIBLE" ? "ck-card-head-success" : "ck-card-head-neutral"}`}>
                      <span className={`ck-badge ${specificResult.tier === "ELIGIBLE" ? "ck-badge-success" : "ck-badge-neutral"}`}>
                        {specificResult.tier === "ELIGIBLE" ? "Eligible" : "Not eligible"}
                      </span>
                      <span className="ml-auto text-ink-500">{specificResult.score}% match</span>
                    </div>
                    <div className="ck-card-body">
                      <h3 className="font-display text-lg leading-tight break-words text-ink-900">{specificProgramme.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-brand-600">
                        {specificProgramme.level.toLowerCase()} {specificProgramme.department?.school ? `· ${specificProgramme.department.school}` : ""}
                      </p>
                      <p className="mt-3 text-sm text-ink-700">{specificResult.details}</p>
                      {(specificResult.missingCores.length > 0 || specificResult.missingGroups.length > 0 || specificResult.failedGradeSubjects.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {specificResult.missingCores.map((m) => <span key={m} className="ck-chip ck-chip-warn">Missing: {m}</span>)}
                          {specificResult.missingGroups.map((g) => <span key={g.label} className="ck-chip ck-chip-warn">Missing: {g.label}</span>)}
                          {specificResult.failedGradeSubjects.slice(0, 3).map((f) => <span key={f.subject} className="ck-chip ck-chip-error">{f.subject}: {f.grade} — need C6</span>)}
                          {specificResult.failedGradeSubjects.length > 3 && (
                            <span className="ck-chip ck-chip-error">+{specificResult.failedGradeSubjects.length - 3} more below grade</span>
                          )}
                        </div>
                      )}
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Link href={`/programmes/${specificProgramme.slug}`} className="ck-btn ck-btn-primary ck-btn-sm w-full sm:w-auto">
                          View programme <ArrowRight size={12} weight="duotone" />
                        </Link>
                        {specificResult.tier === "ELIGIBLE" && (
                          <a href="https://admissions.uenr.edu.gh/applicant-login" target="_blank" rel="noreferrer" className="ck-btn ck-btn-secondary ck-btn-sm w-full sm:w-auto">
                            Apply
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                )}

                {/* Top recommendation */}
                {mode === "best" && topRecommendation && (
                  <article className="ck-card ck-card-flush border-brand-200">
                    <div className="ck-card-head ck-card-head-brand">
                      <Trophy size={13} weight="duotone" />
                      <span>Top pick</span>
                      <span className="ml-auto inline-flex items-center gap-1 bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Star size={10} weight="duotone" /> Strong
                      </span>
                    </div>
                    <div className="ck-card-body">
                      <h3 className="font-display text-lg leading-tight break-words text-ink-900">{topRecommendation.programme.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-brand-600">
                        {topRecommendation.programme.level.toLowerCase()} {topRecommendation.programme.department?.school ? `· ${topRecommendation.programme.department.school}` : ""}
                      </p>
                      <p className="mt-3 text-sm text-ink-700">{topRecommendation.reason}</p>
                      {topRecommendation.alternatives.length > 0 && (
                        <p className="mt-2 truncate text-xs text-ink-400">
                          Also eligible: {topRecommendation.alternatives.slice(0, 2).map((a) => a.programme.name).join(" · ")}
                          {topRecommendation.alternatives.length > 2 ? ` +${topRecommendation.alternatives.length - 2} more` : ""}
                        </p>
                      )}
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Link href={`/programmes/${topRecommendation.programme.slug}`} className="ck-btn ck-btn-primary ck-btn-sm w-full sm:w-auto">
                          View programme <ArrowRight size={12} weight="duotone" />
                        </Link>
                        <a href="https://admissions.uenr.edu.gh/applicant-login" target="_blank" rel="noreferrer" className="ck-btn ck-btn-secondary ck-btn-sm w-full sm:w-auto">
                          Apply
                        </a>
                      </div>
                    </div>
                  </article>
                )}

                {mode === "best" && submitted && !topRecommendation && (
                  <p className="ck-note ck-note-warn">
                    No programmes match these grades yet — edit your grades to try again.
                  </p>
                )}

                {/* Other matches */}
                {mode === "best" && filtered.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">Other matches</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {filtered.map(({ programme, result }) => (
                        <article key={programme.slug} className="ck-result ck-result-eligible flex flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="ck-badge ck-badge-success"><CheckCircle size={10} weight="duotone" /> Eligible</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">{programme.level.toLowerCase()}</span>
                              {result.requiresExam && <span className="ck-badge ck-badge-exam">Exam</span>}
                            </div>
                            <span className="shrink-0 text-xs font-bold text-ink-400">{result.score}%</span>
                          </div>
                          <h3 className="mt-1.5 text-sm font-bold leading-tight break-words text-ink-900">{programme.name}</h3>
                          <p className="mt-0.5 text-xs text-ink-500">{programme.department?.school}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-ink-600">{result.details}</p>
                          <div className="mt-auto flex flex-col gap-1.5 pt-3 sm:flex-row">
                            <Link href={`/programmes/${programme.slug}`} className="ck-btn ck-btn-primary ck-btn-xs w-full sm:w-auto">View</Link>
                            <a href="https://admissions.uenr.edu.gh/applicant-login" target="_blank" rel="noreferrer" className="ck-btn ck-btn-secondary ck-btn-xs w-full sm:w-auto">Apply</a>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <button type="button" onClick={() => { setStep(2); setSubmitted(false) }} className="ck-btn ck-btn-secondary w-full sm:w-auto">
                    <PencilSimple size={14} weight="duotone" /> Edit grades
                  </button>
                  <button type="button" onClick={resetAll} className="ck-btn ck-btn-secondary w-full sm:w-auto">
                    <ArrowClockwise size={14} weight="duotone" /> Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
