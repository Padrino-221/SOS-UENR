import { extractText, getDocumentProxy } from 'unpdf'

export interface ExtractedProjectDetails {
  title?: string
  studentName?: string
  groupMembers?: string
  programme?: string
  degreeLevel?: string
  academicYear?: string
  department?: string
  supervisor?: string
  githubLink?: string
  abstract?: string
  objective?: string
}

type FieldKey = keyof ExtractedProjectDetails

const SINGLE_LINE_LABELS: Record<Exclude<FieldKey, 'abstract' | 'objective'>, string[]> = {
  title: ['project topic', 'project title', 'title of project', 'topic', 'title'],
  studentName: [
    'student name',
    'student names',
    'name of student',
    'names of students',
    'student name(s)',
    'names of student(s)',
  ],
  groupMembers: [
    'group members',
    'group member(s)',
    'names of group members',
    'other group members',
    'members',
  ],
  programme: [
    'programme of study',
    'program of study',
    'programme',
    'program',
    'course of study',
    'course',
  ],
  degreeLevel: ['degree level', 'level of study', 'academic level', 'award', 'level', 'degree'],
  academicYear: ['academic year', 'academic session', 'year of study', 'session', 'year'],
  department: ['department', 'department of', 'school', 'school of'],
  supervisor: ['project supervisor', 'supervisor(s)', 'supervisor', 'supervisor of project'],
  githubLink: [
    'github link',
    'github url',
    'source code link',
    'repository link',
    'link to repository',
    'project repository',
    'source code',
    'repository',
    'github',
  ],
}

const MULTILINE_LABELS: Record<'abstract' | 'objective', string[]> = {
  abstract: ['abstract', 'project summary', 'summary', 'synopsis'],
  objective: [
    'specific objectives',
    'specific objective',
    'objectives',
    'objective',
    'aims',
    'aim',
    'goals',
  ],
}

const ALL_LABELS = new Set<string>([
  ...Object.values(SINGLE_LINE_LABELS).flat(),
  ...Object.values(MULTILINE_LABELS).flat(),
])

const MAX_LINES = 45
const MAX_ABSTRACT_CHARS = 2500
const MAX_OBJECTIVE_CHARS = 1200

function normalizeLabel(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

function labelOfLine(line: string): { label: string; rest: string } {
  const m = line.trim().match(/^(.+?)\s*[:：\-–]\s*(.*)$/)
  if (m) return { label: normalizeLabel(m[1]), rest: m[2].trim() }
  return { label: normalizeLabel(line.trim()), rest: '' }
}

function isKnownLabel(label: string): boolean {
  return ALL_LABELS.has(label)
}

function cleanValue(value: string): string {
  return value.replace(/^["'“”\s]+|["'””\s]+$/g, '').trim()
}

export function normalizeDegree(raw: string): string | undefined {
  const s = raw.toLowerCase().replace(/\./g, '').replace(/\s/g, '')
  if (s === 'bsc' || s === 'bscs' || s.startsWith('bachelor')) return 'BSc'
  if (s.startsWith('diploma')) return 'Diploma'
  if (s === 'mphil') return 'MPHIL'
  if (s === 'phd' || s.startsWith('doctor')) return 'PHD'
  if (s === 'msc' || s.startsWith('master')) return 'MSc'
  return undefined
}

export function parseProjectDetails(text: string, fileName = ''): ExtractedProjectDetails {
  const result: ExtractedProjectDetails = {}
  const lines = text
    .replace(/\r/g, '')
    .replace(/\f/g, '\n')
    .split('\n')
    .map((l) => l.trim())

  const fieldLabels: { [K in FieldKey]: string[] } = {
    ...SINGLE_LINE_LABELS,
    ...MULTILINE_LABELS,
  }

  interface LabelHit {
    index: number
    field: FieldKey
    rest: string
  }
  const hits: LabelHit[] = []

  for (let i = 0; i < lines.length; i++) {
    const { label, rest } = labelOfLine(lines[i])
    if (!label) continue
    for (const [name, synonyms] of Object.entries(fieldLabels) as [FieldKey, string[]][]) {
      if (synonyms.includes(label)) {
        hits.push({ index: i, field: name, rest })
        break
      }
    }
  }

  for (const hit of hits) {
    if (hit.field === 'abstract' || hit.field === 'objective') continue
    if (result[hit.field]) continue
    let value = hit.rest
    if (!value) {
      for (let j = hit.index + 1; j < lines.length; j++) {
        if (!lines[j]) continue
        const { label } = labelOfLine(lines[j])
        if (isKnownLabel(label)) break
        value = lines[j]
        break
      }
    }
    if (value) result[hit.field] = cleanValue(value)
  }

  for (const field of ['abstract', 'objective'] as const) {
    if (result[field]) continue
    const hit = hits.find((h) => h.field === field)
    if (!hit) continue

    const parts: string[] = hit.rest ? [hit.rest] : []
    const maxChars = field === 'abstract' ? MAX_ABSTRACT_CHARS : MAX_OBJECTIVE_CHARS
    for (let j = hit.index + 1; j < lines.length && parts.length < MAX_LINES; j++) {
      const line = lines[j]
      if (!line) continue
      const { label } = labelOfLine(line)
      if (isKnownLabel(label)) break
      parts.push(line)
      if (parts.join(' ').length >= maxChars) break
    }
    const value = parts.join(' ').trim()
    if (value) result[field] = value.length > maxChars ? value.slice(0, maxChars).trim() : value
  }

  if (!result.academicYear) {
    const m = text.match(/\b(20\d{2})\s*[/\-–]\s*(20\d{2})\b/)
    if (m) result.academicYear = `${m[1]}/${m[2]}`
  }

  if (!result.degreeLevel) {
    const m = text.match(/\b(b\.?\s?sc|diploma|m\.?\s?sc|m\.?\s?phil|phd|p\.?\s?h\.?\s?d)\b/i)
    if (m) result.degreeLevel = normalizeDegree(m[1])
  }

  if (!result.githubLink) {
    const m = text.match(/https?:\/\/github\.com\/[\w\-./_]+\/?/)
    if (m) result.githubLink = m[0]
  }

  if (fileName && (!result.academicYear || !result.title)) {
    const m = fileName.match(
      /^\s*((20\d{2})\s*(?:[/\-–])\s*(20\d{2}))[_\s-]+(.+)\.pdf\s*$/i,
    )
    if (m) {
      if (!result.academicYear) result.academicYear = `${m[2]}/${m[3]}`
      if (!result.title) result.title = m[4].trim()
    }
  }

  if (!result.title) {
    for (const line of lines) {
      if (line.length < 6 || line.length > 200) continue
      const { label } = labelOfLine(line)
      if (isKnownLabel(label)) continue
      if (/^(chapter|acknowledg|abstract|dedication|declaration|table of)/i.test(line)) continue
      result.title = line
      break
    }
  }

  for (const key of Object.keys(result) as (keyof ExtractedProjectDetails)[]) {
    const v = result[key]
    if (typeof v === 'string' && !v.trim()) delete result[key]
  }

  return result
}

export async function extractPdfText(input: ArrayBuffer | Uint8Array): Promise<string> {
  const data = new Uint8Array(input)
  const proxy = await getDocumentProxy(data)
  const { text } = await extractText(proxy, { mergePages: false })
  const pages = Array.isArray(text) ? text : [text]
  return pages.slice(0, 3).join('\n').trim()
}