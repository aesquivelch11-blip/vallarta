import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { splitWords } from '../utils/splitWords'

export default function Entrance() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.ent-rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.ent-wordmark', { opacity: 0 })
      gsap.set('.word-inner', { y: -40, opacity: 0 })
      gsap.set('.ent-descriptor', { opacity: 0 })
      gsap.set('.ent-scroll', { opacity: 0 })

      gsap.timeline({ delay: 0.2 })
        .to('.ent-rule', { scaleX: 1, duration: 0.5, ease: 'power2.inOut' })
        .to('.ent-wordmark', { opacity: 1, duration: 0.3, ease: 'power1.out' }, '+=0.2')
        .to('.word-inner', {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
        }, '-=0.1')
        .to('.ent-descriptor', { opacity: 1, duration: 0.4, ease: 'power1.out' }, '+=0.3')
        .to('.ent-scroll', { opacity: 1, duration: 0.4, ease: 'power1.out' }, '-=0.2')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between px-[5vw] py-12 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 0% 0%, rgba(232,220,200,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(232,220,200,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #1a1a1a 0%, #0A0A0A 100%)',
      }}
    >
      {/* Top strip */}
      <div className="relative">
        <div
          className="ent-rule w-full h-px mb-8"
          style={{
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            backgroundColor: '#E8DCC8',
          }}
        />
        <span
          className="ent-wordmark text-smoke tracking-wider uppercase"
          style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)', opacity: 0 }}
        >
          V18
        </span>
      </div>

      {/* Center — headline */}
      <div className="flex-1 flex items-center">
        <h1
          className="font-display leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(3rem, 13vw, 13vw)', color: '#F5F0E8' }}
        >
          <span className="block">{splitWords('Growth that feels')}</span>
          <em className="not-italic block" style={{ color: '#E8DCC8' }}>
            {splitWords('inevitable.')}
          </em>
        </h1>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between">
        <span
          className="ent-descriptor text-smoke tracking-wider uppercase"
          style={{ fontSize: '0.7rem', opacity: 0 }}
        >
          SEO & Social — Built for brands that refuse generic
        </span>
        <span
          className="ent-scroll text-smoke tracking-wider uppercase flex items-center gap-3"
          style={{ fontSize: '0.7rem', opacity: 0 }}
        >
          Scroll
          <span className="block w-8 h-px" style={{ backgroundColor: '#8A8A8A' }} />
        </span>
      </div>
    </section>
  )
}
