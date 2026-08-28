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
      <PageHero
        title={contact.heroTitle}
        subtitle={contact.heroSubtitle}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-6">
              <h2 className="text-lg font-bold">{contact.cardHeading}</h2>
              <ul className="mt-5 space-y-4 text-sm text-ink-700">
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-700 text-white">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">Address</p>
                    <p>{contact.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-700 text-white">
                    <Phone size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">Phone</p>
                    <p>{contact.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-700 text-white">
                    <Envelope size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">Email</p>
                    <p>{contact.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-700 text-white">
                    <Clock size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">Office hours</p>
                    <p>{contact.officeHours}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="h-64 overflow-hidden rounded-2xl border border-ink-100 bg-ink-100">
              <iframe
                title="UENR Sunyani location"
                src={contact.mapEmbed}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-6 text-2xl font-bold">{contact.formHeading}</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
