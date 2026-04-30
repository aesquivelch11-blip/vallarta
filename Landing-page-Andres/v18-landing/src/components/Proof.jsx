import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const clients = [
  { name: 'Meridian Hotels', size: 'lg' },
  { name: 'Apex Fitness', size: 'sm' },
  { name: 'Lumière Beauty', size: 'md' },
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
    <section ref={sectionRef} className="bg-[#2A2A2A] py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Client strip — left-aligned, asymmetric rhythm */}
        <div className="mb-28">
          <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#8A8A8A]">
            Trusted By
          </p>
          <div className="flex flex-wrap items-center">
            {clients.map((client, i) => (
              <>
                <span
                  key={client.name}
                  className={`font-display font-light text-[#E8DCC8] ${sizeClasses[client.size]}`}
                >
                  {client.name}
                </span>
                {i < clients.length - 1 && (
                  <span
                    className="mx-6 h-8 w-px bg-[#E8DCC8]/15"
                    aria-hidden="true"
                  />
                )}
              </>
            ))}
          </div>
        </div>

        {/* Testimonials — asymmetric editorial spread */}
        <div className="relative flex flex-col gap-16 md:flex-row md:gap-12">
          {/* Dominant left quote */}
          <div
            ref={bigQuoteRef}
            className="flex-1 md:pr-12"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            <blockquote className="font-display text-3xl leading-[1.3] italic text-[#F5F0E8] md:text-4xl lg:text-5xl">
              <span className="text-[#E8DCC8]" style={{ fontSize: 'clamp(4rem, 15vw, 12rem)', lineHeight: 0.8, fontStyle: 'normal' }}>
                340%
              </span>
              <span className="ml-4">
                revenue from search in 8 months. V18 didn't just run our SEO — they rebuilt how we think about organic growth entirely.
              </span>
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-8 bg-[#8A8A8A]" />
              <div>
                <p className="text-sm font-medium text-[#8A8A8A]">Sarah Chen</p>
                <p className="text-xs text-[#8A8A8A]/70">CMO, Meridian Hotels</p>
              </div>
            </div>
          </div>

          {/* Secondary right pull-quote — offset vertically */}
          <div
            ref={smallQuoteRef}
            className="flex-1 md:mt-24 md:max-w-sm"
            style={{ opacity: 0 }}
          >
            <blockquote className="font-display text-lg leading-relaxed italic text-[#F5F0E8]/80">
              "Finally, an agency that treats our brand like their own. The social content is indistinguishable from in-house."
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-6 bg-[#8A8A8A]/60" />
              <div>
                <p className="text-xs font-medium text-[#8A8A8A]">Marcus Rivera</p>
                <p className="text-[11px] text-[#8A8A8A]/60">Founder, Apex Fitness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
