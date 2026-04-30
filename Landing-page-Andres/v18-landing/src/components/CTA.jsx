import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords } from '../utils/splitWords'

export default function CTA() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.cta-word', { y: -40, opacity: 0 })
      gsap.set('.cta-rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.cta-button', { opacity: 0 })
      gsap.set('.cta-footer', { opacity: 0 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.timeline()
            .to('.cta-word', {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.1,
            })
            .to('.cta-button', { opacity: 1, duration: 0.4, ease: 'power1.out' }, '-=0.3')
            .to('.cta-rule', { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.2')
            .to('.cta-footer', { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.1')
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 py-12 overflow-hidden"
      style={{
        backgroundColor: '#0A0A0A',
        backgroundImage: 'radial-gradient(ellipse at center, rgba(232,220,200,0.04) 0%, #0A0A0A 70%)',
      }}
    >
      <span
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: '#8A8A8A' }}
      >
        What&apos;s next.
      </span>

      <div className="flex-1 flex flex-col items-start justify-center gap-12">
        <h2
          className="leading-[1.0] tracking-tight font-display"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', color: '#F5F0E8' }}
        >
          <span className="block">{splitWords("Ready for growth that", 'cta-word')}</span>
          <span className="block" style={{ color: '#E8DCC8' }}>
            {splitWords("feels inevitable?", 'cta-word')}
          </span>
        </h2>

        <a
          href="mailto:hello@v18.co"
          className="cta-button cta-btn uppercase tracking-[0.2em] inline-block px-10 py-4 border"
          style={{
            fontSize: '0.75rem',
            opacity: 0,
            borderColor: '#E8DCC8',
            backgroundColor: 'transparent',
            color: '#E8DCC8',
          }}
        >
          Start the conversation
        </a>
      </div>

      <div>
        <div
          className="cta-rule w-full h-px mb-6"
          style={{
            backgroundColor: '#E8DCC8',
            opacity: 0.1,
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
        <div className="cta-footer flex justify-between" style={{ opacity: 0 }}>
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: '#8A8A8A' }}
          >
            V18 — 2025
          </span>
          <span
            className="text-xs tracking-[0.2em]"
            style={{ color: '#8A8A8A' }}
          >
            hello@v18.co
          </span>
        </div>
      </div>
    </section>
  )
}
