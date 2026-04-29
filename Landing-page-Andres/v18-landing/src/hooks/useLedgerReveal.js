import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reveals [data-ledger] elements with left-to-right clip-path wipe on scroll.
 * Elements must have clip-path: inset(0 100% 0 0) — set globally in index.css.
 *
 * @param {React.RefObject} containerRef - ref to the section element
 * @param {object} options
 * @param {number} options.stagger - delay between items (default 0.12)
 * @param {number} options.duration - per-item duration (default 0.75)
 * @param {string} options.start - ScrollTrigger start (default 'top 85%')
 */
export function useLedgerReveal(containerRef, options = {}) {
  const {
    stagger = 0.12,
    duration = 0.75,
    start = 'top 85%',
  } = options

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current.querySelectorAll('[data-ledger]')
      if (items.length === 0) return

      gsap.to(items, {
        clipPath: 'inset(0 0% 0 0)',
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          toggleActions: 'play none none none',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])
}
