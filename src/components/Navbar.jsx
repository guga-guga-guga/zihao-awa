import { useEffect, useState } from 'react'
import { navLinks } from '../data/profile'
// import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a className="nav__logo" href="#home" aria-label="返回首页">
          <span className="nav__logo-mark">ZH</span>
          <span className="nav__logo-text">
            <span>Zihao-作品</span>
            <small>VISUAL · AI · BRAND</small>
          </span>
        </a>

        <nav className="nav__links" aria-label="主导航">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              <span className="nav__link-label">{link.label}</span>
              <span className="nav__link-en">{link.en}</span>
            </a>
          ))}
        </nav>
          <div className="nav__actions">
            {/* <ThemeToggle /> */}
            <a className="nav__cta" href="#contact">
              联系我
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
      </div>
    </header>
  )
}
