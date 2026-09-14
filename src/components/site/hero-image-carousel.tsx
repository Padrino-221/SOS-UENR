'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface Props {
  images: string[]
  fallback?: string
  intervalMs?: number
  className?: string
}

export function HeroImageCarousel({ images, fallback = '/JOEY SHOT IT_2.jpg', intervalMs = 8000, className }: Props) {
  const normalized = images && images.length > 0 ? images.filter(Boolean) : fallback ? [fallback] : []
  const count = normalized.length
  const [index, setIndex] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(() => {
      if (pausedRef.current) return
      setIndex((i) => (i + 1) % count)
    }, intervalMs)
    return () => clearInterval(id)
  }, [count, intervalMs])

  // Pause only while the browser tab is hidden (saves work, never blocks viewing)
  useEffect(() => {
    const onVisibility = () => {
      pausedRef.current = document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (count === 0) return null
  if (count === 1) {
    return (
      <div className={className ?? 'relative h-80 sm:h-96'}>
        <Image src={normalized[0]} alt="School of Sciences" fill className="object-cover" priority />
      </div>
    )
  }

  return (
    <div className={className ?? 'relative h-80 sm:h-96'}>
      {normalized.map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt={i === 0 ? 'School of Sciences' : ''}
          fill
          className="object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          priority={i === 0}
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
      ))}
    </div>
  )
}
