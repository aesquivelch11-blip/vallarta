import { useRef } from 'react'
import { useLedgerReveal } from '../hooks/useLedgerReveal'

const differentiators = [
  {
    num: '01',
    title: 'Deep-dive SEO',
    body: 'Technical audits, content strategy, link building. We own the full funnel.',
  },
  {
    num: '02',
    title: 'Social that converts',
    body: 'Not vanity metrics. Content engineered for engagement and leads.',
  },
  {
    num: '03',
    title: 'Embedded partnership',
    body: 'We join your team. Weekly syncs, shared dashboards, zero handoffs.',
  },
]

export default function About() {
  const sectionRef = useRef(null)
  useLedgerReveal(sectionRef, { stagger: 0.12, duration: 0.85 })

  return (
    <section
      ref={sectionRef}
      className="bg-[#0A0A0A] px-6 md:px-12 lg:px-20 py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Section label */}
      <span
        data-ledger
        className="block text-xs uppercase tracking-[0.2em] mb-10 md:mb-14"
        style={{ color: '#8A8A8A', clipPath: 'inset(0 100% 0 0)' }}
      >
        Why V18
      </span>

      {/* Editorial headline */}
      <h2
        data-ledger
        className="font-display leading-[0.95] tracking-tight mb-16 md:mb-24 lg:mb-32"
        style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', clipPath: 'inset(0 100% 0 0)' }}
      >
        <span style={{ color: '#F5F0E8' }}>Not another agency.</span>
        <br />
        <span style={{ color: '#E8DCC8' }}>Your growth partner.</span>
      </h2>

      {/* Full-width rule */}
      <div
        data-ledger
        className="w-full mb-20 md:mb-28"
        style={{ clipPath: 'inset(0 100% 0 0)' }}
      >
        <div className="w-full h-px" style={{ backgroundColor: 'rgba(232,220,200,0.15)' }} />
      </div>

      {/* Asymmetric differentiators */}
      <div className="space-y-20 md:space-y-28 lg:space-y-36">
        {differentiators.map((item, i) => (
          <div
            key={item.num}
            data-ledger
            className="group relative"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            {i === 1 && (
              <div
                className="absolute -inset-4 md:-inset-6 -z-10"
                style={{ backgroundColor: 'rgba(42,42,42,0.35)' }}
              />
            )}

            {i === 2 && (
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 font-display select-none pointer-events-none -z-10"
                style={{
                  fontSize: 'clamp(8rem, 20vw, 16rem)',
                  lineHeight: 1,
                  color: 'rgba(232,220,200,0.05)',
                }}
                aria-hidden="true"
              >
                {item.num}
              </span>
            )}

            <div className={i === 2 ? 'text-right' : i === 1 ? 'ml-[10vw]' : ''}>
              <span className="block text-xs uppercase tracking-[0.15em] mb-4" style={{ color: '#8A8A8A' }}>
                {item.num}
              </span>
              <h3
                className="tracking-tight mb-3"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#E8DCC8' }}
              >
                {item.title}
              </h3>
              <p
                className="leading-relaxed max-w-xl"
                style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)', color: '#8A8A8A' }}
              >
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
