export const dynamic = 'force-dynamic'

export default function CheckerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="ck-scope min-h-screen bg-ink-50">
      {children}
    </div>
  )
}
