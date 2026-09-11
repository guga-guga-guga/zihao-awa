import { useEffect, useRef, useState } from 'react'

export default function RollingNumber({ value, length = 2, className = '' }) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return undefined

    const start = performance.now()
    const duration = 460

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (to - from) * eased))

      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else {
        fromRef.current = to
        setDisplay(to)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])

  return <span className={className}>{String(display).padStart(length, '0')}</span>
}