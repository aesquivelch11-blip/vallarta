# V18 Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the V18 landing page from generic dark-editorial to Awwwards-caliber luxury editorial through atmospheric hero, full-viewport problem panels, accordion services, and a new CTA section.

**Architecture:** Each section is a self-contained React component managing its own GSAP animations. A shared `splitWords` utility handles word-split animation markup used by Entrance and CTA. No new dependencies — GSAP, Lenis, and Tailwind already installed.

**Tech Stack:** React 19, Vite, GSAP 3 + ScrollTrigger, Lenis, Tailwind CSS 3, IBM Plex Mono / Canela / DM Sans (loaded via @font-face)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/index.css` | Modify | Grain overlay, CTA hover CSS, new CSS tokens |
| `src/utils/splitWords.jsx` | Create | Word-split markup for GSAP cascade animations |
| `src/components/Entrance.jsx` | Rewrite | Atmospheric bg, 13vw headline, word-split GSAP, video slot |
| `src/components/Problem.jsx` | Rewrite | Full-viewport panels, ghost symbols, per-panel ScrollTrigger |
| `src/components/Services.jsx` | Rewrite | Click accordion, GSAP height tween, ghost numbers |
| `src/components/Partners.jsx` | Minor edit | Sand tint gradient, name scale 6vw→7vw |
| `src/components/CTA.jsx` | Create | Full-viewport closing section, word-split headline, bordered button |
| `src/App.jsx` | Modify | Import and render `<CTA />` |
| `public/ref.mp4` | Delete | Temp reference file |
| `public/ref.html` | Delete | Temp reference file |

---

## Task 1: CSS Foundation — Grain Overlay + Tokens

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace `src/index.css` content**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --ink: #0E1E2F;
    --sand: #C9B99A;
    --fog: #F2EFE9;
    --muted: #6B7B8A;
    --grain-opacity: 0.04;
    --grain-size: 180px;
  }

  html {
    overflow-x: hidden;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background-color: var(--ink);
    color: var(--fog);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    opacity: var(--grain-opacity);
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: var(--grain-size) var(--grain-size);
  }

  [data-ledger] {
    clip-path: inset(0 100% 0 0);
  }

  .cta-btn {
    transition: background-color 200ms ease, color 200ms ease;
  }

  .cta-btn:hover {
    background-color: var(--sand);
    color: var(--ink);
  }
}
```

- [ ] **Step 2: Verify grain in browser preview**

Open `http://localhost:5175`. A subtle noise texture should be visible over the dark background — very faint. If it looks like static, reduce `--grain-opacity` to `0.03`.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add grain overlay and CSS tokens"
```

---

## Task 2: Create `splitWords` Utility

**Files:**
- Create: `src/utils/splitWords.jsx`

- [ ] **Step 1: Create the utility**

```jsx
/**
 * Splits text into word spans for GSAP cascade animation.
 * Outer span: overflow:hidden clip box. Inner span: animated target.
 * Target inner spans in GSAP via the className prop.
 */
export function splitWords(text, className = 'word-inner') {
  const words = text.split(' ')
  return words.map((word, i) => (
    <span
      key={i}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        marginRight: i < words.length - 1 ? '0.28em' : 0,
      }}
    >
      <span className={className} style={{ display: 'inline-block' }}>
        {word}
      </span>
    </span>
  ))
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/splitWords.jsx
git commit -m "feat: add splitWords utility for GSAP word-cascade animations"
```

---

## Task 3: Rebuild Entrance — Atmospheric Hero

**Files:**
- Rewrite: `src/components/Entrance.jsx`

- [ ] **Step 1: Rewrite `src/components/Entrance.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { splitWords } from '../utils/splitWords'

