<!-- SEED — re-run $impeccable document once there's code to capture the actual tokens and components. -->
---
name: Vallarta Property Manager
description: High-end property management and oversight for Puerto Vallarta.
---

# Design System: Vallarta Property Manager

## 1. Overview

**Creative North Star: "The Luxury Villa Overseer"**

This system embraces a restrained luxury, drawing inspiration from high-end hospitality experiences like omaivillas.com, khufus.com, and hba.com. It relies on responsive motion energy—subtle, high-end transitions that feel deliberate and premium. The aesthetic explicitly rejects generic, tech-ish software design and overly vibrant colors, prioritizing a calm, resort-like atmosphere.

**Key Characteristics:**
- Restrained color strategy for a calm, luxurious feel.
- Elegant Serif display typography paired with a clean Sans-serif body.
- High-end, responsive motion for state changes.

## 2. Colors

**The Restrained Luxury Rule.** Tinted neutrals do the heavy lifting, and the primary accent is used sparingly (≤10% of the surface) to maintain a sense of calm.

### Primary
- **[To be resolved during implementation]**: Calm luxury hue inspired by omaivillas.com.

### Neutral
- **[To be resolved during implementation]**: Tinted, relaxed neutrals for backgrounds and text.

## 3. Typography

**Display font:** EB Garamond Variable — Garalde serif with genuine Renaissance provenance. Georg Duffner's revival of the Egenolff–Berner specimen (Frankfurt, 1592). At display sizes the stroke contrast is moderate and refined; at text sizes it holds readability better than high-contrast Didones. Both the upright and italic are strong — the italic is a true chancery italic, not a sloped roman. Variable `wght` axis: 400–800. Not Cormorant (over-exposed), not DM Serif (template-like), not Fraunces (too expressive for financial data).

**UI / body font:** Instrument Sans — humanist-geometric hybrid. Warmer letter proportions than pure geometric sans, designed to sit alongside editorial serifs without friction. Handles uppercase tracking for labels, pill buttons, and wordmarks cleanly.

**No monospace font.** Instrument Sans handles every role. The technical register of monospace conflicts with the platform's calm, bespoke character.

### Italic discipline

EB Garamond italic is reserved for four moments. No exceptions.

**Use italic for:**
- Property name on hero (`.hero__property-name`) — the singular brand identity moment
- Performance aside editorial quote (`.performance-section__aside-quote`) — contextual voice, not a heading
- Guest names in Chronicle (`.chronicle-stay__name`) — guestbook register quality
- Property name in Camera view — same rule as hero

**Never italic for:**
- Headings, section titles, subheadings
- Financial figures and metric values — upright EB Garamond is more authoritative for numbers
- Navigation items — italic nav is an AI slop tell
- Footer wordmark — upright reads as architectural
- Operational/status values
- Loading states or fallback text

### When to use EB Garamond

Use EB Garamond (upright, wght 400) for:
- Property names and hero identity (italic, exception)
- Large financial figures on the dashboard
- Monthly revenue values in tables
- Section headline moments (calendar month display, bookings title)
- Operational status values

**Never use EB Garamond for:**
- Labels, navigation, buttons, form elements, data tables with Instrument Sans columns
- Any UI element where the user is actively performing a task
- Error messages, helper text, metadata, delta values

### When to use Instrument Sans

Instrument Sans handles everything else:
- All navigation and menu items
- Buttons and CTAs (uppercase, tracked)
- Form labels and inputs
- Data labels, axis ticks, delta values
- Section labels (uppercase, heavily tracked, Weathered Timber)
- Body copy and descriptions
- Metric labels (not values)

### Type scale

| Role | Font | Style | Size | Weight | Tracking | Case |
|---|---|---|---|---|---|---|
| Hero property name | EB Garamond | italic | clamp(2.75rem, 5.5vw, 4.5rem) | 400 | -0.02em | sentence |
| Financial figure | EB Garamond | upright | clamp(1.75rem, 3vw, 2.5rem) | 400 | -0.01em | — |
| Calendar month | EB Garamond | upright | clamp(2.25rem, 6vw, 3.5rem) | 400 | -0.02em | sentence |
| Section headline | EB Garamond | upright | clamp(1.25rem, 3vw, 1.625rem) | 400 | normal | sentence |
| Editorial quote | EB Garamond | italic | clamp(1rem, 1.6vw, 1.25rem) | 400 | normal | sentence |
| Guest name | EB Garamond | italic | clamp(0.875rem, 1.5vw, 1.0625rem) | 400 | normal | sentence |
| Title | Instrument Sans | upright | 1rem–1.25rem | 500–600 | 0.01em | sentence |
| Body | Instrument Sans | upright | 0.875rem–1rem | 400 | 0.01em | sentence |
| Label | Instrument Sans | upright | 0.625rem–0.6875rem | 500 | 0.20em–0.35em | uppercase |
| Data / numeric | Instrument Sans | upright | 0.625rem–0.75rem | 400 | 0.10em–0.18em | uppercase |
| Wordmark | Instrument Sans | upright | 0.6875rem | 500 | 0.35em | uppercase |

### Typography rules

- Body line length: 65–75ch maximum
- Financial figures on dark surfaces: EB Garamond upright, white at 90% opacity
- Section labels: Instrument Sans uppercase, 0.30em–0.35em tracking, Weathered Timber on light / `rgba(255,255,255,0.55)` on dark
- Never mix display and UI fonts at the same visual level — a label next to an EB Garamond figure is always Instrument Sans
- Delta values are always Instrument Sans uppercase — never display font
- EB Garamond Variable has no `opsz` axis; `font-optical-sizing: auto` is not declared

## 4. Elevation

The interface relies on flat surfaces by default, matching our responsive motion energy. Depth is used exclusively for state changes and high-end feedback.

## 5. Components

<!-- Components omitted in Seed Mode - to be extracted once implemented -->

## 6. Do's and Don'ts

### Do:
- **Do** use ample white space to create a relaxed, luxury feel.
- **Do** rely on subtle, sophisticated motion for state changes.
- **Do** ensure owner metrics are immediately clear and beautifully presented.

### Don't:
- **Don't** use generic, tech-ish design patterns or standard dashboard clichés.
- **Don't** use overly vibrant, neon, or harsh accent colors.
- **Don't** clutter the interface; avoid unnecessary borders, harsh shadows, or dense grids.
