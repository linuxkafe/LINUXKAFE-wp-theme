# T007 — Plan Output: Megahost Feature Parity — Header Styles (3 variants)

## Phase 1: Hostile Analysis

### INSIGHTS CONSULTED
- SD-CURRENT-THEME: linuxkafe header.php, functions.php, navigation.js, style.css
- SD-MEGAHOST-REF: megahost customizer.php (header_style, top bar, client area), components/header/
- SD-T006: linuxkafe_header_display() already implemented, layout system done

### ASSUMPTIONS I'M MAKING

| Type | Assumption | Justification |
|------|------------|---------------|
| [KNOWN] | Current theme has `.site-header` with `.header-container` using flexbox | Verified in style.css:78-94 |
| [KNOWN] | Mobile menu uses checkbox hack (`#menu-btn` + `.menu-icon` + `.menu`) | Verified in style.css:200-360 |
| [KNOWN] | `linuxkafe_header_display()` exists in theme-functions.php (T006) | Implemented in T006 |
| [INFERRED] | Header 1 = solid with top bar + client area + branding + nav | Megahost customizer: header_1 = "Solid Background" |
| [INFERRED] | Header 2 = transparent with top bar + branding + nav | Megahost customizer: header_2 = "Transparent Background" |
| [INFERRED] | Header 3 = minimal, uses section-titles/title-default | Megahost customizer: header_3 = "Hidden Header Elements" |
| [ASSUMED] | Top bar repeater → simplified to 3 fixed fields (icon, title, link) x 3 items | Native Customizer doesn't have repeater; Kirki not used |
| [ASSUMED] | Client area = visual login form only, no backend processing | Megahost shows placeholders only |
| [UNKNOWN] | Exact HTML structure of megahost header components | Source files not available in working dir |

### WHAT WASN'T SPECIFIED
- Exact markup for each header variant
- Client area form behavior (JS toggle? CSS only?)
- Top bar element count (megahost default 3, but repeater allows more)
- How transparent header handles scroll state
- Whether header 3 completely removes header or just shows section title

### ALTERNATIVES I DIDN'T CHOOSE

| Option | Description | Rejected Because |
|--------|-------------|------------------|
| Use Kirki for repeater | Megahost uses Kirki repeater | Adds dependency; current theme uses native API |
| Single header file with conditionals | One file, if/else for variants | Harder to maintain; megahost uses separate template parts |
| React/Vue header | Modern component approach | Overkill; WP theme uses PHP templates |
| Fixed 3 top bar items | Hardcode 3 elements | Some flexibility via Customizer fields |

### INVITE CONTRADICTION
- **Critical flaw risk**: Current theme's `.site-header` has fixed styling. Header 2 (transparent) needs completely different CSS. May need to restructure.
- **What would disprove this**: If existing header markup cannot be adapted without breaking mobile menu or gamification elements.

### DISTINGUISH CLAIM TYPES
- **Empirical**: Megahost has 3 header styles with specific Customizer controls; current theme has 1 header
- **Normative**: Should use native Customizer API; should keep mobile menu working; should maintain accessibility

### RISKS & SIDE EFFECTS
1. **Mobile Menu Breakage**: Checkbox hack depends on specific DOM structure (label ~ ul)
2. **Z-index Conflicts**: Transparent header + shell (z-index: 5000) + Tux + game modal
3. **Layout System Interaction**: Boxed layouts add margin/shadow to containers
4. **Gamification Positioning**: Shell trigger fixed bottom-right, Tux absolute, game modal fixed center
5. **Customizer Live Preview**: postMessage for header style switching is complex (full header replacement)

### COST OF BEING WRONG: HIGH
- Header is on every page; breaking it breaks the entire site
- Mobile menu is critical for usability
- Customizer preview must work for user confidence

### REASONING SKELETON
1. Megahost has 3 headers → Need 3 template parts + 1 section title
2. Header selected via Customizer → Add radio control with postMessage
3. Top bar + client area are sub-components → Create separate template parts
4. Per-page override via ACF → Already handled in `linuxkafe_header_display()`
5. CSS must support all variants → Scoped styles per header class

### SCOPE BOUNDARIES
**In bounds**: 3 header template parts, section title, top bar, client area, Customizer controls, CSS, tests
**Out of bounds**: Actual login processing, Kirki integration, mega menu, footer (T008), demo content

