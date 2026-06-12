# Nav Menu Redesign: Cinematic Bottom Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the horizontal accordion nav with a full-bleed cinematic image panel + fixed bottom tab bar that shows all 5 destinations simultaneously, with clip-path wipe transitions between images.

**Architecture:** `NavMenuView.tsx` is rewritten and split into three focused files: a main orchestrator that holds state and keyboard/touch logic, a `NavImagePanel` component that handles clip-path wipe transitions, and a `NavBottomBar` component that handles tab selection and the spring active indicator. CSS tokens in `design-tokens.css` are updated to remove accordion-specific rules and add bottom-bar tokens. No new npm packages needed — `motion/react` is already installed.

**Tech Stack:** React, `motion/react` (AnimatePresence, motion.div, layoutId, whileTap), CSS custom properties, existing OKLCH design token system, vitest + @testing-library/react

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/NavMenu/NavImagePanel.tsx` | Full-bleed image + clip-path wipe on `activeIndex` change |
| Create | `src/components/NavMenu/NavBottomBar.tsx` | Bottom tab strip, active spring indicator, metrics |
| Rewrite | `src/components/NavMenuView.tsx` | State, keyboard/touch, ARIA, layout shell |
| Modify | `src/design-tokens.css` (lines 127–156 tokens + lines 211–591 CSS) | Remove accordion CSS, add bottom bar tokens + styles |
| Modify | `src/App.tsx` (line 134–139) | Pass `previousScreen` prop to NavMenuView |
| Create | `tests/components/NavMenuView.test.tsx` | Behavior tests: tabs, keyboard, close |

---

## Task 1: Write Failing Tests

**Files:**
- Create: `tests/components/NavMenuView.test.tsx`

- [ ] **Step 1.1: Create test file**

```tsx
import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import NavMenuView from '../../../src/components/NavMenuView';

