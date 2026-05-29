# Menu Screen Accessibility & Readability Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all text readability and accessibility issues on the NavMenu screen, ensuring WCAG AA contrast ratios pass and all interactive controls are clearly visible and large enough to tap.

**Architecture:** Single-file change — `NavMenuView.tsx`. Four independent problem areas are fixed in four tasks so each commit is reviewable and revertable in isolation. No new files created. No logic changes, only markup and CSS classes.

**Tech Stack:** React 18, Tailwind CSS v4, TypeScript, Vite

---

## File Structure

One file touched across all tasks:

| File | Action |
|---|---|
| `src/components/NavMenuView.tsx` | Modify — background overlay, header controls, menu text, footer |

---

## Task 1: Strengthen the background scrim

The current overlay is `bg-black/35` (35% opacity). Against a bright coastal photo with white buildings and sky, the lightest text areas (`text-white/60`, `text-white/70`) fail WCAG AA at this opacity. We raise it to `bg-black/50` and add a gradient band behind the menu item area so the serif headings always sit on dark.

**Files:**
- Modify: `src/components/NavMenuView.tsx:56-66`

- [ ] **Step 1: Verify the TypeScript build passes on the current file**

```powershell
npx tsc --noEmit
```

Expected: no errors (baseline green build).

- [ ] **Step 2: Replace the overlay and vignette divs with stronger values**

Replace lines 56–66 in `src/components/NavMenuView.tsx`:

```tsx
      {/* Uniform dark overlay — raised to 50% for WCAG AA compliance */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-black/50" />

      {/* Gradient scrim — heavier at left where text lives */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.10) 60%, transparent 100%)',
        }}
      />
```

- [ ] **Step 3: Verify the build still passes**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check in dev server**

```powershell
npm run dev
```

Open `http://localhost:5173`, navigate to the menu. The background photo should be visibly darker — especially in the sky and building areas — while remaining recognisable. Text should read clearly with no bleed-through.

- [ ] **Step 5: Commit**

```powershell
git add src/components/NavMenuView.tsx
git commit -m "fix(menu): raise background scrim to 50% for WCAG AA contrast"
```

---

## Task 2: Add protective backdrops to header controls

The hamburger icon (top-left) and the close ✕ button (top-right) are thin white strokes rendered directly on the image with no protective backing. On bright spots (sky, white buildings) they become invisible. We wrap each in a frosted-glass pill that guarantees contrast regardless of what part of the photo is behind them.

**Files:**
- Modify: `src/components/NavMenuView.tsx:79-94`

- [ ] **Step 1: Verify the TypeScript build passes**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Replace the header block (lines 79–94)**

```tsx
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 md:px-14 pt-8 md:pt-12 shrink-0">
          {/* Hamburger — decorative, not interactive */}
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20"
            aria-hidden="true"
          >
            <Menu className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <h2
            className="text-[10px] md:text-[11px] tracking-[0.35em] text-white uppercase font-medium"
            id="nav-menu-brand"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
          >
            Vallarta Estates
          </h2>
          <button
            aria-label="Close menu"
            id="nav-menu-close-btn"
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/45 transition-colors duration-300 cursor-pointer"
          >
            <X className="w-4 h-4 text-white" strokeWidth={1.5} />
          </button>
        </header>
```

- [ ] **Step 3: Verify the build still passes**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check in dev server**

Open `http://localhost:5173`, navigate to the menu. Scroll mentally to an imaginary bright-sky position — both the hamburger pill and the ✕ pill should be clearly visible as frosted dark circles. The ✕ button must be immediately legible. Test the hover state: it darkens slightly.

- [ ] **Step 5: Commit**

```powershell
git add src/components/NavMenuView.tsx
git commit -m "fix(menu): add frosted-glass backdrops to header controls for contrast safety"
```

---

## Task 3: Improve menu item label and subtitle legibility

The main labels use `font-serif` at weight 300 (thin). Thin strokes disappear against textured backgrounds even with a scrim. We move to weight 400 and add a stronger text-shadow. The subtitles are `text-[9px]` / `text-[10px]` at `text-white/70` — too small and too transparent. We raise them to `text-[11px]` / `text-[12px]` at `text-white/90` with a stronger shadow.

**Files:**
- Modify: `src/components/NavMenuView.tsx:121-129`

- [ ] **Step 1: Verify the TypeScript build passes**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Replace the label and subtitle spans (lines 121–129)**

```tsx
                  <span
                    className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-white group-hover:text-white/90 transition-colors duration-300 leading-[1.15]"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.55)' }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[11px] md:text-[12px] tracking-[0.25em] text-white/90 font-mono block mt-2.5 uppercase"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                  >
                    {item.subtitle}
                  </span>
```

