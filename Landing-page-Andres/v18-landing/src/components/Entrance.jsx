import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { splitWords } from '../utils/splitWords'

export default function Entrance() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.ent-rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.ent-wordmark', { opacity: 0 })
      gsap.set('.word-inner', { y: 60, opacity: 0 })
      gsap.set('.ent-descriptor', { opacity: 0 })
      gsap.set('.ent-scroll', { opacity: 0 })

      gsap.timeline({ delay: 0.3 })
        .to('.ent-rule', { scaleX: 1, duration: 0.8, ease: 'power2.inOut' })
        .to('.ent-wordmark', { opacity: 1, duration: 0.4 }, '-=0.4')
        .to('.word-inner', {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.08,
        }, '-=0.2')
        .to('.ent-descriptor', { opacity: 1, duration: 0.5 }, '-=0.4')
        .to('.ent-scroll', { opacity: 1, duration: 0.5 }, '-=0.3')

      gsap.to(bgRef.current, {
        backgroundPosition: '100% 100%',
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 py-10 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(232,220,200,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(232,220,200,0.04) 0%, transparent 50%),
            #0A0A0A
          `,
          backgroundSize: '120% 120%',
        }}
      />

      {/* Top strip */}
      <div className="relative">
        <div
          className="ent-rule w-full h-px mb-6"
          style={{ backgroundColor: '#E8DCC8', transformOrigin: 'left center' }}
        />
        <span
          className="ent-wordmark text-xs uppercase tracking-[0.25em]"
          style={{ color: '#8A8A8A', opacity: 0 }}
        >
          V18
        </span>
      </div>

      {/* Center — headline */}
      <div className="flex-1 flex items-center">
        <h1
          className="font-display leading-[0.9] tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 11rem)', color: '#F5F0E8' }}
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
          className="ent-descriptor text-xs uppercase tracking-[0.2em]"
          style={{ color: '#8A8A8A', opacity: 0 }}
        >
          SEO & Social — Built for brands that refuse generic
        </span>
        <span
          className="ent-scroll text-xs uppercase tracking-[0.25em] flex items-center gap-3"
          style={{ color: '#8A8A8A', opacity: 0 }}
        >
          Scroll
          <span className="block w-8 h-px" style={{ backgroundColor: '#8A8A8A' }} />
        </span>
      </div>
    </section>
  )
}
