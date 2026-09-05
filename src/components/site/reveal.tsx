'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

export type RevealVariant = 'wipe' | 'tilt' | 'slide' | 'pop' | 'skew'

/**
 * Scroll-triggered animations built purely from clip-path and transform —
 * no opacity, so nothing ever fades in or out.
 */
const variantStyles: Record<
  RevealVariant,
  { hidden: CSSProperties; visible: CSSProperties; transition: string }
> = {
  // Curtain wipes upward from the bottom edge
  wipe: {
    hidden: { clipPath: 'inset(100% 0 0 0)', transform: 'translateY(28px)' },
    visible: { clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' },
    transition:
      'clip-path 900ms cubic-bezier(0.77,0,0.18,1), transform 900ms cubic-bezier(0.77,0,0.18,1)',
  },
  // 3D tilt: unclips top-to-bottom while rotating into place
  tilt: {
    hidden: {
      clipPath: 'inset(0 0 100% 0)',
      transform:
        'perspective(1000px) rotateX(18deg) rotateZ(-2.5deg) translateY(30px)',
    },
    visible: {
      clipPath: 'inset(0 0 0 0)',
      transform: 'perspective(1000px) rotateX(0deg) rotateZ(0deg) translateY(0)',
    },
    transition:
      'clip-path 1000ms cubic-bezier(0.22,1,0.36,1), transform 1000ms cubic-bezier(0.22,1,0.36,1)',
  },
  // Slides in from the left while unclipping left-to-right
  slide: {
    hidden: { clipPath: 'inset(0 100% 0 0)', transform: 'translateX(-56px)' },
    visible: { clipPath: 'inset(0 0 0 0)', transform: 'translateX(0)' },
    transition:
      'clip-path 850ms cubic-bezier(0.22,1,0.36,1), transform 850ms cubic-bezier(0.22,1,0.36,1)',
  },
  // Springs up with a bouncy overshoot
  pop: {
    hidden: { clipPath: 'inset(100% 0 0 0)', transform: 'scale(0.7)' },
    visible: { clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' },
    transition:
      'clip-path 700ms cubic-bezier(0.22,1,0.36,1), transform 1000ms cubic-bezier(0.34,1.56,0.64,1)',
  },
  // Rising skew that straightens out
  skew: {
    hidden: {
      clipPath: 'inset(100% 0 0 0)',
      transform: 'translateY(36px) skewY(5deg)',
    },
    visible: {
      clipPath: 'inset(0 0 0 0)',
      transform: 'translateY(0) skewY(0deg)',
    },
    transition:
      'clip-path 950ms cubic-bezier(0.77,0,0.18,1), transform 950ms cubic-bezier(0.77,0,0.18,1)',
  },
}

export function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'wipe',
  y = 0,
  scale = 1,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  variant?: RevealVariant
  y?: number
  scale?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style = variantStyles[variant]
  const hidden: CSSProperties = { ...style.hidden }
  const visibleStyle: CSSProperties = { ...style.visible }
  if (y !== 0 || scale !== 1) {
    hidden.transform = `translateY(${y}px) scale(${scale}) ${hidden.transform ?? ''}`.trim()
    visibleStyle.transform = `translateY(0px) scale(1) ${visibleStyle.transform ?? ''}`.trim()
  }

  const transition = style.transition
    .split(', ')
    .map((t) => `${t} ${delay}ms`)
    .join(', ')

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(visible ? visibleStyle : hidden),
        transition,
        willChange: 'clip-path, transform',
      }}
    >
      {children}
    </div>
  )
}

export function RevealStagger({
  children,
  stagger = 90,
  className = '',
}: {
  children: React.ReactNode[]
  stagger?: number
  className?: string
}) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((c, i) => (
            <Reveal key={i} delay={i * stagger}>
              {c}
            </Reveal>
          ))
        : children}
    </div>
  )
}