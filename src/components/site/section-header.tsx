export function SectionHeader({
  kicker,
  heading,
  description,
  align = 'left',
}: {
  kicker: string
  heading: string
  description?: string
  align?: 'left' | 'center'
}) {
  if (align === 'center') {
    return (
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 px-2">
        <span className="kicker justify-center mb-3 sm:mb-4">{kicker}</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink-900 leading-tight text-balance">{heading}</h2>
        {description && <p className="text-ink-600 leading-relaxed mt-3 sm:mt-4 text-base sm:text-lg">{description}</p>}
      </div>
    )
  }
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
      <div>
        <span className="kicker mb-3 sm:mb-5">{kicker}</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink-900 leading-tight max-w-2xl text-balance">{heading}</h2>
      </div>
      {description && <p className="text-ink-600 leading-relaxed max-w-sm text-base sm:text-lg lg:text-right">{description}</p>}
    </div>
  )
}