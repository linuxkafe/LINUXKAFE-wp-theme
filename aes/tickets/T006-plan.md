# T006 — Plan Output: Megahost Feature Parity — Layout System

## Phase 1: Hostile Analysis

### INSIGHTS CONSULTED
- SD-CURRENT-THEME: linuxkafe functions.php, customizer.php, style.css structure
- SD-MEGAHOST-REF: megahost functions.php, inc/theme-core/theme-functions.php, inc/theme-core/customizer.php

### ASSUMPTIONS I'M MAKING

| Type | Assumption | Justification |
|------|------------|---------------|
| [KNOWN] | Current theme uses CSS custom properties for layout (--width-max: 1100px) | Verified in style.css:29 |
| [KNOWN] | Current theme has no layout switching mechanism | Verified in functions.php and style.css |
| [INFERRED] | Megahost layout system applies classes to body or main container | megahost's iwthemesfw_layout_display() echoes the layout value |
| [ASSUMED] | Layout classes should be applied to `<body>` via `body_class` filter | Standard WP pattern; megahost appears to use template parts |
| [ASSUMED] | Sass compilation pipeline will be added | Current theme uses plain CSS; megahost uses Sass |
| [UNKNOWN] | Exact container widths for each layout variant | Not explicitly defined in megahost Sass files visible |

### WHAT WASN'T SPECIFIED
- Exact pixel widths for `wide`, `semiboxed`, `boxed`, `boxed-margin`
- Whether boxed layouts support background patterns/images
- How layout interacts with existing gamification elements (shell, Tux, game modal)
- Whether to use Kirki (like megahost) or native Customizer API (like current linuxkafe)

### ALTERNATIVES I DIDN'T CHOOSE

| Option | Description | Rejected Because |
|--------|-------------|------------------|
| Use Kirki framework | Megahost uses Kirki for Customizer | Adds external dependency; current theme uses native API; Kirki may be abandoned |
| Apply layout via JS | Toggle classes on body via JavaScript | Flash of unstyled content; SEO unfriendly; not how megahost works |
| Single container class | One `.container` with modifier classes | Less flexible for CSS Grid/Flexbox layouts |

### INVITE CONTRADICTION
- **Critical flaw risk**: Current theme has `--width-max: 1100px` on `:root`. Boxed layout typically needs narrower max-width. May need multiple CSS custom property sets.
- **What would disprove this**: If megahost's Sass reveals container widths that don't map cleanly to CSS custom properties.

### DISTINGUISH CLAIM TYPES
- **Empirical**: Current theme has no layout system; megahost has 4 layouts with ACF override
- **Normative**: Should use native Customizer API (not Kirki) for consistency; should apply via `body_class` filter

### RISKS & SIDE EFFECTS
1. **CSS Conflicts**: Existing `.header-container` uses `var(--width-max)` — boxed layouts need different max-width
2. **Gamification Elements**: Shell (fixed position), Tux (absolute), Game modal (fixed) — must not break in boxed layouts
3. **Background Image Feature**: `linuxkafe_featured_image_as_background()` sets `background-attachment: fixed` on body — conflicts with boxed layout background patterns
4. **Responsive Breakpoints**: Mobile layouts must work across all 4 variants

### COST OF BEING WRONG: HIGH
- Layout system affects every page; wrong implementation requires full CSS refactor
- Customizer integration must work with existing gamification settings

### REASONING SKELETON
1. Megahost has 4 layouts → We need 4 layout classes
2. Layout selected via Customizer → Need Customizer radio control (native API)
3. Per-page override via ACF → Need `get_field()` check before `get_theme_mod()`
4. Layout applied to body → Use `body_class` filter
5. CSS for each layout → Define container widths via CSS custom properties per layout class

### SCOPE BOUNDARIES
**In bounds**: Layout system PHP logic, Customizer control, CSS for 4 layouts, body_class integration
**Out of bounds**: ACF field creation (assume field exists), Header styles (T007), Footer (T008), Kirki migration (T009)

---

## Phase 2: Solution Proposal

### Approach
1. **PHP**: Add `linuxkafe_layout_display()` function in `inc/theme-functions.php` (new file or existing)
2. **PHP**: Hook into `body_class` filter to add layout class
3. **Customizer**: Add "Layouts" section with radio control in `inc/customizer.php`
4. **CSS**: Define layout variants in `style.css` using CSS custom properties scoped to body classes
5. **Testing**: Add Playwright tests for layout switching

### Files to Change
1. `functions.php` — include new theme-functions.php
2. `inc/theme-functions.php` — new file with layout display logic
3. `inc/customizer.php` — add Layouts section
4. `style.css` — add layout variant styles
5. `tests/smoke.spec.js` — add layout tests

### Verification Criteria
- [ ] Customizer shows "Layouts" section with 4 radio options
- [ ] Changing layout updates preview instantly (postMessage)
- [ ] Layout class appears on `<body>` in frontend
- [ ] Container widths change per layout
- [ ] Gamification elements (shell, Tux, game) work in all layouts
- [ ] Tests pass

---

## Phase 3: Implementation Plan (Surgical)

### Step 1: Create `inc/theme-functions.php` with layout logic
```php
function linuxkafe_layout_display() {
    // Check ACF field first, then theme_mod, default 'semiboxed'
    // Return layout slug
}
function linuxkafe_body_class_layout( $classes ) {
    $classes[] = 'layout-' . linuxkafe_layout_display();
    return $classes;
}
add_filter( 'body_class', 'linuxkafe_body_class_layout' );
```

### Step 2: Include in functions.php
```php
require get_template_directory() . '/inc/theme-functions.php';
```

### Step 3: Add Customizer section in inc/customizer.php
- Section: `linuxkafe_layouts`
- Setting: `linuxkafe_layout_type` (theme_mod, default 'semiboxed')
- Control: Radio with 4 choices
- Transport: `postMessage` for live preview

### Step 4: Add CSS in style.css
```css
body.layout-wide .header-container,
body.layout-wide .site-main,
body.layout-wide .site-footer { max-width: 100%; }

body.layout-semiboxed .header-container,
body.layout-semiboxed .site-main,
body.layout-semiboxed .site-footer { max-width: var(--width-max); }

body.layout-boxed .header-container,
body.layout-boxed .site-main,
body.layout-boxed .site-footer { max-width: 1200px; margin: 0 auto; background: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.1); }

body.layout-boxed-margin .header-container,
body.layout-boxed-margin .site-main,
body.layout-boxed-margin .site-footer { max-width: 1100px; margin: 2rem auto; background: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
```

### Step 5: Add Playwright tests

---

## Phase 4: Validation Gates
- `npm run lint:js` — passes
- `npm run lint:scss` — passes  
- `npm test` — all Playwright tests pass
- Manual: Customizer preview updates live
- Manual: All 4 layouts render correctly on mobile/desktop

---

## Phase 5: Critical Review Checklist
- [ ] Can this be simpler? (Using native Customizer API, not Kirki)
- [ ] Correct for all inputs? (ACF override, missing theme_mod, customizer preview)
- [ ] Technical debt? (CSS custom property scoping — acceptable)
- [ ] Teammate understandable? (Clear function names, documented)
- [ ] Insights for registry? (Layout system pattern for future features)