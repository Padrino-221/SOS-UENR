'use client'

import { useState, useActionState } from 'react'
import { UploadSimple } from '@phosphor-icons/react'
import { updateSpmsProfile, changeSpmsPassword } from '../actions'
import { PageHeader, Card, Button, Input, Textarea, PasswordInput } from '@/components/ui'

interface Staff {
  id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  bio: string
  researchAreas: string
  staffType: string
  photoUrl: string | null
  department: { name: string } | null
}

export function ProfilePageClient({ staff }: { staff: Staff }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account settings" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="mb-4 font-bold text-ink-900">Personal Information</h3>
            <ProfileForm staff={staff} />
          </Card>

          <Card>
            <h3 className="mb-4 font-bold text-ink-900">Change Password</h3>
            <PasswordForm />
          </Card>
        </div>

        <div>
          <Card>
            <div className="flex flex-col items-center text-center">
              {staff.photoUrl ? (
                <img
                  src={staff.photoUrl}
                  alt={staff.name}
                  className="mb-3 h-20 w-20 rounded-full object-cover object-top"
                />
              ) : (
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-2xl font-bold text-brand-700">
                  {staff.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <h3 className="font-bold text-ink-900">{staff.name}</h3>
              {staff.title && <p className="text-sm text-ink-500">{staff.title}</p>}
              <p className="mt-1 text-sm text-ink-500">{staff.email}</p>
              {staff.department && (
                <p className="mt-1 text-xs text-ink-400">{staff.department.name}</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProfileForm({ staff }: { staff: Staff }) {
  const [state, formAction, pending] = useActionState(updateSpmsProfile as any, {} as any)
  const [photoUrl, setPhotoUrl] = useState(staff.photoUrl ?? '')
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const data = await res.json()
      setPhotoUrl(data.url)
    }
    setUploading(false)
  }

  return (
    <form
      action={formAction}
      className="space-y-4"
    >
      <input type="hidden" name="photoUrl" value={photoUrl} />
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-700">Profile Photo</label>
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="h-16 w-16 rounded-full object-cover object-top" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-700">
              {staff.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm text-ink-600 transition hover:border-brand-300 hover:bg-brand-50">
            <UploadSimple size={16} />
            {uploading ? 'Uploading…' : 'Choose Photo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      <Input
        label="Full Name"
        name="name"
        defaultValue={staff.name}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Title/Rank"
          name="title"
          defaultValue={staff.title ?? ''}
          placeholder="e.g. Dr., Prof."
        />
        <Input
          label="Phone"
          name="phone"
          defaultValue={staff.phone ?? ''}
          placeholder="+233..."
        />
      </div>
      <Textarea
        label="Bio"
        name="bio"
        defaultValue={staff.bio}
        rows={4}
        placeholder="Tell us about yourself..."
      />
      <Textarea
        label="Research Areas"
        name="researchAreas"
        defaultValue={staff.researchAreas}
        rows={3}
        placeholder="e.g. Machine Learning, Data Science, Software Engineering"
      />

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Profile updated successfully.
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending || uploading}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

function PasswordForm() {
  const [state, formAction, pending] = useActionState(changeSpmsPassword as any, {} as any)

  return (
    <form action={formAction} className="space-y-4">
      <PasswordInput
        label="Current Password"
        name="currentPassword"
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordInput
          label="New Password"
          name="newPassword"
          required
        />
        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          required
        />
      </div>

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Password changed successfully.
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Changing…' : 'Change password'}
        </Button>
      </div>
    </form>
  )
}
