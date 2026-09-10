'use client'
/* eslint-disable react-hooks/set-state-in-effect -- intentional lock for School of Sciences Integrated Science requirement */

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle, WarningCircle, Info, GraduationCap, Sparkle, Trophy, Star } from '@phosphor-icons/react'
import { ALL_SUBJECTS, WASSCE_GRADES, GRADE_POINTS, normalizeSubject, type WASSCEGrade } from '@/lib/subjects'
import { evaluateProgramme, rankProgrammes, getTopRecommendation, type ProgrammeForCheck, type SubjectResult, type EligibilityRule } from '@/lib/eligibility'
import { SelectDropdown } from '@/components/ui/select-dropdown'

type Props = {
  programmes: ProgrammeForCheck[]
}

type CoreRow = { subject: string; grade: WASSCEGrade | '' }
type ElectiveRow = { subject: string; grade: WASSCEGrade | '' }

const SCIENCE_ALT_OPTIONS = ["Integrated Science", "Social Studies"] as const
const ELECTIVE_SUBJECTS = [...new Set([...ALL_SUBJECTS].filter((s) => !["English Language","Mathematics","Integrated Science","Social Studies"].includes(s)))]

function GradeSelect({ value, onChange }: { value: string; onChange: (v: WASSCEGrade | '') => void }) {
  const options = WASSCE_GRADES.map((g) => ({
    value: g,
    label: g,
  }))
  return (
    <SelectDropdown
      options={options}
      value={value}
      onChange={(v) => onChange(v as WASSCEGrade | '')}
      placeholder="Grade"
      className="rounded-lg !py-2.5 text-sm"
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
      className="rounded-lg !py-2.5 text-sm"
    />
  )
}

