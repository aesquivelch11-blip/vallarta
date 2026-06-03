# Nav Menu 4-Panel Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the photo-background vertical-list nav menu with a full-screen 4-panel horizontal card grid where hovering a panel expands it via Framer Motion layout animation.

**Architecture:** Four `motion.div` panels sit in a `flex-row` container; `flexGrow` on each panel changes on hover and Framer Motion's `layout` prop animates the visual resize. The header (wordmark, logout, close) floats above all panels at `z-index: 30`. Mount stagger animation runs on a separate inner `motion.div` per panel so it doesn't conflict with the layout animation.

**Tech Stack:** React 18, Framer Motion (`motion/react`), Tailwind CSS v4, Lucide React, CSS custom properties (design tokens)

---

## File Map

| File | What changes |
|---|---|
| `src/design-tokens.css` | Add 4 ambient glow CSS vars under the nav card section |
| `src/components/NavMenuView.tsx` | Full rewrite — new layout, remove photo bg, origin screen logic, footer |
| `src/App.tsx` | Remove `originScreen` derivation and prop from nav_menu case |

---

### Task 1: Add ambient glow tokens to design-tokens.css

**Files:**
- Modify: `src/design-tokens.css` (around line 101–108, after `--nav-card-border-hover`)

- [ ] **Step 1: Open `src/design-tokens.css` and locate the nav card token block**

The block starts at line 101:
```css
/* --- Nav Menu Cards --- */
--nav-card-estates-bg: oklch(18% 0.04 145);
--nav-card-financial-bg: oklch(15% 0.03 260);
--nav-card-operations-bg: oklch(16% 0.04 65);
--nav-card-calendar-bg: oklch(14% 0.03 185);
--nav-card-border: oklch(75% 0.06 80 / 0.25);
--nav-card-border-hover: oklch(75% 0.06 80 / 0.6);
--nav-card-text-shadow: 0 2px 12px oklch(10% 0.01 60 / 0.6);
```

- [ ] **Step 2: Add glow vars immediately after `--nav-card-text-shadow`**

```css
  --nav-card-estates-glow: oklch(32% 0.09 145);
  --nav-card-financial-glow: oklch(28% 0.08 260);
  --nav-card-operations-glow: oklch(30% 0.10 65);
  --nav-card-calendar-glow: oklch(26% 0.08 185);
```

The full nav card block should now read:

```css
  /* --- Nav Menu Cards --- */
  --nav-card-estates-bg: oklch(18% 0.04 145);
  --nav-card-financial-bg: oklch(15% 0.03 260);
  --nav-card-operations-bg: oklch(16% 0.04 65);
  --nav-card-calendar-bg: oklch(14% 0.03 185);
  --nav-card-border: oklch(75% 0.06 80 / 0.25);
  --nav-card-border-hover: oklch(75% 0.06 80 / 0.6);
  --nav-card-text-shadow: 0 2px 12px oklch(10% 0.01 60 / 0.6);
  --nav-card-estates-glow: oklch(32% 0.09 145);
  --nav-card-financial-glow: oklch(28% 0.08 260);
  --nav-card-operations-glow: oklch(30% 0.10 65);
  --nav-card-calendar-glow: oklch(26% 0.08 185);
```

- [ ] **Step 3: Commit**

```bash
git add src/design-tokens.css
git commit -m "feat(nav): add ambient glow CSS tokens for 4-panel cards"
```

---

### Task 2: Rewrite NavMenuView.tsx

**Files:**
- Modify: `src/components/NavMenuView.tsx` (full rewrite)

The current file is 215 lines. This task replaces it entirely.

**Important context before writing:**
- `LayoutGroup` and `motion` both come from `'motion/react'` — same package already imported
- `--nav-card-*-bg` and `--nav-card-*-glow` are CSS custom properties — use as `var(--nav-card-estates-bg)` in inline styles
- `nav-close-btn` CSS class is defined in `src/design-tokens.css` (line 118–125) — keep using it
- `--nav-text-shadow-base`, `--nav-card-text-shadow` exist in design-tokens.css — use for text shadows
- Font families must be inline styles (`fontFamily: 'var(--font-display)'`) — no Tailwind font utilities exist for these

- [ ] **Step 1: Replace the entire file with the new implementation**

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { X, LogOut } from 'lucide-react';
import { ScreenType } from '../types';

