import { useRef, useState } from 'react'
import Reveal from './Reveal'
import LightRays from './LightRays'
import { profile } from '../data/profile'

export default function About() {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  const copyToClipboard = async (value) => {
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

    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section className="about section" id="about">
      <div className="about__grid" aria-hidden="true" />
      <div className="about__glow" aria-hidden="true" />
      <LightRays className="about__light-rays" />
      <div className="container">
        <div className="about__layout">
          <Reveal className="about__portrait-wrap" delay={80}>
            <div className="about__portrait">
              <img src="/images/portrait.svg" alt="王子豪个人头像占位图" />
              <div className="about__portrait-info">
                <span className="about__name">{profile.name}</span>
                <span className="about__roles">{profile.roles.join(' / ')}</span>
              </div>
            </div>
            <div className="about__card-note">
              <span>PORTRAIT</span>
            </div>
          </Reveal>

          <div className="about__content">
            <Reveal className="section-heading section-heading--left">
              <div className="section-heading__meta">
                <span className="section-heading__index">01</span>
                <span className="section-heading__line" />
                <span className="section-heading__en">ABOUT / PROFILE</span>
              </div>
              <h2 className="section-heading__title">个人经历</h2>
              <p className="section-heading__desc">从技术到设计，从概念到成品。</p>
            </Reveal>

            <Reveal delay={80}>
              <p className="about__summary">{profile.summary}</p>
            </Reveal>

            <Reveal delay={140} className="about__bio">
              {profile.longBio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>

            <Reveal delay={200} className="about__info-grid">
              <div className="about__info-item">
                <span className="about__info-label">教育背景</span>
                <strong>{profile.education}</strong>
                <span>{profile.educationPeriod} · {profile.degree}</span>
              </div>
              <div className="about__info-item">
                <span className="about__info-label">现居地</span>
                <strong>{profile.location}</strong>
                <span>可远程 / 可到岗</span>
              </div>
              <div className="about__info-item">
                <span className="about__info-label">联系方式</span>
                <button
                  type="button"
                  className="about__copy-link"
                  onClick={() => copyToClipboard(profile.email)}
                >
                  {profile.email}
                </button>
                <button
                  type="button"
                  className="about__copy-link"
                  onClick={() => copyToClipboard(profile.wechat)}
                >
                  {profile.wechat}
                </button>
                <a
                  className="about__copy-link"
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/{profile.github}
                </a>
              </div>
            </Reveal>

            <Reveal delay={260} className="about__stats">
              {profile.stats.map((stat) => (
                <div className="about__stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
      {copied && <div className="copy-toast" role="status">已复制</div>}
    </section>
  )
}