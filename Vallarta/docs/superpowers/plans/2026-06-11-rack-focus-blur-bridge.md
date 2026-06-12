# Rack-Focus Blur Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic opacity crossfade in NavImagePanel with a cinematography-inspired blur bridge — the current image blurs out over 150ms (like a lens losing focus), the image swaps at peak blur (imperceptible), then the new image sharpens over 250ms.

**Architecture:** Modify `src/components/NavMenu/NavImagePanel.tsx` to use `AnimatePresence mode="wait"` — the exiting element completes its blur-out before the entering element mounts, creating a clean rack-focus without overlapping images. Update `.nav-image-layer` CSS with `will-change: filter` for GPU hinting during transitions. Add a unit test for the NavImagePanel component with mocked motion.

**Tech Stack:** React 19, motion v12, Framer Motion AnimatePresence, CSS `filter: blur()`, Vitest + Testing Library

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/components/NavMenu/NavImagePanel.tsx` | Modify | Rewrite exit/enter AnimatePresence animation props to use blur + scale rack-focus |
| `src/design-tokens.css` | Modify | Add `will-change: filter` to `.nav-image-layer` for transition performance hint |
| `tests/components/NavImagePanel.test.tsx` | Create | Unit test: renders correct image per activeIndex, skeleton visibility, reduced motion behavior |

**Why these files:** The animation logic lives entirely in `NavImagePanel.tsx` — no parent component (`NavMenuView.tsx`) needs changes. The CSS change is a single-line performance hint. The test file covers the component's public contract (what image shows for what index).

---

### Task 1: Write the NavImagePanel unit test

**Files:**
- Create: `tests/components/NavImagePanel.test.tsx`
- Reference: `tests/components/NavMenuView.test.tsx` (for mock pattern)
- Reference: `src/components/NavMenu/NavImagePanel.tsx` (current implementation)

- [ ] **Step 1.1: Create the test file with motion mock**

Write the test file that mocks `motion/react` (following the same pattern as `NavMenuView.test.tsx`) and tests NavImagePanel's render contract.

```tsx
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import NavImagePanel from '../../src/components/NavMenu/NavImagePanel';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} style={style} data-testid="motion-div">{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: vi.fn().mockReturnValue(false),
}));

