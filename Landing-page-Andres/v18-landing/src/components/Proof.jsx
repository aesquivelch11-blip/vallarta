import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const clients = [
  { name: 'Meridian Hotels', size: 'lg' },
  { name: 'Apex Fitness', size: 'sm' },
  { name: 'Lumi\u00E8re Beauty', size: 'md' },
  { name: 'Northpeak Coffee', size: 'sm' },
  { name: 'Veloce Auto', size: 'lg' },
  { name: 'Sonder Living', size: 'md' },
]

const sizeClasses = {
  sm: 'text-sm opacity-[0.3]',
  md: 'text-lg opacity-[0.5]',
  lg: 'text-2xl opacity-[0.7]',
}

export default function Proof() {
  const sectionRef = useRef(null)
  const bigQuoteRef = useRef(null)
  const smallQuoteRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bigQuoteRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(
        smallQuoteRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-28 md:py-36" style={{ backgroundColor: '#2A2A2A' }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Client strip */}
        <div className="mb-24 md:mb-32">
          <p className="mb-8 text-[11px] uppercase tracking-[0.2em]" style={{ color: '#8A8A8A' }}>
            Trusted By
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {clients.map((client) => (
              <span
                key={client.name}
                className={`font-display font-light ${sizeClasses[client.size]}`}
                style={{ color: '#E8DCC8' }}
              >
                {client.name}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials — asymmetric */}
        <div className="relative flex flex-col gap-16 md:flex-row md:gap-12">
          <div
            ref={bigQuoteRef}
            className="flex-1 md:pr-12"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            <blockquote className="font-display leading-[1.3] italic" style={{ color: '#F5F0E8', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              <span
                className="inline-block align-top mr-3"
                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', lineHeight: 0.8, fontStyle: 'normal', color: '#E8DCC8' }}
              >
                340%
              </span>
              <span className="inline-block max-w-lg align-baseline">
                revenue from search in 8 months. V18 didn't just run our SEO — they rebuilt how we think about organic growth entirely.
              </span>
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-8" style={{ backgroundColor: '#8A8A8A' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#8A8A8A' }}>Sarah Chen</p>
                <p className="text-xs" style={{ color: 'rgba(138,138,138,0.7)' }}>CMO, Meridian Hotels</p>
              </div>
            </div>
          </div>

          <div
            ref={smallQuoteRef}
            className="flex-1 md:mt-24 md:max-w-sm"
            style={{ opacity: 0 }}
          >
            <blockquote className="font-display leading-relaxed italic text-lg md:text-xl" style={{ color: 'rgba(245,240,232,0.8)' }}>
              "Finally, an agency that treats our brand like their own. The social content is indistinguishable from in-house."
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-6" style={{ backgroundColor: 'rgba(138,138,138,0.6)' }} />
              <div>
                <p className="text-xs font-medium" style={{ color: '#8A8A8A' }}>Marcus Rivera</p>
                <p className="text-[11px]" style={{ color: 'rgba(138,138,138,0.6)' }}>Founder, Apex Fitness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
