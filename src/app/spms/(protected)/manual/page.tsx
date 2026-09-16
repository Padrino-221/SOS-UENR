import { requireSpmsAuth } from '@/lib/spms-auth'
import { ManualClient } from './manual-client'

export const dynamic = 'force-dynamic'

export default async function ManualPage() {
  const session = await requireSpmsAuth()
  return <ManualClient isAdmin={session.role === 'ADMIN'} />
}