- [ ] **Step 3: Verify the build still passes**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check in dev server**

Open `http://localhost:5173`, navigate to the menu. Each menu label should feel slightly heavier and more legible. Subtitles ("PORTFOLIO OVERVIEW & ASSET VALUATION" etc.) should now be readable at arm's length without squinting. The serif elegance must be preserved — weight 400 is still light, just not skeletal.

- [ ] **Step 5: Commit**

```powershell
git add src/components/NavMenuView.tsx
git commit -m "fix(menu): increase menu item font weight and subtitle size for readability"
```

---

## Task 4: Fix footer link contrast, touch targets, and page indicator

The footer links are `text-[10px]` at `text-white/80`. Against the blue-green water at the bottom of the photo, this fails AA. We raise opacity to `text-white/95`, increase icon sizes from `w-3.5 h-3.5` to `w-4 h-4`, add `py-1` to every interactive element (increases vertical tap target to ~28px), and raise the `Property Management` label from `text-[8px]` to `text-[9px]`. The page indicator (01 — 04) moves from `text-xs` to `text-sm` and from `text-white/70` to `text-white/90`.

**Files:**
- Modify: `src/components/NavMenuView.tsx:137-193`

- [ ] **Step 1: Verify the TypeScript build passes**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Replace the footer block (lines 137–193)**

```tsx
        {/* Bottom bar */}
        <footer className="shrink-0 px-8 md:px-14 pb-8 md:pb-10">
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <p
                className="text-[9px] tracking-[0.3em] text-white/80 uppercase font-medium"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              >
                Property Management
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] tracking-[0.15em] text-white/95">
                <button
                  onClick={() =>
                    onNotify
                      ? onNotify('Support concierge: concierge@vallarta-estates.com')
                      : alert('Support concierge: concierge@vallarta-estates.com')
                  }
                  className="flex items-center gap-2 py-1 hover:text-white transition-colors duration-200 cursor-pointer uppercase"
                  id="nav-foo-contact"
                >
                  <Phone className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Contact
                </button>
                <button
                  onClick={() =>
                    onNotify
                      ? onNotify('System telemetry functioning securely.')
                      : alert('System telemetry functioning securely.')
                  }
                  className="flex items-center gap-2 py-1 hover:text-white transition-colors duration-200 cursor-pointer uppercase"
                  id="nav-foo-settings"
                >
                  <Sliders className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Settings
                </button>
                <a
                  href="https://images.unsplash.com/photo-1613977257363-707ba9348227"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 py-1 hover:text-white transition-colors duration-200 uppercase"
                  id="nav-foo-website"
                >
                  <Globe className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Website
                </a>
                <button
                  onClick={() => onNavigate('login', 'push')}
                  className="flex items-center gap-2 py-1 hover:text-white transition-colors duration-200 cursor-pointer uppercase"
                  id="nav-foo-logout"
                >
                  <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-white/90">
              <span className="text-sm font-serif">01</span>
              <div className="w-8 h-px bg-white/50" />
              <span className="text-sm font-serif">04</span>
            </div>
          </div>
        </footer>
```

- [ ] **Step 3: Verify the build still passes**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check in dev server**

Open `http://localhost:5173`, navigate to the menu. Footer links must be clearly legible over the water. Icons should be clearly visible at their new size. The "01 — 04" indicator should register as intentional text, not a smudge. Click each footer button to confirm they still fire correctly.

- [ ] **Step 5: Commit**

```powershell
git add src/components/NavMenuView.tsx
git commit -m "fix(menu): raise footer contrast, enlarge touch targets, fix page indicator size"
```

---

## Verification Plan

### Build check
Run after every task:
```powershell
npx tsc --noEmit
```
Expected: zero TypeScript errors across all four tasks.

### Manual visual verification
After all four tasks:
1. `npm run dev` → open `http://localhost:5173`
2. Open the menu (hamburger icon).
3. Confirm: background is visibly darker but still recognisable as the coastal photo.
4. Confirm: hamburger and ✕ appear inside frosted dark circles.
5. Confirm: all four menu labels (THE ESTATES, FINANCIAL PERFORMANCE, OPERATIONS, CALENDAR) are readable at a glance.
6. Confirm: subtitles below each label are legible without squinting.
7. Confirm: footer links (Contact, Settings, Website, Logout) are readable and large enough to tap.
8. Confirm: "01 — 04" indicator reads as intentional content.

### Regression check
Navigate back to all other screens and confirm nothing else changed.
