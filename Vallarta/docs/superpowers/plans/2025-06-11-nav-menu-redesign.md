# Nav Menu Editorial Luxury Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the NavMenuView from a generic dark-mode mobile overlay into an editorial luxury navigation portal that matches the Vallarta Estates brand (warm Banderas Palette, EB Garamond serif, cinematic photography, film-grain texture).

**Architecture:** Modify existing CSS tokens and component files. Create one new component (`NavEditorialTitle.tsx`) for the active-section display title. The bottom bar becomes a floating glass island with double-bezel nesting. All animations use `transform`/`opacity` only (no `clip-path`, no `ease-in-out`).

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Motion v12 (`motion/react`), Vitest, Vite. Fonts: EB Garamond Variable (display serif, already imported in `main.tsx`), Instrument Sans (UI sans-serif, already imported in `main.tsx`).

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/design-tokens.css` | Modify | Warm color tokens, noise keyframe, Ken Burns fix, stagger keyframes, editorial title tokens, z-index fix |
| `src/components/NavMenu/NavEditorialTitle.tsx` | Create | Active-section display title with eyebrow tag |
| `src/components/NavMenu/NavImagePanel.tsx` | Modify | Replace `clipPath` animation with opacity crossfade, add `cinematic-grade` class |
| `src/components/NavMenu/NavBottomBar.tsx` | Modify | Floating island structure, staggered entry, magnetic hover |
| `src/components/NavMenuView.tsx` | Modify | Wire in `NavEditorialTitle`, pass `menuItems[activeIndex]` data, update header z-index and height |

---

### Task 1: Design Tokens & CSS Foundation

**Files:**
- Modify: `src/design-tokens.css`

- [ ] **Step 1: Add warm Nav Menu color tokens**

Open `src/design-tokens.css`. Find the block starting at line 127 (`/* --- Nav Menu --- */`). Replace the entire `/* --- Nav Menu --- */` section (lines 127–161) with the following. This shifts the palette from cool `oklch` grays to warm Banderas Midnight tones and adds Sunset Ochre as the primary accent.

```css
    /* --- Nav Menu --- */
    /* Shell — warm Banderas Midnight instead of cool gray */
    --nav-shell-bg: #162732;
    --nav-header-height: 72px;
    --nav-font-display: var(--font-display);
    --nav-font-label: var(--font-ui);

    /* Accent — Sunset Ochre (brand signature) replaces restrained terracotta */
    --nav-accent: #d49a55;
    --nav-accent-strong: #e8b06a;

    /* Scrim system — warm-tinted */
    --nav-scrim-top: rgba(22, 39, 50, 0.28);
    --nav-scrim-heavy: rgba(22, 39, 50, 0.72);
    --nav-scrim-mid: rgba(22, 39, 50, 0.38);
    --nav-scrim-light: rgba(22, 39, 50, 0.12);

    /* Header text */
    --nav-wordmark-color: rgba(250, 248, 245, 0.52);

    /* Close button */
    --nav-close-color: rgba(250, 248, 245, 0.58);
    --nav-close-color-hover: rgba(250, 248, 245, 0.96);
    --nav-close-border: rgba(250, 248, 245, 0.16);
    --nav-close-border-hover: rgba(250, 248, 245, 0.34);
    --nav-close-bg-hover: rgba(250, 248, 245, 0.06);

    /* Bottom bar — floating island */
    --nav-bottom-bar-height: 88px;
    --nav-bottom-bar-bg: rgba(14, 26, 34, 0.86);
    --nav-tab-color: rgba(250, 248, 245, 0.48);
    --nav-tab-active-color: rgba(250, 248, 245, 0.96);
    --nav-tab-metric-color: rgba(250, 248, 245, 0.40);
    --nav-tab-metric-active-color: rgba(250, 248, 245, 0.60);
    --nav-tab-current-dot: #d49a55;

    /* Editorial title */
    --nav-title-color: rgba(250, 248, 245, 0.94);
    --nav-eyebrow-color: rgba(250, 248, 245, 0.40);
