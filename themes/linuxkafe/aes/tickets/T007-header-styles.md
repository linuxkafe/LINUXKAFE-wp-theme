---
ticket: T007
title: Megahost Feature Parity — Header Styles (3 variants)
sprint: sprint-06
priority: high
status: done
created: 2026-09-21
completed: 2026-09-21
---

# T007 — Megahost Feature Parity: Header Styles (3 variants)

## Context
Implement 3 header styles from megahost theme:
1. **Header 1** — Solid background with top bar, client area (support), logo, navigation
2. **Header 2** — Transparent background with top bar, logo, navigation  
3. **Header 3** — Minimal/hidden header (uses section titles only)

Each header supports customizer options for alignment, top bar elements, and client area.

## Acceptance Criteria
- [ ] **Header 1** (`components/header/header-1.php`): Solid header with top bar, support area, branding, navigation
- [ ] **Header 2** (`components/header/header-2.php`): Transparent header with top bar, branding, navigation
- [ ] **Header 3** (`components/section-titles/title-default.php`): Minimal header / section title only
- [ ] **Customizer Integration**: Radio control for header style (3 options) with live preview
- [ ] **Client Area** (Header 1 only): Login form with user/password placeholders, button, toggle
- [ ] **Top Bar**: Repeater field for custom elements (icon, title, link) with alignment (left/right)
- [ ] **Per-page Override**: ACF field `style_header` overrides Customizer
- [ ] **Responsive**: Mobile menu works in all headers
- [ ] **Accessibility**: Proper ARIA labels, focus management, semantic HTML
- [ ] **Tests**: Playwright tests for each header variant

## Scope
**In scope:**
- `components/header/header-1.php`, `components/header/header-2.php`
- `components/section-titles/title-default.php`
- `components/header/top-bar-elements.php`, `components/header/top-support.php`, `components/header/site-branding.php`
- Customizer section "Header Style" with radio + dependent fields
- `linuxkafe_header_display()` already implemented in T006
- CSS for all 3 header variants
- Playwright tests

**Out of scope:**
- Footer system (T008)
- Kirki framework migration (not needed - using native API)
- Mega menu (not in megahost)

## Dependencies
- T006 (Layout System) — `linuxkafe_header_display()` function exists
- WordPress Customizer API
- Existing navigation.js for mobile menu

## Known Risks
- **CSS Conflicts**: Existing `.site-header` and `.header-container` styles may conflict
- **Mobile Menu**: Current checkbox hack menu must work with new header structures
- **Gamification Elements**: Shell trigger, Tux, game modal must not be obstructed
- **Transparent Header**: Header 2 needs proper z-index and backdrop handling
- **Client Area Form**: Non-functional placeholder (no backend auth integration)

## Notes
- Megahost used Kirki repeater for top bar elements → implement with native Customizer repeated fields or simplified approach
- Client area is visual only (no actual login processing)
- Header 3 maps to section titles component