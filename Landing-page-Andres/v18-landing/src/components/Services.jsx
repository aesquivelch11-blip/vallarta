import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const services = [
  {
    num: '01',
    name: 'Sales Team Architecture',
    desc: 'KPI systems, CRM setup, call coaching, script frameworks. Full infrastructure from day one.',
  },
  {
    num: '02',
    name: 'Offer & Pricing Strategy',
    desc: 'Positioning, go-to-market sequencing, financing integration, competitive differentiation.',
  },
  {
    num: '03',
    name: 'Lead Generation',
    desc: 'Setter frameworks, outbound systems, content strategy, VSL scripting.',
  },
]

export default function Services() {
  const [openIndex, setOpenIndex] = useState(0)
  const descRefs = useRef([])
  const isFirstRender = useRef(true)

  useEffect(() => {
    services.forEach((_, i) => {
      const el = descRefs.current[i]
      if (!el) return
      const isOpen = i === openIndex
      if (isFirstRender.current) {
        gsap.set(el, { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 })
      } else {
        gsap.to(el, {
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
          duration: 0.5,
          ease: 'power2.inOut',
        })
      }
    })
    isFirstRender.current = false
  }, [openIndex])

  return (
    <section className="bg-ink px-[5vw] py-[8vw]">
      <p
        className="font-mono text-muted tracking-[0.3em] uppercase mb-12"
        style={{ fontSize: '0.7rem' }}
      >
        What We Do
      </p>

      {services.map((s, i) => (
        <div key={s.num}>
          <div
            className="flex items-baseline gap-[4vw] py-8 cursor-pointer"
            onClick={() => setOpenIndex(i === openIndex ? -1 : i)}
          >
            {/* Ghost number */}
            <span
              className="font-mono flex-shrink-0 select-none"
              style={{
                fontSize: 'clamp(2rem, 8vw, 8vw)',
                lineHeight: 1,
                color: 'var(--fog)',
                opacity: i === openIndex ? 0.15 : 0.08,
                transition: 'opacity 300ms ease',
              }}
            >
              {s.num}
            </span>

            {/* Service name */}
            <span
              className="font-display text-fog flex-1"
              style={{ fontSize: 'clamp(1.25rem, 3.5vw, 3.5vw)', lineHeight: 1.1 }}
            >
              {s.name}
            </span>

            {/* Toggle indicator */}
            <span
              className="font-mono text-muted flex-shrink-0"
              style={{ fontSize: '1.5rem', lineHeight: 1 }}
            >
              {i === openIndex ? '−' : '+'}
            </span>
          </div>

          {/* Collapsible description */}
          <div
            ref={(el) => (descRefs.current[i] = el)}
            style={{ overflow: 'hidden', height: 0, opacity: 0 }}
          >
            <p
              className="font-body text-muted pb-8"
              style={{ fontSize: '0.875rem', maxWidth: '480px', lineHeight: 1.6 }}
            >
              {s.desc}
            </p>
          </div>

          {i < services.length - 1 && (
            <div className="w-full h-px bg-fog opacity-10" />
          )}
        </div>
      ))}
    </section>
  )
}
