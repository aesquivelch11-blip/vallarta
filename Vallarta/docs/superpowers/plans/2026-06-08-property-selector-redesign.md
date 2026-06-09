# Property Selector Redesign - Design Spec

**Date:** 2026-06-08  
**Status:** Ready for implementation  
**Register:** Product  
**Fidelity:** Production-ready

---

## 1. Feature Summary

A memorable, gallery-style property selector for property owners and managers to browse 10-20 luxury properties in Puerto Vallarta. The grid serves as a hub where users select a property to view its dashboard, with a cinematic GridZoom expansion animation on selection. The interface evokes coastal luxury, calm, and premium restraint while remaining highly functional.

## 2. Primary User Action

Select a property to view its dashboard. The grid should make this decision effortless by showing name and status prominently, with location as supporting context.

## 3. Design Direction

**Color strategy:** Restrained with coastal luxury palette. Light canvas (Bleached Bone #faf8f5), tinted neutrals, Sunset Ochre accent used sparingly (≤10%) for active states and key indicators.

**Theme scene sentence:** Owner or manager browsing properties on a tablet or desktop in a relaxed home setting during daytime, wanting to feel in control while experiencing the calm luxury of their Puerto Vallarta portfolio.

**Named anchor references:**
- HBA.com/projects (restrained luxury, photography-led)
- Hutstuf.com/our-huts (editorial grid, minimal chrome)
- GridZoom (cinematic expansion animation)
- *More memorable than all three* through unusual geometry and motion

## 4. Scope

- **Fidelity:** Production-ready
- **Breadth:** Single screen (property selector grid)
- **Interactivity:** Interactive prototype with GridZoom animation
- **Time intent:** Polish until it ships

## 5. Layout Strategy

### Grid Topology

**Asymmetric editorial grid** (not uniform cards):
- 5+ properties visible in viewport
- Mix of large featured cells (spanning 2-3 columns) and smaller secondary cells
- Varied aspect ratios create visual rhythm
- Properties positioned strategically (high-value/featured properties get larger cells)

**Example grid topology (desktop):**
```
[Large 2x2] [Medium 1x1] [Medium 1x1]
[Large 2x2] [Medium 1x1] [Tall 1x2]
```

### Visual Hierarchy

- Property name: EB Garamond italic, oversized, commanding presence
- Status: Colored accent line on leading edge (not badge/dot)
- Location: Smaller supporting text, subtle treatment

### Photography

Full-bleed within cards, cinematic crops, warm matte treatment (existing `.cinematic-grade` filter). Images should feel like a luxury portfolio, not stock photos.

## 6. Status Indicator Design

**Approach:** Status as a **colored accent line** at the card's leading edge (left or top), not a badge or dot.

- **Available**: Thin vertical line, muted sage green (oklch 72% 0.08 155)
- **Occupied**: Thin vertical line, warm ochre (oklch 55% 0.06 80)
- **Maintenance**: Thin vertical line, muted terracotta (oklch 62% 0.12 70)
- **Reserved**: Thin vertical line, soft blue (oklch 65% 0.05 260)

The line is subtle (2-3px wide), runs full height of the card, and becomes slightly more saturated on hover. This is accessible (color + position) without being a generic badge.

## 7. Search and Filters

**Approach:** **Floating control bar** that appears on scroll or hover, positioned at the grid's top-right corner.

- **Default state**: Only a search icon (magnifying glass) and filter icon (sliders) visible
- **Expanded state**: Search input slides out from icon, filter pills appear below
- **Filter pills**: Inline chips (All, Available, Occupied, Maintenance, Reserved) with the same accent color as status lines
- **Animation**: Controls fade in with subtle translateY(-8px) on scroll, expand with width transition

This keeps the grid clean by default but makes filtering accessible without a persistent top bar.

## 8. Typography and Content

### Per Card

- **Property name**: EB Garamond italic, oversized (clamp 2rem to 3.5rem), positioned bottom-left with generous padding
- **Status line**: 2-3px vertical accent on leading edge, full height
- **Location**: Instrument Sans uppercase, 0.5625rem, 0.3em tracking, positioned below name, subtle opacity (0.5)

### Text Overlay

Gradient from transparent at top to dark at bottom (matching existing `.hero__gradient` pattern), ensuring text readability over images.

## 9. Interaction Model

### Hover

- Card outer container scales to 0.97 (subtle "press in")
- Image scales to 1.08 (zoom into photo)
- Status accent line brightens slightly
- Name and location shift up 4px (micro-animation)

### Click (GridZoom Expansion)

- Selected card scales up and translates to center (GridZoom pattern)
- Other cards fade out with stagger (0.15s, radial from selected)
- Card morphs into property dashboard view
- Back button appears (top-left, minimal arrow)

### Filter Change

- Filtered-out cards fade and scale down (0.8) with stagger
- Remaining cards reflow with smooth grid animation
- Search input clears with fade

## 10. Motion Choreography

### Page Load

- Grid fades in with stagger (0.07s per card, top-left to bottom-right)
- Cards animate from opacity 0, translateY(24px) to opacity 1, translateY(0)
- Duration: 0.5s per card, ease: expo.out

### Scroll

- Subtle parallax on images (translateY -20px to -35px over scroll range)
- Floating control bar fades in after 100px scroll

### Easing

- expo.out for reveals and entrances
- expo.inOut for GridZoom expansion
- Duration: 1.2s for major transitions, 0.3s for micro-interactions

## 11. Key States

- **Default**: Asymmetric grid, 5+ properties visible, floating controls hidden
- **Hover**: Card zooms, status line brightens, text shifts
- **Loading**: Skeleton cards matching asymmetric geometry
- **Filtered**: Smooth reflow animation, filtered cards fade out
- **Empty**: "No properties match" with inline clear-filters link
- **Selected**: GridZoom expansion to dashboard
- **Mobile**: Single column, maintains typography and status lines

## 12. Technical Implementation Notes

### GridZoom Animation Pattern (from codrops reference)

- **Asymmetric grid**: Cells have different sizes (some span 4 columns, others 2, creating visual rhythm)
- **Hover**: Outer cell scales to 0.95, inner image scales to 1.4 (creates depth/parallax)
- **Click**: Selected cell scales up ~54% viewport width, translates to center-right position. Other cells fade out with stagger (0.17s)
- **Mini-grid**: After expansion, a small grid appears for navigation between items
- **Easing**: expo.inOut for smooth, premium feel

### Key Differences from Current Implementation

1. **Layout**: Current uses fixed 3-column grid with uniform cards. New uses asymmetric editorial grid.
2. **Status**: Current uses top-right dot. New uses leading-edge accent line.
3. **Filters**: Current uses persistent top bar. New uses floating control bar.
4. **Theme**: Current is dark. New is light (coastal luxury).
5. **Animation**: Current has basic hover. New has full GridZoom expansion.

## 13. Recommended References

For implementation:
- `spatial-design.md` - layout and spacing
- `typography.md` - type hierarchy
- `motion-design.md` - GridZoom animation and transitions
- `color-and-contrast.md` - status accent colors
- `responsive-design.md` - mobile adaptation

## 14. Open Questions

- Should the grid have a "featured" property that's always larger, or rotate featured positions?
- How should the mini-grid navigation work after GridZoom expansion?
- Should the search expand inline or as an overlay?
- What's the exact breakpoint for switching from asymmetric to single-column layout?

---

## Anti-Goals

- **NOT** a generic, bland, AI-sloppy screen
- **NOT** uniform card grid
- **NOT** persistent top filter bar
- **NOT** dark theme (shift to light coastal palette)
- **NOT** status as badge or dot

## Success Criteria

- Owner/manager can select a property in <3 seconds
- Grid feels memorable and premium, not generic
- GridZoom animation is smooth and cinematic
- Status is immediately visible without being intrusive
- Filters are accessible but don't clutter the default view
- 5+ properties visible in viewport on desktop
- Mobile experience maintains the luxury feel