---

## Phase 2: Solution Proposal

### Approach
1. **Create component directory structure**: `components/header/`, `components/section-titles/`
2. **Build Header 1** (`header-1.php`): Top bar → Client area → Branding + Nav
3. **Build Header 2** (`header-2.php`): Top bar → Branding + Nav (transparent)
4. **Build Header 3** (`title-default.php`): Minimal section title only
5. **Create shared components**: `top-bar-elements.php`, `top-support.php`, `site-branding.php`
6. **Add Customizer section**: "Header Style" with dependent fields
7. **Add CSS**: Scoped styles for each header variant
8. **Add Customizer preview JS**: Live switching via postMessage
9. **Add Playwright tests**: Verify each header renders correctly

### Files to Create/Modify
1. `components/header/header-1.php` (new)
2. `components/header/header-2.php` (new)
3. `components/section-titles/title-default.php` (new)
4. `components/header/top-bar-elements.php` (new)
5. `components/header/top-support.php` (new)
6. `components/header/site-branding.php` (new)
7. `inc/customizer.php` — add Header Style section
8. `style.css` — header variant styles
9. `js/customizer.js` — live preview for header switching
10. `tests/smoke.spec.js` — header tests

### Verification Criteria
- [ ] Customizer shows "Header Style" with 3 radio options
- [ ] Changing header updates preview (postMessage)
- [ ] Header 1: solid bg, top bar, client area, branding, nav
- [ ] Header 2: transparent bg, top bar, branding, nav
- [ ] Header 3: minimal section title only
- [ ] Mobile menu works in all 3 headers
- [ ] Top bar elements configurable (icon, title, link)
- [ ] Client area shows login form (Header 1 only)
- [ ] All layouts (T006) work with all headers
- [ ] Tests pass

---

## Phase 3: Implementation Plan (Surgical)

### Step 1: Create component directories and template parts
```bash
mkdir -p components/header components/section-titles
```

### Step 2: Header 1 — Solid with top bar + client area
```php
// components/header/header-1.php
// Includes: top-bar-elements.php, top-support.php, site-branding.php, navigation
```

### Step 3: Header 2 — Transparent
```php
// components/header/header-2.php
// Includes: top-bar-elements.php, site-branding.php, navigation
```

### Step 4: Header 3 — Section title only
```php
// components/section-titles/title-default.php
// Minimal: just page title + breadcrumbs
```

### Step 4: Customizer section (in customizer.php)
- Section: `linuxkafe_header_style`
- Setting: `linuxkafe_header_style` (radio, 3 choices, postMessage)
- Dependent: Client area fields (show only for header_1)
- Top bar: alignment (left/right), 3 element fields (icon, title, link)

### Step 5: CSS in style.css
```css
/* Header 1 - Solid */
body.header-style-1 .site-header { background: var(--color-header); }
body.header-style-1 .top-bar { ... }
body.header-style-1 .client-area { ... }

/* Header 2 - Transparent */
body.header-style-2 .site-header { background: transparent; position: absolute; width: 100%; }
body.header-style-2 .site-header.scrolled { background: var(--color-header); backdrop-filter: blur(10px); }

/* Header 3 - Minimal */
body.header-style-3 .site-header { display: none; }
```

### Step 6: Customizer preview JS
- Listen to `linuxkafe_header_style` changes
- Replace header via AJAX or DOM manipulation

### Step 7: Playwright tests
- Test each header variant renders
- Test mobile menu
- Test top bar elements
- Test client area visibility

---

## Phase 4: Validation Gates
- `npm run lint:js` — passes
- `npm run lint:scss` — passes
- `npm test` — Playwright tests pass
- Manual: Customizer preview switches headers
- Manual: All 3 headers work in all 4 layouts
- Manual: Mobile menu functional
- Manual: Gamification elements not obstructed

---

## Phase 5: Critical Review Checklist
- [ ] Can this be simpler? (Simplified top bar from repeater to 3 fixed items)
- [ ] Correct for all inputs? (Header style + layout combinations)
- [ ] Technical debt? (CSS complexity for 3 variants — acceptable)
- [ ] Teammate understandable? (Clear component separation)
- [ ] Insights for registry? (Header variant pattern for future themes)