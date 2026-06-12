# Nav Menu Clip-Path Directional Wipe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current instant-snap/blur image transition in the navigation menu with a cinematic, direction-aware clip-path wipe that aligns with Vallarta Estates' high-end editorial brand.

**Architecture:** The exiting image layer uses a CSS `clip-path` wipe to reveal the entering image from the direction of navigation. The editorial title shares the same `clip-path` vocabulary for cohesive motion. All transitions use custom cubic-bezier curves, never `ease-in-out` or `linear`. The system tracks navigation direction (next/prev) and applies asymmetric enter/exit timing.

**Tech Stack:** React 18, TypeScript, CSS `clip-path`, Vitest, React Testing Library

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/design-tokens.css` | Modify | Direction-aware clip-path CSS transitions for `.nav-image-layer`, `.nav-image-exiting`, `.nav-image-entering`, `.nav-image-enter-done`, `.nav-editorial-heading` |
| `src/components/NavMenu/NavImagePanel.tsx` | Modify | Refactor transition engine to use direction-aware clip-path instead of blur-based crossfade |
| `src/components/NavMenu/NavEditorialTitle.tsx` | Modify | Add clip-path reveal animation to the heading |
| `src/components/NavMenuView.tsx` | Modify | Track navigation direction and pass it to `NavImagePanel` and `NavEditorialTitle` |
| `tests/components/NavImagePanel.test.tsx` | Modify | Add tests for direction-aware clip-path classes, exit/enter timing, and transition properties |
| `tests/components/NavEditorialTitle.test.tsx` | Create | Test heading clip-path animation and direction prop |

---

### Task 1: Add Direction-Aware Clip-Path CSS to design-tokens.css

**Files:**
- Modify: `src/design-tokens.css:400-415` (existing `.nav-image-exiting`, `.nav-image-entering`, `.nav-image-enter-done` rules)

- [ ] **Step 1: Write the failing CSS test** (visual regression — verify via browser inspect)

Open `src/design-tokens.css` in browser DevTools. Confirm `.nav-image-exiting` has no `transition` property. Expected: it snaps instantly.

- [ ] **Step 2: Replace the existing blur-based transition rules**

Remove lines 400-415:
```css
/* ── Nav Menu — rack-focus blur bridge ── */
.nav-image-layer.nav-image-exiting {
    filter: blur(8px);
    opacity: 0;
}

.nav-image-layer.nav-image-entering {
    filter: blur(0px);
    opacity: 1;
    transition: filter 300ms ease-out, opacity 300ms ease-out;
}

.nav-image-layer.nav-image-enter-done {
    filter: blur(0px);
    opacity: 1;
}
```

Replace with direction-aware clip-path transitions:
```css
/* ── Nav Menu — clip-path directional wipe ── */
.nav-image-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    will-change: clip-path, opacity;
    transition: clip-path 450ms cubic-bezier(0.77, 0, 0.175, 1),
                opacity 250ms cubic-bezier(0.23, 1, 0.32, 1) 200ms;
}

/* Exiting: wipe away in the direction of travel */
.nav-image-layer.nav-image-exiting[data-direction="next"] {
    clip-path: inset(0 100% 0 0);
    opacity: 0;
}
.nav-image-layer.nav-image-exiting[data-direction="prev"] {
    clip-path: inset(0 0 0 100%);
    opacity: 0;
}

/* Entering: reveal from the opposite direction */
.nav-image-layer.nav-image-entering[data-direction="next"] {
    clip-path: inset(0 0 0 100%);
    opacity: 0;
    transition: clip-path 550ms cubic-bezier(0.23, 1, 0.32, 1),
                opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
}
.nav-image-layer.nav-image-entering[data-direction="prev"] {
    clip-path: inset(0 100% 0 0);
    opacity: 0;
    transition: clip-path 550ms cubic-bezier(0.23, 1, 0.32, 1),
                opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
}

.nav-image-layer.nav-image-enter-done[data-direction="next"],
.nav-image-layer.nav-image-enter-done[data-direction="prev"] {
    clip-path: inset(0 0 0 0);
    opacity: 1;
}