export default function Entrance() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.ent-rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.ent-wordmark', { opacity: 0 })
      gsap.set('.word-inner', { y: -40, opacity: 0 })
      gsap.set('.ent-descriptor', { opacity: 0 })
      gsap.set('.ent-scroll', { opacity: 0 })

      gsap.timeline({ delay: 0.2 })
        .to('.ent-rule', { scaleX: 1, duration: 0.5, ease: 'power2.inOut' })
        .to('.ent-wordmark', { opacity: 1, duration: 0.3, ease: 'power1.out' }, '+=0.2')
        .to('.word-inner', {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
        }, '-=0.1')
        .to('.ent-descriptor', { opacity: 1, duration: 0.4, ease: 'power1.out' }, '+=0.3')
        .to('.ent-scroll', { opacity: 1, duration: 0.4, ease: 'power1.out' }, '-=0.2')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between px-[5vw] py-12 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 40% 50%, #0E1E2F 0%, #060f1a 100%)',
      }}
    >
      {/* Top strip */}
      <div className="relative">
        <div
          className="ent-rule w-full h-px bg-sand mb-8"
          style={{ transformOrigin: 'left center', transform: 'scaleX(0)' }}
        />
        <span
          className="ent-wordmark font-mono text-muted tracking-[0.3em] uppercase"
          style={{ fontSize: 'clamp(0.75rem, 3vw, 1.5rem)', opacity: 0 }}
        >
          V18
        </span>
      </div>

      {/* Center — headline */}
      <div className="flex-1 flex items-center">
        <h1
          className="font-display text-fog leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(3rem, 13vw, 13vw)' }}
        >
          <span className="block">{splitWords('Built-in sales leadership for')}</span>
          <em className="text-sand not-italic block">
            {splitWords("companies that don't compromise.")}
          </em>
        </h1>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between">
        <span
          className="ent-descriptor font-mono text-muted tracking-[0.2em] uppercase"
          style={{ fontSize: '0.7rem', opacity: 0 }}
        >
          Sales Leadership / 2025
        </span>
        <span
          className="ent-scroll font-mono text-muted tracking-[0.25em] uppercase flex items-center gap-3"
          style={{ fontSize: '0.7rem', opacity: 0 }}
        >
          Scroll
          <span className="block w-8 h-px bg-muted" />
        </span>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser preview**

Expected:
- Dark radial gradient background (deep ink center, near-black edges)
- Rule animates left→right
- `V18` wordmark fades in
- Headline words cascade one-by-one from above (y: -40 → 0)
- "companies that don't compromise." in `--sand` italic
- Headline noticeably larger than before (~13vw)
- Bottom labels fade in last
- Grain texture visible over background

- [ ] **Step 3: Commit**

```bash
git add src/components/Entrance.jsx
git commit -m "feat: Entrance — atmospheric bg, 13vw word-split headline"
```

---

## Task 4: Rebuild Problem — Full-Viewport Panels

**Files:**
- Rewrite: `src/components/Problem.jsx`

- [ ] **Step 1: Rewrite `src/components/Problem.jsx`**

```jsx
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
```

- [ ] **Step 2: Verify in browser preview**

Scroll through Problem section. Expected:
- Three full-viewport panels, each 100vh
- Statement text at massive scale (~18vw)
- Ghost ✓/✗ fades in at very low opacity, bleeds off right edge
- `01 / 02 / 03` labels top-left of each panel
- Third entry ("Sales infrastructure.") in `--sand`
- Closing copy in `--sand` after third panel

- [ ] **Step 3: Commit**

```bash
git add src/components/Problem.jsx
git commit -m "feat: Problem — full-viewport panels with ghost symbols"
```

---

## Task 5: Rebuild Services — Accordion

**Files:**
- Rewrite: `src/components/Services.jsx`

- [ ] **Step 1: Rewrite `src/components/Services.jsx`**

```jsx
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
```

- [ ] **Step 2: Verify in browser preview**

Expected:
- First row open by default, description visible
- Ghost numbers at `0.08` opacity, open row at `0.15`
- Click a row → it opens, previous closes (smooth GSAP height tween)
- Click open row → closes (`openIndex` becomes `-1`)
- `+` / `−` toggles correctly

- [ ] **Step 3: Commit**

```bash
git add src/components/Services.jsx
git commit -m "feat: Services — accordion with GSAP height tween and ghost numbers"
```

---

## Task 6: Partners — Minor Tweaks

**Files:**
- Modify: `src/components/Partners.jsx`

- [ ] **Step 1: Update gradient overlay — add sand tint**

In `src/components/Partners.jsx`, find the gradient string and replace:

```jsx
// Before:
background: 'linear-gradient(to top, rgba(14,30,47,0.95) 0%, rgba(14,30,47,0.4) 40%, transparent 70%)',

// After:
background: 'linear-gradient(to top, rgba(14,30,47,0.95) 0%, rgba(201,185,154,0.08) 5%, rgba(14,30,47,0.4) 40%, transparent 70%)',
```

- [ ] **Step 2: Update partner name scale**

Find the partner name font size and replace:

```jsx
// Before:
style={{ fontSize: 'clamp(2rem, 6vw, 6vw)', lineHeight: 1 }}

// After:
style={{ fontSize: 'clamp(2rem, 7vw, 7vw)', lineHeight: 1 }}
```

- [ ] **Step 3: Verify in browser preview**

Expected:
- Subtle warm sand tint at bottom of portrait gradient
- Partner names noticeably larger

- [ ] **Step 4: Commit**

```bash
git add src/components/Partners.jsx
git commit -m "feat: Partners — sand tint gradient, scale name to 7vw"
```

---

## Task 7: Create CTA Component

