'use client'

import Link from 'next/link'
import {
  FileText,
  GraduationCap,
  Target,
} from '@phosphor-icons/react'
import { Card } from '@/components/ui'

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
  return (
    <>
      {/* Hero banner */}
      <section className="bg-brand-700 py-16 text-white">
        <div className="container-page">
          <nav className="mb-3 text-xs text-white/60">
            <Link href="/projects" className="transition hover:text-white">Projects</Link>
            <span className="mx-1.5 text-white/40">/</span>
            <span className="font-medium text-white">{project.title.length > 50 ? project.title.slice(0, 50) + '…' : project.title}</span>
          </nav>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              {DEGREE_LABELS[project.degreeLevel] ?? project.degreeLevel}
            </span>
            {project.department && (
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                {project.department.name}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{project.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/70">
            {project.studentName && (
              <span>{project.studentName}</span>
            )}
            {project.academicYear && (
              <span>{project.academicYear.year}</span>
            )}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <article className="space-y-8 lg:col-span-2">
            {project.abstract && (
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-ink-900">
                  <FileText size={20} className="text-gold-600" />
                  Project Abstract
                </h2>
                <div className="mt-4 space-y-3 text-ink-700 leading-relaxed">
                  {project.abstract.split(/\n\s*\n/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {project.objective && (
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-ink-900">
                  <Target size={20} className="text-gold-600" />
                  Main Objective
                </h2>
                <div className="mt-4 space-y-3 text-ink-700 leading-relaxed">
                  {project.objective.split(/\n\s*\n/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Details card */}
            <div className="rounded-xl border border-ink-100 bg-white p-6">
              <h3 className="text-lg font-bold text-ink-900">Project Details</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Degree Level</dt>
                  <dd className="font-semibold text-ink-900">
                    {DEGREE_LABELS[project.degreeLevel] ?? project.degreeLevel}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Programme</dt>
                  <dd className="font-semibold text-ink-900">{project.programme ?? '—'}</dd>
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
                className="flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-yellow-300">
                  <GraduationCap size={20} />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Supervisor</p>
                  <p className="font-bold text-ink-900">{project.supervisor.name}</p>
                  {project.supervisor.title && (
                    <p className="text-sm text-ink-500">{project.supervisor.title}</p>
                  )}
                </div>
              </Link>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
