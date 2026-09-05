'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { useToast } from '@/components/ui'
import { updateProfileName, updateProfilePassword } from '@/actions/content'
import { Input, Button, Card, PageHeader, Badge } from '@/components/ui'
import { User, Envelope, Shield, Calendar, Lock, FloppyDisk } from '@phosphor-icons/react'

interface ProfilePageClientProps {
  user: {
    name: string
    email: string
    role: string
    createdAt: string
  }
}

export function ProfilePageClient({ user }: ProfilePageClientProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        description="Manage your account settings."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <NameForm name={user.name} />
          <PasswordForm />
        </div>

        <Card className="lg:col-span-1 h-fit">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-xl font-bold text-brand-700">
                <User size={28} weight="duotone" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-ink-900">{user.name}</h2>
                <Badge variant={user.role === 'ADMIN' ? 'info' : 'default'}>
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 border-t border-ink-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-ink-500">
                  <Envelope size={14} className="shrink-0" weight="duotone" />
                  Email
                </div>
                <span className="font-medium text-ink-900">{user.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-ink-500">
                  <Shield size={14} className="shrink-0" weight="duotone" />
                  Role
                </div>
                <span className="font-medium text-ink-900">{user.role}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-ink-500">
                  <Calendar size={14} className="shrink-0" weight="duotone" />
                  Joined
                </div>
                <span className="font-medium text-ink-900">{user.createdAt}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function NameForm({ name }: { name: string }) {
  const { toast } = useToast()
  const [state, formAction, pending] = useActionState(updateProfileName, {
    error: '',
    success: false,
  })

  useEffect(() => {
    if (state.success) {
      toast('success', 'Name updated.')
    }
  }, [state.success, toast])

  return (
    <Card>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
        <User size={18} weight="duotone" /> Change Name
      </h3>
      <form action={formAction} className="space-y-4">
        <Input
          name="name"
          label="Full name"
          defaultValue={name}
          required
        />
        {state.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            <FloppyDisk size={16} weight="duotone" />
            {pending ? 'Saving…' : 'Save name'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const { toast } = useToast()
  const [state, formAction, pending] = useActionState(updateProfilePassword, {
    error: '',
    success: false,
  })

  useEffect(() => {
    if (state.success) {
      toast('success', 'Password changed.')
    }
  }, [state.success, toast])

  return (
    <Card>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
        <Lock size={18} weight="duotone" /> Change Password
      </h3>
      <form action={formAction} className="space-y-4">
        <Input
          name="currentPassword"
          label="Current password"
          type="password"
          required
        />
        <Input
          name="newPassword"
          label="New password"
          type="password"
          required
        />
        <Input
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          required
        />
        {state.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            <Lock size={16} weight="duotone" />
            {pending ? 'Changing…' : 'Change password'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