**Files:**
- Create: `src/components/CTA.jsx`

- [ ] **Step 1: Create `src/components/CTA.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords } from '../utils/splitWords'

export default function CTA() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.cta-word', { y: -40, opacity: 0 })
      gsap.set('.cta-rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.cta-button', { opacity: 0 })
      gsap.set('.cta-footer', { opacity: 0 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.timeline()
            .to('.cta-word', {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.1,
            })
            .to('.cta-button', { opacity: 1, duration: 0.4, ease: 'power1.out' }, '-=0.3')
            .to('.cta-rule', { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.2')
            .to('.cta-footer', { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.1')
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between px-[5vw] py-12 bg-ink overflow-hidden"
    >
      {/* Top-left label */}
      <span
        className="font-mono text-muted tracking-[0.2em] uppercase"
        style={{ fontSize: '0.7rem' }}
      >
        What&apos;s next.
      </span>

      {/* Center — headline + button */}
      <div className="flex-1 flex flex-col items-start justify-center gap-12">
        <h2
          className="font-display text-fog leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 8vw)' }}
        >
          <span className="block">{splitWords("Let's build something", 'cta-word')}</span>
          <em className="text-sand not-italic block">
            {splitWords('that lasts.', 'cta-word')}
          </em>
        </h2>

        <a
          href="mailto:hello@v18.co"
          className="cta-button cta-btn font-mono tracking-[0.2em] uppercase border px-10 py-4 inline-block"
          style={{
            fontSize: '0.75rem',
            opacity: 0,
            borderColor: 'var(--sand)',
            color: 'var(--sand)',
          }}
        >
          Start the conversation →
        </a>
      </div>

      {/* Bottom */}
      <div>
        <div
          className="cta-rule w-full h-px mb-6"
          style={{
            backgroundColor: 'var(--fog)',
            opacity: 0.1,
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
        <div className="cta-footer flex justify-between" style={{ opacity: 0 }}>
          <span
            className="font-mono text-muted tracking-[0.2em] uppercase"
            style={{ fontSize: '0.7rem' }}
          >
            V18 — 2025
          </span>
          <span className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>
            hello@v18.co
          </span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify isolated — no console errors**

CTA not yet in App. Check browser console is clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/CTA.jsx
git commit -m "feat: CTA — full-viewport closing section with word-split headline"
```

---

## Task 8: Wire CTA into App

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Update `src/App.jsx`**

```jsx
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Entrance from './components/Entrance'
import Problem from './components/Problem'
import Services from './components/Services'
import Partners from './components/Partners'
import CTA from './components/CTA'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => { lenis.destroy() }
  }, [])

  return (
    <main>
      <Entrance />
      <Problem />
      <Services />
      <Partners />
      <CTA />
    </main>
  )
}
```

- [ ] **Step 2: Full end-to-end browser verification**

Scroll through entire page. Check all of:
- [ ] Entrance: atmospheric bg, large word-split headline, bottom descriptor visible
- [ ] Problem: 3 full-viewport panels, ghost symbols bleeding right, massive statement text
- [ ] Services: accordion opens/closes on click, ghost numbers, first row open on load
- [ ] Partners: warm sand tint at bottom gradient, names at 7vw
- [ ] CTA: word-split headline reveals on scroll, bordered button, bottom rule + footer
- [ ] Grain texture visible throughout all sections
- [ ] No console errors
- [ ] Lenis smooth scroll intact

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire CTA into App — full redesign complete"
```

---

## Task 9: Cleanup Temp Files

**Files:**
- Delete: `public/ref.mp4`
- Delete: `public/ref.html`

- [ ] **Step 1: Remove temp reference files**

```bash
rm public/ref.mp4 public/ref.html
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove temp reference files from public"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|-----------------|------|
| Grain overlay `body::after` | Task 1 |
| Entrance 13vw word-split headline | Task 3 |
| Entrance atmospheric radial gradient bg | Task 3 |
| Entrance video slot ready | Task 3 — swap `background` style to `<video>` when `public/hero.mp4` exists |
| Problem full-viewport panels | Task 4 |
| Problem ghost symbols 40vw bleeding right | Task 4 |
| Problem statement 18vw | Task 4 |
| Problem negative entry in `--sand` | Task 4 |
| Services accordion click | Task 5 |
| Services GSAP height tween | Task 5 |
| Services ghost numbers | Task 5 |
| Partners sand tint | Task 6 |
| Partners name 7vw | Task 6 |
| CTA full-viewport | Task 7 |
| CTA word-split headline | Task 7 |
| CTA bordered button with hover | Task 7 + CSS in Task 1 |
| CTA bottom rule animation | Task 7 |
| App wired | Task 8 |
