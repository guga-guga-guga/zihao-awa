import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\_-'

export default function ScrambleText({ text, className = '', as: Tag = 'span' }) {
  const [display, setDisplay] = useState(text)
  const rafRef = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 420

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const reveal = Math.floor(p * text.length)
      let next = ''

      for (let i = 0; i < text.length; i += 1) {
        const char = text[i]
        if (i < reveal || char === ' ') next += char
        else next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }

      setDisplay(next)

      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else setDisplay(text)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [text])

  return <Tag className={className}>{display}</Tag>
}