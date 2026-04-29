import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Entrance() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.ent-rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.ent-wordmark', { opacity: 0 })
      gsap.set('.ent-headline', { y: -80, opacity: 0 })
      gsap.set('.ent-scroll', { opacity: 0 })

      gsap.timeline({ delay: 0.2 })
        .to('.ent-rule', {
          scaleX: 1,
          duration: 0.5,
          ease: 'power2.inOut',
        })
        .to('.ent-wordmark', {
          opacity: 1,
          duration: 0.3,
          ease: 'power1.out',
        }, '+=0.3')
        .to('.ent-headline', {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
        }, '-=0.1')
        .to('.ent-scroll', {
          opacity: 1,
          duration: 0.4,
          ease: 'power1.out',
        }, '+=0.4')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between px-[5vw] py-12 bg-ink overflow-hidden"
    >
      <div className="relative">
        <div
          className="ent-rule w-full h-px bg-sand mb-8"
          style={{ transformOrigin: 'left center' }}
        />
        <span className="ent-wordmark font-mono text-muted tracking-[0.3em] uppercase"
          style={{ fontSize: 'clamp(0.75rem, 3vw, 1.5rem)' }}>
          V18
        </span>
      </div>

      <div className="flex-1 flex items-center">
        <h1
          className="ent-headline font-display text-fog leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 9vw)' }}
        >
          Built-in sales<br />leadership for<br />
          <em className="text-sand not-italic">
            companies that<br />don&apos;t compromise.
          </em>
        </h1>
      </div>

      <div className="ent-scroll flex justify-end">
        <span className="font-mono text-muted tracking-[0.25em] uppercase flex items-center gap-3"
          style={{ fontSize: '0.7rem' }}>
          Scroll
          <span className="block w-8 h-px bg-muted" />
        </span>
      </div>
    </section>
  )
}
