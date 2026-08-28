'use client'

import type { SiteSectionKey, SiteSections } from '@/data/siteDefaults'
import { TextInput, TextArea, FieldGroup, ImageField } from './form-fields'
import { ArrayItems } from './array-items'
import { Plus, Trash } from '@phosphor-icons/react'

type SectionData = SiteSections[SiteSectionKey]

interface Props {
  sectionKey: SiteSectionKey
  data: SectionData
  onChange: (data: unknown) => void
}

export function SectionForm({ sectionKey, data, onChange }: Props) {
  const set = (key: string, value: unknown) => {
    onChange({ ...data, [key]: value })
  }

  const setNested = (key: string, sub: string, value: unknown) => {
    const current = (data as unknown as Record<string, unknown>)[key]
    set(key, { ...(current as Record<string, unknown>), [sub]: value })
  }

  switch (sectionKey) {
    case 'branding':
      return <BrandingForm data={data as SiteSections['branding']} set={set} />
    case 'hero':
      return <HeroForm data={data as SiteSections['hero']} set={set} setNested={setNested} />
    case 'home':
      return <HomeForm data={data as SiteSections['home']} set={set} setNested={setNested} />
    case 'about':
      return <AboutForm data={data as SiteSections['about']} set={set} />
    case 'programmes':
      return <ProgrammesForm data={data as SiteSections['programmes']} set={set} setNested={setNested} />
    case 'news':
      return <NewsForm data={data as SiteSections['news']} set={set} />
    case 'staff':
      return <StaffForm data={data as SiteSections['staff']} set={set} />
    case 'leadership':
      return <LeadershipForm data={data as SiteSections['leadership']} set={set} />
    case 'contact':
      return <ContactForm data={data as SiteSections['contact']} set={set} />
    case 'projects':
      return <ProjectsForm data={data as SiteSections['projects']} set={set} />
    case 'footer':
      return <FooterForm data={data as SiteSections['footer']} set={set} />
    case 'navigation':
      return <NavigationForm data={data as SiteSections['navigation']} set={set} />
    default:
      return <div className="text-sm text-ink-500">Unknown section</div>
  }
}

function BrandingForm({ data, set }: { data: SiteSections['branding']; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Branding" description="Site name and logo" />
      <FieldGroup title="Brand">
        <TextInput label="Site Name" value={data.siteName} onChange={(v) => set('siteName', v)} />
        <ImageField label="Logo" value={data.logo} onChange={(v) => set('logo', v)} hint="Upload your school logo" />
      </FieldGroup>
    </div>
  )
}

