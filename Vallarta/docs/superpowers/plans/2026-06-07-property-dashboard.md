# Property Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a per-property dashboard screen that surfaces occupancy, arrivals/departures, P&L financials, and tasks in a two-zone split layout (data left, image gallery right), scoped to the active property.

**Architecture:** `DashboardView` assembles a CSS-grid two-zone layout — a left panel with a vertical domain-selector strip and swappable domain content (Today / Financials / Tasks), and a right panel with an inset image gallery. All data is mock for now, keyed by `propertyId`. The view is wired into `App.tsx` as the landing screen after property selection.

**Tech Stack:** React 19, TypeScript, Tailwind v4, motion/react, Lucide React, CSS custom properties from `design-tokens.css`.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/types.ts` | Add `'dashboard'` to ScreenType; add `images: string[]` to Property |
| Modify | `src/components/PropertySelector/propertyData.ts` | Add `images` array to each property |
| Modify | `src/data/properties.ts` | Add `images` array to each property (consistency) |
| Create | `src/components/Dashboard/dashboardData.ts` | Mock data types + data per property |
| Create | `src/components/Dashboard/DashboardGallery.tsx` | Inset image gallery, click-zone nav, counter, slide |
| Create | `src/components/Dashboard/DashboardDomainNav.tsx` | Vertical strip (desktop) / segmented pill (mobile) |
| Create | `src/components/Dashboard/DashboardToday.tsx` | Today domain: occupancy, arrivals, departures |
| Create | `src/components/Dashboard/DashboardFinancials.tsx` | Financials domain: period selector, P&L sequence |
| Create | `src/components/Dashboard/DashboardTasks.tsx` | Tasks domain: count, numbered list |
| Create | `src/components/Dashboard/DashboardView.tsx` | Top-level layout, domain routing, responsive split |
| Modify | `src/App.tsx` | Add 'dashboard' case; redirect post-selection to dashboard |
| Create | `tests/test_dashboard.js` | Static file-content assertions |

---

## Task 1: Extend types.ts

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/test_dashboard.js`:

```js
import fs from 'fs';
import assert from 'assert';

const types = fs.readFileSync('src/types.ts', 'utf-8');

assert.ok(types.includes("'dashboard'"), "ScreenType must include 'dashboard'");
assert.ok(types.includes('images: string[]'), 'Property must include images: string[]');

console.log('Task 1 PASS: types.ts extended correctly.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `'dashboard'` not found.

- [ ] **Step 3: Update ScreenType and Property**

Replace the contents of `src/types.ts`:

```ts
export type ScreenType =
  | 'login'
  | 'nav_menu'
  | 'reporting'
  | 'deep_dive'
  | 'camera_expanded'
  | 'calendar'
  | 'property_selector'
  | 'dashboard';

export interface EstateMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'stable' | 'down';
}

export interface Property {
  id: string;
  name: string;
  location: string;
  tagline: string;
  imageUrl: string;         // kept for backward compatibility
  imageWebp?: string;
  images: string[];         // gallery images; imageUrl is always images[0]
  metrics?: {
    bedrooms: number;
    occupancy: string;
    revenue: string;
  };
}

export interface CameraFeed {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  live: boolean;
}

export interface ArrivalEvent {
  id: string;
  name: string;
  dates: string;
  nights: number;
}
```

- [ ] **Step 4: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 1 PASS: types.ts extended correctly.`

- [ ] **Step 5: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors. (Existing components still use `imageUrl` which remains on the interface.)

- [ ] **Step 6: Commit**

```
git add src/types.ts tests/test_dashboard.js
git commit -m "feat(dashboard): add dashboard screen type and images[] to Property"
```

---

## Task 2: Add images array to property data

**Files:**
- Modify: `src/components/PropertySelector/propertyData.ts`
- Modify: `src/data/properties.ts`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
const propData = fs.readFileSync('src/components/PropertySelector/propertyData.ts', 'utf-8');
assert.ok(propData.includes('images:'), 'propertyData must include images array');
assert.ok(propData.includes('[propImg1'), 'images array must reference propImg1');

