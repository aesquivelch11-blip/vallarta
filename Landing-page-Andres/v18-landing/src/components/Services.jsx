import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const services = [
  {
    num: '01',
    name: 'SEO Strategy',
    desc: 'Technical audits, keyword architecture, content optimization, link building. We own the full search funnel — from crawl to conversion.',
  },
  {
    num: '02',
    name: 'Social Media',
    desc: 'Platform-specific content, community management, paid social amplification. Not vanity metrics — content engineered for engagement and leads.',
  },
  {
    num: '03',
    name: 'Content Production',
    desc: 'Video, photography, copywriting, design. Full creative pipeline from concept to publish. Brand stories that actually get shared.',
  },
  {
    num: '04',
    name: 'Performance Marketing',
    desc: 'Google Ads, Meta Ads, retargeting, conversion optimization. Data-driven campaigns with transparent reporting and real ROI.',
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
    <section className="bg-[#0A0A0A] px-6 md:px-12 lg:px-20 py-24 md:py-32">
      <p
        className="text-xs uppercase tracking-[0.2em] mb-14 md:mb-20"
        style={{ color: '#8A8A8A' }}
      >
        What We Do
      </p>

      {services.map((s, i) => (
        <div key={s.num}>
          <div
            className="flex items-baseline gap-[4vw] py-8 cursor-pointer"
            onClick={() => setOpenIndex(i === openIndex ? -1 : i)}
          >
            <span
              className="font-display flex-shrink-0 select-none"
              style={{
                fontSize: 'clamp(2rem, 8vw, 8vw)',
                lineHeight: 1,
                color: '#E8DCC8',
                opacity: i === openIndex ? 0.15 : 0.08,
                transition: 'opacity 300ms ease',
              }}
            >
              {s.num}
            </span>

            <span
              className="flex-1"
              style={{
                fontSize: 'clamp(1.25rem, 3.5vw, 3.5vw)',
                lineHeight: 1.1,
                color: '#F5F0E8',
              }}
            >
              {s.name}
            </span>

            <span
              className="flex-shrink-0"
              style={{ fontSize: '1.5rem', lineHeight: 1, color: '#8A8A8A' }}
            >
              {i === openIndex ? '−' : '+'}
            </span>
          </div>

          <div
            ref={(el) => (descRefs.current[i] = el)}
            style={{ overflow: 'hidden', height: 0, opacity: 0 }}
          >
            <p
              className="pb-8"
              style={{
                fontSize: '0.875rem',
                maxWidth: '480px',
                lineHeight: 1.6,
                color: '#8A8A8A',
              }}
            >
              {s.desc}
            </p>
          </div>

          {i < services.length - 1 && (
            <div className="w-full h-px" style={{ backgroundColor: 'rgba(232,220,200,0.08)' }} />
          )}
        </div>
      ))}
    </section>
  )
}
