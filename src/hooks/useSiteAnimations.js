import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export default function useSiteAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section headings: English label enters first with large movement,
      // then the Chinese title and description follow.
      gsap.utils.toArray('.section-heading').forEach((heading) => {
        const en = heading.querySelector('.section-heading__en')
        const title = heading.querySelector('.section-heading__title')
        const desc = heading.querySelector('.section-heading__desc')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            start: 'top 78%',
            once: true,
          },
          defaults: { ease: 'power4.out' },
        })

        if (en) {
          tl.fromTo(
            en,
            { xPercent: -80, opacity: 0, filter: 'blur(8px)' },
            { xPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1 },
          )
        }

        if (title) {
          tl.fromTo(
            title,
            { y: 90, opacity: 0, scale: 0.94 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2 },
            '-=0.75',
          )
        }

        if (desc) {
          tl.fromTo(
            desc,
            { y: 42, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            '-=0.7',
          )
        }
      })

      // Main module children: cards / panels enter with a slow stagger.
      const staggerGroups = [
        '.about__layout',
        '.projects__showcase',
        '.skills__toolkit',
      ]

      staggerGroups.forEach((selector) => {
        const parent = document.querySelector(selector)
        if (!parent) return

        const items = parent.children
        gsap.fromTo(
          items,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.3,
            stagger: 0.16,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: parent,
              start: 'top 76%',
              once: true,
            },
          },
        )
      })

      // Image reveal + subtle parallax for project images.
      gsap.utils.toArray('.projects__visual').forEach((visual) => {
        const img = visual.querySelector('img')
        if (!img) return

        gsap.fromTo(
          img,
          { scale: 1.18, yPercent: -6 },
          {
            scale: 1.12,
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: visual,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        )

        gsap.fromTo(
          visual,
          { clipPath: 'inset(8% 5% 8% 5%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: visual,
              start: 'top 82%',
              once: true,
            },
          },
        )
      })

      // Portrait reveal + subtle parallax.
      gsap.utils.toArray('.about__portrait').forEach((portrait) => {
        const img = portrait.querySelector('img')
        if (!img) return

        gsap.fromTo(
          img,
          { scale: 1.15, yPercent: -6 },
          {
            scale: 1.1,
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: portrait,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        )

        gsap.fromTo(
          portrait,
          { clipPath: 'inset(10% 6% 10% 6%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: portrait,
              start: 'top 82%',
              once: true,
            },
          },
        )
      })
    }, document.body)

    return () => ctx.revert()
  }, [])
}
