# Phase 1: Foundation & Data Architecture

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the data model to support ambient colors, guest chronicle, revenue history, and dark mode tokens.

**Architecture:** Add TypeScript interfaces and CSS tokens for new features. Pre-compute ambient colors per property. Create a React context provider for ambient color consumption.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS v4, CSS custom properties

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Dashboard/dashboardData.ts` | Expanded interfaces + enriched mock data |
| `src/components/Dashboard/AmbientColorProvider.tsx` | React context for ambient colors |
| `src/design-tokens.css` | New dark mode + ambient color tokens |
| `src/types.ts` | Add `performance` to ScreenType |

---

### Task 1: Add AmbientColors and GuestLogEntry Interfaces

**Files:**
- Modify: `src/components/Dashboard/dashboardData.ts`

**Code:**
```typescript
export interface AmbientColors {
  canvas: string;
  accent: string;
  surface: string;
}

export interface GuestLogEntry {
  id: string;
  timestamp: string;
  type: 'arrival' | 'departure' | 'task_completed' | 'maintenance' | 'note';
  description: string;
  guestName?: string;
  nights?: number;
  assignee?: string;
}

export interface DashboardData {
  occupancy: number;
  occupancyPrev: number;
  occupancyHistory: number[];
  arrivalsToday: GuestEvent[];
  departuresToday: GuestEvent[];
  arrivalsTomorrow: GuestEvent[];
  departuresTomorrow: GuestEvent[];
  lengthOfStay: LengthOfStay;
  guestSatisfaction: GuestSatisfaction;
  tasks: DashboardTask[];
  periods: PeriodFinancials[];
  expenseBreakdown: ExpenseCategory[];
  ambientColors: AmbientColors;
  revenueHistory: number[];
  budgetTarget: number;
  guestLog: GuestLogEntry[];
}
```

---

### Task 2: Add Ambient Colors to All 5 Properties

**Files:**
- Modify: `src/components/Dashboard/dashboardData.ts`

**Code:**
```typescript
const mockData: Record<string, DashboardData> = {
  'casa-palmeras': {
    // ... existing fields ...
    ambientColors: {
      canvas: '#faf6f0',
      accent: '#d4a76a',
      surface: '#fdf8f2',
    },
    revenueHistory: [10100, 8900, 11200, 9600, 10800, 12400],
    budgetTarget: 15000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T15:14:00', type: 'arrival', description: 'Elena Rosenthal checked in', guestName: 'Elena Rosenthal', nights: 5 },
      { id: 'g2', timestamp: '2026-06-07T15:14:00', type: 'arrival', description: 'Marco & Lucia Ferrara checked in', guestName: 'Marco & Lucia Ferrara', nights: 3 },
      { id: 'g3', timestamp: '2026-06-07T11:00:00', type: 'task_completed', description: 'Pool filter cartridge replaced', assignee: 'Carlos' },
    ],
  },
  'villa-luna': {
    // ... existing fields ...
    ambientColors: {
      canvas: '#f5f8f5',
      accent: '#5a8a7a',
      surface: '#f0f5f2',
    },
    revenueHistory: [9400, 8200, 10500, 8900, 11200, 9800],
    budgetTarget: 12000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T16:00:00', type: 'arrival', description: 'Valentina Cruz checked in', guestName: 'Valentina Cruz', nights: 6 },
    ],
  },
  'casa-sol': {
    // ... existing fields ...
    ambientColors: {
      canvas: '#f8f5f0',
      accent: '#b8a07a',
      surface: '#f5f0e8',
    },
    revenueHistory: [14900, 12400, 16800, 14100, 15600, 18200],
    budgetTarget: 20000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T10:30:00', type: 'departure', description: 'The Okafor Family checked out', guestName: 'The Okafor Family', nights: 10 },
      { id: 'g2', timestamp: '2026-06-07T09:00:00', type: 'task_completed', description: 'Dock safety inspection completed', assignee: 'Miguel' },
    ],
  },
  'vista-al-mar': {
    // ... existing fields ...
    ambientColors: {
      canvas: '#f0f5f8',
      accent: '#6a8a9a',
      surface: '#e8f0f5',
    },
    revenueHistory: [18200, 15600, 20100, 17400, 19800, 21500],
    budgetTarget: 25000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T14:00:00', type: 'arrival', description: 'Isabelle & Jean-Paul Moreau checked in', guestName: 'Isabelle & Jean-Paul Moreau', nights: 9 },
      { id: 'g2', timestamp: '2026-06-07T11:00:00', type: 'departure', description: 'Dr. Amara Nwosu checked out', guestName: 'Dr. Amara Nwosu', nights: 4 },
    ],
  },
  'casa-brisa': {
    // ... existing fields ...
    ambientColors: {
      canvas: '#f8f8f5',
      accent: '#8a8a7a',
      surface: '#f2f2e8',
    },
    revenueHistory: [5500, 4800, 5900, 5200, 5800, 6100],
    budgetTarget: 8000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T12:00:00', type: 'departure', description: 'Lucas Mendes checked out', guestName: 'Lucas Mendes', nights: 3 },
    ],
  },
};
```

**Verification:** All 5 properties have `ambientColors`, `revenueHistory`, `budgetTarget`, and `guestLog`.

---

### Task 3: Add performance to ScreenType

**Files:**
- Modify: `src/types.ts`

**Code:**
```typescript
export type ScreenType =
  | 'login'
  | 'nav_menu'
  | 'reporting'
  | 'deep_dive'
  | 'camera_expanded'
  | 'calendar'
  | 'property_selector'
  | 'dashboard'
  | 'performance'; // NEW
