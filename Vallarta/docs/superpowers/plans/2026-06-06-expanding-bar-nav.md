# Expanding Bar Nav — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-panel passageway nav with an all-4-panels-visible expanding bar grid, using Framer Motion `layout` for the flex morph and staggered entrance animation.

**Architecture:** All 4 panels render simultaneously in a `flex-row` (desktop) / `flex-col` (mobile) container. Active panel holds `flex: 1`; collapsed panels hold `flex: 0 0 64px`. Clicking a collapsed panel expands it; clicking the active panel navigates. Framer Motion `layout` prop animates the flex size change with `easeInOutCubic` 0.7s; container variants drive the stagger entrance.

**Tech Stack:** React 19, TypeScript, Framer Motion v12 (`motion/react`), CSS custom properties, Tailwind v4

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/design-tokens.css` | Modify | Remove edge/hint CSS; add collapsed bar, CTA arrow, mobile vertical styles |
| `src/components/NavMenuView.tsx` | Modify | Rewrite JSX to all-4-panels map; clean state; update keyboard/touch handlers |

---

## Preserved Constraints

Keep unchanged: `menuItems` array, `ScreenType` import, `NavMenuViewProps` interface, `handlePanelClick` (180ms delay + `selectedPanel` flash), `onClose`/`onNavigate` props, `loadedImages` skeleton/fade, focus trap, `role="dialog"` + `aria-modal`, `focus-visible` rings, `prefers-reduced-motion` block, `nav-last-panel` session key, circular `walk()` logic, `--nav-shell-bg` shell color, all scrim tokens, all image assets.

---

### Task 1: CSS — Remove edge indicator + hint banner styles

**Files:**
- Modify: `src/design-tokens.css`

Remove all CSS for the old edge indicators and hint banner. These elements are deleted in the new layout.

- [ ] **Step 1: Remove edge indicator block**

Find and delete the entire block from `/* ── Nav Menu — edge indicators ── */` through the end of `.nav-portal__edge:focus-visible` rule, plus the `navEdgeFadeIn` keyframe and the two rules that reference it (`.nav-portal-grid--cinematic .nav-portal__edge` and `.nav-portal-grid--snappy .nav-portal__edge`). That is approximately lines 187–249 in the current file. The block looks like:

```css
/* ── Nav Menu — edge indicators ── */
.nav-portal__edge {
  flex: 0 0 48px;
  ...
}
.nav-portal__edge-label { ... }
.nav-portal__edge-chevron { ... }
.nav-portal__edge--right .nav-portal__edge-label { ... }
.nav-portal__edge:hover .nav-portal__edge-label { ... }
.nav-portal__edge:focus-visible { ... }
@keyframes navEdgeFadeIn { ... }
.nav-portal-grid--cinematic .nav-portal__edge { ... }
.nav-portal-grid--snappy .nav-portal__edge { ... }
```

Delete all of the above.

- [ ] **Step 2: Remove hint banner block**

Find and delete the entire block from `/* ── Nav Menu — keyboard hint ── */` through `.nav-hint-banner__dismiss:hover`. That includes `.nav-hint-banner`, `@keyframes navHintIn`, `.nav-hint-banner__text`, `.nav-kbd`, `.nav-hint-banner__dismiss`, `.nav-hint-banner__dismiss:hover`.

- [ ] **Step 3: Remove hint + edge from reduced-motion block**

Inside `@media (prefers-reduced-motion: reduce)`, delete these lines:
```css
  .nav-portal__edge { transition: none; opacity: 1; }
  .nav-portal__edge-label { transition: none; }
  .nav-portal__dot { transition: none; }
  .nav-hint-banner { animation: none; opacity: 1; transform: none; }
```

- [ ] **Step 4: Remove edge from mobile block**

Inside `@media (max-width: 767px)`, delete:
```css
  .nav-portal__edge {
    flex: 0 0 36px;
  }
  .nav-portal__edge-label {
    font-size: 0.4375rem;
    letter-spacing: 0.15em;
  }