interface NavMenuViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  dataValue: string;
  screen: ScreenType;
  bgVar: string;
  glowVar: string;
  index: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'estates',
    label: 'The Estates',
    subtitle: 'Portfolio Overview',
    dataValue: '4 Active Stays',
    screen: 'reporting',
    bgVar: '--nav-card-estates-bg',
    glowVar: '--nav-card-estates-glow',
    index: '01',
  },
  {
    id: 'financial',
    label: 'Financial',
    subtitle: 'Yield Revenue',
    dataValue: '$12.4K MTD',
    screen: 'deep_dive',
    bgVar: '--nav-card-financial-bg',
    glowVar: '--nav-card-financial-glow',
    index: '02',
  },
  {
    id: 'operations',
    label: 'Operations',
    subtitle: 'Live Supervision',
    dataValue: '2 Cameras Online',
    screen: 'camera_expanded',
    bgVar: '--nav-card-operations-bg',
    glowVar: '--nav-card-operations-glow',
    index: '03',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    subtitle: 'Reservations',
    dataValue: '3 Arrivals This Week',
    screen: 'calendar',
    bgVar: '--nav-card-calendar-bg',
    glowVar: '--nav-card-calendar-glow',
    index: '04',
  },
];

export default function NavMenuView({ onNavigate, onClose, onNotify }: NavMenuViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [logoutPending, setLogoutPending] = useState(false);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const handleLogoutClick = () => {
    if (logoutPending) {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      setLogoutPending(false);
      onNavigate('login', 'push');
    } else {
      setLogoutPending(true);
      onNotify?.('Tap again to confirm logout');
      logoutTimerRef.current = setTimeout(() => setLogoutPending(false), 3000);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden">
      {/* Header — floats above all panels */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-16 pt-10 md:pt-16">
        <p
          className="text-[0.6875rem] font-medium tracking-[0.35em] text-white/90 uppercase"
          style={{ fontFamily: 'var(--font-ui)', textShadow: 'var(--nav-text-shadow-base)' }}
        >
          Vallarta Estates
        </p>
        <div className="flex items-center gap-6">
          <button
            onClick={handleLogoutClick}
            className={`flex items-center gap-2 text-[0.6875rem] tracking-[0.15em] uppercase transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm cursor-pointer ${
              logoutPending ? 'text-white' : 'text-white/50 hover:text-white'
            }`}
            style={{ fontFamily: 'var(--font-ui)', textShadow: 'var(--nav-text-shadow-base)' }}
            aria-label={logoutPending ? 'Confirm logout' : 'Logout'}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            {logoutPending ? 'Confirm?' : 'Logout'}
          </button>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="nav-close-btn w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <X className="w-4 h-4 text-white" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* 4-panel grid */}
      <LayoutGroup>
        <div className="flex w-full h-full">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              className="relative h-full overflow-hidden cursor-pointer border-r border-white/[0.06] last:border-r-0 outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                flexGrow: hoveredId === item.id ? 3.5 : 1,
                flexShrink: 1,
                flexBasis: 0,
                background: `var(${item.bgVar})`,
              }}
              transition={{ layout: { type: 'spring', stiffness: 280, damping: 30 } }}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => onNavigate(item.screen, 'push')}
              tabIndex={0}
              role="button"
              aria-label={item.label}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(item.screen, 'push');
                }
              }}
              onFocus={() => setHoveredId(item.id)}
              onBlur={() => setHoveredId(null)}
            >
              {/* Ambient glow at top */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 120% 45% at 50% 0%, var(${item.glowVar}) 0%, transparent 70%)`,
                }}
              />

              {/* Mount stagger wrapper — separate from layout motion.div to avoid conflicts */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 * index,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Bottom-anchored content */}
                <div className="absolute bottom-0 left-0 right-0 p-[clamp(1.5rem,5vh,3.5rem)]">
                  <span
                    className="block text-[0.625rem] tracking-[0.3em] text-white/40 mb-3"
                    style={{ fontFamily: 'var(--font-ui)', textShadow: 'var(--nav-text-shadow-base)' }}
                  >
                    {item.index}
                  </span>

                  <motion.span
                    className="block text-[clamp(1.75rem,3vw,3.5rem)] font-light leading-[1.1] text-white/90 mb-4"
                    style={{
                      fontFamily: 'var(--font-display)',
                      textShadow: 'var(--nav-card-text-shadow)',
                    }}
                    animate={{ scale: hoveredId === item.id ? 1.03 : 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Subtitle / dataValue crossfade — same dual-span technique as previous design */}
                  <div className="relative h-[1.4em]">
                    <span
                      className="absolute inset-0 text-[0.6875rem] tracking-[0.2em] text-white/60 uppercase leading-none transition-opacity duration-300"
                      style={{ fontFamily: 'var(--font-ui)', opacity: hoveredId === item.id ? 0 : 1 }}
                    >
                      {item.subtitle}
                    </span>
                    <span
                      className="absolute inset-0 text-[0.6875rem] tracking-[0.2em] text-white/60 uppercase leading-none transition-opacity duration-300"
                      style={{ fontFamily: 'var(--font-ui)', opacity: hoveredId === item.id ? 1 : 0 }}
                    >
                      {item.dataValue}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles without errors**

Run:
```bash
npm run lint
```
Expected: no output (exit 0). If you see `error TS2339: Property 'originScreen' does not exist`, that means App.tsx still passes the old prop — fix in Task 3.

- [ ] **Step 3: Start dev server and visually verify in browser at http://localhost:4000**

Run:
```bash
npm run dev
```

Navigate to the nav menu (sign in from login screen, or navigate directly). Check:
- 4 dark panels fill full screen horizontally
- Hovering any panel expands it smoothly, others compress
- Bottom of each panel shows: index number, section title, subtitle (crossfades to dataValue on hover)
- Header shows wordmark left, Logout + X right
- Logout tap 1: label changes to "Confirm?" and toast fires
- Logout tap 2: navigates to login
- Close (×) returns to previous screen
- Title scales slightly on hover

- [ ] **Step 4: Commit**

```bash
git add src/components/NavMenuView.tsx
git commit -m "feat(nav): rewrite as 4-panel horizontal hub with Framer Motion expand"
```

---

### Task 3: Remove originScreen from App.tsx

**Files:**
- Modify: `src/App.tsx` lines 128–140

The `nav_menu` case in `renderActiveScreen()` currently derives `originScreen` from history and passes it to `NavMenuView`. `NavMenuViewProps` no longer accepts that prop, so it must be removed.

- [ ] **Step 1: Update the nav_menu case in App.tsx**

Find this block (lines 128–140):
```tsx
case 'nav_menu': {
  const originScreen = history[history.length - 2] as ScreenType | undefined;
  return (
    <div key="nav_menu" className="w-full min-h-screen">
      <NavMenuView 
        onNavigate={(screen, style) => handleNavigate(screen, style)} 
        onClose={handleCloseNavMenu} 
        onNotify={triggerToast}
        originScreen={originScreen}
      />
    </div>
  );
}
```

Replace with:
```tsx
case 'nav_menu':
  return (
    <div key="nav_menu" className="w-full min-h-screen">
      <NavMenuView
        onNavigate={(screen, style) => handleNavigate(screen, style)}
        onClose={handleCloseNavMenu}
        onNotify={triggerToast}
      />
    </div>
  );
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npm run lint
```
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "refactor(app): remove originScreen from NavMenuView — hub model has no active panel"
```

