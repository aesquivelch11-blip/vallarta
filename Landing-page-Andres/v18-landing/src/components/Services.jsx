import { useRef } from 'react'
import { useLedgerReveal } from '../hooks/useLedgerReveal'

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
  const sectionRef = useRef(null)

  useLedgerReveal(sectionRef, { stagger: 0.2, duration: 0.8, start: 'top 80%' })

  return (
    <section ref={sectionRef} className="bg-ink px-[5vw] py-[8vw]">
      <p
        data-ledger
        className="font-mono text-muted tracking-[0.3em] uppercase mb-12"
        style={{ fontSize: '0.7rem' }}
      >
        What We Do
      </p>

      {services.map((s, i) => (
        <div key={s.num}>
          <div
            data-ledger
            className="group flex items-baseline gap-[4vw] py-8 cursor-default"
          >
            <span
              className="font-mono text-muted flex-shrink-0 select-none"
              style={{ fontSize: 'clamp(1.5rem, 6vw, 6vw)', lineHeight: 1 }}
            >
              {s.num}
            </span>

            <span
              className="font-display text-fog flex-1 relative"
              style={{ fontSize: 'clamp(1.25rem, 3vw, 3vw)', lineHeight: 1.1 }}
            >
              {s.name}
              <span
                className="absolute bottom-0 left-0 h-px bg-sand"
                style={{ width: '0%', transition: 'width 0.4s ease-out' }}
                ref={(el) => {
                  if (!el) return
                  const row = el.closest('[data-ledger]')
                  if (!row) return
                  row.addEventListener('mouseenter', () => { el.style.width = '100%' })
                  row.addEventListener('mouseleave', () => { el.style.width = '0%' })
                }}
              />
            </span>

            <span
              className="font-body text-muted text-right hidden md:block flex-shrink-0"
              style={{ fontSize: '0.875rem', maxWidth: '280px', lineHeight: 1.6 }}
            >
              {s.desc}
            </span>
          </div>

          {i < services.length - 1 && (
            <div className="w-full h-px bg-fog opacity-10" />
          )}
        </div>
      ))}
    </section>
  )
}
