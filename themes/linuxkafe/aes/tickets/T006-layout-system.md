---
ticket: T006
title: Megahost Feature Parity — Layout System
sprint: sprint-06
priority: high
status: done
created: 2026-09-21
completed: 2026-09-21
---

# T006 — Megahost Feature Parity: Layout System

## Context
Implement the layout system from megahost theme: 4 layout options (Wide, Semi Boxed, Boxed, Boxed Margin) controlled via Customizer, with per-page override via ACF field. The layout affects the main container width and styling.

## Acceptance Criteria
- [ ] **Layout Options**: 4 layout types registered — `layout-wide`, `layout-semiboxed`, `layout-boxed`, `layout-boxed-margin`
- [ ] **Customizer Integration**: Radio control in Customizer under "Layouts" section with live preview
- [ ] **Default Layout**: `layout-semiboxed` (matching megahost default)
- [ ] **Per-Page Override**: ACF field `layout_pages` overrides global setting when set
- [ ] **Frontend Application**: Layout class applied to `<body>` or main wrapper via `iwthemesfw_layout_display()` equivalent
- [ ] **CSS Implementation**: Sass/CSS for each layout variant with proper container widths
- [ ] **Responsive**: Layouts work correctly on mobile/tablet/desktop
- [ ] **Tests**: Playwright tests verify layout switching and persistence

## Scope
**In scope:**
- `functions.php` — theme support, layout registration
- `inc/theme-core/theme-functions.php` — layout display logic (adapted)
- `assets/sass/layout/_layouts.scss` — layout styles
- `assets/sass/main.scss` — import layout styles
- Customizer integration (T009 dependency)
- Playwright tests in `tests/smoke.spec.js`

**Out of scope:**
- ACF field creation (handled separately if needed)
- Header styles (T007)
- Footer system (T008)

## Dependencies
- T009 (Customizer integration) — for Customizer control
- WordPress core functions
- Sass compilation pipeline

## Known Risks
- **CSS Conflicts**: Existing linuxkafe styles may conflict with new layout classes
- **Container Width**: Need to determine appropriate max-widths for each layout
- **Existing Gamification**: Shell, Tux, game modal must not break in different layouts

## Notes
- Megahost uses `iwthemesfw_layout_display()` function that checks ACF field first, then theme_mod
- Layout classes applied to body or main container
- Default is `semiboxed` (container with some padding but not full boxed)
- Boxed adds background pattern/image support (future enhancement)