function HeroForm({ data, set, setNested }: { data: SiteSections['hero']; set: (k: string, v: unknown) => void; setNested: (k: string, sub: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Hero Section" description="Homepage hero banner with title, description, and stats" />
      <FieldGroup title="Content">
        <TextInput label="Badge" value={data.badge} onChange={(v) => set('badge', v)} />
        <TextInput label="Title (before highlight)" value={data.title} onChange={(v) => set('title', v)} />
        <TextInput label="Highlighted Word" value={data.highlightWord} onChange={(v) => set('highlightWord', v)} />
        <TextInput label="Subtitle (after highlight)" value={data.subtitle} onChange={(v) => set('subtitle', v)} hint="Use \n for line break" />
        <TextArea label="Description" value={data.description} onChange={(v) => set('description', v)} rows={3} />
      </FieldGroup>
      <FieldGroup title="Image">
        <ImageField label="Hero Image" value={data.image} onChange={(v) => set('image', v)} hint="Upload a hero banner image" />
      </FieldGroup>
      <FieldGroup title="Buttons">
        <TextInput label="Primary CTA Label" value={data.primaryCta.label} onChange={(v) => setNested('primaryCta', 'label', v)} />
        <TextInput label="Primary CTA Link" value={data.primaryCta.href} onChange={(v) => setNested('primaryCta', 'href', v)} />
        <TextInput label="Secondary CTA Label" value={data.secondaryCta.label} onChange={(v) => setNested('secondaryCta', 'label', v)} />
        <TextInput label="Secondary CTA Link" value={data.secondaryCta.href} onChange={(v) => setNested('secondaryCta', 'href', v)} />
      </FieldGroup>
      <ArrayItems
        label="Stats"
        items={data.stats}
        onChange={(v) => set('stats', v)}
        fields={[
          { key: 'value', label: 'Value', placeholder: '4,000+' },
          { key: 'label', label: 'Label', placeholder: 'Students' },
        ]}
      />
    </div>
  )
}

function HomeForm({ data, set, setNested }: { data: SiteSections['home']; set: (k: string, v: unknown) => void; setNested: (k: string, sub: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Home Page" description="About preview, departments, programmes, news, and CTA sections" />
      <FieldGroup title="About Preview">
        <TextInput label="Eyebrow" value={data.aboutEyebrow} onChange={(v) => set('aboutEyebrow', v)} />
        <TextInput label="Heading" value={data.aboutHeading} onChange={(v) => set('aboutHeading', v)} />
        <TextArea label="Body" value={data.aboutBody} onChange={(v) => set('aboutBody', v)} rows={4} />
        <TextInput label="Link" value={data.aboutLink} onChange={(v) => set('aboutLink', v)} />
      </FieldGroup>
      <FieldGroup title="Year Card">
        <TextInput label="Year" value={String(data.aboutYear)} onChange={(v) => set('aboutYear', Number(v))} type="number" />
        <TextInput label="Year Text" value={data.aboutYearText} onChange={(v) => set('aboutYearText', v)} />
      </FieldGroup>
      <FieldGroup title="Stats Cards">
        <TextInput label="Stat 1 Value" value={data.aboutStat1Value} onChange={(v) => set('aboutStat1Value', v)} />
        <TextInput label="Stat 1 Label" value={data.aboutStat1Label} onChange={(v) => set('aboutStat1Label', v)} />
        <TextInput label="Stat 2 Value" value={data.aboutStat2Value} onChange={(v) => set('aboutStat2Value', v)} />
        <TextInput label="Stat 2 Label" value={data.aboutStat2Label} onChange={(v) => set('aboutStat2Label', v)} />
      </FieldGroup>
      <FieldGroup title="Departments">
        <TextInput label="Eyebrow" value={data.deptEyebrow} onChange={(v) => set('deptEyebrow', v)} />
        <TextInput label="Heading" value={data.deptHeading} onChange={(v) => set('deptHeading', v)} />
        <TextInput label="Link" value={data.deptLink} onChange={(v) => set('deptLink', v)} />
      </FieldGroup>
      <FieldGroup title="Programmes">
        <TextInput label="Eyebrow" value={data.progEyebrow} onChange={(v) => set('progEyebrow', v)} />
        <TextInput label="Heading" value={data.progHeading} onChange={(v) => set('progHeading', v)} />
        <TextInput label="Link" value={data.progLink} onChange={(v) => set('progLink', v)} />
      </FieldGroup>
      <FieldGroup title="News">
        <TextInput label="Eyebrow" value={data.newsEyebrow} onChange={(v) => set('newsEyebrow', v)} />
        <TextInput label="Heading" value={data.newsHeading} onChange={(v) => set('newsHeading', v)} />
        <TextInput label="Link" value={data.newsLink} onChange={(v) => set('newsLink', v)} />
        <TextInput label="Empty State" value={data.newsEmpty} onChange={(v) => set('newsEmpty', v)} />
      </FieldGroup>
      <FieldGroup title="Call to Action">
        <TextInput label="Heading" value={data.ctaHeading} onChange={(v) => set('ctaHeading', v)} />
        <TextArea label="Body" value={data.ctaBody} onChange={(v) => set('ctaBody', v)} rows={3} />
        <TextInput label="Primary Button" value={data.ctaPrimary.label} onChange={(v) => setNested('ctaPrimary', 'label', v)} />
        <TextInput label="Primary Link" value={data.ctaPrimary.href} onChange={(v) => setNested('ctaPrimary', 'href', v)} />
        <TextInput label="Secondary Button" value={data.ctaSecondary.label} onChange={(v) => setNested('ctaSecondary', 'label', v)} />
        <TextInput label="Secondary Link" value={data.ctaSecondary.href} onChange={(v) => setNested('ctaSecondary', 'href', v)} />
      </FieldGroup>
    </div>
  )
}

function AboutForm({ data, set }: { data: SiteSections['about']; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="About Page" description="Story, vision, mission, departments, and values" />
      <FieldGroup title="Hero">
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => set('heroTitle', v)} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} rows={2} />
      </FieldGroup>
      <FieldGroup title="Our Story">
        <TextInput label="Eyebrow" value={data.storyEyebrow} onChange={(v) => set('storyEyebrow', v)} />
        <TextInput label="Heading" value={data.storyHeading} onChange={(v) => set('storyHeading', v)} />
        <TextArea label="Body" value={data.storyBody} onChange={(v) => set('storyBody', v)} rows={8} hint="Separate paragraphs with a blank line" />
      </FieldGroup>
      <FieldGroup title="Vision">
        <TextInput label="Title" value={data.visionTitle} onChange={(v) => set('visionTitle', v)} />
        <TextArea label="Body" value={data.visionBody} onChange={(v) => set('visionBody', v)} rows={3} />
      </FieldGroup>
      <FieldGroup title="Mission">
        <TextInput label="Title" value={data.missionTitle} onChange={(v) => set('missionTitle', v)} />
        <TextArea label="Body" value={data.missionBody} onChange={(v) => set('missionBody', v)} rows={3} />
      </FieldGroup>
      <FieldGroup title="Departments & Centres">
        <TextInput label="Eyebrow" value={data.deptEyebrow} onChange={(v) => set('deptEyebrow', v)} />
        <TextInput label="Heading" value={data.deptHeading} onChange={(v) => set('deptHeading', v)} />
        <TextInput label="CeRAB Heading" value={data.cerabHeading} onChange={(v) => set('cerabHeading', v)} />
        <TextArea label="CeRAB Body" value={data.cerabBody} onChange={(v) => set('cerabBody', v)} rows={2} />
        <TextInput label="CeRAB Link" value={data.cerabLink} onChange={(v) => set('cerabLink', v)} />
      </FieldGroup>
      <FieldGroup title="Values">
        <TextInput label="Eyebrow" value={data.valuesEyebrow} onChange={(v) => set('valuesEyebrow', v)} />
        <TextInput label="Heading" value={data.valuesHeading} onChange={(v) => set('valuesHeading', v)} />
        <ArrayItems
          label="Values"
          items={data.values}
          onChange={(v) => set('values', v)}
          fields={[
            { key: 'title', label: 'Title', placeholder: 'Excellence' },
            { key: 'description', label: 'Description' },
          ]}
        />
      </FieldGroup>
    </div>
  )
}

