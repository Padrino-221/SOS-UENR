import { MapPin, Phone, Envelope, Clock } from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { ContactForm } from '@/components/site/contact-form'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const sections = await getSiteSections()
  const { contact } = sections

  return (
    <>
      <PageHero title={contact.heroTitle} subtitle={contact.heroSubtitle} crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

      <section className="section-padding bg-white">
        <div className="container-premium grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="card-premium p-7">
              <h2 className="font-serif text-xl text-ink-900">{contact.cardHeading}</h2>
              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex gap-4">
                  <span className="h-10 w-10 shrink-0 grid place-items-center rounded-lg bg-brand-700 text-white"><MapPin size={18} weight="duotone" /></span>
                  <div>
                    <p className="font-semibold text-ink-900">Address</p>
                    <p className="mt-1 leading-relaxed text-ink-600">{contact.address}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="h-10 w-10 shrink-0 grid place-items-center rounded-lg bg-brand-700 text-white"><Phone size={18} weight="duotone" /></span>
                  <div>
                    <p className="font-semibold text-ink-900">Phone</p>
                    <p className="mt-1 text-ink-600">{contact.phone}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="h-10 w-10 shrink-0 grid place-items-center rounded-lg bg-brand-700 text-white"><Envelope size={18} weight="duotone" /></span>
                  <div>
                    <p className="font-semibold text-ink-900">Email</p>
                    <p className="mt-1 text-ink-600">{contact.email}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="h-10 w-10 shrink-0 grid place-items-center rounded-lg bg-brand-700 text-white"><Clock size={18} weight="duotone" /></span>
                  <div>
                    <p className="font-semibold text-ink-900">Office hours</p>
                    <p className="mt-1 text-ink-600">{contact.officeHours}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-xl border border-ink-100 h-72">
              <iframe title="UENR Sunyani location" src={contact.mapEmbed} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="card-premium p-7 sm:p-8">
              <h2 className="font-serif text-2xl text-ink-900">{contact.formHeading}</h2>
              <p className="mt-2 text-sm text-ink-600">We'd love to hear from you — send a message and we'll respond promptly.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
