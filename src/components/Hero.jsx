import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { profile } from '../data/profile'

export default function Hero() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(
        '.hero__curtain',
        { yPercent: 0 },
        { yPercent: -100, duration: 1.2, ease: 'power4.inOut' },
        0.25,
      )
        .fromTo(
          '.hero__title-line > span',
          { yPercent: 120, rotate: 3 },
          { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.14 },
          0.6,
        )
        .fromTo(
          '.hero__roles > span',
          { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
          1.0,
        )
        .fromTo(
          '.hero__subtitle',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          1.15,
        )
        .fromTo(
          '.hero__actions .btn',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
          1.3,
        )
        .fromTo(
          '.hero__topline, .hero__side, .hero__footer',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
          1.35,
        )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="home" ref={rootRef}>
      <div className="hero__curtain" aria-hidden="true" />
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__noise" aria-hidden="true" />
      <div className="hero__carousel" aria-hidden="true">
        <picture>
          <source srcSet="/images/hero-0001.webp" type="image/webp" />
          <img className="hero__carousel-img hero__carousel-img--1" src="/images/hero-0001.png" alt="" decoding="async" fetchPriority="high" />
        </picture>
        <picture>
          <source srcSet="/images/hero-ocean.webp" type="image/webp" />
          <img className="hero__carousel-img hero__carousel-img--2" src="/images/hero-ocean.png" alt="" decoding="async" loading="lazy" fetchPriority="low" />
        </picture>
          <picture>
            <source srcSet="/images/hero-cangmen.webp" type="image/webp" />
            <img className="hero__carousel-img hero__carousel-img--3" src="/images/hero-cangmen.png" alt="" decoding="async" loading="lazy" fetchPriority="low" />
          </picture>
      </div>

      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__topline">
          <span className="hero__status">
            <i />
            {profile.available}
          </span>
          <span className="hero__location">{profile.location} · 中国</span>
        </div>

        <div className="hero__main">
          <div className="hero__side" aria-hidden="true">
            <span>PORTFOLIO</span>
            <span>2026</span>
          </div>

          <div className="hero__content">
            <p className="hero__roles">
              {profile.roles.map((role, i) => (
                <span key={role}>
                  {i > 0 && <em>/</em>}
                  {role}
                </span>
              ))}
            </p>

            <h1 className="hero__title">
              <span className="hero__title-line">
                <span className="hero__title-solid">视觉 · AI</span>
              </span>
              <span className="hero__title-line">
                <span className="hero__title-outline">创意无限</span>
              </span>
            </h1>

            <p className="hero__subtitle">
              用克制的科技感与完整的创作闭环，为产品与品牌建立清晰的视觉语言。
            </p>

            <div className="hero__actions">
              <a className="btn btn--primary" href="#projects">
                查看作品
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="btn btn--ghost" href="#contact">
                联系我
              </a>
            </div>
          </div>
        </div>

        <div className="hero__footer">
          <div className="hero__footer-note">
            <span className="hero__footer-line" />
            <span>SCROLL TO EXPLORE</span>
          </div>
          <div className="hero__footer-mouse" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  )
}
