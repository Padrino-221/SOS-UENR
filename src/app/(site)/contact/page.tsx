import { MapPin, Phone, Envelope, Clock } from '@phosphor-icons/react/dist/ssr'
import { PageHero } from '@/components/site/page-hero'
import { ContactForm } from '@/components/site/contact-form'
import { getSiteSections } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const sections = await getSiteSections()
  const { contact } = sections

  const items = [
    { icon: MapPin, label: 'Address', value: contact.address },
    { icon: Phone, label: 'Phone', value: contact.phone },
    { icon: Envelope, label: 'Email', value: contact.email },
    { icon: Clock, label: 'Office hours', value: contact.officeHours },
  ]

  return (
    <>
      <PageHero title={contact.heroTitle} subtitle={contact.heroSubtitle} crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

      <section className="section-padding bg-[#f7f7f5]">
        <div className="container-premium grid gap-8 lg:grid-cols-5">
          {/* Info + map */}
          <div className="space-y-6 lg:col-span-2">
            <div className="border border-[#e5e5e0] bg-white p-7">
              <h2 className="font-serif text-xl text-ink-900">{contact.cardHeading}</h2>
              <ul className="mt-2">
                {items.map((item) => (
                  <li key={item.label} className="flex gap-4 border-b border-[#e5e5e0] py-5 last:border-b-0 last:pb-0 first:pt-5">
                    <span className="h-10 w-10 shrink-0 grid place-items-center bg-brand-700 text-white">
                      <item.icon size={18} weight="duotone" />
                    </span>
                    <div>
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-ink-400">{item.label}</p>
                      <p className="mt-1 leading-relaxed text-ink-700 text-[0.9rem]">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden border border-[#e5e5e0] h-72">
              <iframe title="UENR Sunyani location" src={contact.mapEmbed} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="border border-[#e5e5e0] bg-white p-7 sm:p-8">
              <span className="kicker">Get in touch</span>
              <h2 className="mt-2 font-serif text-2xl text-ink-900">{contact.formHeading}</h2>
              <p className="mt-2 text-sm text-ink-500">We&apos;d love to hear from you — send a message and we&apos;ll respond promptly.</p>
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
