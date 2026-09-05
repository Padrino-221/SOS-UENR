import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Toggle as UIToggle } from '@/components/ui/toggle'

export function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
  hint,
  placeholder,
  textarea,
  rows = 4,
}: {
  label: string
  name: string
  defaultValue?: string | null
  type?: string
  required?: boolean
  hint?: string
  placeholder?: string
  textarea?: boolean
  rows?: number
}) {
  if (textarea) {
    return (
      <Textarea
        label={label}
        name={name}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        required={required}
        rows={rows}
        hint={hint}
      />
    )
  }

  return (
    <Input
      label={label}
      name={name}
      type={type}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      required={required}
      hint={hint}
    />
  )
}

export function Toggle({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string
  name: string
  defaultChecked?: boolean
  hint?: string
}) {
  return (
    <UIToggle
      label={label}
      name={name}
      defaultChecked={defaultChecked}
      hint={hint}
    />
  )
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
  hint,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
  defaultValue?: string
  required?: boolean
  hint?: string
}) {
  return (
    <Select
      label={label}
      name={name}
      options={options}
      defaultValue={defaultValue}
      required={required}
      hint={hint}
    />
  )
}