```

- [ ] **Step 2: Add noise texture and stagger keyframes**

Find the line immediately after the `@keyframes navHeaderIn` block (after line 226). Insert the following new keyframes block:

```css
/* ── Nav Menu — warm film-grain overlay ── */
@keyframes navGrainShift {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-2%, -2%); }
    30% { transform: translate(1%, -3%); }
    50% { transform: translate(-1%, 2%); }
    70% { transform: translate(3%, 1%); }
    90% { transform: translate(-2%, 3%); }
}

/* ── Nav Menu — staggered tab entry ── */
@keyframes navTabSlideIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ── Nav Menu — editorial title entry ── */
@keyframes navTitleIn {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

- [ ] **Step 3: Fix Ken Burns easing**

Find the `.nav-image-layer img.loaded` rule inside the `@media (prefers-reduced-motion: no-preference)` block (around line 302–306). Change `ease-in-out` to the custom expo curve:

Current:
```css
        animation: navKenBurns 14s ease-in-out infinite alternate;
```

Replace with:
```css
        animation: navKenBurns 14s cubic-bezier(0.32, 0.72, 0, 1) infinite alternate;
```

- [ ] **Step 4: Change `will-change` from `clip-path` to `transform`**

Find `.nav-image-layer` (around line 278). Change:

Current:
```css
    will-change: clip-path;
```

Replace with:
```css
    will-change: transform, opacity;
```

- [ ] **Step 5: Fix header z-index and wordmark**

Find `.nav-header` (around line 229). The current rule is:

```css
.nav-header {
    animation: navHeaderIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.01s both;
    background: linear-gradient(to bottom, oklch(14% 0.005 60 / 0.60), transparent);
}
```

Replace with:

```css
.nav-header {
    animation: navHeaderIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.01s both;
    background: linear-gradient(to bottom, rgba(22, 39, 50, 0.60), transparent);
    z-index: 40;
}
```

Find `.nav-portal__wordmark` (around line 235). Replace the entire rule:

Current:
```css
.nav-portal__wordmark {
    font-family: var(--font-ui);
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--nav-wordmark-color);
}
```

Replace with:
```css
.nav-portal__wordmark {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 1.125rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: var(--nav-wordmark-color);
}
```

- [ ] **Step 6: Add film-grain overlay utility class**

Find the `.nav-scrim` rule (around line 328). After the closing brace of `.nav-scrim`, insert:

```css
/* ── Nav Menu — warm grain overlay (fixed, non-scrolling) ── */
.nav-grain {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    background-size: 256px 256px;
    animation: navGrainShift 8s steps(10) infinite;
}
```

- [ ] **Step 7: Restyle bottom bar for floating island**

Find `.nav-bottom-bar` (around line 339). Replace the entire rule:

Current:
```css
.nav-bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--nav-bottom-bar-height);
    z-index: 10;
    display: flex;
    align-items: stretch;
    background: var(--nav-bottom-bar-bg);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border-top: 1px solid oklch(100% 0 0 / 0.07);
}
```

Replace with:
```css
/* Outer shell — double-bezel wrapper */
.nav-bottom-bar-shell {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    padding: 6px;
    background: rgba(250, 248, 245, 0.04);
    border: 1px solid rgba(250, 248, 245, 0.08);
    border-radius: 2rem;
}

/* Inner core — the actual tab bar */
.nav-bottom-bar {
    display: flex;
    align-items: stretch;
    height: var(--nav-bottom-bar-height);
    background: var(--nav-bottom-bar-bg);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-radius: calc(2rem - 6px);
    box-shadow: inset 0 1px 1px rgba(250, 248, 245, 0.08);
    overflow: hidden;
}
```

- [ ] **Step 8: Add tab stagger animation class**

Find `.nav-bottom-tab` (around line 355). After its closing brace, insert:

```css
/* Staggered entry — each tab gets a delay via inline style */
.nav-bottom-tab--entering {
    animation: navTabSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

- [ ] **Step 9: Add editorial title CSS**

Find the `/* ── Nav Menu — mobile ── */` media query (around line 441). Before it, insert:

```css
/* ── Nav Menu — editorial title ── */
.nav-editorial-title {
    position: absolute;
    bottom: 140px;
    left: 44px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
    animation: navTitleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.nav-eyebrow-tag {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px solid rgba(250, 248, 245, 0.12);
    background: rgba(250, 248, 245, 0.04);
    font-family: var(--font-ui);
    font-size: 0.5625rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--nav-eyebrow-color);
}

.nav-editorial-heading {
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--nav-title-color);
    margin: 0;
}
```

- [ ] **Step 10: Update mobile media query for new elements**

Find the `@media (max-width: 767px)` block for nav (around line 441). Add rules for the new elements. The current block ends with `.nav-tab-metric { font-size: 0.5rem; }`. After that line, before the closing `}`, add:

```css
    .nav-bottom-bar-shell {
        bottom: 16px;
        left: 16px;
        right: 16px;
        transform: none;
    }

    .nav-bottom-bar {
        height: 72px;
    }

    .nav-editorial-title {
        bottom: 120px;
        left: 24px;
    }

    .nav-editorial-heading {
        font-size: clamp(1.75rem, 8vw, 2.5rem);
    }