function ProgrammesForm({ data, set, setNested }: { data: SiteSections['programmes']; set: (k: string, v: unknown) => void; setNested: (k: string, sub: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Programmes Page" description="Hero and admission requirements" />
      <FieldGroup title="Hero">
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => set('heroTitle', v)} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} rows={2} />
      </FieldGroup>
      <FieldGroup title="Admission Requirements">
        <TextInput label="Heading" value={data.reqHeading} onChange={(v) => set('reqHeading', v)} />
        <TextArea label="Body" value={data.reqBody} onChange={(v) => set('reqBody', v)} rows={4} />
        <TextInput label="CTA Label" value={data.reqCta.label} onChange={(v) => setNested('reqCta', 'label', v)} />
        <TextInput label="CTA Link" value={data.reqCta.href} onChange={(v) => setNested('reqCta', 'href', v)} />
      </FieldGroup>
    </div>
  )
}

function NewsForm({ data, set }: { data: SiteSections['news']; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="News & Events" description="Page hero content" />
      <FieldGroup title="Hero">
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => set('heroTitle', v)} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} rows={2} />
      </FieldGroup>
    </div>
  )
}

function StaffForm({ data, set }: { data: SiteSections['staff']; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Staff Page" description="Page hero content for academic staff" />
      <FieldGroup title="Hero">
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => set('heroTitle', v)} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} rows={2} />
      </FieldGroup>
    </div>
  )
}

function LeadershipForm({ data, set }: { data: SiteSections['leadership']; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Leadership Page" description="Page hero content for leadership and administration" />
      <FieldGroup title="Hero">
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => set('heroTitle', v)} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} rows={2} />
      </FieldGroup>
    </div>
  )
}

