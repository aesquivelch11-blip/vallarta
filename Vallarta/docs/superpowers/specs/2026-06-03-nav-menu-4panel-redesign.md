# Nav Menu 4-Panel Hub — Design Spec

## Goal

Replace the current photo-background vertical-list nav menu with a full-screen 4-panel horizontal card grid that acts as a central navigation hub.

## Layout

Four equal-width panels fill 100dvh × 100vw in a `flex-row`. Default state: each panel `flex: 1`. Hovered panel animates to `flex: 3.5`; the other three share the remaining space equally at `flex: 1`. Thin `1px` vertical dividers between panels using `--nav-card-border`.

No photo background. No dark overlay scrim. No gradient.

## Panel Design

Each panel uses the existing card background tokens:

| Panel | Token |
|---|---|
| The Estates | `--nav-card-estates-bg` |
| Financial Performance | `--nav-card-financial-bg` |
| Operations | `--nav-card-operations-bg` |
| Calendar | `--nav-card-calendar-bg` |

**Top ambient glow:** CSS `radial-gradient` at top-center of each panel. Color matches the card's bg token at higher luminosity (~15–20% lighter). Adds atmospheric depth without a photo.

**Content anchored to bottom ~30% of panel height:**

```
01                          ← Instrument Sans, 0.625rem, tracking 0.3em, white/40
The Estates                 ← EB Garamond Variable, ~3.5rem, font-weight 300, white/90
Portfolio Overview          ← Instrument Sans, 0.6875rem, tracking 0.2em, uppercase, white/60
                              crossfades to dataValue on hover
```

Panel content uses `position: absolute; bottom: 0; padding: clamp(24px, 5vh, 56px)`.

## Hover / Expand Behavior

- `hoveredId: string | null` state on the parent
- Each panel is a `motion.div` with the `layout` prop
- Width driven by Framer Motion animating the `flex` value via inline style
- Spring: `{ type: 'spring', stiffness: 280, damping: 30 }` (matches project expo easing feel)
- On hover expand: section title `scale: 1.03`, subtitle crossfades to `dataValue` (same dual-span absolute technique as current design)
- On hover: panel brightness slightly increases via overlay opacity drop

## Header

Single row overlaid across all panels at `z-index: 30`:

```
VALLARTA ESTATES            [LOGOUT]    [×]
```

- Wordmark: `.t-wordmark` class, `white/90`
- Logout: Instrument Sans, `0.6875rem`, tracking `0.15em`, uppercase, `white/50` default → `white` on hover. Two-tap confirm: tap 1 shows "Confirm?", auto-resets after 3s. Tap 2 navigates to `login`. Uses existing `logoutPending` state + timer ref logic.
- Close (×): existing `nav-close-btn` pill style, calls `onClose`
- Layout: `flex justify-between items-center px-6 md:px-16 pt-10 md:pt-16`

## Mount Animation

Panels stagger-fade in from `y: 24, opacity: 0` → `y: 0, opacity: 1`.  
Delay: `0.08 * index` seconds. Duration `0.5s`. Ease `[0.16, 1, 0.3, 1]`.

## Origin Screen Logic

Removed. Nav menu is a hub — all panels equally navigable, no disabled/dimmed states.

## What Gets Removed from Current Implementation

- `bgImage` import and photo background div
- `--nav-overlay-base` overlay div
- Gradient scrim div
- `menuItems` right-aligned vertical list in `<main>`
- `hoveredIndex` numeric counter in footer (`01 — 04`)
- `<footer>` with Contact, Settings, Website links
- `originScreen` prop handling (disabled panel logic)
- `weight: 'primary' | 'secondary'` distinction on menu items

## What Stays

- `MenuItem` interface (adapted — remove `weight`, keep `id`, `label`, `subtitle`, `dataValue`, `screen`)
- `logoutPending` state + `logoutTimerRef` + two-tap logout logic
- `onNavigate`, `onClose`, `onNotify` props
- `NavMenuViewProps` interface (remove `originScreen`)
- All nav card CSS tokens in `design-tokens.css`
- `nav-close-btn` CSS class

## Files

| File | Change |
|---|---|
| `src/components/NavMenuView.tsx` | Full rewrite of JSX + state. Keep props interface (minus `originScreen`), keep logout logic |
| `src/design-tokens.css` | Add ambient glow CSS vars per card if needed; remove nothing |
| `src/App.tsx` | Remove `originScreen` from `NavMenuView` call site |

## Accessibility

- Each panel is a `<button>` with `aria-label={item.label}`
- `focus-visible` ring: `focus-visible:ring-2 focus-visible:ring-white/40`
- `prefers-reduced-motion`: skip expand animation, show static layout
