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
      className="relative min-h-screen flex flex-col justify-between px-[5vw] py-12 bg-ink overflow-hidden"
    >
      {/* Top-left label */}
      <span
        className="font-mono text-muted tracking-[0.2em] uppercase"
        style={{ fontSize: '0.7rem' }}
      >
        What&apos;s next.
      </span>

      {/* Center — headline + button */}
      <div className="flex-1 flex flex-col items-start justify-center gap-12">
        <h2
          className="font-display text-fog leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 8vw)' }}
        >
          <span className="block">{splitWords("Let's build something", 'cta-word')}</span>
          <em className="text-sand not-italic block">
            {splitWords('that lasts.', 'cta-word')}
          </em>
        </h2>

        <a
          href="mailto:hello@v18.co"
          className="cta-button cta-btn font-mono tracking-[0.2em] uppercase border px-10 py-4 inline-block"
          style={{
            fontSize: '0.75rem',
            opacity: 0,
            borderColor: 'var(--sand)',
            color: 'var(--sand)',
          }}
        >
          Start the conversation →
        </a>
      </div>

      {/* Bottom */}
      <div>
        <div
          className="cta-rule w-full h-px mb-6"
          style={{
            backgroundColor: 'var(--fog)',
            opacity: 0.1,
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
        <div className="cta-footer flex justify-between" style={{ opacity: 0 }}>
          <span
            className="font-mono text-muted tracking-[0.2em] uppercase"
            style={{ fontSize: '0.7rem' }}
          >
            V18 — 2025
          </span>
          <span className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>
            hello@v18.co
          </span>
        </div>
      </div>
    </section>
  )
}
