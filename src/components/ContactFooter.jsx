import Reveal from './Reveal'
import { profile } from '../data/profile'

export default function ContactFooter() {
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
              <a className="contact__channel" href={`mailto:${profile.email}`}>
                <span className="contact__channel-label">EMAIL</span>
                <strong>{profile.email}</strong>
                <small>随时可以发邮件</small>
              </a>
              <div className="contact__channel">
                <span className="contact__channel-label">WECHAT</span>
                <strong>{profile.wechat}</strong>
                <small>添加时请备注来意</small>
              </div>
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