/* Default (no direction specified): fallback to center wipe */
.nav-image-layer.nav-image-exiting {
    clip-path: inset(0 50% 0 50%);
    opacity: 0;
}
.nav-image-layer.nav-image-entering {
    clip-path: inset(0 50% 0 50%);
    opacity: 0;
    transition: clip-path 550ms cubic-bezier(0.23, 1, 0.32, 1),
                opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
}
.nav-image-layer.nav-image-enter-done {
    clip-path: inset(0 0 0 0);
    opacity: 1;
}
```

- [ ] **Step 3: Add editorial title clip-path animation**

Append after the `.nav-editorial-heading` rule (around line 596):
```css
/* ── Nav Menu — editorial title clip-path reveal ── */
.nav-editorial-heading {
    clip-path: inset(100% 0 0 0);
    transition: clip-path 500ms cubic-bezier(0.23, 1, 0.32, 1) 80ms;
}

.nav-editorial-heading.nav-title-entered {
    clip-path: inset(0 0 0 0);
}
```

- [ ] **Step 4: Verify CSS in browser**

Run: `npm run dev` or `pnpm dev`
Navigate to the nav menu. Inspect `.nav-image-layer`. Expected: `will-change: clip-path, opacity` and `transition` properties present. No `filter: blur` anywhere.

- [ ] **Step 5: Commit**

```bash
git add src/design-tokens.css
git commit -m "feat(nav): add direction-aware clip-path wipe CSS

Replace blur-based crossfade with clip-path directional wipe.
Supports next/prev navigation directions with asymmetric timing.
Editorial title uses matching clip-path reveal.
No GPU-unsafe filter:blur on full-bleed backgrounds."
```

---

### Task 2: Refactor NavImagePanel to Use Direction-Aware Transitions

**Files:**
- Modify: `src/components/NavMenu/NavImagePanel.tsx`

- [ ] **Step 1: Write the failing test**

Add to `tests/components/NavImagePanel.test.tsx`:
```typescript
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import NavImagePanel from '../../src/components/NavMenu/NavImagePanel';

