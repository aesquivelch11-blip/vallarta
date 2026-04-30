import { useRef } from 'react'
import { useLedgerReveal } from '../hooks/useLedgerReveal'

const partners = [
  {
    name: 'Partner Name',
    title: 'Co-Founder & Sales Director',
    credentials: '10+ years closing high-ticket B2B',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Partner Name',
    title: 'Co-Founder & Strategy Lead',
    credentials: 'Former VP Sales, 3 exits',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function Partners() {
  const sectionRef = useRef(null)

  useLedgerReveal(sectionRef, { stagger: 0, duration: 1.0, start: 'top 90%' })

  return (
    <section ref={sectionRef} className="bg-ink">
      <div className="px-[5vw] pt-[8vw] pb-8">
        <p
          data-ledger
          className="font-mono text-muted tracking-[0.3em] uppercase"
          style={{ fontSize: '0.7rem' }}
        >
          The Partners
        </p>
      </div>

      {partners.map((partner, i) => (
        <div
          key={i}
          data-ledger
          className="relative w-full overflow-hidden"
          style={{ height: '100vh' }}
        >
          <img
            src={partner.image}
            alt={partner.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />

          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(14,30,47,0.95) 0%, rgba(201,185,154,0.08) 5%, rgba(14,30,47,0.4) 40%, transparent 70%)',
            }}
          />

          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-[5vw] pb-12">
            <div>
              <p
                className="font-display text-fog"
                style={{ fontSize: 'clamp(2rem, 7vw, 7vw)', lineHeight: 1 }}
              >
                {partner.name}
              </p>
              <p
                className="font-body text-sand mt-2"
                style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
              >
                {partner.title}
              </p>
            </div>
            <p
              className="font-mono text-muted text-right"
              style={{ fontSize: '0.75rem', maxWidth: '200px', lineHeight: 1.6 }}
            >
              {partner.credentials}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}