console.log('Task 2 PASS: property data includes images.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `images:` not found.

- [ ] **Step 3: Update propertyData.ts**

Replace `src/components/PropertySelector/propertyData.ts`:

```ts
import { Property } from '../../types';
import propImg1 from '../../assets/Menu/menu-1.jpg';
import propImg1Webp from '../../assets/Menu/menu-1.webp';
import propImg2 from '../../assets/Menu/menu-2.jpg';
import propImg2Webp from '../../assets/Menu/menu-2.webp';
import propImg3 from '../../assets/Menu/menu-3.jpg';
import propImg3Webp from '../../assets/Menu/menu-3.webp';
import propImg4 from '../../assets/Menu/menu-4.jpg';
import propImg4Webp from '../../assets/Menu/menu-4.webp';
import propImg5 from '../../assets/Menu/menu-1.jpg';
import propImg5Webp from '../../assets/Menu/menu-1.webp';

export const sampleProperties: Property[] = [
  {
    id: 'casa-palmeras',
    name: 'Casa Palmeras',
    location: 'Zona Romántica',
    tagline: 'Oceanfront luxury with private infinity pool',
    imageUrl: propImg1,
    imageWebp: propImg1Webp,
    images: [propImg1, propImg2, propImg3],
    metrics: { bedrooms: 4, occupancy: '78%', revenue: '$12,400' },
  },
  {
    id: 'villa-luna',
    name: 'Villa Luna',
    location: 'Conchas Chinas',
    tagline: 'Contemporary hillside retreat with panoramic views',
    imageUrl: propImg2,
    imageWebp: propImg2Webp,
    images: [propImg2, propImg3, propImg4],
    metrics: { bedrooms: 3, occupancy: '92%', revenue: '$9,800' },
  },
  {
    id: 'casa-sol',
    name: 'Casa del Sol',
    location: 'Marina Vallarta',
    tagline: 'Beachfront estate with private dock',
    imageUrl: propImg3,
    imageWebp: propImg3Webp,
    images: [propImg3, propImg4, propImg1],
    metrics: { bedrooms: 5, occupancy: '65%', revenue: '$18,200' },
  },
  {
    id: 'vista-al-mar',
    name: 'Vista al Mar',
    location: 'Punta Mita',
    tagline: 'Cliffside villa with sunset terrace',
    imageUrl: propImg4,
    imageWebp: propImg4Webp,
    images: [propImg4, propImg1, propImg2],
    metrics: { bedrooms: 6, occupancy: '85%', revenue: '$21,500' },
  },
  {
    id: 'casa-brisa',
    name: 'Casa Brisa',
    location: 'Bucerías',
    tagline: 'Boutique casita steps from the sand',
    imageUrl: propImg5,
    imageWebp: propImg5Webp,
    images: [propImg5, propImg3],
    metrics: { bedrooms: 2, occupancy: '71%', revenue: '$6,100' },
  },
];
```

- [ ] **Step 4: Update src/data/properties.ts**

Replace `src/data/properties.ts`:

```ts
export interface Property {
  id: string;
  name: string;
  location: string;
  tagline: string;
  imageUrl: string;
  imageWebp?: string;
  images: string[];
  metrics?: {
    bedrooms: number;
    occupancy: string;
    revenue: string;
  };
}

export const sampleProperties: Property[] = [
  {
    id: 'villa-almara',
    name: 'Villa Almara',
    location: 'Zona Romantica',
    tagline: 'Oceanfront luxury with private infinity pool',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80'],
    metrics: { bedrooms: 4, occupancy: '78%', revenue: '$12,400' },
  },
  {
    id: 'casa-marena',
    name: 'Casa Marena',
    location: 'Marina Vallarta',
    tagline: 'Modern waterfront living with panoramic bay views',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'],
    metrics: { bedrooms: 3, occupancy: '82%', revenue: '$9,800' },
  },
  {
    id: 'residencia-coral',
    name: 'Residencia Coral',
    location: 'Conchas Chinas',
    tagline: 'Hillside estate with private beach access',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'],
    metrics: { bedrooms: 5, occupancy: '65%', revenue: '$15,200' },
  },
  {
    id: 'penthouse-brisa',
    name: 'Penthouse Brisa',
    location: 'Zona Romantica',
    tagline: 'Rooftop terrace above the cobblestone streets',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'],
    metrics: { bedrooms: 2, occupancy: '91%', revenue: '$7,600' },
  },
  {
    id: 'hacienda-luna',
    name: 'Hacienda Luna',
    location: 'Fluvial Vallarta',
    tagline: 'Tropical retreat nestled along the river',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'],
    metrics: { bedrooms: 6, occupancy: '58%', revenue: '$18,100' },
  },
];
```

- [ ] **Step 5: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 2 PASS: property data includes images.`

- [ ] **Step 6: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```
git add src/components/PropertySelector/propertyData.ts src/data/properties.ts tests/test_dashboard.js
git commit -m "feat(dashboard): add images[] to property data"
```

---

## Task 3: Create dashboard mock data

**Files:**
- Create: `src/components/Dashboard/dashboardData.ts`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
assert.ok(
  fs.existsSync('src/components/Dashboard/dashboardData.ts'),
  'dashboardData.ts must exist'
);
const ddData = fs.readFileSync('src/components/Dashboard/dashboardData.ts', 'utf-8');
assert.ok(ddData.includes('getDashboardData'), 'must export getDashboardData');
assert.ok(ddData.includes('DashboardData'), 'must export DashboardData interface');
assert.ok(ddData.includes('DashboardTask'), 'must export DashboardTask interface');
assert.ok(ddData.includes('PeriodFinancials'), 'must export PeriodFinancials interface');

console.log('Task 3 PASS: dashboardData.ts created correctly.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `dashboardData.ts must exist`.

- [ ] **Step 3: Create src/components/Dashboard/dashboardData.ts**

```ts
export interface GuestEvent {
  id: string;
  name: string;
  nights: number;
}

export interface DashboardTask {
  id: string;
  description: string;
  status: 'urgent' | 'pending' | 'scheduled';
}

export interface PeriodFinancials {
  label: string;
  revenue: number;
  expenses: number;
}

export interface DashboardData {
  occupancy: number;
  arrivalsToday: GuestEvent[];
  departuresToday: GuestEvent[];
  arrivalsTomorrow: GuestEvent[];
  departuresTomorrow: GuestEvent[];
  tasks: DashboardTask[];
  periods: PeriodFinancials[];
}

const mockData: Record<string, DashboardData> = {
  'casa-palmeras': {
    occupancy: 78,
    arrivalsToday: [
      { id: 'a1', name: 'Elena Rosenthal', nights: 5 },
      { id: 'a2', name: 'Marco & Lucia Ferrara', nights: 3 },
    ],
    departuresToday: [
      { id: 'd1', name: 'James Whitfield', nights: 7 },
    ],
    arrivalsTomorrow: [{ id: 'a3', name: 'Camille Devereux', nights: 4 }],
    departuresTomorrow: [{ id: 'd2', name: 'Sofía Méndez', nights: 4 }],
    tasks: [
      { id: 't1', description: 'Replace pool filter cartridge', status: 'urgent' },
      { id: 't2', description: 'AC unit inspection — unit 2', status: 'pending' },
      { id: 't3', description: 'Touch-up paint on terrace railing', status: 'scheduled' },
    ],
    periods: [
      { label: 'June 2026', revenue: 12400, expenses: 3200 },
      { label: 'May 2026', revenue: 10800, expenses: 2950 },
      { label: 'April 2026', revenue: 9600, expenses: 2800 },
    ],
  },
  'villa-luna': {
    occupancy: 92,
    arrivalsToday: [{ id: 'a1', name: 'Valentina Cruz', nights: 6 }],
    departuresToday: [],
    arrivalsTomorrow: [],
    departuresTomorrow: [{ id: 'd1', name: 'Henrik Larsen', nights: 5 }],
    tasks: [
      { id: 't1', description: 'Restock amenity kit — master suite', status: 'urgent' },
      { id: 't2', description: 'Garden irrigation check', status: 'scheduled' },
    ],
    periods: [
      { label: 'June 2026', revenue: 9800, expenses: 2100 },
      { label: 'May 2026', revenue: 11200, expenses: 2400 },
      { label: 'April 2026', revenue: 8900, expenses: 1950 },
    ],
  },
  'casa-sol': {
    occupancy: 65,
    arrivalsToday: [],
    departuresToday: [{ id: 'd1', name: 'The Okafor Family', nights: 10 }],
    arrivalsTomorrow: [
      { id: 'a1', name: 'Rebecca & Tom Harrington', nights: 7 },
    ],
    departuresTomorrow: [],
    tasks: [
      { id: 't1', description: 'Dock safety inspection due', status: 'urgent' },
      { id: 't2', description: 'Deep clean — beach-level terrace', status: 'pending' },
      { id: 't3', description: 'Replace outdoor shower head', status: 'pending' },
      { id: 't4', description: 'Refill propane for grill', status: 'scheduled' },
    ],
    periods: [
      { label: 'June 2026', revenue: 18200, expenses: 4800 },
      { label: 'May 2026', revenue: 15600, expenses: 4200 },
      { label: 'April 2026', revenue: 14100, expenses: 3900 },
    ],
  },
  'vista-al-mar': {
    occupancy: 85,
    arrivalsToday: [{ id: 'a1', name: 'Isabelle & Jean-Paul Moreau', nights: 9 }],
    departuresToday: [{ id: 'd1', name: 'Dr. Amara Nwosu', nights: 4 }],
    arrivalsTomorrow: [],
    departuresTomorrow: [],
    tasks: [
      { id: 't1', description: 'Sunset terrace lighting repair', status: 'urgent' },
      { id: 't2', description: 'Guest welcome basket preparation', status: 'pending' },
    ],
    periods: [
      { label: 'June 2026', revenue: 21500, expenses: 5600 },
      { label: 'May 2026', revenue: 19800, expenses: 5200 },
      { label: 'April 2026', revenue: 17400, expenses: 4700 },
    ],
  },
  'casa-brisa': {
    occupancy: 71,
    arrivalsToday: [],
    departuresToday: [{ id: 'd1', name: 'Lucas Mendes', nights: 3 }],
    arrivalsTomorrow: [{ id: 'a1', name: 'Priya Sharma', nights: 5 }],
    departuresTomorrow: [],
    tasks: [
      { id: 't1', description: 'Replace bedroom ceiling fan', status: 'pending' },
    ],
    periods: [
      { label: 'June 2026', revenue: 6100, expenses: 1400 },
      { label: 'May 2026', revenue: 5800, expenses: 1350 },
      { label: 'April 2026', revenue: 5200, expenses: 1200 },
    ],
  },
};

const fallback = mockData['casa-palmeras'];

export function getDashboardData(propertyId: string): DashboardData {
  return mockData[propertyId] ?? fallback;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
```

- [ ] **Step 4: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 3 PASS: dashboardData.ts created correctly.`

- [ ] **Step 5: Commit**

```
git add src/components/Dashboard/dashboardData.ts tests/test_dashboard.js
git commit -m "feat(dashboard): add dashboard mock data"
```

---

## Task 4: DashboardGallery component

**Files:**
- Create: `src/components/Dashboard/DashboardGallery.tsx`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardGallery.tsx'),
  'DashboardGallery.tsx must exist'
);
const gallery = fs.readFileSync('src/components/Dashboard/DashboardGallery.tsx', 'utf-8');
assert.ok(gallery.includes('handleTouchStart'), 'gallery must handle touch start');
assert.ok(gallery.includes('handleTouchEnd'), 'gallery must handle touch end');
assert.ok(gallery.includes('useReducedMotion'), 'gallery must respect reduced motion');
assert.ok(gallery.includes("directionRef"), 'gallery must track slide direction');

console.log('Task 4 PASS: DashboardGallery created correctly.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `DashboardGallery.tsx must exist`.

- [ ] **Step 3: Create DashboardGallery.tsx**

```tsx
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface DashboardGalleryProps {
  images: string[];
}

export default function DashboardGallery({ images }: DashboardGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const directionRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const total = images.length;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    directionRef.current = 1;
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    directionRef.current = -1;
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    if (clickX >= width / 2) {
      goNext();
    } else {
      goPrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) goPrev();
      else goNext();
    }
  };

  if (total === 0) {
    return (
      <div
        className="w-full h-full"
        style={{ background: 'var(--color-canvas)' }}
        aria-hidden="true"
      />
    );
  }

  const slideVariants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0 }),
        animate: { x: '0%', opacity: 1 },
        exit: (dir: number) => ({ x: `${dir * -100}%`, opacity: 0 }),
      };

  const counter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <div
      className="w-full h-full flex items-stretch"
      style={{ background: 'var(--color-canvas)', padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem) 0.75rem clamp(1rem, 2vw, 1.75rem)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <div
        className="relative w-full h-full overflow-hidden"
        onClick={handleFrameClick}
        style={{ cursor: total > 1 ? 'pointer' : 'default', borderRadius: '4px' }}
      >
        <AnimatePresence custom={directionRef.current} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            custom={directionRef.current}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
            }
          />
        </AnimatePresence>

        {total > 1 && (
          <span
            className="absolute bottom-3 right-4"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {counter}
          </span>
        )}
      </div>
    </div>
  );
}
```

Note: The outer `div` has two `style` props — merge them before committing. Replace the two `style` props on the outer `div` with one:

```tsx
style={{
  background: 'var(--color-canvas)',
  padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem) 0.75rem clamp(1rem, 2vw, 1.75rem)',
  touchAction: 'pan-y',
}}
```

And remove the standalone `style={{ touchAction: 'pan-y' }}`.

- [ ] **Step 4: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 4 PASS: DashboardGallery created correctly.`

- [ ] **Step 5: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```
git add src/components/Dashboard/DashboardGallery.tsx tests/test_dashboard.js
git commit -m "feat(dashboard): add DashboardGallery with slide nav and touch support"
```

---

## Task 5: DashboardDomainNav component

**Files:**
- Create: `src/components/Dashboard/DashboardDomainNav.tsx`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardDomainNav.tsx'),
  'DashboardDomainNav.tsx must exist'
);
const nav = fs.readFileSync('src/components/Dashboard/DashboardDomainNav.tsx', 'utf-8');
assert.ok(nav.includes("'today'"), "nav must include 'today' domain");
assert.ok(nav.includes("'financials'"), "nav must include 'financials' domain");
assert.ok(nav.includes("'tasks'"), "nav must include 'tasks' domain");
assert.ok(nav.includes('aria-pressed'), 'nav items must have aria-pressed');

console.log('Task 5 PASS: DashboardDomainNav created correctly.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `DashboardDomainNav.tsx must exist`.

- [ ] **Step 3: Create DashboardDomainNav.tsx**

```tsx
import React from 'react';
import { Sun, TrendingUp, ClipboardList } from 'lucide-react';

export type Domain = 'today' | 'financials' | 'tasks';

interface DashboardDomainNavProps {
  active: Domain;
  onChange: (domain: Domain) => void;
}

const domains: { id: Domain; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'today', label: 'Today', Icon: Sun },
  { id: 'financials', label: 'Financials', Icon: TrendingUp },
  { id: 'tasks', label: 'Tasks', Icon: ClipboardList },
];

export default function DashboardDomainNav({ active, onChange }: DashboardDomainNavProps) {
  return (
    <>
      {/* Desktop: vertical strip */}
      <nav
        className="hidden lg:flex flex-col items-center gap-1 py-10"
        style={{
          width: '72px',
          borderRight: '1px solid var(--color-border-subtle)',
        }}
        aria-label="Dashboard sections"
      >
        {domains.map(({ id, label, Icon }, i) => {
          const isActive = active === id;
          const isFirst = i === 0;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-pressed={isActive}
              aria-label={label}
              style={{
                marginTop: isFirst ? 0 : '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 8px',
                borderRadius: '8px',
                background: isActive ? 'var(--color-border-subtle)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '56px',
                transition: 'background 0.2s ease',
              }}
            >
              <Icon
                size={isFirst ? 17 : 15}
                strokeWidth={isActive ? 2 : 1.5}
                style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: isFirst ? '0.5625rem' : '0.5rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile/Tablet: horizontal segmented pill */}
      <nav
        className="flex lg:hidden"
        style={{ padding: '12px 20px 0' }}
        aria-label="Dashboard sections"
      >
        <div
          style={{
            display: 'inline-flex',
            gap: '2px',
            background: 'var(--color-border-subtle)',
            borderRadius: '999px',
            padding: '3px',
          }}
          role="group"
        >
          {domains.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-pressed={isActive}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.625rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                  background: isActive ? 'var(--color-canvas)' : 'transparent',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '5px 14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 5 PASS: DashboardDomainNav created correctly.`

- [ ] **Step 5: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```
git add src/components/Dashboard/DashboardDomainNav.tsx tests/test_dashboard.js
git commit -m "feat(dashboard): add DashboardDomainNav with vertical strip and pill variants"
```

---

## Task 6: DashboardToday component

**Files:**
- Create: `src/components/Dashboard/DashboardToday.tsx`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardToday.tsx'),
  'DashboardToday.tsx must exist'
);
const today = fs.readFileSync('src/components/Dashboard/DashboardToday.tsx', 'utf-8');
assert.ok(today.includes('arrivalsToday'), 'must reference arrivalsToday');
assert.ok(today.includes('departuresToday'), 'must reference departuresToday');
assert.ok(today.includes('VIEW CALENDAR'), 'must include VIEW CALENDAR nav link');
assert.ok(today.includes('No arrivals'), 'must handle empty arrivals state');

console.log('Task 6 PASS: DashboardToday created correctly.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `DashboardToday.tsx must exist`.

- [ ] **Step 3: Create DashboardToday.tsx**

```tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, GuestEvent } from './dashboardData';

interface DashboardTodayProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

function GuestList({ guests, italic }: { guests: GuestEvent[]; italic: boolean }) {
  if (guests.length === 0) return null;
  return (
    <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {guests.map(g => (
        <li
          key={g.id}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)',
            fontStyle: italic ? 'italic' : 'normal',
            fontWeight: 400,
            color: 'var(--color-ink)',
            lineHeight: 1.3,
          }}
        >
          {g.name}
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontStyle: 'normal',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              marginLeft: '8px',
            }}
          >
            {g.nights}n
          </span>
        </li>
      ))}
    </ul>
  );
}

function EmptyGuests({ label }: { label: string }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem',
        fontWeight: 400,
        color: 'var(--color-ink-secondary)',
        margin: '6px 0 0',
        fontStyle: 'normal',
      }}
    >
      {label}
    </p>
  );
}

export default function DashboardToday({ data, onNavigate }: DashboardTodayProps) {
  const { occupancy, arrivalsToday, departuresToday, arrivalsTomorrow, departuresTomorrow } = data;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
        gap: 0,
      }}
    >
      {/* Occupancy — dominant */}
      <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            margin: '0 0 8px',
          }}
        >
          Occupancy
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 1,
          }}
        >
          {occupancy}%
        </p>
      </div>

      {/* Arrivals — more visual weight */}
      <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {arrivalsToday.length}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              margin: 0,
            }}
          >
            Arriving today
          </p>
        </div>
        {arrivalsToday.length > 0
          ? <GuestList guests={arrivalsToday} italic={true} />
          : <EmptyGuests label="No arrivals" />
        }
        {arrivalsTomorrow.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 400,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              margin: '10px 0 0',
              opacity: 0.7,
            }}
          >
            {arrivalsTomorrow.length} tomorrow
          </p>
        )}
      </div>

      {/* Departures — subordinate */}
      <div style={{ marginBottom: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 2vw, 1.375rem)',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {departuresToday.length}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              margin: 0,
              opacity: 0.75,
            }}
          >
            Departing today
          </p>
        </div>
        {departuresToday.length > 0
          ? <GuestList guests={departuresToday} italic={false} />
          : <EmptyGuests label="No departures" />
        }
        {departuresTomorrow.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              margin: '8px 0 0',
              opacity: 0.6,
            }}
          >
            {departuresTomorrow.length} tomorrow
          </p>
        )}
      </div>

      {/* Nav link */}
      <button
        onClick={() => onNavigate('calendar', 'push')}
        style={{
          marginTop: 'clamp(1.5rem, 3vw, 2rem)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.625rem',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-secondary)',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        VIEW CALENDAR
        <ArrowRight size={11} strokeWidth={1.5} />
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 6 PASS: DashboardToday created correctly.`

- [ ] **Step 5: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```
git add src/components/Dashboard/DashboardToday.tsx tests/test_dashboard.js
git commit -m "feat(dashboard): add DashboardToday domain"
```

---

## Task 7: DashboardFinancials component

**Files:**
- Create: `src/components/Dashboard/DashboardFinancials.tsx`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardFinancials.tsx'),
  'DashboardFinancials.tsx must exist'
);
const fin = fs.readFileSync('src/components/Dashboard/DashboardFinancials.tsx', 'utf-8');
assert.ok(fin.includes('REVENUE'), 'must show REVENUE label');
assert.ok(fin.includes('EXPENSES'), 'must show EXPENSES label');
assert.ok(fin.includes('NET'), 'must show NET label');
assert.ok(fin.includes('selectedPeriodIndex'), 'must track selected period');
assert.ok(fin.includes('VIEW FINANCIALS'), 'must include VIEW FINANCIALS nav link');

console.log('Task 7 PASS: DashboardFinancials created correctly.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `DashboardFinancials.tsx must exist`.

- [ ] **Step 3: Create DashboardFinancials.tsx**

```tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, formatCurrency } from './dashboardData';

interface DashboardFinancialsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardFinancials({ data, onNavigate }: DashboardFinancialsProps) {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);

  const { periods } = data;
  const period = periods[selectedPeriodIndex];
  const net = period.revenue - period.expenses;
  const isNegative = net < 0;

  const goPrevPeriod = () => {
    setSelectedPeriodIndex(prev => Math.min(prev + 1, periods.length - 1));
  };

  const goNextPeriod = () => {
    setSelectedPeriodIndex(prev => Math.max(prev - 1, 0));
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-ink-secondary)',
    margin: 0,
  };

  const figureStyle: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    color: 'var(--color-ink)',
    margin: 0,
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
      }}
    >
      {/* Period selector */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        <button
          onClick={goPrevPeriod}
          disabled={selectedPeriodIndex >= periods.length - 1}
          aria-label="Previous period"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: selectedPeriodIndex >= periods.length - 1 ? 'default' : 'pointer',
            color: selectedPeriodIndex >= periods.length - 1 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            fontWeight: 400,
            color: 'var(--color-ink)',
            letterSpacing: '0.02em',
            userSelect: 'none',
          }}
        >
          {period.label}
        </span>
        <button
          onClick={goNextPeriod}
          disabled={selectedPeriodIndex <= 0}
          aria-label="Next period"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: selectedPeriodIndex <= 0 ? 'default' : 'pointer',
            color: selectedPeriodIndex <= 0 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Revenue — supporting */}
      <div style={{ marginBottom: '16px' }}>
        <p style={labelStyle}>Revenue</p>
        <p style={{ ...figureStyle, fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', marginTop: '6px' }}>
          {formatCurrency(period.revenue)}
        </p>
      </div>

      {/* Expenses — subordinate (smaller + reduced opacity) */}
      <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        <p style={{ ...labelStyle, opacity: 0.7 }}>Expenses</p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(1rem, 2vw, 1.375rem)',
            marginTop: '6px',
            opacity: 0.75,
          }}
        >
          {formatCurrency(period.expenses)}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }} />

      {/* Net — dominant */}
      <div style={{ marginBottom: 'auto' }}>
        <p
          style={{
            ...labelStyle,
            fontSize: '0.625rem',
            letterSpacing: '0.32em',
          }}
        >
          Net
        </p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginTop: '10px',
            color: isNegative ? 'oklch(53% 0.12 25)' : 'var(--color-ink)',
          }}
        >
          {formatCurrency(net)}
        </p>
      </div>

      {/* Nav link */}
      <button
        onClick={() => onNavigate('reporting', 'push')}
        style={{
          marginTop: 'clamp(1.5rem, 3vw, 2rem)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.625rem',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-secondary)',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        VIEW FINANCIALS
        <ArrowRight size={11} strokeWidth={1.5} />
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 7 PASS: DashboardFinancials created correctly.`

- [ ] **Step 5: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```
git add src/components/Dashboard/DashboardFinancials.tsx tests/test_dashboard.js
git commit -m "feat(dashboard): add DashboardFinancials with P&L sequence"
```

---

## Task 8: DashboardTasks component

**Files:**
- Create: `src/components/Dashboard/DashboardTasks.tsx`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardTasks.tsx'),
  'DashboardTasks.tsx must exist'
);
const tasks = fs.readFileSync('src/components/Dashboard/DashboardTasks.tsx', 'utf-8');
assert.ok(tasks.includes('All clear'), 'must show All clear when no tasks');
assert.ok(tasks.includes('urgent'), 'must handle urgent status');
assert.ok(tasks.includes('slice(0, 5)'), 'must limit list to 5 items');

console.log('Task 8 PASS: DashboardTasks created correctly.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `DashboardTasks.tsx must exist`.

- [ ] **Step 3: Create DashboardTasks.tsx**

```tsx
import React from 'react';
import { ScreenType } from '../../types';
import { DashboardData, DashboardTask } from './dashboardData';

interface DashboardTasksProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const statusLabel: Record<DashboardTask['status'], string> = {
  urgent: 'Urgent',
  pending: 'Pending',
  scheduled: 'Scheduled',
};

const statusColor: Record<DashboardTask['status'], string> = {
  urgent: 'oklch(53% 0.12 25)',
  pending: 'var(--color-ink-secondary)',
  scheduled: 'var(--color-ink-muted)',
};

export default function DashboardTasks({ data, onNavigate, onNotify }: DashboardTasksProps) {
  const { tasks } = data;
  const visible = tasks.slice(0, 5);
  const hasMore = tasks.length > 5;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
      }}
    >
      {/* Count */}
      <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            margin: '0 0 8px',
          }}
        >
          Open items
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 1,
          }}
        >
          {tasks.length > 0 ? `${tasks.length} open` : 'All clear'}
        </p>
      </div>

      {/* Numbered list */}
      {visible.length > 0 && (
        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            flex: 1,
          }}
        >
          {visible.map((task, i) => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                paddingTop: i === 0 ? 0 : '14px',
                paddingBottom: '14px',
                borderBottom: i < visible.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}
            >
              {/* EB Garamond numeral anchor */}
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: 400,
                  color: 'var(--color-ink-secondary)',
                  lineHeight: 1.2,
                  minWidth: '18px',
                  flexShrink: 0,
                  opacity: 0.6,
                }}
              >
                {i + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.8125rem',
                    fontWeight: 400,
                    color: 'var(--color-ink)',
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                >
                  {task.description}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.5625rem',
                    fontWeight: task.status === 'urgent' ? 600 : 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: statusColor[task.status],
                    margin: 0,
                    opacity: task.status === 'urgent' ? 1 : 0.7,
                  }}
                >
                  {statusLabel[task.status]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* View all — disabled until Tasks screen exists */}
      {tasks.length > 0 && (
        <button
          onClick={() => onNotify?.('Tasks screen coming soon')}
          style={{
            marginTop: 'clamp(1.5rem, 3vw, 2rem)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            opacity: 0.6,
            alignSelf: 'flex-start',
          }}
        >
          VIEW ALL TASKS {hasMore && `(${tasks.length})`}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 8 PASS: DashboardTasks created correctly.`

- [ ] **Step 5: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```
git add src/components/Dashboard/DashboardTasks.tsx tests/test_dashboard.js
git commit -m "feat(dashboard): add DashboardTasks with numbered list"
```

---

## Task 9: DashboardView — assemble the layout

**Files:**
- Create: `src/components/Dashboard/DashboardView.tsx`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardView.tsx'),
  'DashboardView.tsx must exist'
);
const view = fs.readFileSync('src/components/Dashboard/DashboardView.tsx', 'utf-8');
assert.ok(view.includes('DashboardGallery'), 'DashboardView must include DashboardGallery');
assert.ok(view.includes('DashboardDomainNav'), 'DashboardView must include DashboardDomainNav');
assert.ok(view.includes('DashboardToday'), 'DashboardView must include DashboardToday');
assert.ok(view.includes('DashboardFinancials'), 'DashboardView must include DashboardFinancials');
assert.ok(view.includes('DashboardTasks'), 'DashboardView must include DashboardTasks');
assert.ok(view.includes('getDashboardData'), 'DashboardView must call getDashboardData');

console.log('Task 9 PASS: DashboardView assembled correctly.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `DashboardView.tsx must exist`.

- [ ] **Step 3: Create DashboardView.tsx**

```tsx
import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { sampleProperties } from '../PropertySelector/propertyData';
import { getDashboardData } from './dashboardData';
import DashboardGallery from './DashboardGallery';
import DashboardDomainNav, { Domain } from './DashboardDomainNav';
import DashboardToday from './DashboardToday';
import DashboardFinancials from './DashboardFinancials';
import DashboardTasks from './DashboardTasks';

interface DashboardViewProps {
  propertyId: string | null;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

export default function DashboardView({ propertyId, onNavigate, onNotify }: DashboardViewProps) {
  const [activeDomain, setActiveDomain] = useState<Domain>('today');

  const property = sampleProperties.find(p => p.id === propertyId) ?? sampleProperties[0];
  const data = getDashboardData(property.id);

  const renderDomain = () => {
    switch (activeDomain) {
      case 'today':
        return <DashboardToday data={data} onNavigate={onNavigate} />;
      case 'financials':
        return <DashboardFinancials data={data} onNavigate={onNavigate} />;
      case 'tasks':
        return <DashboardTasks data={data} onNavigate={onNavigate} onNotify={onNotify} />;
    }
  };

  return (
    <div
      className="w-full"
      style={{
        minHeight: '100dvh',
        background: 'var(--color-canvas)',
        display: 'grid',
        gridTemplateColumns: '1fr',        // mobile default: single column
        gridTemplateRows: 'auto 1fr',      // mobile: gallery strip on top
      }}
    >
      {/* Mobile/Tablet gallery strip — visible below lg */}
      <div
        className="lg:hidden"
        style={{ height: 'clamp(180px, 30vw, 220px)' }}
      >
        <DashboardGallery images={property.images} />
      </div>

      {/* Main area — on desktop becomes a two-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',      // mobile: full width
          gridTemplateRows: 'auto 1fr',
        }}
        className="lg:grid-cols-[58fr_42fr] lg:h-[100dvh]"
      >
        {/* Left panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Mobile: domain pill above content */}
          <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />

          {/* Domain content + vertical strip (desktop wraps both) */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            {/* Desktop vertical domain strip — rendered inside DashboardDomainNav (hidden on mobile) */}
            <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />

            {/* Domain content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {renderDomain()}
            </div>
          </div>
        </div>

        {/* Right panel — gallery, desktop only */}
        <div
          className="hidden lg:block"
          style={{ height: '100dvh', position: 'sticky', top: 0 }}
        >
          <DashboardGallery images={property.images} />
        </div>
      </div>
    </div>
  );
}
```

**Note on the nav duplication:** `DashboardDomainNav` renders the mobile pill with `flex lg:hidden` and the desktop strip with `hidden lg:flex`. Rendering it twice (once at the top for mobile, once inside the left panel for desktop) is intentional — the mobile pill lives above the content area, the desktop strip lives beside it. This is a known pattern and both instances are managed by CSS visibility.

- [ ] **Step 4: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 9 PASS: DashboardView assembled correctly.`

- [ ] **Step 5: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```
git add src/components/Dashboard/DashboardView.tsx tests/test_dashboard.js
git commit -m "feat(dashboard): assemble DashboardView with two-zone layout"
```

---

## Task 10: Wire DashboardView into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add failing assertion to test**

Append to `tests/test_dashboard.js`:

```js
const app = fs.readFileSync('src/App.tsx', 'utf-8');
assert.ok(app.includes("case 'dashboard'"), "App.tsx must handle 'dashboard' case");
assert.ok(app.includes('DashboardView'), 'App.tsx must import DashboardView');
assert.ok(
  app.includes("handleNavigate('dashboard'") || app.includes("'dashboard', 'push'"),
  'PropertySelector must navigate to dashboard on property select'
);

console.log('Task 10 PASS: App.tsx wired to dashboard.');
```

- [ ] **Step 2: Run test to verify it fails**

```
node tests/test_dashboard.js
```

Expected: AssertionError on `App.tsx must handle 'dashboard' case`.

- [ ] **Step 3: Add DashboardView import to App.tsx**

Add after the existing imports (after `import Preloader`):

```tsx
import DashboardView from './components/Dashboard/DashboardView';
```

- [ ] **Step 4: Add dashboard case to renderActiveScreen()**

Inside the `switch (currentScreen)` block in `App.tsx`, add before the `default:` case:

```tsx
case 'dashboard':
  return (
    <div key="dashboard" className="w-full min-h-screen">
      <DashboardView
        propertyId={selectedPropertyId}
        onNavigate={(screen, style) => handleNavigate(screen, style)}
        onNotify={triggerToast}
      />
    </div>
  );
```

- [ ] **Step 5: Update PropertySelector to navigate to dashboard**

In the `property_selector` case in `renderActiveScreen()`, change:

```tsx
onSelectProperty={(propertyId) => {
  setSelectedPropertyId(propertyId);
  handleNavigate('reporting', 'push');
}}
```

to:

```tsx
onSelectProperty={(propertyId) => {
  setSelectedPropertyId(propertyId);
  handleNavigate('dashboard', 'push');
}}
```

- [ ] **Step 6: Run test to verify it passes**

```
node tests/test_dashboard.js
```

Expected: `Task 10 PASS: App.tsx wired to dashboard.`

- [ ] **Step 7: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```
git add src/App.tsx tests/test_dashboard.js
git commit -m "feat(dashboard): wire DashboardView into App, redirect from property selector"
```

---

## Task 11: Final test run and build verification

- [ ] **Step 1: Run full test suite**

```
node tests/test_dashboard.js
node tests/test_property_selector.js
node tests/test_property_selector_aria.js
```

Expected: All tests pass with no AssertionErrors.

- [ ] **Step 2: TypeScript full check**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Production build**

```
npx vite build
```

Expected: Build completes with no errors. Warnings about bundle size are acceptable.

- [ ] **Step 4: Final commit**

```
git add -A
git commit -m "feat(dashboard): complete property dashboard implementation"
```

---

## Known Limitations (out of scope for this plan)

- **Tasks screen** does not exist yet. The "VIEW ALL TASKS" button fires a toast notification instead of navigating.
- **Real data** is not wired. All dashboard content is mock data keyed by `propertyId`.
- **Owner-specific view** (passive oversight mode) is deferred to a future spec.
- **Multiple property images** reuse existing menu assets as placeholders. Real per-property photo sets are a content task.