function ContactForm({ data, set }: { data: SiteSections['contact']; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Contact Page" description="Contact info, map, and form" />
      <FieldGroup title="Hero">
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => set('heroTitle', v)} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} rows={2} />
      </FieldGroup>
      <FieldGroup title="Contact Information">
        <TextInput label="Card Heading" value={data.cardHeading} onChange={(v) => set('cardHeading', v)} />
        <TextArea label="Address" value={data.address} onChange={(v) => set('address', v)} rows={2} />
        <TextInput label="Phone" value={data.phone} onChange={(v) => set('phone', v)} />
        <TextInput label="Email" value={data.email} onChange={(v) => set('email', v)} />
        <TextInput label="Office Hours" value={data.officeHours} onChange={(v) => set('officeHours', v)} />
      </FieldGroup>
      <FieldGroup title="Map">
        <TextInput label="Google Maps Embed URL" value={data.mapEmbed} onChange={(v) => set('mapEmbed', v)} />
      </FieldGroup>
      <FieldGroup title="Form">
        <TextInput label="Form Heading" value={data.formHeading} onChange={(v) => set('formHeading', v)} />
      </FieldGroup>
    </div>
  )
}

function ProjectsForm({ data, set }: { data: SiteSections['projects']; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Projects Page" description="Coming soon placeholder content" />
      <FieldGroup title="Hero">
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => set('heroTitle', v)} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} rows={2} />
      </FieldGroup>
      <FieldGroup title="Coming Soon">
        <TextInput label="Heading" value={data.comingSoonHeading} onChange={(v) => set('comingSoonHeading', v)} />
        <TextArea label="Body" value={data.comingSoonBody} onChange={(v) => set('comingSoonBody', v)} rows={3} />
      </FieldGroup>
      <FieldGroup title="Undergraduate">
        <TextInput label="Title" value={data.ugTitle} onChange={(v) => set('ugTitle', v)} />
        <TextArea label="Body" value={data.ugBody} onChange={(v) => set('ugBody', v)} rows={2} />
      </FieldGroup>
      <FieldGroup title="Post-Graduate">
        <TextInput label="Title" value={data.pgTitle} onChange={(v) => set('pgTitle', v)} />
        <TextArea label="Body" value={data.pgBody} onChange={(v) => set('pgBody', v)} rows={2} />
      </FieldGroup>
    </div>
  )
}

function FooterForm({ data, set }: { data: SiteSections['footer']; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Footer" description="Brand, links, contact info, and copyright" />
      <FieldGroup title="Brand">
        <TextInput label="Brand Name" value={data.brandName} onChange={(v) => set('brandName', v)} />
        <TextInput label="Subtitle" value={data.brandSubtitle} onChange={(v) => set('brandSubtitle', v)} />
        <TextArea label="Tagline" value={data.tagline} onChange={(v) => set('tagline', v)} rows={3} />
      </FieldGroup>
      <FieldGroup title="Quick Links">
        <TextInput label="Section Heading" value={data.quickLinksHeading} onChange={(v) => set('quickLinksHeading', v)} />
        <ArrayItems
          label="Links"
          items={data.quickLinks}
          onChange={(v) => set('quickLinks', v)}
          fields={[
            { key: 'label', label: 'Label', placeholder: 'About Us' },
            { key: 'href', label: 'Link', placeholder: '/about' },
          ]}
        />
      </FieldGroup>
      <FieldGroup title="Programmes Column">
        <TextInput label="Section Heading" value={data.programmesHeading} onChange={(v) => set('programmesHeading', v)} />
        <ArrayItems
          label="Links"
          items={data.programmesLinks}
          onChange={(v) => set('programmesLinks', v)}
          fields={[
            { key: 'label', label: 'Label', placeholder: 'Degree Programmes' },
            { key: 'href', label: 'Link', placeholder: '/programmes?level=degree' },
          ]}
        />
      </FieldGroup>
      <FieldGroup title="Contact Column">
        <TextInput label="Heading" value={data.contactHeading} onChange={(v) => set('contactHeading', v)} />
        <TextArea label="Address" value={data.address} onChange={(v) => set('address', v)} rows={2} />
        <TextInput label="Phone" value={data.phone} onChange={(v) => set('phone', v)} />
        <TextInput label="Email" value={data.email} onChange={(v) => set('email', v)} />
      </FieldGroup>
      <FieldGroup title="Bottom Bar">
        <TextInput label="Copyright" value={data.copyright} onChange={(v) => set('copyright', v)} />
        <TextInput label="Tagline" value={data.bottomTagline} onChange={(v) => set('bottomTagline', v)} />
      </FieldGroup>
    </div>
  )
}

