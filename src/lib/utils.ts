export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function truncate(text: string, length = 160) {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}

export function unwrapList(value: string | { value: string } | null | undefined) {
  if (value == null) return ''
  const v = typeof value === 'string' ? value : value.value
  return v
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•*]\s*/, ''))
    .join('\n')
}
