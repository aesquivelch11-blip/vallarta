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
        background: 'radial-gradient(ellipse at 40% 50%, #0E1E2F 0%, #060f1a 100%)',
      }}
    >
      {/* Top strip */}
      <div className="relative">
        <div
          className="ent-rule w-full h-px bg-sand mb-8"
          style={{ transformOrigin: 'left center', transform: 'scaleX(0)' }}
        />
        <span
          className="ent-wordmark font-mono text-muted tracking-[0.3em] uppercase"
          style={{ fontSize: 'clamp(0.75rem, 3vw, 1.5rem)', opacity: 0 }}
        >
          V18
        </span>
      </div>

      {/* Center — headline */}
      <div className="flex-1 flex items-center">
        <h1
          className="font-display text-fog leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(3rem, 13vw, 13vw)' }}
        >
          <span className="block">{splitWords('Built-in sales leadership for')}</span>
          <em className="text-sand not-italic block">
            {splitWords("companies that don't compromise.")}
          </em>
        </h1>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between">
        <span
          className="ent-descriptor font-mono text-muted tracking-[0.2em] uppercase"
          style={{ fontSize: '0.7rem', opacity: 0 }}
        >
          Sales Leadership / 2025
        </span>
        <span
          className="ent-scroll font-mono text-muted tracking-[0.25em] uppercase flex items-center gap-3"
          style={{ fontSize: '0.7rem', opacity: 0 }}
        >
          Scroll
          <span className="block w-8 h-px bg-muted" />
        </span>
      </div>
    </section>
  )
}
