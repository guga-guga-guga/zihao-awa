import Reveal from './Reveal'
import Grainient from './Grainient'
import { profile } from '../data/profile'
import useTheme from '../hooks/useTheme'

export default function About() {
  const { theme } = useTheme()

  return (
    <section className="about section" id="about">
      <Grainient
        className="about__grainient"
        color1={theme === 'light' ? '#eef1f6' : '#1f1d1f'}
        color2={theme === 'light' ? '#dbe4f0' : '#2c273e'}
        color3={theme === 'light' ? '#e6ecf3' : '#252d36'}
        timeSpeed={0.25}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
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
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  <span>{profile.wechat}</span>
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
    </section>
  )
}
