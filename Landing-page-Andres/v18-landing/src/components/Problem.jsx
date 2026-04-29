import { useRef } from 'react'
import { useLedgerReveal } from '../hooks/useLedgerReveal'

const entries = [
  { statement: 'Revenue growing.', symbol: '✓', positive: true },
  { statement: 'Leads coming in.', symbol: '✓', positive: true },
  { statement: 'Sales infrastructure.', symbol: '✗', positive: false },
]

export default function Problem() {
  const sectionRef = useRef(null)

  useLedgerReveal(sectionRef, { stagger: 0.18, duration: 0.85, start: 'top 80%' })

  return (
    <section ref={sectionRef} className="bg-ink px-[5vw] py-[10vw]">
      {entries.map((entry, i) => (
        <div key={i}>
          <div
            data-ledger
            className="flex items-baseline justify-between py-8"
          >
            <span
              className="font-display text-fog"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 4vw)' }}
            >
              {entry.statement}
            </span>
            <span
              className="font-display ml-8 flex-shrink-0"
              style={{
                fontSize: 'clamp(2rem, 5vw, 5vw)',
                color: entry.positive ? 'var(--sand)' : 'var(--muted)',
              }}
            >
              {entry.symbol}
            </span>
          </div>
          {i < entries.length - 1 && (
            <div className="w-full h-px bg-fog opacity-10" />
          )}
        </div>
      ))}

      <p
        data-ledger
        className="font-body text-muted mt-12"
        style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
      >
        V18 embeds as your complete sales leadership — strategy, team, infrastructure.
      </p>
    </section>
  )
}
