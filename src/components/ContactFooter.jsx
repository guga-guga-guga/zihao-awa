import { useRef, useState } from 'react'
import Reveal from './Reveal'
import { profile } from '../data/profile'

export default function ContactFooter() {
  const [copied, setCopied] = useState(null)
  const timerRef = useRef(null)

  const copyToClipboard = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopied(key)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(null), 1600)
  }

  return (
    <footer className="contact" id="contact">
      <div className="contact__grid" aria-hidden="true" />
      <div className="contact__glow" aria-hidden="true" />

      <div className="contact__inner container">
        <div className="contact__layout">
          <Reveal className="contact__heading">
            <span className="contact__eyebrow">NEXT STEP</span>
            <h2 className="contact__title">
              <span>Let’s</span>
              <span className="contact__title-outline">Talk.</span>
            </h2>
            <p className="contact__desc">
              如果你有品牌视觉、AI 产品设计或 3D 视觉相关的项目想法，
              <br />
              欢迎随时联系我。
            </p>
          </Reveal>

          <div className="contact__right">
            <Reveal delay={120} className="contact__channels">
              <button
                type="button"
                className="contact__channel"
                onClick={() => copyToClipboard('email', profile.email)}
              >
                <span className="contact__channel-label">
                  EMAIL
                  {copied === 'email' && <span className="contact__channel-copied">已复制</span>}
                </span>
                <strong>{profile.email}</strong>
                <small>{copied === 'email' ? '已复制到剪贴板' : '点击复制邮箱'}</small>
              </button>

              <button
                type="button"
                className="contact__channel"
                onClick={() => copyToClipboard('wechat', profile.wechat)}
              >
                <span className="contact__channel-label">
                  WECHAT
                  {copied === 'wechat' && <span className="contact__channel-copied">已复制</span>}
                </span>
                <strong>{profile.wechat}</strong>
                <small>{copied === 'wechat' ? '已复制到剪贴板' : '点击复制微信号'}</small>
              </button>
            </Reveal>
          </div>
        </div>

        <div className="contact__footer container">
          <span>© 2026 {profile.name} · {profile.roles.join(' / ')}</span>
          <span>Designed & Built by {profile.name}</span>
        </div>
      </div>
    </footer>
  )
}