function NavigationForm({ data, set }: { data: SiteSections['navigation']; set: (k: string, v: unknown) => void }) {
  function updateItem(index: number, key: string, value: string) {
    const next = data.items.map((item, i) =>
      i === index ? { ...item, [key]: value } : item,
    )
    set('items', next)
  }
  function addItem() {
    set('items', [...data.items, { label: '', href: '', children: [] }])
  }
  function removeItem(index: number) {
    set('items', data.items.filter((_, i) => i !== index))
  }
  function updateChild(itemIndex: number, childIndex: number, key: string, value: string) {
    const next = data.items.map((item, i) => {
      if (i !== itemIndex) return item
      const children = [...(item.children || [])]
      children[childIndex] = { ...children[childIndex], [key]: value }
      return { ...item, children }
    })
    set('items', next)
  }
  function addChild(itemIndex: number) {
    const next = data.items.map((item, i) => {
      if (i !== itemIndex) return item
      return { ...item, children: [...(item.children || []), { label: '', href: '' }] }
    })
    set('items', next)
  }
  function removeChild(itemIndex: number, childIndex: number) {
    const next = data.items.map((item, i) => {
      if (i !== itemIndex) return item
      return { ...item, children: (item.children || []).filter((_, j) => j !== childIndex) }
    })
    set('items', next)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Navigation" description="Top bar, navigation items, and CTA button" />
      <FieldGroup title="Top Bar">
        <TextInput label="Text" value={data.topBarText} onChange={(v) => set('topBarText', v)} />
        <TextInput label="Link Label" value={data.topBarLink.label} onChange={(v) => { const cur = data.topBarLink; set('topBarLink', { ...cur, label: v }) }} />
        <TextInput label="Link URL" value={data.topBarLink.href} onChange={(v) => { const cur = data.topBarLink; set('topBarLink', { ...cur, href: v }) }} />
      </FieldGroup>
      <FieldGroup title="CTA Button">
        <TextInput label="Label" value={data.ctaLabel} onChange={(v) => set('ctaLabel', v)} />
        <TextInput label="Link" value={data.ctaHref} onChange={(v) => set('ctaHref', v)} />
      </FieldGroup>
      <FieldGroup title="Navigation Items">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-ink-700">Items</label>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-700 hover:bg-brand-100"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-4">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-ink-100 bg-ink-50/50 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    value={item.label}
                    onChange={(e) => updateItem(i, 'label', e.target.value)}
                    placeholder="Label"
                    className="w-full rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 focus:outline-none"
                  />
                  <input
                    value={item.href}
                    onChange={(e) => updateItem(i, 'href', e.target.value)}
                    placeholder="Link"
                    className="w-full rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="mt-1 rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash size={14} />
                </button>
              </div>
              {item.children && item.children.length > 0 && (
                <div className="ml-4 space-y-2 border-l-2 border-ink-200 pl-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Children</p>
                  {item.children.map((child, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className="flex-1 space-y-1">
                        <input
                          value={child.label}
                          onChange={(e) => updateChild(i, j, 'label', e.target.value)}
                          placeholder="Child label"
                          className="w-full rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 focus:outline-none"
                        />
                        <input
                          value={child.href}
                          onChange={(e) => updateChild(i, j, 'href', e.target.value)}
                          placeholder="Child link"
                          className="w-full rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeChild(i, j)}
                        className="mt-1 rounded-lg p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => addChild(i)}
                className="ml-4 inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-brand-700 hover:bg-brand-50"
              >
                <Plus size={10} /> Add Child
              </button>
            </div>
          ))}
        </div>
      </FieldGroup>
    </div>
  )
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink-900">{title}</h3>
      <p className="text-sm text-ink-500">{description}</p>
    </div>
  )
}