export function EligibilityChecker({ programmes }: Props) {
  const [mode, setMode] = useState<"specific" | "best">("specific")
  const [selectedProgrammeSlug, setSelectedProgrammeSlug] = useState<string>("")
  const [coreSecond, setCoreSecond] = useState<"Integrated Science" | "Social Studies">("Integrated Science")
  const [cores, setCores] = useState<CoreRow[]>([
    { subject: "English Language", grade: "" },
    { subject: "Mathematics", grade: "" },
    { subject: "Integrated Science", grade: "" },
  ])
  const [electives, setElectives] = useState<ElectiveRow[]>([
    { subject: "", grade: "" },
    { subject: "", grade: "" },
    { subject: "", grade: "" },
  ])
  const [submitted, setSubmitted] = useState(false)
  const [levelFilter, setLevelFilter] = useState<"ALL" | "DEGREE" | "DIPLOMA">("ALL")

  // Keep cores[2] in sync with alt choice
  const handleAltChange = (alt: "Integrated Science" | "Social Studies") => {
    setCoreSecond(alt)
    setCores((prev) => {
      const copy = [...prev]
      copy[2] = { ...copy[2], subject: alt }
      return copy
    })
  }

  // For specific programme checks, School of Sciences requires Integrated Science only (per 2026/2027 requirements). Lock to Integrated Science.
  useEffect(() => {
    if (mode === "specific" && coreSecond !== "Integrated Science") {
      setCoreSecond("Integrated Science")
      setCores((prev) => {
        const copy = [...prev]
        copy[2] = { ...copy[2], subject: "Integrated Science" }
        return copy
      })
    }
  }, [mode, coreSecond])

  const eligibleProgrammes = useMemo(() => programmes.filter((p) => p.level !== "POSTGRADUATE"), [programmes])

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
    if (levelFilter === "ALL") return ranked
    return ranked.filter((r) => r.programme.level === levelFilter)
  }, [ranked, levelFilter])

  const summary = useMemo(() => {
    if (!submitted || ranked.length === 0) return null
    const eligible = ranked.filter((r) => r.result.tier === "ELIGIBLE").length
    const almost = ranked.filter((r) => r.result.tier === "ALMOST").length
    return { eligible, almost, total: ranked.length }
  }, [ranked, submitted])

  const hasEligible = useMemo(() => ranked.some((r) => r.result.tier === "ELIGIBLE"), [ranked])

  const topRecommendation = useMemo(() => {
    if (!submitted || mode !== "best") return null
    const pool = levelFilter === "ALL" ? eligibleProgrammes : eligibleProgrammes.filter((p) => p.level === levelFilter)
    const withParsed = pool.map((p) => ({
      ...p,
      eligibilityRule: (p.eligibilityRule as EligibilityRule | null) ?? null,
    }))
    return getTopRecommendation(results, withParsed as ProgrammeForCheck[])
  }, [submitted, results, eligibleProgrammes, levelFilter, mode])

  const specificProgramme = useMemo(() => eligibleProgrammes.find((p) => p.slug === selectedProgrammeSlug) ?? null, [eligibleProgrammes, selectedProgrammeSlug])
  const specificResult = useMemo(() => {
    if (!submitted || mode !== "specific" || !specificProgramme) return null
    return evaluateProgramme(results, (specificProgramme.eligibilityRule as EligibilityRule | null) ?? null, specificProgramme as ProgrammeForCheck)
  }, [submitted, mode, specificProgramme, results])

  return (
    <div className="space-y-8">
      {/* Intro — short, unambiguous */}
      <div className="card-premium p-4 sm:p-5 bg-brand-50/60 border-brand-100">
        <div className="flex gap-2.5 sm:gap-3">
          <span className="h-8 w-8 sm:h-9 sm:w-9 grid place-items-center rounded-lg bg-brand-700 text-white shrink-0"><Info size={16} weight="duotone" className="sm:hidden" /><Info size={18} weight="duotone" className="hidden sm:block" /></span>
          <div className="min-w-0 flex-1 text-sm leading-relaxed text-ink-700">
            <p className="font-semibold text-ink-900 text-[13px] sm:text-sm leading-tight sm:leading-relaxed">WASSCE checker — private &amp; instant. Final decision by Admissions.</p>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-ink-600">Checked against UENR 2026/2027 (WASSCE A1–C6). Nothing is saved — runs on your device.</p>
          </div>
        </div>
      </div>

      {/* Mode toggle — full width on mobile, auto on desktop */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => { setMode("specific"); setSubmitted(false) }}
            className={`flex-1 sm:flex-none rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold border transition text-center ${mode === "specific" ? "bg-brand-700 text-white border-brand-700" : "bg-white border-ink-100 text-ink-700 hover:border-brand-200"}`}
          >
            Check specific
          </button>
          <button
            type="button"
            onClick={() => { setMode("best"); setSubmitted(false) }}
            className={`flex-1 sm:flex-none rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold border transition text-center ${mode === "best" ? "bg-brand-700 text-white border-brand-700" : "bg-white border-ink-100 text-ink-700 hover:border-brand-200"}`}
          >
            Find best fit
          </button>
        </div>
        <p className="w-full text-xs leading-relaxed text-ink-500">
          {mode === "specific" ? "Choose a programme to check if you qualify." : "Enter grades to see your top match and all eligible programmes."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-5">
          <div className="card-premium p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-xl text-ink-900">Your WASSCE results</h2>
            <p className="mt-1 text-sm text-ink-600">WASSCE A1 (best) → F9. Private — stays on your device.</p>

            <div className="mt-6 space-y-5">
              {mode === "specific" && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-700">Programme to check</p>
                  <div className="mt-2">
                    <SelectDropdown
                      options={[...eligibleProgrammes]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((p) => ({ value: p.slug, label: `${p.name} — ${p.level.toLowerCase()}` }))}
                      value={selectedProgrammeSlug}
                      onChange={(v) => { setSelectedProgrammeSlug(v); setSubmitted(false) }}
                      placeholder="Select programme"
                      className="rounded-lg !py-2.5 text-sm"
                    />
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-700">Core subjects (3)</p>
                <div className="mt-3 space-y-3">
                  {cores.slice(0,2).map((c, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2">
                      <div className="col-span-3 min-w-0">
                        <div className="rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 text-sm text-ink-800">{c.subject}</div>
                      </div>
                      <div className="col-span-2 min-w-0">
                        <GradeSelect value={c.grade} onChange={(v) => setCores((prev) => { const cp=[...prev]; cp[idx]={...cp[idx], grade: v}; return cp })} />
                      </div>
                    </div>
                  ))}
                  {mode === "specific" ? (
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-3 min-w-0">
                        <div className="rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 text-sm text-ink-800">Integrated Science</div>
                      </div>
                      <div className="col-span-2 min-w-0">
                        <GradeSelect value={cores[2].grade} onChange={(v) => setCores((prev) => { const cp=[...prev]; cp[2]={...cp[2], grade: v}; return cp })} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-3 min-w-0">
                        <SubjectSelect value={coreSecond} onChange={(v) => handleAltChange(v as typeof coreSecond)} options={SCIENCE_ALT_OPTIONS} placeholder="Core" />
                      </div>
                      <div className="col-span-2 min-w-0">
                        <GradeSelect value={cores[2].grade} onChange={(v) => setCores((prev) => { const cp=[...prev]; cp[2]={...cp[2], grade: v}; return cp })} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-700">Electives (2–3)</p>
                  <button type="button" onClick={() => setElectives((prev) => prev.length < 4 ? [...prev, {subject:"",grade:""}] : prev)} className="text-xs font-semibold text-brand-700 hover:underline">+ Add</button>
                </div>
                <div className="mt-3 space-y-3">
                  {electives.map((e, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2">
                      <div className="col-span-3 min-w-0">
                        <SubjectSelect value={e.subject} onChange={(v) => setElectives((prev) => { const cp=[...prev]; cp[idx]={...cp[idx], subject: v}; return cp })} options={ELECTIVE_SUBJECTS} placeholder="Choose elective" />
                      </div>
                      <div className="col-span-2 flex gap-1">
                        <div className="flex-1 min-w-0"><GradeSelect value={e.grade} onChange={(v) => setElectives((prev) => { const cp=[...prev]; cp[idx]={...cp[idx], grade: v}; return cp })} /></div>
                        {electives.length > 2 && (
                          <button type="button" onClick={() => setElectives((prev) => prev.filter((_,i)=>i!==idx))} className="shrink-0 px-2 text-ink-400 hover:text-red-600 text-sm">×</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {aggregate !== null && (
                  <p className="mt-3 text-xs text-ink-600">Your best-6 aggregate: <span className="font-bold text-ink-900">{aggregate}</span> <span className="text-ink-400">(lower is better)</span></p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => setSubmitted(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Sparkle size={16} weight="duotone" /> {mode === "specific" ? "Check eligibility" : "Find best fit"}
                </button>
                <button
                  type="button"
                  onClick={() => { setCores([{subject:"English Language",grade:""},{subject:"Mathematics",grade:""},{subject:coreSecond,grade:""}]); setElectives([{subject:"",grade:""},{subject:"",grade:""},{subject:"",grade:""}]); setSubmitted(false) }}
                  className="rounded-lg border border-ink-100 bg-white px-4 py-3 text-sm font-semibold text-ink-700 hover:border-brand-200"
                >
                  Reset
                </button>
              </div>
              {!canSubmit && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  {mode === "specific" && !selectedProgrammeSlug ? "Select a programme, then fill 3 cores and 2 electives." : "Fill 3 cores and 2 electives to check."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 min-w-0">
          {!submitted ? (
            <div className="card-premium p-6 sm:p-10 text-center">
              <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-brand-50 text-brand-700"><GraduationCap size={22} weight="duotone" /></div>
              <h3 className="mt-4 font-serif text-lg text-ink-900">{mode === "specific" ? "Check one programme" : "Find your best fit"}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 max-w-md mx-auto">
                {mode === "specific"
                  ? "Select a programme on the left and enter your grades. We'll tell you clearly: eligible or not, and what's missing."
                  : "Enter your grades and we'll rank every programme and highlight your top match. Private — stays on your device."}
              </p>
            </div>
          ) : mode === "specific" ? (
            <>
              {specificProgramme && specificResult ? (
                <div className={`overflow-hidden rounded-xl border-2 bg-white shadow-sm ${specificResult.tier==="ELIGIBLE" ? "border-emerald-500" : specificResult.tier==="ALMOST" ? "border-amber-400" : "border-ink-200"}`}>
                  <div className={`px-5 py-3 flex items-center gap-2 text-white ${specificResult.tier==="ELIGIBLE" ? "bg-emerald-600" : specificResult.tier==="ALMOST" ? "bg-amber-500" : "bg-ink-700"}`}>
                    <span className="h-7 w-7 grid place-items-center rounded-full bg-white/15">
                      {specificResult.tier==="ELIGIBLE" ? <CheckCircle size={14} weight="duotone" /> : specificResult.tier==="ALMOST" ? <WarningCircle size={14} weight="duotone" /> : <Info size={14} weight="duotone" />}
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.14em]">
                      {specificResult.tier==="ELIGIBLE" ? "Eligible" : specificResult.tier==="ALMOST" ? "Not eligible — close" : "Not eligible"}
                    </p>
                    <span className="ml-auto rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold">{specificResult.score}% match</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-serif text-xl sm:text-2xl text-ink-900 leading-tight">{specificProgramme.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-brand-700">{specificProgramme.level.toLowerCase()} {specificProgramme.department ? `· ${specificProgramme.department.name}` : ""}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-800">{specificResult.details}</p>
                    {(specificResult.missingCores.length > 0 || specificResult.missingGroups.length > 0 || specificResult.failedGradeSubjects.length > 0) && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {specificResult.missingCores.map((m) => <li key={m} className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs text-amber-800">Missing: {m}</li>)}
                        {specificResult.missingGroups.map((g) => <li key={g.label} className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs text-amber-800">Need: {g.label}</li>)}
                        {specificResult.failedGradeSubjects.map((f) => <li key={f.subject} className="rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-xs text-red-700">{f.subject}: {f.grade} (need C6)</li>)}
                      </ul>
                    )}
                    {aggregate !== null && <p className="mt-3 text-xs text-ink-500">Your best-6 aggregate: <span className="font-bold text-ink-700">{aggregate}</span></p>}
                    {specificResult.requiresExam && <p className="mt-2 text-xs font-semibold text-ink-700">Note: This programme requires an entrance exam/interview if eligible.</p>}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/programmes/${specificProgramme.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800">View programme <ArrowRight size={14} weight="duotone" /></Link>
                      {specificResult.tier==="ELIGIBLE" ? (
                        <a href="https://admissions.uenr.edu.gh/applicant-login" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-ink-100 bg-white px-5 py-2.5 text-sm font-bold text-ink-700 hover:border-brand-200">Apply now</a>
                      ) : hasEligible ? (
                        <button type="button" onClick={() => setMode("best")} className="inline-flex items-center gap-2 rounded-lg border border-ink-100 bg-white px-5 py-2.5 text-sm font-bold text-ink-700 hover:border-brand-200">Find best fit instead</button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-sm text-ink-600">Select a programme to check.</p>
              )}
              <div className="mt-6 card-premium p-5 bg-ink-50 border-ink-100">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-700">Note</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">Guidance only. Final decision by Admissions. WASSCE A1–C6 required.</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { k: "ALL", l: "All levels" },
                  { k: "DEGREE", l: "Degree" },
                  { k: "DIPLOMA", l: "Diploma" },
                ].map((tab) => (
                  <button key={tab.k} onClick={() => setLevelFilter(tab.k as typeof levelFilter)} className={`rounded-full px-4 py-1.5 text-xs font-bold border transition ${levelFilter===tab.k ? "bg-brand-700 text-white border-brand-700" : "bg-white border-ink-100 text-ink-600 hover:border-brand-200"}`}>{tab.l}</button>
                ))}
                <button onClick={() => window.print()} className="ml-auto text-xs font-semibold text-ink-600 hover:text-brand-700">Print / Save</button>
              </div>

              {summary && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="card-premium p-4 text-center bg-emerald-50/60 border-emerald-100">
                    <p className="text-2xl font-serif text-emerald-700">{summary.eligible}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Eligible</p>
                  </div>
                  <div className="card-premium p-4 text-center bg-amber-50/70 border-amber-100">
                    <p className="text-2xl font-serif text-amber-700">{summary.almost}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">Almost</p>
                  </div>
                  <div className="card-premium p-4 text-center bg-ink-50">
                    <p className="text-2xl font-serif text-ink-800">{summary.total - summary.eligible - summary.almost}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-600">Other</p>
                  </div>
                </div>
              )}

              {topRecommendation && (
                <div className="mb-8 overflow-hidden rounded-xl border-2 border-brand-700 bg-white shadow-sm">
                  <div className="bg-brand-700 px-5 py-3 flex items-center gap-2 text-white">
                    <span className="h-7 w-7 grid place-items-center rounded-full bg-white/15"><Trophy size={14} weight="duotone" /></span>
                    <p className="text-xs font-bold uppercase tracking-[0.14em]">Top recommendation</p>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
                      <Star size={12} weight="duotone" /> Strong match
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl text-ink-900 leading-tight">{topRecommendation.programme.name}</h3>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-brand-700">
                          {topRecommendation.programme.level.toLowerCase()} {topRecommendation.programme.department ? `· ${topRecommendation.programme.department.name}` : ""}
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-ink-50 border border-ink-100 px-2 py-0.5 text-xs font-bold text-ink-600">{topRecommendation.result.score}% match</span>
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold border border-emerald-600 text-white">
                        <CheckCircle size={14} weight="duotone" /> Eligible
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-700">{topRecommendation.reason}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">{topRecommendation.result.details}</p>
                    {topRecommendation.alternatives.length > 0 && (
                      <p className="mt-3 text-xs leading-relaxed text-ink-500">
                        Also consider: {topRecommendation.alternatives.map((a) => a.programme.name).join(" · ")}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/programmes/${topRecommendation.programme.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800">
                        View {topRecommendation.programme.name} <ArrowRight size={14} weight="duotone" />
                      </Link>
                      <a href="https://admissions.uenr.edu.gh/applicant-login" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-ink-100 bg-white px-5 py-2.5 text-sm font-bold text-ink-700 hover:border-brand-200 hover:text-brand-700">Apply now</a>
                    </div>
                  </div>
                </div>
              )}

              {!topRecommendation && submitted && (
                <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5">
                  <p className="text-sm font-bold text-amber-900">{hasEligible ? "No eligible programmes in this level" : "No eligible programmes with these grades"}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700">
                    {hasEligible
                      ? "Try All levels or review the missing requirements below."
                      : "None of the programmes will accept these results as-is. Review the missing requirements below — improving a core to C6 or adding the needed elective could make you eligible."}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {filtered.map(({ programme, result }) => (
                  <div key={programme.slug} className={`card-premium p-5 ${result.tier==="ELIGIBLE" ? "border-emerald-200 bg-emerald-50/30" : result.tier==="ALMOST" ? "border-amber-200 bg-amber-50/20" : "bg-white"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${result.tier==="ELIGIBLE" ? "bg-emerald-600 text-white border-emerald-600" : result.tier==="ALMOST" ? "bg-amber-500 text-white border-amber-500" : "bg-ink-100 text-ink-600 border-ink-100"}`}>
                            {result.tier==="ELIGIBLE" ? <CheckCircle size={14} weight="duotone" /> : result.tier==="ALMOST" ? <WarningCircle size={14} weight="duotone" /> : <Info size={14} weight="duotone" />}
                            {result.tier==="ELIGIBLE" ? "Eligible" : result.tier==="ALMOST" ? "Almost" : "Not eligible"}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">{programme.level.toLowerCase()}</span>
                          {programme.department && <span className="text-xs text-ink-500">{programme.department.name}</span>}
                          {result.requiresExam && <span className="rounded-full bg-ink-900 text-white px-2 py-1 text-xs">Exam</span>}
                        </div>
                        <h3 className="mt-2 font-serif text-lg leading-tight text-ink-900">{programme.name}</h3>
                        <p className="mt-1 text-sm text-ink-600 line-clamp-2">{programme.summary}</p>
                        <p className="mt-2 text-sm leading-relaxed text-ink-700">{result.details}</p>
                        {(result.missingCores.length > 0 || result.missingGroups.length > 0) && (
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {result.missingCores.map((m) => (
                              <li key={m} className="rounded-full bg-white border border-amber-200 px-2.5 py-1 text-xs text-amber-800">Missing: {m}</li>
                            ))}
                            {result.missingGroups.map((g) => (
                              <li key={g.label} className="rounded-full bg-white border border-amber-200 px-2.5 py-1 text-xs text-amber-800">Need: {g.label}</li>
                            ))}
                            {result.failedGradeSubjects.map((f) => (
                              <li key={f.subject} className="rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-xs text-red-700">{f.subject}: {f.grade} (need C6)</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-ink-500 shrink-0">{result.score}%</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/programmes/${programme.slug}`} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800">View <ArrowRight size={14} weight="duotone" /></Link>
                      {result.tier==="ELIGIBLE" && <a href="https://admissions.uenr.edu.gh/applicant-login" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-4 py-2 text-xs font-bold text-ink-700 hover:border-brand-200">Apply</a>}
                    </div>
                  </div>
                ))}
                {filtered.length===0 && (
                  <p className="text-center py-8 text-sm text-ink-600">No programmes in this filter.</p>
                )}
              </div>

              <div className="mt-8 card-premium p-5 bg-ink-50 border-ink-100">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-700">Note</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">Guidance only — final decision by Admissions. WASSCE A1–C6.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
