import { useEffect, useRef, useState } from 'react'

const ACCESS_TEXT = '正在验证访问权限'
const AUTH_TEXT = '身份已确认：用户'

export default function ArchiveBoot({ progress = 0 }) {
  const [access, setAccess] = useState('')
  const [auth, setAuth] = useState('')
  const startRef = useRef(0)

  useEffect(() => {
    startRef.current = performance.now()
    let raf = 0

    const tick = (now) => {
      const elapsed = (now - startRef.current) / 1000
      const accessChars = Math.floor(Math.min(1, elapsed / 0.9) * ACCESS_TEXT.length)
      const authChars = Math.floor(
        Math.min(1, Math.max(0, (elapsed - 1.0) / 0.8)) * AUTH_TEXT.length,
      )

      setAccess(ACCESS_TEXT.slice(0, accessChars))
      setAuth(AUTH_TEXT.slice(0, authChars))
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const statusText =
    progress >= 1 ? '档案已就绪' : '正在加载项目图片资源'

  return (
    <div className="archive-boot" role="status" aria-live="polite">
      <div className="archive-boot__grid" aria-hidden="true" />
      <div className="archive-boot__scan" aria-hidden="true" />

      <div className="archive-boot__inner">
        <p className="archive-boot__access">
          {access}
          <i aria-hidden="true" />
        </p>

        <div className="archive-boot__mark">
          <span className="archive-boot__mark-sign">+</span>
          <span className="archive-boot__mark-text">历史项目</span>
          <span className="archive-boot__mark-sign">-</span>
        </div>

        <div className="archive-boot__auth">
          <span className="archive-boot__auth-dot" aria-hidden="true" />
          <span>{auth}</span>
        </div>

        <div
          className="archive-boot__ring"
          style={{ '--boot-progress': Math.min(1, Math.max(0, progress)) }}
        >
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle
              className="archive-boot__ring-bg"
              cx="60"
              cy="60"
              r="48"
            />
            <circle
              className="archive-boot__ring-fg"
              cx="60"
              cy="60"
              r="48"
              pathLength="1"
            />
          </svg>
          <strong>{String(Math.round(progress * 100)).padStart(3, '0')}</strong>
        </div>

        <p className="archive-boot__status">{statusText}</p>
      </div>
    </div>
  )
}