```

- [ ] **Step 11: Update reduced-motion block for new elements**

Find the `@media (prefers-reduced-motion: reduce)` block for nav (around line 472). Add entries for the new animations. After `.nav-tab-metric { transition: none; }`, before the closing `}`, add:

```css
    .nav-grain {
        animation: none;
    }

    .nav-bottom-tab--entering {
        animation: none;
        opacity: 1;
        transform: none;
    }

    .nav-editorial-title {
        animation: none;
        opacity: 1;
        transform: none;
    }
```

- [ ] **Step 12: Verify CSS compiles**

Run:
```bash
rtk npm run lint
```
Expected: No TypeScript errors. If the command is not `lint` (which runs `tsc --noEmit`), run:
```bash
rtk npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 13: Commit**

```bash
rtk git add src/design-tokens.css
rtk git commit -m "style(nav): warm Banderas palette, editorial tokens, floating island CSS, film grain"
```

---

### Task 2: Create NavEditorialTitle Component

**Files:**
- Create: `src/components/NavMenu/NavEditorialTitle.tsx`

- [ ] **Step 1: Create the component file**

Create a new file at `src/components/NavMenu/NavEditorialTitle.tsx` with the following exact content:

```tsx
import React from 'react';

interface NavEditorialTitleProps {
  label: string;
}

export default function NavEditorialTitle({ label }: NavEditorialTitleProps) {
  return (
    <div className="nav-editorial-title" aria-hidden="true">
      <span className="nav-eyebrow-tag">Navigation</span>
      <h2 className="nav-editorial-heading">{label}</h2>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
rtk npm run lint
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/NavMenu/NavEditorialTitle.tsx
rtk git commit -m "feat(nav): add NavEditorialTitle component with eyebrow tag and serif heading"
```

---

### Task 3: Fix NavImagePanel — Opacity Crossfade + Cinematic Grade

**Files:**
- Modify: `src/components/NavMenu/NavImagePanel.tsx`

- [ ] **Step 1: Replace clipPath animation with opacity crossfade**

Open `src/components/NavMenu/NavImagePanel.tsx`. Find the `<motion.div>` block (lines 37–62). Replace it entirely:

Current (lines 37–62):
```tsx
        <motion.div
          key={activeIndex}
          className="nav-image-layer"
          initial={shouldReduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          exit={
            shouldReduce
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }
          }
          transition={
            shouldReduce
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.23, 1, 0.32, 1] }
          }
        >
          <picture>
            <source srcSet={item.imageWebp} type="image/webp" />
            <img
              src={item.image}
              alt=""
              className={loadedIds[item.id] ? 'loaded' : ''}
              onLoad={() => handleLoad(item.id)}
            />
          </picture>
        </motion.div>
```

Replace with:
```tsx
        <motion.div
          key={activeIndex}
          className="nav-image-layer"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={
            shouldReduce
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }
          }
          transition={
            shouldReduce
              ? { duration: 0 }
              : { duration: 0.55, ease: [0.23, 1, 0.32, 1] }
          }
        >
          <picture>
            <source srcSet={item.imageWebp} type="image/webp" />
            <img
              src={item.image}
              alt=""
              className={`cinematic-grade${loadedIds[item.id] ? ' loaded' : ''}`}
              onLoad={() => handleLoad(item.id)}
            />
          </picture>
        </motion.div>
```