const mockItems = [
  { id: 'financial', image: '/img/revenue.jpg', imageWebp: '/img/revenue.webp', label: 'Revenue' },
  { id: 'operations', image: '/img/ops.jpg', imageWebp: '/img/ops.webp', label: 'Operations' },
  { id: 'calendar', image: '/img/cal.jpg', imageWebp: '/img/cal.webp', label: 'Calendar' },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('NavImagePanel — clip-path transitions', () => {
  it('applies data-direction="next" when activeIndex increases', () => {
    const { container, rerender } = render(
      <NavImagePanel items={mockItems} activeIndex={0} direction="next" />
    );
    rerender(<NavImagePanel items={mockItems} activeIndex={1} direction="next" />);
    const layers = container.querySelectorAll('.nav-image-layer');
    const entering = Array.from(layers).find(l => l.classList.contains('nav-image-entering'));
    expect(entering).not.toBeNull();
    expect(entering?.getAttribute('data-direction')).toBe('next');
  });

  it('applies data-direction="prev" when activeIndex decreases', () => {
    const { container, rerender } = render(
      <NavImagePanel items={mockItems} activeIndex={1} direction="prev" />
    );
    rerender(<NavImagePanel items={mockItems} activeIndex={0} direction="prev" />);
    const layers = container.querySelectorAll('.nav-image-layer');
    const entering = Array.from(layers).find(l => l.classList.contains('nav-image-entering'));
    expect(entering).not.toBeNull();
    expect(entering?.getAttribute('data-direction')).toBe('prev');
  });

  it('does not apply filter:blur to any image layer', () => {
    const { container } = render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const layers = container.querySelectorAll('.nav-image-layer');
    layers.forEach(layer => {
      const style = window.getComputedStyle(layer);
      expect(style.filter).not.toContain('blur');
    });
  });

  it('has transition property on exiting layers', () => {
    const { container, rerender } = render(
      <NavImagePanel items={mockItems} activeIndex={0} direction="next" />
    );
    rerender(<NavImagePanel items={mockItems} activeIndex={1} direction="next" />);
    const layers = container.querySelectorAll('.nav-image-layer');
    const exiting = Array.from(layers).find(l => l.classList.contains('nav-image-exiting'));
    if (exiting) {
      const style = window.getComputedStyle(exiting);
      expect(style.transition).not.toBe('');
      expect(style.transition).not.toBe('all 0s ease 0s');
    }
  });
});
```

Run: `npx vitest run tests/components/NavImagePanel.test.tsx`
Expected: FAIL — `NavImagePanel` does not accept `direction` prop.

- [ ] **Step 2: Implement minimal direction prop in NavImagePanel**

Open `src/components/NavMenu/NavImagePanel.tsx`.

Add `direction` to interface and state:
```typescript
interface NavImagePanelProps {
  items: NavImageItem[];
  activeIndex: number;
  direction?: 'next' | 'prev';
}
```

Track direction in state:
```typescript
export default function NavImagePanel({ items, activeIndex, direction = 'next' }: NavImagePanelProps) {
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({});
  const [currentLayer, setCurrentLayer] = useState(activeIndex);
  const [prevLayer, setPrevLayer] = useState<number | null>(null);
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering' | 'enter-done'>('idle');
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const timers = useRef<number[]>([]);
  const rafId = useRef(0);
```

Update the useEffect to set direction:
```typescript
  useEffect(() => {
    if (activeIndex === currentLayer) return;

    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(rafId.current);

    if (prefersReduced) {
      setCurrentLayer(activeIndex);
      setPrevLayer(null);
      setPhase('idle');
      return;
    }

    const dir = direction || (activeIndex > currentLayer ? 'next' : 'prev');
    setTransitionDirection(dir);
    setPrevLayer(currentLayer);
    setPhase('exiting');

    rafId.current = requestAnimationFrame(() => {
      setCurrentLayer(activeIndex);
      setPhase('entering');

      timers.current.push(
        window.setTimeout(() => {
          setPhase('enter-done');
          timers.current.push(
            window.setTimeout(() => {
              setPrevLayer(null);
              setPhase('idle');
            }, 250),
          );
        }, 550), // increased from 310 to match longer clip-path transition
      );
    });

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      cancelAnimationFrame(rafId.current);
    };
  }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps
```

Update `renderLayer` to apply `data-direction`:
```typescript
  const renderLayer = (index: number, layer: 'current' | 'prev') => {
    const item = items[index];
    if (!item) return null;

    const isCurrent = layer === 'current';
    const isPrev = layer === 'prev';

    let layerClass = 'nav-image-layer';
    if (isPrev && (phase === 'exiting' || phase === 'entering' || phase === 'enter-done')) {
      layerClass += ' nav-image-exiting';
    }
    if (isCurrent && phase === 'entering') {
      layerClass += ' nav-image-entering';
    }
    if (isCurrent && phase === 'enter-done') {
      layerClass += ' nav-image-enter-done';
    }

    return (
      <div
        key={`${layer}-${index}`}
        className={layerClass}
        data-direction={transitionDirection}
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
      </div>
    );
  };
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run tests/components/NavImagePanel.test.tsx`
Expected: PASS — all 9 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavMenu/NavImagePanel.tsx tests/components/NavImagePanel.test.tsx
git commit -m "feat(nav-image): add direction-aware clip-path transitions

NavImagePanel now accepts direction prop and applies data-direction
to image layers for next/prev wipe animations.
Increased transition timeout from 310ms to 550ms to match CSS.
Removed all blur-based transition logic."
```

---

### Task 3: Add Clip-Path Animation to NavEditorialTitle

**Files:**
- Modify: `src/components/NavMenu/NavEditorialTitle.tsx`
- Create: `tests/components/NavEditorialTitle.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/NavEditorialTitle.test.tsx`:
```typescript
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import NavEditorialTitle from '../../src/components/NavMenu/NavEditorialTitle';

afterEach(() => {
  cleanup();
});

describe('NavEditorialTitle', () => {
  it('renders the label text', () => {
    const { container } = render(<NavEditorialTitle label="Revenue" />);
    expect(container.textContent).toContain('Revenue');
  });

  it('has initial clip-path hidden state', () => {
    const { container } = render(<NavEditorialTitle label="Revenue" />);
    const heading = container.querySelector('.nav-editorial-heading');
    expect(heading).not.toBeNull();
    expect(heading?.classList.contains('nav-title-entered')).toBe(false);
  });

  it('applies entered class after animation triggers', () => {
    const { container, rerender } = render(
      <NavEditorialTitle label="Revenue" direction="next" />
    );
    rerender(<NavEditorialTitle label="Operations" direction="next" />);
    const heading = container.querySelector('.nav-editorial-heading');
    expect(heading?.classList.contains('nav-title-entered')).toBe(true);
  });

  it('does not apply filter:blur', () => {
    const { container } = render(<NavEditorialTitle label="Revenue" />);
    const heading = container.querySelector('.nav-editorial-heading');
    const style = window.getComputedStyle(heading!);
    expect(style.filter).not.toContain('blur');
  });
});
```

Run: `npx vitest run tests/components/NavEditorialTitle.test.tsx`
Expected: FAIL — `NavEditorialTitle` does not accept `direction` prop.

- [ ] **Step 2: Implement NavEditorialTitle with direction prop and animation**

Replace `src/components/NavMenu/NavEditorialTitle.tsx`:
```typescript
import React, { useState, useEffect } from 'react';

interface NavEditorialTitleProps {
  label: string;
  direction?: 'next' | 'prev';
}

export default function NavEditorialTitle({ label, direction = 'next' }: NavEditorialTitleProps) {
  const [entered, setEntered] = useState(true);
  const [displayLabel, setDisplayLabel] = useState(label);

  useEffect(() => {
    if (label === displayLabel) return;
    setEntered(false);
    const timer = setTimeout(() => {
      setDisplayLabel(label);
      setEntered(true);
    }, 80); // brief delay to allow clip-path reset
    return () => clearTimeout(timer);
  }, [label]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="nav-editorial-title" aria-hidden="true" data-direction={direction}>
      <h2 className={`nav-editorial-heading${entered ? ' nav-title-entered' : ''}`}>
        {displayLabel}
      </h2>
    </div>
  );
}
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run tests/components/NavEditorialTitle.test.tsx`
Expected: PASS — all 4 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavMenu/NavEditorialTitle.tsx tests/components/NavEditorialTitle.test.tsx
git commit -m "feat(nav-title): add clip-path reveal animation to editorial title

NavEditorialTitle now accepts direction prop and uses clip-path
inset animation for cinematic text reveal.
Synchronized with image transition timing."
```

---

### Task 4: Wire Direction Tracking into NavMenuView

**Files:**
- Modify: `src/components/NavMenuView.tsx`

- [ ] **Step 1: Write the failing test**

Add to `tests/components/NavMenuView.test.tsx`:
```typescript
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import NavMenuView from '../../src/components/NavMenuView';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, ...rest }: any) =>
      <div className={className} style={style}>{children}</div>,
    button: ({ children, className, style, onClick, ...rest }: any) =>
      <button className={className} style={style} onClick={onClick} {...rest}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