```

- [ ] **Step 5: Remove nav-portal-grid cinematic/snappy panel rules**

Find and delete:
```css
/* Snappy entrance: all panels in 0.1s (subsequent opens) */
.nav-portal-grid--snappy .nav-panel {
  animation: navPanelIn 0.10s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0s;
}
```

Also delete the base `.nav-panel` animation rule since Framer Motion will handle entrance:
```css
/* ── Nav Menu — card accordion ── */
.nav-panel {
  flex: 1;
  opacity: 0;
  animation: navPanelIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

Replace it with just the base structural rule (no animation):
```css
/* ── Nav Menu — panel ── */
.nav-panel {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
```

Also delete the `navPanelIn` keyframe and `navHeaderIn` is fine to keep for the header animation.

- [ ] **Step 6: Verify no orphan references**

```bash
grep -n "nav-portal__edge\|nav-hint\|nav-kbd\|navHintIn\|navPanelIn\|nav-portal-grid--cinematic\|nav-portal-grid--snappy" src/design-tokens.css
```

Expected: zero matches.

- [ ] **Step 7: Commit**

```bash
git add src/design-tokens.css
git commit -m "chore(nav): remove edge indicator, hint banner, cinematic/snappy CSS"
```

---

### Task 2: CSS — Add collapsed bar, active panel, CTA arrow, mobile styles

**Files:**
- Modify: `src/design-tokens.css`

Add all new CSS needed for the expanding bar layout.

- [ ] **Step 1: Add panel flex rules**

After the `.nav-panel { position: relative; overflow: hidden; cursor: pointer; }` rule added in Task 1, add:

```css
/* ── Nav Menu — panel flex states ── */
.nav-panel--active {
  flex: 1;
  min-width: 0;
}

.nav-panel--collapsed {
  flex: 0 0 64px;
  flex-shrink: 0;
}
```

- [ ] **Step 2: Add active panel gold line rule**

Find the existing `.nav-portal-line` CSS block and add an active-state override after it:

```css
/* Active panel — gold line always fully swept */
.nav-panel--active .nav-portal-line {
  transform: scaleX(1);
  transition: none;
}

/* Collapsed panel — gold line subtle presence */
.nav-panel--collapsed .nav-portal-line {
  transform: scaleX(0.15);
  opacity: 0.5;
  transition: none;
}
```

- [ ] **Step 3: Add collapsed panel title styles**

After the collapsed panel `.nav-panel--collapsed` rule, add:

```css
/* ── Nav Menu — collapsed bar rotated title ── */
.nav-panel-collapsed-title {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
  pointer-events: none;
  z-index: 10;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.04em;
}

.nav-panel--collapsed:hover .nav-panel-collapsed-title {
  color: rgba(255, 255, 255, 0.75);
}
```

- [ ] **Step 4: Add CTA arrow styles**

After the `.nav-panel__subtitle` block, add:

```css
/* ── Nav Menu — CTA arrow (active panel) ── */
.nav-panel-cta-arrow {
  display: block;
  color: var(--nav-gold);
  font-size: 1.125rem;
  line-height: 1;
  margin-bottom: 10px;
  animation: ctaArrowPulse 2s ease-in-out infinite;
}

@keyframes ctaArrowPulse {
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 0.80; }
}
```

- [ ] **Step 5: Update mobile media query for vertical stack**

Find `@media (max-width: 767px)` block. Replace the existing `.nav-portal-grid` rule with:

```css
  .nav-portal-grid {
    flex-direction: column;
    padding-top: 56px; /* header height */
  }
```

Add collapsed/active panel overrides for mobile:

```css
  .nav-panel--active {
    flex: 1;
    min-height: 0;
  }

  .nav-panel--collapsed {
    flex: 0 0 64px;
    width: 100%;
  }

  /* Mobile: collapsed title is horizontal, not rotated */
  .nav-panel-collapsed-title {
    writing-mode: horizontal-tb;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    padding: 0 20px;
  }
```

Also remove any existing mobile overrides for `.nav-panel` that conflict (the old `flex: 1 1 0`, `min-height: 0`, `animation: none`, `opacity: 1`, `transform: none`, `transition: none` rules).

- [ ] **Step 6: Add reduced-motion overrides for new elements**

Inside `@media (prefers-reduced-motion: reduce)`, add:

```css
  .nav-panel-cta-arrow { animation: none; opacity: 0.65; }
  .nav-portal-line { transition: none; }
```

- [ ] **Step 7: Verify CSS compiles without errors**

```bash
npx vite build --mode development 2>&1 | head -30
```

Expected: no CSS parse errors.

- [ ] **Step 8: Commit**

```bash
git add src/design-tokens.css
git commit -m "feat(nav): add expanding bar CSS — collapsed/active panel states, CTA arrow, mobile vertical stack"
```

---

### Task 3: NavMenuView — State cleanup + keyboard/touch handlers

**Files:**
- Modify: `src/components/NavMenuView.tsx`

Remove the state and refs that no longer exist. Update keyboard handler so 1–4 expand only (not navigate). Update touch handler for mobile vertical swipe.

- [ ] **Step 1: Remove hintVisible state and hasAnimated ref**

Find and delete:
```tsx
  const hasAnimated = useRef(sessionStorage.getItem('nav-anim') === '1');
```

Find and delete:
```tsx
  const [hintVisible, setHintVisible] = useState(
    sessionStorage.getItem('nav-hint-seen') !== '1'
  );
```

- [ ] **Step 2: Remove nav-anim useEffect**

Find and delete:
```tsx
  useEffect(() => {
    const timer = setTimeout(() => sessionStorage.setItem('nav-anim', '1'), 600);
    return () => clearTimeout(timer);
  }, []);
```

- [ ] **Step 3: Remove hintVisible useEffect**

Find and delete:
```tsx
  useEffect(() => {
    if (!hintVisible) return;
    const timer = setTimeout(() => {
      setHintVisible(false);
      sessionStorage.setItem('nav-hint-seen', '1');
    }, 5000);
    return () => clearTimeout(timer);
  }, [hintVisible]);
```

- [ ] **Step 4: Update keyboard handler — 1–4 keys expand, not navigate**

Find the keyboard handler block that reads:
```tsx
      const panelKeys = ['1', '2', '3', '4'];
      const keyIndex = panelKeys.indexOf(e.key);
      if (keyIndex !== -1 && keyIndex < menuItems.length) {
        e.preventDefault();
        handlePanelClick(menuItems[keyIndex].screen, menuItems[keyIndex].id);
        return;
      }
```

Replace with:
```tsx
      const panelKeys = ['1', '2', '3', '4'];
      const keyIndex = panelKeys.indexOf(e.key);
      if (keyIndex !== -1 && keyIndex < menuItems.length) {
        e.preventDefault();
        setActiveIndex(keyIndex);
        return;
      }
```

- [ ] **Step 5: Update touch handler for mobile vertical swipe**

Find `handleTouchEnd` and replace the entire function body with:

```tsx
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Vertical stack: swipe up = next panel, swipe down = previous panel
      if (Math.abs(deltaY) > 50) {
        walk(deltaY < 0 ? 1 : -1);
      }
      return;
    }

    // Desktop: horizontal swipe walks panels
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      walk(deltaX > 0 ? -1 : 1);
      return;
    }

    // Desktop: swipe down closes
    if (deltaY > 80) {
      onClose();
    }
  };
```

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/NavMenuView.tsx
git commit -m "refactor(nav): state cleanup, keyboard 1-4 expands only, mobile vertical swipe"
```

---

### Task 4: NavMenuView — Add motion imports + animation constants

**Files:**
- Modify: `src/components/NavMenuView.tsx`

Add the Framer Motion imports and define the animation variant constants above the component.

- [ ] **Step 1: Add motion imports at top of file**

Find the existing import block at the top of `NavMenuView.tsx`. After the last import statement, add:

```tsx
import { motion, AnimatePresence } from 'motion/react';
```

- [ ] **Step 2: Add animation constants above the component function**

After the `menuItems` array and before `const ChevronLeft` (or wherever the SVG components are), add:

```tsx
// ── Framer Motion variants ──

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const panelEntranceVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const layoutTransition = {
  duration: 0.7,
  ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
};
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavMenuView.tsx
git commit -m "feat(nav): add Framer Motion imports and animation variant constants"
```

---

### Task 5: NavMenuView — Rewrite JSX: grid container + panel map

**Files:**
- Modify: `src/components/NavMenuView.tsx`

Replace the IIFE-based single-panel JSX with a `motion.div` container mapping all 4 panels. This task focuses on the outer structure only (photos + scrim are in next task).

- [ ] **Step 1: Replace the passageway div and its contents**

Find the entire `{/* ── Passageway ── */}` div (the one with `className` referencing `nav-portal-grid nav-portal-grid--cinematic` or `nav-portal-grid--snappy`). Replace it entirely with:

```tsx
      {/* ── Panel grid ── */}
      <motion.div
        className="nav-portal-grid absolute inset-0 flex flex-row"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {menuItems.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            variants={panelEntranceVariants}
            style={{ originX: 0 }}
            transition={{ layout: layoutTransition }}
            className={`nav-panel ${i === activeIndex ? 'nav-panel--active' : 'nav-panel--collapsed'} relative h-full overflow-hidden${selectedPanel === item.id ? ' nav-panel--selected' : ''}`}
            onClick={() => {
              if (i !== activeIndex) {
                setActiveIndex(i);
              } else {
                handlePanelClick(item.screen, item.id);
              }
            }}
            role="button"
            aria-label={i === activeIndex ? `Navigate to ${item.label}` : `Expand ${item.label}`}
            tabIndex={0}
          >
            {/* Photo skeleton */}
            <div
              className={`nav-portal__img-skeleton ${loadedImages[item.id] ? 'nav-portal__img-skeleton--hidden' : ''}`}
              aria-hidden="true"
            />

            {/* Full-bleed photo */}
            <picture aria-hidden="true">
              <source srcSet={item.imageWebp} type="image/webp" />
              <img
                src={item.image}
                alt=""
                className={`nav-portal__img ${loadedImages[item.id] ? 'nav-portal__img--loaded' : ''}`}
                onLoad={() => handleImageLoad(item.id)}
              />
            </picture>

            {/* Scrim */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 2,
                background:
                  'linear-gradient(to bottom, var(--nav-scrim-top) 0%, transparent 20%), linear-gradient(to top, var(--nav-scrim-heavy) 0%, var(--nav-scrim-mid) 36%, var(--nav-scrim-light) 65%, transparent 100%)',
              }}
            />

            {/* Gold bottom line */}
            <div className="nav-portal-line" />

            {/* Panel content — collapsed title or active content */}
            {/* (added in Task 6) */}
          </motion.div>
        ))}
      </motion.div>
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and verify structure renders**

