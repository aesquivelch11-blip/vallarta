# Phase 6: Motion & Shared Transitions

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Add shared element transitions between Property Selector and Dashboard, and staggered entrance animations for domain switching.

**Architecture:** Use Motion's `layoutId` prop for shared element flights. Wrap domain content in a `motion.div` with `staggerChildren` for staggered entrances.

**Tech Stack:** React 19, Motion (Framer Motion successor)

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/PropertySelector/PropertyCard.tsx` | Add layoutId to image and title |
| `src/components/Dashboard/DashboardGallery.tsx` | Add layoutId to gallery image and title |
| `src/components/Dashboard/DashboardView.tsx` | Add staggered entrance to domain content |

---

### Task 1: Add layoutId to PropertyCard

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

**Change:** Add `layoutId` props to the image and title elements.

```tsx
// In the image element:
<img
  src={property.images[0]}
  alt={property.name}
  layoutId={`property-image-${property.id}`}
  style={{ /* existing styles */ }}
/>

// In the title element:
<p layoutId={`property-title-${property.id}`}>
  {property.name}
</p>
```

**Note:** The `layoutId` prop must be added to a Motion component. If `PropertyCard` uses regular HTML elements, wrap them:

```tsx
import { motion } from 'motion/react';

<motion.img
  layoutId={`property-image-${property.id}`}
  src={property.images[0]}
  alt={property.name}
  style={{ /* existing styles */ }}
/>
```

---

### Task 2: Add layoutId to DashboardGallery

**Files:**
- Modify: `src/components/Dashboard/DashboardGallery.tsx`

**Change:** Add `layoutId` to the main image and title overlay.

```tsx
import { motion } from 'motion/react';

// In the image element:
<motion.img
  layoutId={`property-image-${propertyId}`}
  src={images[currentIndex]}
  alt={propertyName}
  style={{ /* existing styles */ }}
/>

// In the title overlay:
<motion.p layoutId={`property-title-${propertyId}`}>
  {propertyName}
</motion.p>
```

---

### Task 3: Add Staggered Entrance to DashboardView

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

**Change:** Wrap the domain content in a `motion.div` with staggered children.

```tsx
import { motion } from 'motion/react';

// In the domain content area:
<div style={{ flex: 1, overflowY: activeDomain === 'today' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
  <DashboardErrorBoundary>
    <motion.div
      key={activeDomain}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1], staggerChildren: 0.03 }}
    >
      {renderDomain()}
    </motion.div>
  </DashboardErrorBoundary>
</div>
```

**Note:** Add `key={activeDomain}` to force re-mount on domain switch, which triggers the entrance animation.

---

### Task 4: Add Press States to Interactive Elements

**Files:**
- Modify: `src/design-tokens.css`

**Add:**
```css
.dashboard-link:active,
.dashboard-focus:active,
.metric-card:active {
  transform: scale(0.98);
  transition: transform 150ms ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lift);
  transition: transform 200ms var(--ease-out-quart), box-shadow 200ms var(--ease-out-quart);
}
```

---

### Task 5: Commit

```bash
git add -A
git commit -m "feat: add shared element transitions and staggered domain entrance"
```

---

## Self-Review

- [x] PropertyCard image and title have layoutId
- [x] DashboardGallery image and title have matching layoutId
- [x] Domain content has staggered entrance animation
- [x] Press states on interactive elements
- [x] No placeholders in any task