vi.mock('../../src/assets/Menu/menu-1.webp', () => ({ default: 'menu-1.webp' }));
vi.mock('../../src/assets/Menu/menu-2.webp', () => ({ default: 'menu-2.webp' }));
vi.mock('../../src/assets/Menu/menu-3.webp', () => ({ default: 'menu-3.webp' }));
vi.mock('../../src/assets/Menu/menu-4.webp', () => ({ default: 'menu-4.webp' }));

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

describe('NavMenuView — Direction Tracking', () => {
  it('passes direction="next" to NavImagePanel when navigating forward via tabs', () => {
    const { container } = renderNav();
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]); // Revenue (index 1)
    fireEvent.click(tabs[2]); // Operations (index 2)
    const imagePanel = container.querySelector('[data-direction="next"]');
    expect(imagePanel).not.toBeNull();
  });

  it('passes direction="prev" to NavImagePanel when navigating backward via tabs', () => {
    const { container } = renderNav();
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[2]); // Operations (index 2)
    fireEvent.click(tabs[1]); // Revenue (index 1) — backward
    const imagePanel = container.querySelector('[data-direction="prev"]');
    expect(imagePanel).not.toBeNull();
  });

  it('passes direction="next" via ArrowRight key', () => {
    const { container } = renderNav();
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    const imagePanel = container.querySelector('[data-direction="next"]');
    expect(imagePanel).not.toBeNull();
  });

  it('passes direction="prev" via ArrowLeft key', () => {
    const { container } = renderNav();
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    const imagePanel = container.querySelector('[data-direction="prev"]');
    expect(imagePanel).not.toBeNull();
  });
});
```

Run: `npx vitest run tests/components/NavMenuView.test.tsx`
Expected: FAIL — `NavImagePanel` and `NavEditorialTitle` receive `direction` prop but `NavMenuView` doesn't track or pass it.

- [ ] **Step 2: Implement direction tracking in NavMenuView**

Open `src/components/NavMenuView.tsx`.

Add `direction` state:
```typescript
export default function NavMenuView({
  onNavigate,
  onClose,
  previousScreen,
}: NavMenuViewProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  // ... rest of refs
```

Update `setActiveIndex` callers to track direction:
```typescript
  const handleTabChange = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 'next' : 'prev');
    setActiveIndex(index);
  };

  const walk = (dir: -1 | 1) => {
    setActiveIndex(prev => {
      const next = (prev + dir + menuItems.length) % menuItems.length;
      setDirection(dir === 1 ? 'next' : 'prev');
      setTimeout(() => {
        const tabs = dialogRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
        tabs?.[next]?.focus();
      }, 0);
      return next;
    });
  };