```bash
npm run dev
```

Open the nav menu. You should see 4 panels rendered side by side, each with a photo. The active panel may not be wide yet (no CSS flex distinction applied in CSS yet — but Task 2 CSS is already done so panels should be sized). Entrance stagger animation should play. No content labels yet.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavMenuView.tsx
git commit -m "feat(nav): rewrite JSX to all-4-panels motion.div grid with layout + stagger entrance"
```

---

### Task 6: NavMenuView — Panel inner content: collapsed title + active content + CTA

**Files:**
- Modify: `src/components/NavMenuView.tsx`

Add the inner content JSX for each panel: collapsed panels show the rotated title; active panel shows index, label, CTA arrow, subtitle — all transitioning via AnimatePresence.

- [ ] **Step 1: Replace the content placeholder comment with AnimatePresence content**

Find the comment `{/* Panel content — collapsed title or active content */}` added in Task 5 (near the bottom of the panel's motion.div, after the gold line div).

Replace the comment with:

```tsx
            {/* Panel content — animated switch between collapsed title and active content */}
            <AnimatePresence mode="wait">
              {i === activeIndex ? (
                <motion.div
                  key="active"
                  className="nav-portal-content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.18,
                    ease: [0.16, 1, 0.3, 1],
                    exit: { duration: 0.15, delay: 0 },
                  }}
                >
                  <span className="nav-portal__index">{item.index}</span>
                  <span className="nav-portal__label">{item.label}</span>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.38, duration: 0.3 }}
                    style={{ lineHeight: 1 }}
                  >
                    <span className="nav-panel-cta-arrow" aria-hidden="true">→</span>
                  </motion.div>
                  <span className="nav-panel__subtitle">{item.subtitle}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  className="nav-panel-collapsed-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify visually in dev server**

