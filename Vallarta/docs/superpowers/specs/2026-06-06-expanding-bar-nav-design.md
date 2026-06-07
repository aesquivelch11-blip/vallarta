# Expanding Bar Nav — Design Spec

**Inspiration:** [ExpandingBarMenus iteration #1](https://tympanus.net/Development/ExpandingBarMenus/) by Codrops  
**Date:** 2026-06-06

---

## Goal

Replace the current passageway layout (1 full-bleed panel at a time, edge indicators) with an expanding bar grid where all 4 panels are always visible. The active panel expands to fill available space; collapsed panels compress to 64px strips. Navigation is two-step: click collapsed → expands; click expanded → navigates.

---

## Layout

### Desktop (≥768px)

Horizontal `flex-row`, `100dvh × 100vw`. All 4 panels always rendered.

- **Collapsed panel:** `flex: 0 0 64px` — photo visible but narrow, rotated title centered vertically
- **Active panel:** `flex: 1` — full-bleed photo + scrim + bottom content + CTA

Framer Motion `layout` prop handles the flex morph. No edge indicator buttons. No pagination dots (visible collapsed bars serve as position indicators).

### Mobile (<768px)

`flex-col`. Same 4 panels stacked vertically.

- **Collapsed panel:** `height: 64px`, full width — photo cropped, horizontal title (no rotation)
- **Active panel:** `flex: 1` — takes remaining height

Swipe up → `activeIndex + 1`. Swipe down → `activeIndex - 1`. Threshold: `deltaY > 50`.

---

## Animation Choreography

### Entrance (every open)

All 4 bars animate in left→right with stagger:

- `initial`: `scaleX: 0, opacity: 0`, `originX: 0`
- `animate`: `scaleX: 1, opacity: 1`
- Duration: `0.5s`, easing: `easeOutExpo`
- Stagger: `0.06s` between panels

Active panel content enters after bars settle:
- `translateY: [14 → 0]`, `opacity: [0 → 1]`
- Duration: `0.4s`, delay: `0.32s`, easing: `easeOutExpo`

### Panel Switch

Triggered by arrow keys, clicking a collapsed bar, or pressing `1–4`.

- All panels morph simultaneously via Framer Motion `layout`
- Duration: `0.7s`, easing: `cubicBezier(0.76, 0, 0.24, 1)` (easeInOutCubic)
- Old active content: `opacity: [1 → 0]`, `0.15s`
- New active content: `translateY: [8 → 0]`, `opacity: [0 → 1]`, `0.35s`, `0.18s` delay
- CTA affordance: fades in `0.2s` after content start

### Hover (collapsed bars)

CSS only, no JS:

- Photo scale: `1.04`, `0.4s easeOutExpo`
- Title opacity: `0.45 → 0.75`, `0.25s`
- Gold bottom line: always `scaleX: 0.15` on collapsed (subtle presence)
- No width change on hover

### Click → Navigate (active panel)

- Gold bottom line already at `scaleX: 1` (active state). Click feedback: index number flashes white via `nav-panel--selected` class (existing behavior).
- `180ms` delay then `onNavigate()` fires

---

## Panel Content

### Collapsed (64px)

- Full-bleed photo, `object-fit: cover`
- Scrim: `rgba(0,0,0,0.35)` gradient top-to-bottom
- Title: `writing-mode: vertical-rl`, centered, EB Garamond, `0.875rem`, `rgba(255,255,255,0.45)`
- Gold bottom line: `scaleX: 0.15`, static
- No index number, no subtitle

### Active (expanded)

- Full-bleed photo + existing scrim system (unchanged)
- Bottom content: index `01`, label, subtitle — unchanged
- Gold bottom line: `scaleX: 1` (fully swept) — signals selected state
- **CTA affordance:** `→` arrow in `--nav-gold`, `aria-hidden="true"`, soft opacity pulse `0.55 → 0.8`, `2s` loop. Positioned below the label, above the subtitle. Fades in `0.2s` after content settles.

---

## State

| State var | Change |
|---|---|
| `activeIndex` | Unchanged — controls expanded panel |
| `selectedPanel` | Unchanged — 180ms navigation delay |
| `hintVisible` | **Removed** |
| `hasAnimated` | **Removed** — entrance always plays |

### Session Storage

| Key | Change |
|---|---|
| `nav-last-panel` | Unchanged — restores active panel on reopen |
| `nav-anim` | **Removed** |
| `nav-hint-seen` | **Removed** |

---

## Keyboard

| Key | Behavior |
|---|---|
| `← / →` | Changes `activeIndex` (expands that panel, no navigate) |
| `Enter` | Navigates from active panel |
| `1–4` | Sets `activeIndex` (expands, does NOT navigate) |
| `Esc` | `onClose()` |

---

## Touch (Mobile)

| Gesture | Behavior |
|---|---|
| Swipe up | `activeIndex + 1` |
| Swipe down | `activeIndex - 1` |
| Tap collapsed bar | Sets `activeIndex` |
| Tap active panel | Navigates |

Threshold: `deltaY > 50` (tightened from `80`).

---

## Files

| File | Change |
|---|---|
| `src/components/NavMenuView.tsx` | Full JSX rewrite. State cleanup. Keep: `menuItems`, props interface, `handlePanelClick`, keyboard handler, session storage |
| `src/design-tokens.css` | Add collapsed bar + CTA arrow styles, mobile vertical rules. Remove: `navHintIn`, `.nav-hint-banner`, `.nav-kbd`, `.nav-portal__edge*`, `navEdgeFadeIn` |
| `package.json` | No changes — Framer Motion already installed |

### Removed entirely

- Edge indicator buttons + all `nav-portal__edge*` CSS
- Hint banner + `navHintIn` keyframe + `.nav-hint-banner` + `.nav-kbd` CSS
- `hasAnimated` ref + `nav-anim` session key
- `hintVisible` state + `nav-hint-seen` session key

### Untouched

- `src/App.tsx` — no prop or transition changes
- All menu images
- All design tokens (colors, typography, scrim system)
- `handlePanelClick` logic
- Accessibility: `role="dialog"`, `aria-modal`, focus trap, `focus-visible` rings, `prefers-reduced-motion`
