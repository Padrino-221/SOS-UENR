'use client'

import Link from 'next/link'
import {
  FileText,
  GraduationCap,
  Target,
} from '@phosphor-icons/react'

const DEGREE_LABELS: Record<string, string> = {
  BSc: 'BSc',
  Diploma: 'Diploma',
  MSc: 'MSc',
  MPHIL: 'MPHIL',
  PHD: 'PHD',
}

interface Project {
  title: string
  abstract: string | null
  objective: string | null
  studentName: string | null
  groupMembers: string | null
  programme: string | null
  degreeLevel: string
  documentUrl: string | null
  documentName: string | null
  githubLink: string | null
  supervisor: { id: string; name: string; title: string | null } | null
  department: { name: string } | null
  academicYear: { year: string } | null
}

export function ProjectDetail({ project }: { project: Project }) {
  const shortTitle = project.title.length > 50 ? project.title.slice(0, 50) + '…' : project.title

  return (
    <>
      {/* Hero banner */}
      <section className="bg-brand-700 py-16 text-white">
        <div className="container-premium">
          <nav className="mb-4 text-xs text-white/60">
            <Link href="/projects" className="transition hover:text-white">Projects</Link>
            <span className="mx-1.5 text-white/40">/</span>
            <span className="font-medium text-white">{shortTitle}</span>
          </nav>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center border border-white/25 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-white">
              {DEGREE_LABELS[project.degreeLevel] ?? project.degreeLevel}
            </span>
            {project.department && (
              <span className="inline-flex items-center border border-white/25 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-white">
                {project.department.name}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-serif font-bold text-white sm:text-4xl">{project.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/70">
            {project.studentName && <span>{project.studentName}</span>}
            {project.academicYear && <span>{project.academicYear.year}</span>}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Main content */}
            <article className="space-y-10 lg:col-span-8">
              {project.abstract && (
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-serif text-ink-900">
                    <FileText size={22} weight="duotone" className="text-brand-700" />
                    Project Abstract
                  </h2>
                  <div className="mt-4 space-y-3 leading-[1.75] text-ink-600">
                    {project.abstract.split(/\n\s*\n/).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              )}

              {project.objective && (
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-serif text-ink-900">
                    <Target size={22} weight="duotone" className="text-brand-700" />
                    Main Objective
                  </h2>
                  <div className="mt-4 space-y-3 leading-[1.75] text-ink-600">
                    {project.objective.split(/\n\s*\n/).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:col-span-4">
              {/* Details card */}
              <div className="border border-[#e5e5e0] bg-white p-6">
                <h3 className="font-serif text-lg text-ink-900">Project Details</h3>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Degree Level</dt>
                    <dd className="font-semibold text-ink-900">
                      {DEGREE_LABELS[project.degreeLevel] ?? project.degreeLevel}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Programme</dt>
                    <dd className="text-right font-semibold text-ink-900">{project.programme ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Academic Year</dt>
                    <dd className="font-semibold text-ink-900">{project.academicYear?.year ?? '—'}</dd>
                  </div>
                  {project.department && (
                    <div className="flex justify-between gap-4">
                      <dt className="shrink-0 text-ink-500">Department</dt>
                      <dd className="text-right font-semibold text-ink-900 truncate" title={project.department.name}>{project.department.name}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Supervisor */}
              {project.supervisor && (
                <Link
                  href={`/staff/${project.supervisor.id}`}
                  className="group flex items-center gap-4 border border-[#e5e5e0] bg-white p-5 transition-colors duration-200 hover:border-brand-700"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand-50 text-brand-700">
                    <GraduationCap size={20} weight="duotone" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-ink-400">Supervisor</p>
                    <p className="font-bold text-ink-900 group-hover:text-brand-700 truncate">{project.supervisor.name}</p>
                    {project.supervisor.title && (
                      <p className="text-sm text-ink-500 truncate">{project.supervisor.title}</p>
                    )}
                  </div>
                </Link>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