Key changes:
1. `clipPath: 'inset(0 100% 0 0)'` → `opacity: 0` (GPU-safe)
2. `clipPath: 'inset(0 0% 0 0)'` → `opacity: 1` (GPU-safe)
3. Exit duration `0.18` → `0.25` (smoother crossfade)
4. Enter duration `0.45` → `0.55` (smoother crossfade)
5. Added `cinematic-grade` class to the `<img>` tag

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
rtk npm run lint
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/NavMenu/NavImagePanel.tsx
rtk git commit -m "fix(nav): replace clipPath wipe with opacity crossfade, add cinematic-grade to images"
```

---

### Task 4: Rebuild NavBottomBar — Floating Island + Stagger + Hover

**Files:**
- Modify: `src/components/NavMenu/NavBottomBar.tsx`

- [ ] **Step 1: Replace the entire NavBottomBar component**

Open `src/components/NavMenu/NavBottomBar.tsx`. Replace the entire file content with:

```tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ScreenType } from '../../types';

interface NavBottomItem {
  id: string;
  label: string;
  metric: string;
  screen: ScreenType;
}

interface NavBottomBarProps {
  items: NavBottomItem[];
  activeIndex: number;
  previousScreen?: ScreenType;
  onTabChange: (index: number) => void;
  onTabConfirm: (screen: ScreenType, id: string) => void;
}

