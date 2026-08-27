import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Strengths from './components/Strengths'
import ContactFooter from './components/ContactFooter'
import BackToTop from './components/BackToTop'
import BackgroundFX from './components/BackgroundFX'
import useSiteAnimations from './hooks/useSiteAnimations'

export default function App() {
  useSiteAnimations()

  return (
    <div className="site">
      <BackgroundFX />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Strengths />
      </main>
      <BackToTop />
      <ContactFooter />
    </div>
  )
}
