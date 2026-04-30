import { useRef } from 'react'
import { useLedgerReveal } from '../hooks/useLedgerReveal'

const differentiators = [
  {
    title: 'Deep-dive SEO',
    body: 'Technical audits, content strategy, link building. We own the full funnel.',
  },
  {
    title: 'Social that converts',
    body: 'Not vanity metrics. Content engineered for engagement and leads.',
  },
  {
    title: 'Embedded partnership',
    body: 'We join your team. Weekly syncs, shared dashboards, zero handoffs.',
  },
]

export default function About() {
  const sectionRef = useRef(null)
  useLedgerReveal(sectionRef, { stagger: 0.15, duration: 0.85 })

  return (
    <section
      ref={sectionRef}
      className="bg-[#0A0A0A] px-6 md:px-12 lg:px-20 py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Section label */}
      <span
        data-ledger
        className="block text-[#8A8A8A] uppercase tracking-[0.2em] text-xs mb-8 md:mb-12"
        style={{ clipPath: 'inset(0 100% 0 0)' }}
      >
        Why V18
      </span>

      {/* Editorial headline */}
      <h2
        data-ledger
        className="font-display leading-[0.95] tracking-tight mb-16 md:mb-20 lg:mb-24"
        style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', clipPath: 'inset(0 100% 0 0)' }}
      >
        <span className="text-[#F5F0E8]">Not another agency.</span>
        <br />
        <span className="text-[#E8DCC8]">Your growth partner.</span>
      </h2>

      {/* Full-width champagne rule */}
      <div
        data-ledger
        className="w-full mb-20 md:mb-28 lg:mb-36"
        style={{ clipPath: 'inset(0 100% 0 0)' }}
      >
        <hr className="border-t border-[#E8DCC8]/20" />
      </div>

      {/* Asymmetric differentiators */}
      <div className="space-y-20 md:space-y-28 lg:space-y-36">
        {/* Item 01 — left-aligned, large text, no card */}
        <div data-ledger className="group" style={{ clipPath: 'inset(0 100% 0 0)' }}>
          <span className="block text-[#8A8A8A] text-xs tracking-[0.15em] uppercase mb-4">
            01
          </span>
          <h3
            className="text-[#E8DCC8] tracking-tight mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
          >
            {differentiators[0].title}
          </h3>
          <p
            className="text-[#8A8A8A] leading-relaxed max-w-xl"
            style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}
          >
            {differentiators[0].body}
          </p>
        </div>

        {/* Item 02 — indented with graphite background block */}
        <div data-ledger className="group" style={{ clipPath: 'inset(0 100% 0 0)' }}>
          <div className="ml-[10vw] relative">
            {/* Subtle graphite background block */}
            <div
              className="absolute -inset-4 md:-inset-6 bg-[#2A2A2A]/40 -z-10"
              aria-hidden="true"
            />
            <span className="block text-[#8A8A8A] text-xs tracking-[0.15em] uppercase mb-4">
              02
            </span>
            <h3
              className="text-[#E8DCC8] tracking-tight mb-3"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
            >
              {differentiators[1].title}
            </h3>
            <p
              className="text-[#8A8A8A] leading-relaxed max-w-xl"
              style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}
            >
              {differentiators[1].body}
            </p>
          </div>
        </div>

        {/* Item 03 — right-aligned with floating number behind */}
        <div data-ledger className="group relative" style={{ clipPath: 'inset(0 100% 0 0)' }}>
          {/* Floating "03" behind content */}
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[#E8DCC8]/[0.06] select-none pointer-events-none -z-10"
            style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}
            aria-hidden="true"
          >
            03
          </span>
          <div className="text-right">
            <span className="block text-[#8A8A8A] text-xs tracking-[0.15em] uppercase mb-4">
              03
            </span>
            <h3
              className="text-[#E8DCC8] tracking-tight mb-3"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
            >
              {differentiators[2].title}
            </h3>
            <p
              className="text-[#8A8A8A] leading-relaxed max-w-xl ml-auto"
              style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}
            >
              {differentiators[2].body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
