import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const entries = [
  { num: '01', statement: 'Revenue growing.', symbol: '✓', positive: true },
  { num: '02', statement: 'Leads coming in.', symbol: '✓', positive: true },
  { num: '03', statement: 'Sales infrastructure.', symbol: '✗', positive: false },
]

export default function Problem() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const triggers = []

    const panels = sectionRef.current.querySelectorAll('.problem-panel')
    panels.forEach((panel) => {
      const statement = panel.querySelector('.problem-statement')
      const ghost = panel.querySelector('.problem-ghost')

      gsap.set(statement, { y: 60, opacity: 0 })
      gsap.set(ghost, { opacity: 0, scale: 1.05 })

      const trigger = ScrollTrigger.create({
        trigger: panel,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(statement, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' })
          gsap.to(ghost, { opacity: 0.04, scale: 1, duration: 1.2, ease: 'power3.out' })
        },
      })
      triggers.push(trigger)
    })

    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <section ref={sectionRef}>
      {entries.map((entry) => (
        <div
          key={entry.num}
          className="problem-panel relative flex items-center px-[5vw] overflow-hidden bg-ink"
          style={{ height: '100vh' }}
        >
          {/* Entry number label */}
          <span
            className="absolute top-8 left-[5vw] font-mono text-muted tracking-[0.3em] uppercase"
            style={{ fontSize: '0.7rem' }}
          >
            {entry.num}
          </span>

          {/* Ghost symbol — bleeds off right edge */}
          <span
            className="problem-ghost absolute font-display select-none"
            style={{
              fontSize: 'clamp(8rem, 40vw, 40vw)',
              color: 'var(--fog)',
              opacity: 0,
              lineHeight: 1,
              right: '-5vw',
              top: '50%',
              transform: 'translateY(-50%) scale(1.05)',
            }}
          >
            {entry.symbol}
          </span>

          {/* Statement */}
          <p
            className="problem-statement font-display"
            style={{
              fontSize: 'clamp(2.5rem, 18vw, 18vw)',
              lineHeight: 1,
              color: entry.positive ? 'var(--fog)' : 'var(--sand)',
            }}
          >
            {entry.statement}
          </p>
        </div>
      ))}

      {/* Closing copy */}
      <div className="bg-ink px-[5vw] py-16">
        <p
          className="font-body"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', color: 'var(--sand)' }}
        >
          V18 embeds as your complete sales leadership — strategy, team, infrastructure.
        </p>
      </div>
    </section>
  )
}