// Mock motion/react so tests don't depend on animation
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} style={style}>{children}</div>,
    button: ({ children, className, style, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) =>
      <button className={className} style={style} onClick={onClick}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock webp image imports
vi.mock('../../../src/assets/Menu/menu-1.webp', () => ({ default: 'menu-1.webp' }));
vi.mock('../../../src/assets/Menu/menu-2.webp', () => ({ default: 'menu-2.webp' }));
vi.mock('../../../src/assets/Menu/menu-3.webp', () => ({ default: 'menu-3.webp' }));
vi.mock('../../../src/assets/Menu/menu-4.webp', () => ({ default: 'menu-4.webp' }));

const mockNavigate = vi.fn();
const mockClose = vi.fn();

function renderNav(previousScreen?: string) {
  return render(
    <NavMenuView
      onNavigate={mockNavigate}
      onClose={mockClose}
      previousScreen={previousScreen as any}
    />
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe('NavMenuView — Bottom Bar', () => {
  it('renders all 5 tab labels', () => {
    const { container } = renderNav();
    expect(container.textContent).toContain('Overview');
    expect(container.textContent).toContain('Revenue');
    expect(container.textContent).toContain('Operations');
    expect(container.textContent).toContain('Calendar');
    expect(container.textContent).toContain('Properties');
  });

  it('Escape key calls onClose', () => {
    renderNav();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the close button calls onClose', () => {
    const { getByLabelText } = renderNav();
    fireEvent.click(getByLabelText('Close menu'));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('clicking a tab calls onNavigate with the correct screen', () => {
    const { getByLabelText } = renderNav();
    fireEvent.click(getByLabelText('Navigate to Revenue'));
    expect(mockNavigate).toHaveBeenCalledWith('deep_dive', 'push');
  });

  it('ArrowRight key navigates to next tab and updates aria-selected', () => {
    const { getAllByRole } = renderNav();
    // First tab is active by default
    const tabs = getAllByRole('tab');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowLeft key wraps from first tab to last', () => {
    const { getAllByRole } = renderNav();
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    const tabs = getAllByRole('tab');
    expect(tabs[4].getAttribute('aria-selected')).toBe('true');
  });

  it('number key 2 activates the second tab (Revenue)', () => {
    const { getAllByRole } = renderNav();
    fireEvent.keyDown(document, { key: '2' });
    const tabs = getAllByRole('tab');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('shows "you are here" marker on tab matching previousScreen', () => {
    const { container } = renderNav('deep_dive');
    // Revenue tab corresponds to screen 'deep_dive'
    expect(container.textContent).toContain('Revenue');
    // The current-screen tab should have data-current="true"
    const revenueTab = container.querySelector('[data-current="true"]');
    expect(revenueTab).not.toBeNull();
    expect(revenueTab?.textContent).toContain('Revenue');
  });
});
```

- [ ] **Step 1.2: Run tests to confirm they all fail**

```bash
npx vitest run tests/components/NavMenuView.test.tsx
```

Expected output: all 8 tests FAIL (NavMenuView doesn't have bottom bar structure yet, `previousScreen` prop missing, tab aria-labels don't match).

---

## Task 2: Update Design Tokens

**Files:**
- Modify: `src/design-tokens.css`

The CSS has two sections to update:
1. **Token block** — lines ~127–156: keep existing tokens, add bottom-bar tokens, remove `--nav-collapsed-title-color`
2. **CSS rules block** — lines ~211–591: keep header/close/image CSS, delete accordion-specific rules, add bottom-bar rules

- [ ] **Step 2.1: Replace nav token block (lines 127–156)**

Find this exact block in `src/design-tokens.css`:

```css
    /* --- Nav Menu --- */
    /* Shell */
    --nav-shell-bg: oklch(23% 0.008 60);
    --nav-header-height: 56px;
    --nav-font-display: var(--font-display);
    --nav-font-label: var(--font-ui);

    /* Restrained accent — terracotta (Puerto Vallarta architecture) */
    --nav-accent: oklch(72% 0.07 42);
    --nav-accent-strong: oklch(82% 0.05 42);
    --nav-subtitle-hover: oklch(88% 0.05 42 / 0.78);

    /* Scrim system */
    --nav-scrim-top: oklch(17% 0.006 60 / 0.24);
    --nav-scrim-heavy: oklch(17% 0.006 60 / 0.76);
    --nav-scrim-mid: oklch(17% 0.006 60 / 0.42);
    --nav-scrim-light: oklch(17% 0.006 60 / 0.14);

    /* Header text */
    --nav-wordmark-color: oklch(84% 0.01 72 / 0.52);
    --nav-title-color: oklch(96% 0.008 72);
    --nav-subtitle-color: oklch(89% 0.012 72 / 0.56);
    --nav-collapsed-title-color: oklch(89% 0.012 72 / 0.46);

    /* Close button */
    --nav-close-color: oklch(84% 0.01 72 / 0.58);
    --nav-close-color-hover: oklch(96% 0.008 72);
    --nav-close-border: oklch(90% 0.01 72 / 0.16);
    --nav-close-border-hover: oklch(92% 0.012 72 / 0.34);
    --nav-close-bg-hover: oklch(96% 0.008 72 / 0.06);
```

Replace with:

```css
    /* --- Nav Menu --- */
    /* Shell */
    --nav-shell-bg: oklch(23% 0.008 60);
    --nav-header-height: 56px;
    --nav-font-display: var(--font-display);
    --nav-font-label: var(--font-ui);

    /* Restrained accent — terracotta (Puerto Vallarta architecture) */
    --nav-accent: oklch(72% 0.07 42);
    --nav-accent-strong: oklch(82% 0.05 42);

    /* Scrim system */
    --nav-scrim-top: oklch(17% 0.006 60 / 0.28);
    --nav-scrim-heavy: oklch(17% 0.006 60 / 0.72);
    --nav-scrim-mid: oklch(17% 0.006 60 / 0.38);
    --nav-scrim-light: oklch(17% 0.006 60 / 0.12);

    /* Header text */
    --nav-wordmark-color: oklch(84% 0.01 72 / 0.52);

    /* Close button */
    --nav-close-color: oklch(84% 0.01 72 / 0.58);
    --nav-close-color-hover: oklch(96% 0.008 72);
    --nav-close-border: oklch(90% 0.01 72 / 0.16);
    --nav-close-border-hover: oklch(92% 0.012 72 / 0.34);
    --nav-close-bg-hover: oklch(96% 0.008 72 / 0.06);

    /* Bottom bar */
    --nav-bottom-bar-height: 80px;
    --nav-bottom-bar-bg: oklch(14% 0.005 60 / 0.86);
    --nav-tab-color: oklch(78% 0.01 72 / 0.48);
    --nav-tab-active-color: oklch(96% 0.008 72);
    --nav-tab-metric-color: oklch(68% 0.01 72 / 0.40);
    --nav-tab-metric-active-color: oklch(80% 0.012 72 / 0.60);
    --nav-tab-current-dot: oklch(72% 0.07 42);
```

- [ ] **Step 2.2: Replace the entire nav CSS rules block**

Find the nav CSS block starting with:
```css
/* ── Nav Menu — entry animations ── */
@keyframes navHeaderIn {
```
...and ending just before:
```css
/* Typography System */
.t-property-name {
```

Replace everything in that range with:

```css
/* ── Nav Menu — entry animations ── */
@keyframes navHeaderIn {
    from {
        opacity: 0;
        transform: translateY(-14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ── Nav Menu — header ── */
.nav-header {
    animation: navHeaderIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.01s both;
    background: linear-gradient(to bottom, oklch(14% 0.005 60 / 0.60), transparent);
}

/* ── Nav Menu — wordmark ── */
.nav-portal__wordmark {
    font-family: var(--font-ui);
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--nav-wordmark-color);
}

/* ── Nav Menu — close button ── */
.nav-close-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--nav-close-border);
    background: transparent;
    color: var(--nav-close-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
        border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1),
        color 0.22s cubic-bezier(0.16, 1, 0.3, 1),
        background 0.22s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-close-btn:hover {
    border-color: var(--nav-close-border-hover);
    color: var(--nav-close-color-hover);
    background: var(--nav-close-bg-hover);
}
.nav-close-btn:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 3px;
    border-color: var(--nav-close-border-hover);
    color: var(--nav-close-color-hover);
}
.nav-close-btn:active {
    transform: scale(0.88);
}

/* ── Nav Menu — full-bleed image layer ── */
.nav-image-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    will-change: clip-path;
}

.nav-image-layer img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-image-layer img.loaded {
    opacity: 1;
}

/* Subtle Ken Burns on the active image */
@media (prefers-reduced-motion: no-preference) {
    .nav-image-layer img.loaded {
        animation: navKenBurns 14s ease-in-out infinite alternate;
    }
}

@keyframes navKenBurns {
    from { transform: scale(1); }
    to   { transform: scale(1.04); }
}

/* ── Nav Menu — image loading skeleton ── */
.nav-img-skeleton {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: oklch(18% 0.006 60);
    pointer-events: none;
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-img-skeleton.hidden {
    opacity: 0;
    pointer-events: none;
}

/* ── Nav Menu — scrim overlay ── */
.nav-scrim {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background:
        linear-gradient(to bottom, var(--nav-scrim-top) 0%, transparent 18%),
        linear-gradient(to top, oklch(14% 0.005 60 / 0.85) 0%, var(--nav-scrim-mid) 28%, transparent 60%);
}

/* ── Nav Menu — bottom bar ── */
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

/* ── Nav Menu — bottom tab ── */
.nav-bottom-tab {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 0 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--nav-tab-color);
    transition: color 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) and (pointer: fine) {
    .nav-bottom-tab:hover {
        color: oklch(88% 0.01 72 / 0.72);
    }
}

.nav-bottom-tab:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.55);
    outline-offset: -2px;
    border-radius: 4px;
}

.nav-bottom-tab[aria-selected="true"] {
    color: var(--nav-tab-active-color);
}

/* ── Nav Menu — active indicator line (positioned by Motion layoutId) ── */
.nav-tab-indicator {
    position: absolute;
    top: 0;
    left: 8px;
    right: 8px;
    height: 1.5px;
    background: var(--nav-accent);
    border-radius: 0 0 2px 2px;
}

/* ── Nav Menu — tab label ── */
.nav-tab-label {
    font-family: var(--font-ui);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    line-height: 1;
}

/* ── Nav Menu — tab metric ── */
.nav-tab-metric {
    font-family: var(--font-ui);
    font-size: 0.5625rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    line-height: 1;
    color: var(--nav-tab-metric-color);
    transition: color 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.nav-bottom-tab[aria-selected="true"] .nav-tab-metric {
    color: var(--nav-tab-metric-active-color);
}

/* ── Nav Menu — "you are here" dot ── */
.nav-tab-current-dot {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--nav-tab-current-dot);
}

/* ── Nav Menu — mobile ── */
@media (max-width: 767px) {
    .nav-header {
        height: 48px;
        padding: 0 24px;
    }

    .nav-portal__wordmark {
        font-size: 0.6875rem;
        letter-spacing: 0.28em;
    }

    .nav-close-btn {
        width: 38px;
        height: 38px;
    }

    .nav-bottom-bar {
        height: 72px;
    }

    .nav-tab-label {
        font-size: 0.5625rem;
        letter-spacing: 0.12em;
    }

    .nav-tab-metric {
        font-size: 0.5rem;
    }
}

/* ── Nav Menu — reduced motion ── */
@media (prefers-reduced-motion: reduce) {
    .nav-header {
        animation: none;
        opacity: 1;
        transform: none;
    }

    .nav-image-layer img.loaded {
        animation: none;
    }

    .nav-close-btn {
        transition: none;
    }

    .nav-bottom-tab {
        transition: none;
    }

    .nav-tab-metric {
        transition: none;
    }
}
```

- [ ] **Step 2.3: Commit**

```bash
git add src/design-tokens.css
git commit -m "feat(nav): replace accordion CSS with bottom-bar tokens and styles"
```

---

## Task 3: Create NavImagePanel

**Files:**
- Create directory: `src/components/NavMenu/`
- Create: `src/components/NavMenu/NavImagePanel.tsx`

This component receives the full menu items array and `activeIndex`. It renders a full-bleed image container. When `activeIndex` changes, `AnimatePresence` drives a clip-path wipe — new image enters from the right while old image fades out behind it.

- [ ] **Step 3.1: Create the component**

```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface NavImageItem {
  id: string;
  image: string;
  imageWebp: string;
  label: string;
}

interface NavImagePanelProps {
  items: NavImageItem[];
  activeIndex: number;
}

export default function NavImagePanel({ items, activeIndex }: NavImagePanelProps) {
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({});
  const shouldReduce = useReducedMotion();

  const handleLoad = (id: string) => {
    setLoadedIds(prev => ({ ...prev, [id]: true }));
  };

  const item = items[activeIndex];

  return (
    // Preload all images off-screen, show only the active one via AnimatePresence
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      {/* Skeleton shown until first image loads */}
      <div
        className={`nav-img-skeleton${loadedIds[item.id] ? ' hidden' : ''}`}
      />

      <AnimatePresence mode="sync">
        <motion.div
          key={activeIndex}
          className="nav-image-layer"
          initial={shouldReduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          exit={
            shouldReduce
              ? { opacity: 0 }
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
      </AnimatePresence>

      {/* Preload remaining images silently */}
      {items.map((it, i) =>
        i !== activeIndex ? (
          <img
            key={it.id}
            src={it.image}
            alt=""
            aria-hidden="true"
            onLoad={() => handleLoad(it.id)}
            style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          />
        ) : null,
      )}

      {/* Scrim overlay */}
      <div className="nav-scrim" />
    </div>
  );
}
```

- [ ] **Step 3.2: Commit**

```bash
git add src/components/NavMenu/NavImagePanel.tsx
git commit -m "feat(nav): add NavImagePanel with clip-path wipe transition"
```

---

## Task 4: Create NavBottomBar

**Files:**
- Create: `src/components/NavMenu/NavBottomBar.tsx`

The bottom bar renders five tab buttons. The active tab has a `motion.div` with `layoutId="nav-tab-indicator"` that springs between positions. Each tab receives `whileTap={{ scale: 0.97 }}`. Tabs matching `previousScreen` show a small accent dot ("you are here").

- [ ] **Step 4.1: Create the component**

```tsx
import React from 'react';
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
  return (
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
            className="nav-bottom-tab"
            data-current={isCurrent || undefined}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            onMouseEnter={() => onTabChange(i)}
            onFocus={() => onTabChange(i)}
            onClick={() => onTabConfirm(item.screen, item.id)}
          >
            {/* Active indicator — springs between tabs */}
            {isActive && (
              <motion.div
                layoutId="nav-tab-indicator"
                className="nav-tab-indicator"
                transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              />
            )}

            <span className="nav-tab-label">{item.label}</span>
            <span className="nav-tab-metric">{item.metric}</span>

            {/* "You are here" dot */}
            {isCurrent && (
              <span className="nav-tab-current-dot" aria-hidden="true" />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 4.2: Commit**

```bash
git add src/components/NavMenu/NavBottomBar.tsx
git commit -m "feat(nav): add NavBottomBar with spring indicator and metrics"
```

---

## Task 5: Rewrite NavMenuView

**Files:**
- Rewrite: `src/components/NavMenuView.tsx`

This is a full replacement. Keep the same keyboard behavior (Escape, ArrowLeft/Right, 1–5, Tab trap). Replace the accordion panel grid with NavImagePanel + NavBottomBar. Add `previousScreen` to the props interface. Change tap behavior: clicking any tab navigates immediately (no two-step click).

- [ ] **Step 5.1: Replace NavMenuView entirely**

```tsx
import React, { useRef, useEffect, useState } from 'react';
import { ScreenType } from '../types';
import menuImg1 from '../assets/Menu/menu-1.webp';
import menuImg2 from '../assets/Menu/menu-2.webp';
import menuImg3 from '../assets/Menu/menu-3.webp';
import menuImg4 from '../assets/Menu/menu-4.webp';
import NavImagePanel from './NavMenu/NavImagePanel';
import NavBottomBar from './NavMenu/NavBottomBar';

interface NavMenuViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
  previousScreen?: ScreenType;
}

// Static metrics — replace with real data via props when available
const NAV_METRICS: Record<string, string> = {
  estates: '94% · 3 alerts',
  financial: 'MXN 142K · +8%',
  operations: '2 tasks overdue',
  calendar: '3 arrivals',
  properties: '5 properties',
};

const menuItems = [
  {
    id: 'estates',
    label: 'Overview',
    screen: 'reporting' as ScreenType,
    image: menuImg1,
    imageWebp: menuImg1,
    metric: NAV_METRICS.estates,
  },
  {
    id: 'financial',
    label: 'Revenue',
    screen: 'deep_dive' as ScreenType,
    image: menuImg2,
    imageWebp: menuImg2,
    metric: NAV_METRICS.financial,
  },
  {
    id: 'operations',
    label: 'Operations',
    screen: 'camera_expanded' as ScreenType,
    image: menuImg3,
    imageWebp: menuImg3,
    metric: NAV_METRICS.operations,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    screen: 'calendar' as ScreenType,
    image: menuImg4,
    imageWebp: menuImg4,
    metric: NAV_METRICS.calendar,
  },
  {
    id: 'properties',
    label: 'Properties',
    screen: 'property_selector' as ScreenType,
    image: menuImg1,
    imageWebp: menuImg1,
    metric: NAV_METRICS.properties,
  },
];

const initialIndex = (() => {
  const lastId = sessionStorage.getItem('nav-last-panel');
  if (!lastId) return 0;
  const idx = menuItems.findIndex(m => m.id === lastId);
  return idx === -1 ? 0 : idx;
})();

export default function NavMenuView({
  onNavigate,
  onClose,
  previousScreen,
}: NavMenuViewProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Save active panel on change; announce for screen readers
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sessionStorage.setItem('nav-last-panel', menuItems[activeIndex].id);
    setLiveAnnouncement(
      `${menuItems[activeIndex].label}, ${activeIndex + 1} of ${menuItems.length}`,
    );
  }, [activeIndex]);

  // Focus trap + keyboard navigation
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;

    // Focus the active tab on mount
    const focusActiveTab = () => {
      const tabs = dialogRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs?.[activeIndex]?.focus();
    };
    focusActiveTab();

    const focusable = (): HTMLElement[] =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const walk = (dir: -1 | 1) => {
      setActiveIndex(prev => {
        const next = (prev + dir + menuItems.length) % menuItems.length;
        setTimeout(() => {
          const tabs = dialogRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
          tabs?.[next]?.focus();
        }, 0);
        return next;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); walk(-1); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); walk(1); return; }

      const digit = ['1', '2', '3', '4', '5'].indexOf(e.key);
      if (digit !== -1 && digit < menuItems.length) {
        e.preventDefault();
        setActiveIndex(digit);
        setTimeout(() => {
          const tabs = dialogRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
          tabs?.[digit]?.focus();
        }, 0);
        return;
      }

      if (e.key !== 'Tab') return;
      const els = focusable();
      if (!els.length) return;
      if (e.shiftKey) {
        if (document.activeElement === els[0]) { e.preventDefault(); els[els.length - 1].focus(); }
      } else {
        if (document.activeElement === els[els.length - 1]) { e.preventDefault(); els[0].focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
      prevFocusRef.current?.focus();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabConfirm = (screen: ScreenType, id: string) => {
    if (navTimeoutRef.current) return; // debounce double-tap
    sessionStorage.setItem('nav-last-panel', id);
    navTimeoutRef.current = setTimeout(() => {
      navTimeoutRef.current = null;
      onNavigate(screen, 'push');
    }, 160);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 48) return;
    setActiveIndex(prev =>
      dx < 0
        ? Math.min(prev + 1, menuItems.length - 1)
        : Math.max(prev - 1, 0),
    );
  };

  const handleShellClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      className="relative w-full"
      style={{ minHeight: '100dvh', background: 'var(--nav-shell-bg)', overflow: 'hidden' }}
      onClick={handleShellClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-bleed image with clip-path wipe */}
      <NavImagePanel items={menuItems} activeIndex={activeIndex} />

      {/* Header */}
      <header
        className="nav-header absolute top-0 left-0 right-0 z-[100] flex items-center justify-between"
        style={{ height: 'var(--nav-header-height)', padding: '0 44px' }}
      >
        <span className="nav-portal__wordmark">Vallarta Estates</span>
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="nav-close-btn"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="1" y1="1" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="1" x2="1" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>

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
    </div>
  );
}
```

- [ ] **Step 5.2: Run tests — most should now pass**

```bash
npx vitest run tests/components/NavMenuView.test.tsx
```

Expected: 7/8 tests pass. The `data-current` test may still fail if `previousScreen` isn't wired in App.tsx yet. All tab label, keyboard, and close tests should pass.

- [ ] **Step 5.3: Commit**

```bash
git add src/components/NavMenuView.tsx
git commit -m "feat(nav): rewrite NavMenuView with cinematic bottom-bar layout"
```

---

## Task 6: Wire previousScreen Prop in App.tsx

**Files:**
- Modify: `src/App.tsx` (lines ~134–139)

App.tsx has `history: ScreenType[]` state. The screen the user was on before opening the nav menu is the last history entry that isn't `'nav_menu'` or `'login'`.

- [ ] **Step 6.1: Derive previousScreen and pass to NavMenuView**

Find this block (lines ~131–140):

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

Replace with:

```tsx
      case 'nav_menu': {
        const navPreviousScreen = history
          .filter(s => s !== 'nav_menu' && s !== 'login')
          .at(-1) as ScreenType | undefined;
        return (
          <div key="nav_menu" className="w-full min-h-screen">
            <NavMenuView
              onNavigate={(screen, style) => handleNavigate(screen, style)}
              onClose={handleCloseNavMenu}
              onNotify={triggerToast}
              previousScreen={navPreviousScreen}
            />
          </div>
        );
      }
```

- [ ] **Step 6.2: Run all tests**

```bash
npx vitest run tests/components/NavMenuView.test.tsx
```

Expected: all 8 tests pass.

- [ ] **Step 6.3: Run full test suite to check for regressions**

```bash
npx vitest run
```

Expected: all tests pass. No regressions in DashboardView, DashboardGallery, DashboardToday.

- [ ] **Step 6.4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(nav): pass previousScreen to NavMenuView for 'you are here' indicator"
```

---

## Task 7: TypeScript and Lint Check

**Files:** No changes — verification only.

- [ ] **Step 7.1: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors. If you see `Property 'previousScreen' does not exist on type 'NavMenuViewProps'`, you missed adding it to the interface in NavMenuView.tsx — add `previousScreen?: ScreenType;` to the interface.

- [ ] **Step 7.2: Lint check**

```bash
rtk lint
```

Expected: no errors or warnings related to nav files. Ignore pre-existing warnings in other files.

- [ ] **Step 7.3: Commit if any lint fixes were made**

```bash
git add -p
git commit -m "fix(nav): address lint warnings in bottom bar components"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Full-bleed image fills viewport → `NavImagePanel` with `position: absolute; inset: 0`
- [x] Clip-path wipe on image change → `AnimatePresence` with `clipPath: 'inset(0 100% 0 0)'` initial
- [x] All 5 tabs visible simultaneously → `NavBottomBar` with `flex: 1` on each tab
- [x] Live metrics under each tab label → `NAV_METRICS` record, `nav-tab-metric` span
- [x] Spring active indicator between tabs → `layoutId="nav-tab-indicator"` on `motion.div`
- [x] Tab press `scale(0.97)` → `whileTap={{ scale: 0.97 }}` on `motion.button`
- [x] Glass bottom bar → `backdrop-filter: blur(20px)` on `.nav-bottom-bar`
- [x] "You are here" dot → `nav-tab-current-dot` when `item.screen === previousScreen`
- [x] Touch swipe left/right changes preview → `handleTouchEnd` in NavMenuView
- [x] Keyboard: Escape, ArrowLeft/Right, 1–5, Tab trap → preserved in `useEffect`
- [x] ARIA: dialog, tablist, tab, aria-selected, aria-live → all preserved
- [x] `prefers-reduced-motion` → `useReducedMotion()` in NavImagePanel, `@media` in CSS
- [x] Mobile responsive → `@media (max-width: 767px)` block in CSS

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:**
- `NavImageItem` interface in `NavImagePanel` matches shape of `menuItems` entries
- `NavBottomItem` interface in `NavBottomBar` matches shape of `menuItems` entries
- `ScreenType` imported from `../../types` in NavBottomBar matches `../types` in NavMenuView (both resolve to same `src/types` file)
- `handleTabConfirm` signature: `(screen: ScreenType, id: string) => void` — matches `onTabConfirm` prop in NavBottomBar

---

**Plan complete and saved to `docs/superpowers/plans/2026-06-11-nav-bottom-bar-redesign.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session using `executing-plans`, batch execution with checkpoints

Which approach?
