import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PublicShell } from '@/components/site/public-shell'
import { ScrollToTop } from '@/components/site/scroll-to-top'
import { ScrollToTopButton } from '@/components/site/scroll-to-top-button'
import { getSiteSections } from '@/lib/site-content'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sections = await getSiteSections()

  return (
    <PublicShell>
      <ScrollToTop />
      <SiteHeader navigation={sections.navigation} logo={sections.branding.logo} />
      <main className="flex-1">{children}</main>
      <SiteFooter footer={sections.footer} logo={sections.branding.logo} />
      <ScrollToTopButton />
    </PublicShell>
  )
}