```bash
npm run dev
```

Check:
1. Active panel shows index number, label, gold `→` arrow, subtitle at bottom
2. Gold `→` arrow pulses (opacity cycles 0.55→0.80 over 2s)
3. Collapsed panels show the panel label text rotated vertically
4. Clicking a collapsed panel expands it and shows its content (old active collapses)
5. Clicking the active panel navigates to that screen
6. Stagger entrance animation plays on open

- [ ] **Step 4: Commit**

```bash
git add src/components/NavMenuView.tsx
git commit -m "feat(nav): collapsed title + active content with CTA arrow — AnimatePresence switch"
```

---

### Task 7: NavMenuView — Remove obsolete JSX

**Files:**
- Modify: `src/components/NavMenuView.tsx`

Remove the hint banner JSX and `ChevronLeft`/`ChevronRight` SVG components (edge indicator helpers no longer used).

- [ ] **Step 1: Remove hint banner JSX**

Find and delete the entire `{hintVisible && ( ... )}` block (the hint banner conditional render). It starts with `{/* Keyboard hint banner */}` and ends with the closing `)}`.

- [ ] **Step 2: Remove ChevronLeft and ChevronRight components**

Find and delete:
```tsx
const ChevronLeft = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
    <path d="M8 1L2 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
    <path d="M2 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
```