const mockItems = [
  { id: 'financial', image: '/img/revenue.jpg', imageWebp: '/img/revenue.webp', label: 'Revenue' },
  { id: 'operations', image: '/img/ops.jpg', imageWebp: '/img/ops.webp', label: 'Operations' },
  { id: 'calendar', image: '/img/cal.jpg', imageWebp: '/img/cal.webp', label: 'Calendar' },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('NavImagePanel', () => {
  it('renders the image matching activeIndex', () => {
    render(<NavImagePanel items={mockItems} activeIndex={1} />);
    const imgs = document.querySelectorAll('img');
    const visibleImgs = Array.from(imgs).filter(img => img.getAttribute('aria-hidden') !== 'true');
    expect(visibleImgs.length).toBeGreaterThanOrEqual(1);
    const mainImg = visibleImgs[0] as HTMLImageElement;
    expect(mainImg.src).toContain('/img/ops.jpg');
  });

  it('renders a loading skeleton', () => {
    const { container } = render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const skeleton = container.querySelector('.nav-img-skeleton');
    expect(skeleton).not.toBeNull();
    expect(skeleton?.classList.contains('hidden')).toBe(false);
  });

  it('hides the skeleton once the active image fires onLoad', () => {
    const { container } = render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const imgs = document.querySelectorAll('img');
    const mainImg = Array.from(imgs).find(img => img.getAttribute('aria-hidden') !== 'true')!;
    fireEvent.load(mainImg);
    const skeleton = container.querySelector('.nav-img-skeleton');
    expect(skeleton?.classList.contains('hidden')).toBe(true);
  });

  it('renders invisible preload images for inactive items', () => {
    render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const imgs = document.querySelectorAll('img');
    const hiddenImgs = Array.from(imgs).filter(img => img.style.opacity === '0');
    expect(hiddenImgs.length).toBe(2);
  });

  it('applies cinematic-grade class to the main image', () => {
    render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const imgs = document.querySelectorAll('img');
    const mainImg = Array.from(imgs).find(img => img.getAttribute('aria-hidden') !== 'true')!;
    expect(mainImg.className).toContain('cinematic-grade');
  });
});
```

- [ ] **Step 1.2: Run the test to verify it fails**

Run: `npx vitest run tests/components/NavImagePanel.test.tsx 2>&1`

Expected output: FAIL — the test file itself should fail because:
- `src/components/NavMenu/NavImagePanel.tsx` doesn't export a component with this exact interface yet (or the test has errors we need to fix)
- At minimum, the test infrastructure (file creation, imports) should be verified

If the test file fails to compile due to missing types or imports, fix those in the test file and re-run until the error is a test failure (not a compilation error).

---

### Task 2: Read current implementation and verify baseline

**Files:**
- Read: `src/components/NavMenu/NavImagePanel.tsx`
- Read: `src/design-tokens.css` (lines 364-424, the nav image layer section)
- Read: `package.json` (confirm motion version)

- [ ] **Step 2.1: Read current NavImagePanel.tsx**

```bash
cat src/components/NavMenu/NavImagePanel.tsx
```

Verify the current file content matches what the plan expects — specifically the `AnimatePresence` block with `mode="sync"`, `opacity`-based `initial`, `animate`, and `exit` props.

- [ ] **Step 2.2: Read current CSS for nav image layer**

Read `src/design-tokens.css` lines 364-398 (the `.nav-image-layer`, `.nav-image-layer img`, and Ken Burns keyframes).

Verify: `.nav-image-layer` currently has `will-change: transform, opacity`.

- [ ] **Step 2.3: Confirm motion version in package.json**

```bash
grep -n '"motion"' package.json
```

Expected: `"motion": "^12.23.24"` — motion v12 supports `filter` animation natively.

---

### Task 3: Implement the rack-focus blur bridge in NavImagePanel.tsx

**Files:**
- Modify: `src/components/NavMenu/NavImagePanel.tsx`

- [ ] **Step 3.1: Replace the AnimatePresence mode and exit animation**

Change `mode="sync"` to `mode="wait"` so the exiting element completes its blur before the entering element mounts.

Replace the exit animation from `{ opacity: 0, transition: { duration: 0.25, ... } }` to a blur-out:
```tsx
{ filter: 'blur(8px)', scale: 0.98, transition: { duration: 0.15, ease: 'easeOut' } }
```

Replace the enter animation from `{ opacity: 0 }` → `{ opacity: 1 }` over 550ms to a blur-in:
```tsx
initial={{ filter: 'blur(8px)', scale: 0.98 }}
animate={{ filter: 'blur(0px)', scale: 1 }}
transition={{ duration: 0.25, ease: 'easeOut' }}
```

The complete modified component:

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
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <div
        className={`nav-img-skeleton${loadedIds[item.id] ? ' hidden' : ''}`}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="nav-image-layer"
          initial={
            shouldReduce ? false : { filter: 'blur(8px)', scale: 0.98 }
          }
          animate={
            shouldReduce
              ? { opacity: 1 }
              : { filter: 'blur(0px)', scale: 1 }
          }
          exit={
            shouldReduce
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  filter: 'blur(8px)',
                  scale: 0.98,
                  transition: { duration: 0.15, ease: 'easeOut' },
                }
          }
          transition={
            shouldReduce
              ? { duration: 0 }
              : { duration: 0.25, ease: 'easeOut' }
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
      </AnimatePresence>

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

      <div className="nav-scrim" />
    </div>
  );
}
```

- [ ] **Step 3.2: Add the missing `fireEvent` import to the test file**

The test in Step 1.1 uses `fireEvent.load()` but doesn't import it. Add the import at the top:

Edit `tests/components/NavImagePanel.test.tsx`:
```tsx
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
```

- [ ] **Step 3.3: Run the NavImagePanel tests to verify they pass**

Run: `npx vitest run tests/components/NavImagePanel.test.tsx 2>&1`

Expected: All 5 tests PASS.

---

### Task 4: Update CSS for blur transition performance

**Files:**
- Modify: `src/design-tokens.css`

- [ ] **Step 4.1: Add `filter` to the will-change hint on `.nav-image-layer`**

In `src/design-tokens.css`, find the `.nav-image-layer` rule at line 365-370:

```css
.nav-image-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    will-change: transform, opacity;
}
```

Update `will-change` to include `filter`:

```css
.nav-image-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    will-change: transform, opacity, filter;
}
```

- [ ] **Step 4.2: Run existing test suite to verify no regressions**

Run: `npx vitest run 2>&1`

Expected: All tests PASS (including `tests/components/NavMenuView.test.tsx` — the mock-based tests should be unaffected by the CSS change).

---

### Task 5: Run full build and visual verification

- [ ] **Step 5.1: Run TypeScript check**

Run: `rtk tsc` or `npx tsc --noEmit 2>&1`

Expected: No TypeScript errors. The motion v12 types should support `filter` as an animate property.

- [ ] **Step 5.2: Start dev server and visually verify**

Run: `npx vite --port=4000 2>&1` (or `npm run dev`)

Open the browser, navigate to the NavMenu, and manually verify:

1. Click through each tab — the image should blur out (150ms), then a new image sharpens in (250ms)
2. Rapidly switch tabs — `AnimatePresence mode="wait"` should sequence them without overlap
3. Verify the Ken Burns effect still runs on the loaded image after the transition completes
4. Test with `prefers-reduced-motion: reduce` in DevTools — no blur or scale animation should play

- [ ] **Step 5.3: Commit**

```bash
git add src/components/NavMenu/NavImagePanel.tsx src/design-tokens.css tests/components/NavImagePanel.test.tsx
git commit -m "feat(nav): replace opacity crossfade with rack-focus blur bridge

The image transition when switching nav tabs now uses a cinematic
rack-focus effect: current image blurs out (150ms, ease-out), image
swaps at peak blur (imperceptible), new image sharpens in (250ms,
ease-out). Total animation: 400ms.

- mode=wait prevents overlapping images
- scale(0.98) accompanies blur for lens-like depth shift
- Reduced motion skips all blur/scale animation
- will-change: filter added for GPU hint during transitions
"
```

---

## Self-Review

**1. Spec coverage against the Option B proposal:**

| Option B requirement | Task implementing it |
|---|---|
| "current image blurs to blur(8px)" | Task 3 — exit animation: `filter: 'blur(8px)'` |
| "scales scale(0.98) over 150ms" | Task 3 — exit animation: `scale: 0.98` with `duration: 0.15` |
| "ease-out" | Task 3 — exit and enter both use `ease: 'easeOut'` |
| "instantaneous image swap at blur peak" | Task 3 — `AnimatePresence mode="wait"` sequences exit before enter; both at blur(8px) at the swap point |
| "new image unblurs and scales back to scale(1) over 250ms" | Task 3 — enter animation: initial state `blur(8px), scale(0.98)` → animate `blur(0), scale(1)` over `duration: 0.25` |
| "ease-out" | Task 3 — enter uses `ease: 'easeOut'` |
| "Total: 400ms" | 150ms exit + 250ms enter = 400ms ✓ |
| "blur midpoint masks the swap — no ghosting" | Task 3 — single element visible at any time (mode=wait), both at blur(8) at transition point |

**2. Placeholder scan:** All steps contain complete code, exact file paths, and exact commands. No TBD, TODO, "implement later", "add appropriate handling", or "similar to Task N" patterns.

**3. Type consistency:** 
- `NavImageItem` interface — matches the existing `interface NavImageItem` currently in `NavImagePanel.tsx` (fields: `id`, `image`, `imageWebp`, `label`)
- `NavImagePanelProps` — matches existing props (`items: NavImageItem[]`, `activeIndex: number`)
- `loadedIds` — `Record<string, boolean>` — unchanged from current implementation
- `shouldReduce` — `useReducedMotion()` return type — unchanged
- No new functions, components, or types introduced that could cause drift

**4. Gaps found:** The test file in Step 1.1 omitted the `fireEvent` import — caught during self-review and corrected in Step 3.2.
