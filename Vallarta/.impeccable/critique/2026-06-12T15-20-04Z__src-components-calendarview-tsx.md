---
target: calendar screen
total_score: 25
p0_count: 0
p1_count: 1
timestamp: 2026-06-12T15-20-04Z
slug: src-components-calendarview-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Calendar dots and list statuses are clear, but rely on legends. |
| 2 | Match System / Real World | 3 | Language is standard (Check-in, Check-out, Owner Stay). |
| 3 | User Control and Freedom | 3 | Cancellation requires double tap (Confirm cancel?), which is good for safety. |
| 4 | Consistency and Standards | 3 | Uses standard list/detail patterns, though bottom sheet on desktop is debatable. |
| 5 | Error Prevention | 2 | Native date inputs; overlap gives a soft warning but doesn't require explicit override. |
| 6 | Recognition Rather Than Recall | 2 | **Bottom sheet obscures the calendar.** Users must remember dates while filling the form. |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts for adding bookings. No drag-to-select on the calendar grid. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean interface, though the list and calendar compete for attention. |
| 9 | Error Recovery | 3 | Form validation catches basic date errors. |
| 10 | Help and Documentation | 1 | No visible help or contextual guidance. |
| **Total** | | **25/40** | **Acceptable** |

#### Anti-Patterns Verdict

**LLM assessment**: The calendar screen avoids obvious "AI slop" visuals like generic glassmorphism or gradient text, but it falls into a structural trap: the "modal as first thought." Using a full-width/bottom drawer for viewing and adding bookings is a lazy pattern for desktop product UIs. It obscures the primary context (the calendar) right when the user needs it most (picking dates). Additionally, the reliance on native `<input type="date">` breaks the luxury feel requested by the product brief.

**Deterministic scan**: Clean. The automated detector found 0 anti-patterns in the markup.

**Visual overlays**: Skipped. (Browser automation/injection not available).

#### Overall Impression
The foundation is solid and functional, but it feels like a standard SaaS dashboard rather than a "high-end luxury property" tool. The biggest missed opportunity is the interaction model: users should interact directly with the calendar grid (drag to select dates) rather than clicking "+ Add" and typing into native date pickers inside an obscuring drawer.

#### What's Working
- **Status indicators in the grid**: The dots on the calendar provide a quick, scannable overview of the month's density.
- **Double-tap to cancel**: The armed cancellation state ("Confirm cancel?") is an elegant, inline way to prevent accidental destructive actions without spawning an annoying alert dialog.
- **List/Grid relationship**: Showing both the spatial view (calendar) and the chronological list provides good flexibility.

#### Priority Issues

- **[P1] Context Obscured (Memory Bridge)**
  - **Why it matters**: The `BookingDrawer` bottom sheet covers the calendar grid. When adding a booking, users must remember the available dates because they can no longer see them. This is a high cognitive load violation.
  - **Fix**: Move the booking details/form into a side-panel, or better, allow selecting date ranges directly on the calendar grid before the form appears.
  - **Suggested command**: `/impeccable layout`

- **[P2] Generic Native Form Controls**
  - **Why it matters**: Native `<input type="date">` inputs feel cheap and inconsistent across browsers. This directly violates the "premium, deliberate, and sophisticated" brand personality.
  - **Fix**: Build or integrate a premium, custom date range picker, or leverage the calendar grid itself as the picker.
  - **Suggested command**: `/impeccable craft`

- **[P2] Power User Friction**
  - **Why it matters**: For a tool meant for "day-to-day operations," requiring users to click "+ Add" and manually type dates is inefficient.
  - **Fix**: Implement drag-to-select on the calendar grid to instantly start a booking for those dates.
  - **Suggested command**: `/impeccable adapt`

#### Persona Red Flags

**Alex (Power User)**: 
- Highly frustrated by the lack of drag-to-select on the calendar grid.
- Having to open a drawer and use a native date picker to log a booking is too slow.
- No keyboard shortcuts (e.g., hitting 'N' to start a new booking).

**Jordan (First-Timer)**: 
- The overlap warning ("Overlaps with [Guest] — saving anyway is allowed") might be confusing. Is it an error? Is double-booking expected behavior for this property? Without explicit text explaining *why* it's allowed, it feels like a system glitch.

#### Minor Observations
- The calendar slide animation (`cal-grid--entering-next`) is nice, but ensure it meets the 150-250ms product UI rule.
- The `BookingList` filters by `b.checkIn >= todayStr`. It doesn't show bookings that started in the past but are still active (e.g., check-in yesterday, check-out tomorrow).

#### Questions to Consider
- What if the calendar grid *was* the form? What if clicking a day immediately opened a tiny popover to type a name?
- Does the owner actually need to see a list of reservations, or just the calendar?