- [ ] **Step 3: Remove the inner `walk` call from the keyboard handler's ArrowLeft/ArrowRight**

The `walk` function is still used internally (touch swipe + keyboard walk). Keep `walk`. But verify the keyboard arrow handler still calls `walk(-1)` / `walk(1)` — these are correct since walk just changes `activeIndex`. No changes needed here, just verify.

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors. No unused variable warnings for ChevronLeft/ChevronRight.

- [ ] **Step 5: Commit**

```bash
git add src/components/NavMenuView.tsx
git commit -m "chore(nav): remove hint banner JSX and obsolete ChevronLeft/Right SVG helpers"
```

---

### Task 8: Final verification + QA

**Files:** None (verification only)

- [ ] **Step 1: Full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: CSS integrity check**

```bash
grep -n "nav-portal__edge\|nav-hint\|nav-kbd\|navHintIn\|navPanelIn\|nav-portal-grid--cinematic\|nav-portal-grid--snappy\|hasAnimated\|hintVisible\|nav-hint-seen\|nav-anim" src/design-tokens.css src/components/NavMenuView.tsx
```

Expected: zero matches.

- [ ] **Step 3: Start dev server**

```bash
npm run dev
```

- [ ] **Step 4: Desktop QA checklist**

Open the nav menu and verify:

1. All 4 panels visible simultaneously side-by-side
2. Active panel is wide, 3 collapsed panels are ~64px strips
3. Each collapsed strip shows a cropped photo + rotated panel title
4. Entrance: bars sweep in left-to-right with stagger (visible first open)
5. Clicking a collapsed bar → expands it, old active collapses (0.7s smooth morph)
6. Active panel shows: index `01`, label, gold `→` arrow, subtitle
7. Gold `→` arrow pulses (opacity cycles slowly)
8. Gold bottom line: full width on active panel, thin presence on collapsed panels
9. Clicking active panel → index flashes white → navigates to screen after ~180ms
10. `←` / `→` arrow keys walk between panels (expand, no navigate)
11. `Enter` key navigates from active panel
12. `1`–`4` keys set active panel (expand only, no navigate)
13. `Esc` closes the nav
14. Hover on collapsed bar → title brightens, photo scales 1.04
15. Close button works