---

### Task 4: Reduced motion support

**Files:**
- Modify: `src/components/NavMenuView.tsx`

Users who prefer reduced motion should see no expand animation or stagger — panels should appear instantly and stay equal width.

- [ ] **Step 1: Import `useReducedMotion` and apply it**

At the top of `NavMenuView`, after the existing imports, add:
```tsx
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
```

Inside the component function, after the state declarations:
```tsx
const prefersReducedMotion = useReducedMotion();
```

- [ ] **Step 2: Apply reduced motion to panel flex and mount animation**

In the panel `motion.div`, change the `style` `flexGrow` line and `transition`:
```tsx
style={{
  flexGrow: prefersReducedMotion ? 1 : (hoveredId === item.id ? 3.5 : 1),
  flexShrink: 1,
  flexBasis: 0,
  background: `var(${item.bgVar})`,
}}
transition={{ layout: prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 30 } }}
```

In the inner mount stagger `motion.div`, add:
```tsx
transition={
  prefersReducedMotion
    ? { duration: 0, delay: 0 }
    : { duration: 0.5, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }
}
```

In the title scale `motion.span`:
```tsx
animate={{ scale: (!prefersReducedMotion && hoveredId === item.id) ? 1.03 : 1 }}
transition={{ type: 'spring', stiffness: 280, damping: 30 }}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```bash
npm run lint
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavMenuView.tsx
git commit -m "feat(nav): respect prefers-reduced-motion — skip expand and stagger animations"
```

---

## Self-Review

**Spec coverage check:**
- ✅ 4 full-height panels, flex-row layout
- ✅ Each panel: distinct bg from card tokens
- ✅ Top ambient glow via radial-gradient + glow tokens (Task 1)
- ✅ Section number, title (EB Garamond), subtitle/dataValue crossfade
- ✅ Hover expand: Framer Motion `layout` + `flexGrow` change
- ✅ Spring: stiffness 280, damping 30
- ✅ Title `scale: 1.03` on hover
- ✅ Stagger mount animation (inner motion.div, 0.08 * index delay)
- ✅ Header: wordmark, logout (two-tap confirm), close X
- ✅ `originScreen` removed from NavMenuViewProps and App.tsx
- ✅ Photo bg, scrim, footer, numeric counter — all removed
- ✅ Accessibility: `aria-label`, `tabIndex`, `role="button"`, keyboard nav, `focus-visible` ring
- ✅ `prefers-reduced-motion` (Task 4)

**Placeholder scan:** None found.

**Type consistency:** `MenuItem.bgVar` and `MenuItem.glowVar` used as `var(${item.bgVar})` in inline styles throughout Tasks 2 and 4. `NavMenuViewProps` — `originScreen` removed in Task 2 definition and Task 3 call site. `useReducedMotion` imported in Task 4 before use.