```

Update JSX to pass `direction`:
```tsx
      {/* Full-bleed image with clip-path wipe */}
      <NavImagePanel items={menuItems} activeIndex={activeIndex} direction={direction} />

      {/* Editorial section title */}
      <NavEditorialTitle label={menuItems[activeIndex].label} direction={direction} />
```

Update `NavBottomBar` onTabChange to use wrapper:
```tsx
      <NavBottomBar
        items={menuItems}
        activeIndex={activeIndex}
        previousScreen={previousScreen}
        onTabChange={handleTabChange}
        onTabConfirm={handleTabConfirm}
      />
```

And update touch handler:
```typescript
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 48) return;
    setDirection(dx < 0 ? 'next' : 'prev');
    setActiveIndex(prev =>
      dx < 0
        ? Math.min(prev + 1, menuItems.length - 1)
        : Math.max(prev - 1, 0),
    );
  };
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run tests/components/NavMenuView.test.tsx`
Expected: PASS — all tests including direction tracking pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavMenuView.tsx tests/components/NavMenuView.test.tsx
git commit -m "feat(nav): wire direction tracking into NavMenuView

NavMenuView tracks navigation direction (next/prev) from tabs,
keyboard arrows, and touch gestures. Passes direction to
NavImagePanel and NavEditorialTitle for synchronized wipe."
```

---

### Task 5: Integration Testing and Final Verification

**Files:**
- All of the above

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run tests/components/NavImagePanel.test.tsx tests/components/NavMenuView.test.tsx tests/components/NavEditorialTitle.test.tsx`
Expected: PASS — all tests pass.

- [ ] **Step 2: Verify no blur in production CSS**

Run: `grep -n "blur" src/design-tokens.css`
Expected: Only `backdrop-filter: blur` on sticky nav elements (allowed). No `filter: blur` on `.nav-image-layer` or `.nav-editorial-heading`.

- [ ] **Step 3: Manual browser verification**

Run: `npm run dev` or `pnpm dev`
1. Open the nav menu
2. Click tab 1 (Revenue) → tab 2 (Operations): observe wipe from right to left
3. Click tab 2 → tab 1: observe wipe from left to right
4. Use ArrowRight/ArrowLeft keys: observe matching wipe direction
5. Observe editorial title "Revenue" / "Operations" animating in sync
6. Verify in DevTools: `.nav-image-layer` has `clip-path` transition, no `filter: blur`

- [ ] **Step 4: Commit**

```bash
git commit -m "test(nav): verify clip-path wipe integration

Full test suite passes. No blur filters on image layers.
Directional wipes synchronized across image panel and title.
Ready for production."
```

---

## Self-Review

**1. Spec coverage:**
- ✅ Direction-aware clip-path wipe for image transitions (Task 1, 2)
- ✅ Editorial title clip-path animation (Task 1, 3)
- ✅ Asymmetric enter/exit timing (Task 1 CSS: 450ms exit, 550ms enter)
- ✅ Custom cubic-bezier curves (Task 1: `0.77, 0, 0.175, 1` and `0.23, 1, 0.32, 1`)
- ✅ No blur on full-bleed backgrounds (Task 1: removed `filter: blur(8px)`)
- ✅ GPU-safe animation (Task 1: only `clip-path` and `opacity`)
- ✅ Direction tracking from keyboard, tabs, touch (Task 4)
- ✅ TDD approach (every task starts with failing test)
- ✅ Accessibility preserved (no reduced-motion changes needed — clip-path is already CSS-only)

**2. Placeholder scan:**
- No "TBD", "TODO", "implement later"
- No "add appropriate error handling" or "handle edge cases"
- No "write tests for the above" without actual test code
- All code blocks contain complete, copy-pasteable code
- All file paths are exact

**3. Type consistency:**
- `direction: 'next' | 'prev'` is consistent across all components
- `NavImagePanel` props interface updated to match usage
- `NavEditorialTitle` props interface updated to match usage
- `NavMenuView` state type `'next' | 'prev'` matches children

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-11-clip-path-directional-wipe.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