- [ ] **Step 5: Mobile QA checklist** (resize browser to 375px width)

1. Panels stack vertically
2. Active panel is tall, collapsed panels are ~64px horizontal strips
3. Collapsed strips show horizontal title (not rotated)
4. Swipe up → next panel expands
5. Swipe down → previous panel expands
6. Tap collapsed strip → expands it
7. Tap active panel → navigates
8. Header stays visible at top

- [ ] **Step 6: Accessibility check**

1. Tab key cycles through all 4 panels + close button
2. Each panel has a visible `focus-visible` ring
3. Screen reader reads `aria-label` on each panel (e.g. "Expand Revenue", "Navigate to The Estates")
4. `prefers-reduced-motion`: in browser DevTools, enable reduced motion — CTA arrow should be static (no pulse), layout morph should be instant

- [ ] **Step 7: Commit any fixes**

```bash
git add src/components/NavMenuView.tsx src/design-tokens.css
git commit -m "fix(nav): QA corrections from expanding bar verification"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Task |
|---|---|
| All 4 panels visible simultaneously | Task 5 |
| Active: `flex: 1`, collapsed: `flex: 0 0 64px` | Task 2 |
| Framer Motion `layout` morph, 0.7s easeInOutCubic | Task 4 + 5 |
| Stagger entrance scaleX [0→1], 0.06s, easeOutExpo | Task 4 + 5 |
| Active content: translateY [8→0], 0.35s, 0.18s delay | Task 6 |
| Collapsed title: rotated, EB Garamond, 0.875rem, rgba 0.45 | Task 2 + 6 |
| CTA `→` gold arrow, opacity pulse 0.55→0.80, 2s | Task 2 + 6 |
| CTA fades in 0.2s after content (0.38s total delay) | Task 6 |
| Click collapsed → expand (not navigate) | Task 5 |
| Click active → navigate via `handlePanelClick` | Task 5 |
| `1–4` keys expand only, not navigate | Task 3 |
| Mobile `flex-col`, collapsed `height: 64px` | Task 2 |
| Mobile swipe up/down, threshold 50 | Task 3 |
| Horizontal title on collapsed mobile | Task 2 |
| Gold line: `scaleX: 1` active, `scaleX: 0.15` collapsed | Task 2 |
| Hover: photo scale 1.04, title opacity 0.45→0.75 | Task 2 (existing `.nav-panel:hover img` covers 1.04, collapsed title hover in Task 2 Step 3) |
| Remove hint banner + all related state/CSS | Task 1 + 3 + 7 |
| Remove edge indicators + all related CSS | Task 1 + 7 |
| `nav-last-panel` session storage preserved | Task 3 (not touched) |
| Focus trap preserved | Task 5 (tabIndex={0} on each panel, dialog ref unchanged) |
| `prefers-reduced-motion` coverage | Task 2 Step 6 |

### Placeholder scan
No TBDs or TODOs. Every step has exact code.

### Type consistency
- `panelEntranceVariants` defined in Task 4, used in Task 5 — ✓ same name
- `containerVariants` defined in Task 4, used in Task 5 — ✓ same name
- `layoutTransition` defined in Task 4, used in Task 5 — ✓ same name
- `handlePanelClick(item.screen, item.id)` — `item` is `MenuItem`, `.screen` is `ScreenType`, `.id` is string — matches existing signature ✓
- `setActiveIndex(i)` — `i` is `number`, `activeIndex` is `number` — ✓
- `walk(deltaY < 0 ? 1 : -1)` — `walk` takes `-1 | 1` — ✓
- `AnimatePresence`, `motion` imported from `motion/react` — same as App.tsx ✓
