import { redirect } from 'next/navigation'
import { getSpmsSession } from '@/lib/spms-auth'

export default async function SpmsRootPage() {
  const session = await getSpmsSession()
  if (session) {
    redirect('/spms/dashboard')
  } else {
    redirect('/spms/login')
  }
}
