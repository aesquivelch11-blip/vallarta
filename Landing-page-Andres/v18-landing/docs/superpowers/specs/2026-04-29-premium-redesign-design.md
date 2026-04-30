# V18 Premium Redesign — Design Spec

**Date:** 2026-04-29
**Aesthetic:** Luxury Editorial — Cinematic Descent
**DFII:** 13
**Stack:** React + Vite + GSAP + Lenis + Tailwind

---

## Design System

### Fonts (unchanged — already loaded)
- **Display:** Canela — pushed to extreme scale on hero and Problem panels
- **Body:** DM Sans — tight line-height, secondary content
- **Mono:** IBM Plex Mono — labels only, `tracking-[0.3em]` uppercase

### Color Palette (unchanged)
```css
--ink: #0E1E2F    /* dominant background */
--sand: #C9B99A   /* sole accent */
--fog: #F2EFE9    /* primary text */
--muted: #6B7B8A  /* secondary text / labels */
```

### New Tokens
```css
--grain-opacity: 0.04
--grain-size: 180px
```

### Grain Overlay
Full-page `body::after` pseudo-element — SVG `feTurbulence` noise filter, `mix-blend-mode: overlay`, `pointer-events: none`, `position: fixed`, covers entire viewport at all times.

### Motion Philosophy
Two tempos only:
- **Cinematic (slow):** 0.9–1.2s, `power3.out` — hero and panel entrances
- **Ledger (medium):** 0.7–0.85s, clip-path reveal — all scroll-triggered content

No decorative micro-motion. Every animation must serve orientation or emphasis.

### Differentiation Anchor
"If screenshotted without logo — massive Canela headline over a grained dark atmosphere, full-viewport statement panels with ghost symbols bleeding off-screen, accordion services with oversized ghost numbers. Unmistakably editorial, unmistakably premium."

---

## Section 1 — Entrance (Hero)

### Layout
Full viewport height (`min-h-screen`). Two layers:

**Background layer:**
- CSS radial gradient: `--ink` at center, near-black at edges
- SVG grain overlay from design system
- Video slot: when `public/hero.mp4` exists, it replaces the CSS background as a `<video autoPlay muted loop playsInline>` with `object-fit: cover`

**Content layer — three vertical zones:**
- **Top:** `V18` wordmark (mono, `--muted`, `tracking-[0.3em]`), left-aligned. Horizontal rule animates `scaleX` left→right from wordmark edge.
- **Center:** Headline at `clamp(3rem, 13vw, 13vw)`, Canela. Word-split animation (each word wraps in `overflow: hidden` span, child translates `y: -40 → 0` + `opacity: 0 → 1`). Line 2 ("companies that don't compromise.") renders in `--sand` italic.
- **Bottom:** Left — mono label `"Sales Leadership / 2025"` in `--muted`. Right — `Scroll ——` indicator.

### Animation Sequence
1. `delay: 0.2s` — rule `scaleX` left→right, `0.5s power2.inOut`
2. `+0.2s` — wordmark fade in, `0.3s power1.out`
3. `+0.1s` — headline words cascade: `stagger: 0.12`, `y: -40→0`, `opacity: 0→1`, `0.9s power3.out`
4. `+0.5s` — bottom labels fade in, `0.4s power1.out`

### Key Upgrade Over Current
- Headline: `9vw` → `13vw`
- Animation: single-block fade → word-split cascade
- Background: solid `--ink` → atmospheric dark texture (video-ready slot)
- Bottom-left descriptor grounds the editorial feel

---

## Section 2 — Problem

### Layout
Three full-viewport panels (`height: 100vh` each), stacked vertically. Each panel contains one ledger entry.

**Per panel:**
- **Background:** `--ink` base + grain (inherited from body)
- **Ghost symbol:** `✓` or `✗` at `clamp(8rem, 40vw, 40vw)`, Canela, `--fog` at `opacity: 0.04`, absolutely positioned right-center, overflows right edge intentionally
- **Statement:** Centered vertically, `clamp(2.5rem, 18vw, 18vw)` Canela, `--fog`. The negative entry (`✗ Sales infrastructure.`) renders in `--sand`.
- **Entry number:** Mono label top-left (`01 / 02 / 03`), `--muted`, `0.7rem`

### Animation
Each panel triggers on scroll enter (`top 90%`). Statement slides up (`y: 60 → 0`) + fade. Ghost symbol fades in at `0.04` opacity with slight `scale: 1.05 → 1.0`.

### Closing Copy
After third panel, single full-width text block in `--sand` at `1.1rem` — transition into Services.

---

## Section 3 — Services

### Layout
Standard vertical section, `px-[5vw]`, `py-[8vw]`. Section label row unchanged.

**Accordion rows:**
- **Closed state:** Single line — ghost number (`--fog` at `0.08` opacity, `8vw` mono, left) + service name (`3.5vw` Canela, `--fog`) + `+` indicator (mono, `--muted`, right)
- **Open state:** Row expands (`height` tween via GSAP, `0.5s power2.inOut`). Reveals description (`DM Sans`, `0.875rem`, `--muted`, `max-width: 480px`). Ghost number opacity: `0.08 → 0.15`.
- **Trigger:** Click only (deliberate, premium feel)
- **Behavior:** One row open at a time. First row open on mount.
- **Dividers:** `1px`, `--fog` at `0.10` opacity, between rows.

### State Management
Local `useState` in Services tracking `openIndex`.

---

## Section 4 — Partners

Minimal changes from current (already strong):
- Gradient overlay: add `rgba(201,185,154,0.08)` sand tint at bottom 5%
- Partner name scale: `6vw` → `7vw`

---

## Section 5 — CTA (new)

### Layout
Full viewport height. `--ink` background. Grain inherited.

**Content — vertically centered:**
- Top-left mono label: `"What's next."` (`--muted`, `0.7rem`)
- Headline: `"Let's build something that lasts."` — Canela italic, `clamp(2.5rem, 8vw, 8vw)`, `--fog`, two lines
- Button: bordered rectangle `<a>` — `border: 1px solid var(--sand)`, `color: var(--sand)`, `padding: 1rem 2.5rem`, mono `0.75rem` uppercase `tracking-[0.2em]`, text: `"Start the conversation →"`. Hover: background fills `--sand`, color shifts to `--ink`, `200ms ease`.
- Bottom: rule + `"V18 — 2025"` left, email right

### Animation
- Headline: word-split cascade, same as Entrance (`stagger: 0.1`)
- Button: fade in, `delay: 0.6s`
- Bottom rule: `scaleX` on enter

---

## Files to Modify / Create

| File | Action |
|------|--------|
| `src/index.css` | Add grain overlay (`body::after`), new CSS tokens |
| `src/components/Entrance.jsx` | Word-split headline, atmospheric background, bottom descriptor |
| `src/components/Problem.jsx` | Full-viewport panels, ghost symbols, per-panel layout |
| `src/components/Services.jsx` | Accordion with GSAP height tween, ghost numbers |
| `src/components/Partners.jsx` | Sand tint tweak, name scale bump |
| `src/components/CTA.jsx` | New component |
| `src/App.jsx` | Add `<CTA />` import and render |

---

## Out of Scope

- Navbar / header (deferred)
- Testimonials / social proof (deferred)
- Real hero video (placeholder texture only; video slot ready via `public/hero.mp4`)
- Real partner photography (Unsplash placeholders remain)
- Real contact email / form backend
