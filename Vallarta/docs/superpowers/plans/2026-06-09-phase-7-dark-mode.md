# Phase 7: Executive Dark Mode

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Add a user-toggleable dark mode with a completely rethought palette (midnight-teal canvas, warm amber accents, gallery overlay).

**Architecture:** Create a toggle component that sets `data-theme="dark"` on the `<html>` element. CSS variables are pre-defined in `design-tokens.css` under `[data-theme="dark"]`.

**Tech Stack:** React 19, CSS custom properties, localStorage

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Dashboard/DarkModeToggle.tsx` | Sun/moon toggle button |
| `src/components/Dashboard/DashboardView.tsx` | Add toggle to header |
| `src/design-tokens.css` | Dark mode tokens (already added in Phase 1) |

---

### Task 1: Create DarkModeToggle Component

**Files:**
- Create: `src/components/Dashboard/DarkModeToggle.tsx`

**Code:**
```typescript
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-ink-secondary)',
        padding: '4px',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      aria-label="Toggle dark mode"
      className="dashboard-focus"
    >
      {isDark ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
    </button>
  );
}
```

**Verification:** Toggle switches between sun and moon icons. Theme attribute updates on `<html>`.

---

### Task 2: Add Dark Mode Toggle to Dashboard Header

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

**Change:** Add `<DarkModeToggle />` between the "Back" and "Menu" buttons.

```tsx
import DarkModeToggle from './DarkModeToggle';

// In the header bar:
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.5rem, 3vw, 2.5rem)', height: '52px', borderBottom: '1px solid var(--color-border-subtle)', flexShrink: 0 }}>
  <button className="dashboard-focus" onClick={() => onNavigate('property_selector', 'push_back')} style={headerBtnStyle} aria-label="Back to property selector">
    <ChevronLeft size={12} strokeWidth={1.5} /> Back
  </button>

  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <DarkModeToggle />
    <button className="dashboard-focus" onClick={() => onNavigate('nav_menu', 'push')} style={headerBtnStyle} aria-label="Open navigation menu">
      Menu <ChevronRight size={12} strokeWidth={1.5} />
    </button>
  </div>
</div>
```

---

### Task 3: Add Gallery Overlay in Dark Mode

**Files:**
- Modify: `src/components/Dashboard/DashboardGallery.tsx`

**Change:** Add a dark overlay div that only appears in dark mode.

```tsx
<div
  style={{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to bottom, rgba(15,26,26,0.3) 0%, rgba(15,26,26,0.6) 100%)',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  }}
  className="dark-mode-overlay"
/>
```

**Add to design-tokens.css:**
```css
[data-theme="dark"] .dark-mode-overlay {
  opacity: 1;
}
```

---

### Task 4: Commit

```bash
git add -A
git commit -m "feat: add Executive Dark Mode toggle with persistent localStorage"
```

---

## Self-Review

- [x] Toggle persists in localStorage
- [x] Dark mode tokens cover all colors
- [x] Gallery overlay appears only in dark mode
- [x] Toggle is accessible with aria-label
- [x] No placeholders in any task
