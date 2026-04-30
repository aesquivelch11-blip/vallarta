import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    name: 'Discover',
    description:
      'We audit your current presence, interview your team, and map the gaps. 2 weeks. Zero assumptions.',
  },
  {
    number: '02',
    name: 'Build',
    description:
      'Custom strategy, content calendar, technical fixes. Everything aligned to your growth targets.',
  },
  {
    number: '03',
    name: 'Scale',
    description:
      'Launch, measure, iterate. Monthly reports, weekly syncs. We optimize until the numbers speak.',
  },
]

const indentClasses = [
  'md:ml-[5vw]',
  'md:ml-[20vw]',
  'md:ml-[35vw]',
]

export default function Process() {
  const sectionRef = useRef(null)
  const stepRefs = useRef([])
  const numberRefs = useRef([])
  const textRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepRefs.current.forEach((stepEl, i) => {
        if (!stepEl) return
        const numberEl = numberRefs.current[i]
        const textEl = textRefs.current[i]

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stepEl,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        })

        if (numberEl) {
          tl.fromTo(
            numberEl,
            { x: -60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            0
          )
        }

        if (textEl) {
          tl.fromTo(
            textEl,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            0.15
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-28 md:py-36"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Subtle gradient bleed */}
      <div
        className="pointer-events-none absolute -right-1/4 -top-1/4 h-[80vw] w-[80vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(232,220,200,0.03) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <p
          className="mb-16 md:mb-20 text-sm uppercase tracking-[0.2em]"
          style={{ color: '#8A8A8A' }}
        >
          How We Work
        </p>

        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-[2vw] top-0 h-full w-px md:left-[3vw]"
            style={{ backgroundColor: 'rgba(232,220,200,0.15)' }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => (stepRefs.current[i] = el)}
              className={`relative mb-24 last:mb-0 ${indentClasses[i]}`}
            >
              {/* Timeline dot */}
              <div
                className="absolute -left-[calc(2vw+4px)] top-2 h-2 w-2 rounded-full md:-left-[calc(3vw+4px)]"
                style={{ backgroundColor: 'rgba(232,220,200,0.5)' }}
                aria-hidden="true"
              />

              <div className="flex items-start gap-4 md:gap-8">
                <span
                  ref={(el) => (numberRefs.current[i] = el)}
                  className="shrink-0 font-display leading-none"
                  style={{
                    fontSize: 'clamp(3rem, 10vw, 8vw)',
                    color: 'rgba(232,220,200,0.12)',
                  }}
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                <div ref={(el) => (textRefs.current[i] = el)}>
                  <h3
                    className="mb-3 font-display"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 3vw)', color: '#F5F0E8' }}
                  >
                    {step.name}
                  </h3>

                  <p className="max-w-[400px]" style={{ color: '#8A8A8A' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