export default function NavBottomBar({
  items,
  activeIndex,
  previousScreen,
  onTabChange,
  onTabConfirm,
}: NavBottomBarProps) {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="nav-bottom-bar-shell">
      <nav
        role="tablist"
        aria-label="Navigation sections"
        className="nav-bottom-bar"
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          const isCurrent = item.screen === previousScreen;

          return (
            <motion.button
              key={item.id}
              role="tab"
              id={`nav-tab-${item.id}`}
              aria-selected={isActive}
              aria-label={`Navigate to ${item.label}`}
              tabIndex={isActive ? 0 : -1}
              className={`nav-bottom-tab${!hasEntered ? ' nav-bottom-tab--entering' : ''}`}
              data-current={isCurrent || undefined}
              style={!hasEntered ? { animationDelay: `${i * 80}ms` } : undefined}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              onMouseEnter={() => onTabChange(i)}
              onFocus={() => onTabChange(i)}
              onClick={() => onTabConfirm(item.screen, item.id)}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-tab-indicator"
                  className="nav-tab-indicator"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                />
              )}

              <span className="nav-tab-label">{item.label}</span>
              <span className="nav-tab-metric">{item.metric}</span>

              {isCurrent && (
                <span className="nav-tab-current-dot" aria-hidden="true" />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
```

Key changes:
1. Outer wrapper `<div className="nav-bottom-bar-shell">` added (double-bezel outer shell)
2. `useState` and `useEffect` added for staggered entry timing
3. `hasEntered` state starts `false`, flips to `true` after 600ms
4. Each tab gets `nav-bottom-tab--entering` class with `animationDelay: ${i * 80}ms`
5. After `hasEntered` becomes `true`, the entering class is removed (animation complete)

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
rtk npm run lint
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/NavMenu/NavBottomBar.tsx
rtk git commit -m "feat(nav): floating island bottom bar with double-bezel and staggered entry"
```

---

### Task 5: Wire NavMenuView — Editorial Title + Header Updates

**Files:**
- Modify: `src/components/NavMenuView.tsx`

- [ ] **Step 1: Import NavEditorialTitle**

Open `src/components/NavMenuView.tsx`. Find line 8:

```tsx
import NavBottomBar from './NavMenu/NavBottomBar';
```

After it, add:

```tsx
import NavEditorialTitle from './NavMenu/NavEditorialTitle';
```

- [ ] **Step 2: Update header inline styles**

Find the `<header>` element (around line 212–214):

```tsx
      <header
        className="nav-header absolute top-0 left-0 right-0 z-[100] flex items-center justify-between"
        style={{ height: 'var(--nav-header-height)', padding: '0 44px' }}
      >
```

Replace with:

```tsx
      <header
        className="nav-header absolute top-0 left-0 right-0 flex items-center justify-between"
        style={{ height: 'var(--nav-header-height)', padding: '0 56px' }}
      >
```

Changes: Removed `z-[100]` (now handled by CSS `.nav-header { z-index: 40 }`), increased padding from `44px` to `56px`.

- [ ] **Step 3: Add NavEditorialTitle and film-grain overlay to the render tree**

Find the `{/* Bottom tab bar */}` comment (around line 241). Before it, insert the new components:

Current (lines 236–248):
```tsx
      {/* Screen-reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Bottom tab bar */}
      <NavBottomBar
        items={menuItems}
        activeIndex={activeIndex}
        previousScreen={previousScreen}
        onTabChange={setActiveIndex}
        onTabConfirm={handleTabConfirm}
      />
```

Replace with:

```tsx
      {/* Screen-reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Film-grain texture overlay */}
      <div className="nav-grain" aria-hidden="true" />

      {/* Editorial section title */}
      <NavEditorialTitle label={menuItems[activeIndex].label} />

      {/* Bottom tab bar */}
      <NavBottomBar
        items={menuItems}
        activeIndex={activeIndex}
        previousScreen={previousScreen}
        onTabChange={setActiveIndex}
        onTabConfirm={handleTabConfirm}
      />
```

- [ ] **Step 4: Verify TypeScript compiles**

Run:
```bash
rtk npm run lint
```
Expected: No errors.

- [ ] **Step 5: Run existing tests**

Run:
```bash
rtk npx vitest run tests/components/NavMenuView.test.tsx
```
Expected: All existing tests pass. If any test checks for `z-[100]` or `clipPath`, update the test to match the new values.

- [ ] **Step 6: Commit**

```bash
rtk git add src/components/NavMenuView.tsx
rtk git commit -m "feat(nav): wire editorial title, film grain, remove z-[100], increase header padding"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Run full type check**

```bash
rtk npm run lint
```
Expected: No errors.

- [ ] **Step 2: Run full test suite**

```bash
rtk npx vitest run
```
Expected: All tests pass.

- [ ] **Step 3: Run build**

```bash
rtk npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Visual verification**

Run the dev server:
```bash
npm run dev
```
Open `http://localhost:4000` in a browser. Navigate to the nav menu. Verify:
1. Background is warm Banderas Midnight (`#162732`), not cool gray
2. Photography has warm matte film look (desaturated, slight sepia)
3. Images crossfade with opacity (no horizontal wipe)
4. Bottom bar is a floating glass island with rounded corners, not edge-to-edge
5. Bottom tabs stagger in on first appearance
6. A large italic serif heading ("Overview", "Revenue", etc.) appears in the lower-left
7. An eyebrow pill ("NAVIGATION") sits above the heading
8. The wordmark "Vallarta Estates" is in italic serif, not sans-serif uppercase
9. Active indicator line and "you are here" dot are Sunset Ochre (`#d49a55`)
10. A subtle film-grain texture is visible over the entire screen
11. Close button circle still works (hover, active, focus-visible)

- [ ] **Step 5: Final commit (if any fixes needed)**

If any visual issues required code fixes during Step 4, commit them:
```bash
rtk git add -A
rtk git commit -m "fix(nav): visual polish pass after review"
```

---

## Self-Review Checklist

| Spec Requirement | Task Coverage |
|-----------------|---------------|
| Warm Banderas palette (replace cool grays) | Task 1, Steps 1, 5 |
| EB Garamond serif in wordmark + title | Task 1, Step 5; Task 2; Task 5, Step 2 |
| Sunset Ochre accent | Task 1, Step 1 |
| Cinematic grade on images | Task 3, Step 1 |
| Film-grain texture overlay | Task 1, Step 6; Task 5, Step 3 |
| Replace clipPath with transform/opacity | Task 3, Step 1 |
| Fix Ken Burns easing (no ease-in-out) | Task 1, Step 3 |
| Fix will-change (clip-path → transform) | Task 1, Step 4 |
| Double-bezel bottom bar | Task 1, Step 7; Task 4, Step 1 |
| Floating island (not edge-to-edge) | Task 1, Step 7 |
| Staggered tab entry animation | Task 1, Steps 2, 8; Task 4, Step 1 |
| Editorial display title with eyebrow | Task 1, Step 9; Task 2; Task 5, Step 3 |
| Z-index discipline (remove z-[100]) | Task 1, Step 5; Task 5, Step 2 |
| Increased macro-whitespace | Task 1, Step 5; Task 5, Step 2 |
| Reduced-motion support | Task 1, Step 11 |
| Mobile responsive | Task 1, Step 10 |