```

---

### Task 4: Create AmbientColorProvider

**Files:**
- Create: `src/components/Dashboard/AmbientColorProvider.tsx`

**Code:**
```typescript
import React, { createContext, useContext } from 'react';
import { AmbientColors } from './dashboardData';

const defaultColors: AmbientColors = {
  canvas: '#faf8f5',
  accent: '#2b3b32',
  surface: '#f2ece4',
};

const AmbientContext = createContext<AmbientColors>(defaultColors);

export const AmbientProvider = AmbientContext.Provider;
export const useAmbient = () => useContext(AmbientContext);
```

---

### Task 5: Add Dark Mode Tokens to design-tokens.css

**Files:**
- Modify: `src/design-tokens.css`

**Add before closing `}` of `:root`:**
```css
--color-ambient-canvas: var(--color-canvas);
--color-ambient-accent: var(--color-accent-positive);
--color-ambient-surface: var(--color-surface);
```

**Add at end of file:**
```css
[data-theme="dark"] {
  --color-canvas: #0f1a1a;
  --color-surface: rgba(255, 255, 255, 0.05);
  --color-surface-solid: #1a2a2a;
  --color-ink: #f2ece4;
  --color-ink-secondary: #9a9590;
  --color-ink-muted: #6a6a6a;
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border-medium: rgba(255, 255, 255, 0.1);
  --color-accent-positive: #3a6b4a;
  --color-accent-warning: #d49a55;
  --color-accent-live: #c45a5a;
  --color-accent-live-bg: rgba(196, 90, 90, 0.08);
  --color-task-urgent: #c45a5a;
  --color-task-pending: #9a9590;
  --color-task-scheduled: #6a6a6a;
  --color-ambient-canvas: #0f1a1a;
  --color-ambient-accent: #d49a55;
  --color-ambient-surface: #1a2a2a;
  --login-canvas: #0f1a1a;
  --login-surface: #1a2a2a;
  --login-ink: #f2ece4;
  --login-ink-secondary: #9a9590;
  --login-ink-muted: #9a9590;
  --login-border: rgba(255, 255, 255, 0.12);
  --login-border-focus: rgba(255, 255, 255, 0.35);
  --login-accent: #d49a55;
  --login-accent-hover: #bf8a4a;
  --login-error: #c45a5a;
  --login-error-bg: rgba(196, 90, 90, 0.08);
}
```

---

### Task 6: TypeScript Verification

**Command:**
```bash
npx tsc --noEmit
```

**Expected:** Zero errors.

---

### Task 7: Commit

```bash
git add -A
git commit -m "feat: expand data model for ambient colors, dark mode, guest log, revenue history"
```

---

## Self-Review

- [x] All interfaces are consistent across tasks
- [x] No placeholders (all code is complete)
- [x] All 5 properties enriched with ambient colors
- [x] Dark mode tokens cover all existing color variables
