# linuxkafe Gamification — JS Architecture Documentation

## Overview
Sistema de gamificação modular para o tema WordPress linuxkafe. Implementado em **vanilla ES modules** (ESM) sem dependências externas, carregado via `wp_enqueue_script` com `type="module"`.

## Module Structure

```
js/
├── core.js              # Foundation: config, EventBus, utilities, SequenceDetector
├── gamification.js      # Entry point: lazy init via requestIdleCallback
├── shell.js             # Terminal Linux interativo (REPL)
├── tux.js               # Tux Walker (SVG animado)
├── graffiti.js          # Graffiti Writer (Canvas 2D particles)
├── cybercafe.js         # Cybercafé Toasts (notificações estilo sistema)
├── easter-eggs.js       # Konami, Buy Menu, God Mode, IDKFA, Kill Feed
├── navigation.js        # Legacy: menu hamburger (mantido)
├── autoscroll.js        # Legacy: auto-scroll em posts (mantido)
└── customizer.js        # Legacy: Customizer preview (mantido)
```

## Core Patterns

### 1. Config System (`core.js`)
```javascript
// DEFAULT_CONFIG + wp_localize_script merge
export const CONFIG = mergeConfig();

// Acesso a CSS custom properties
getCSSVar('--color-primary'); // → '#F8B400'
```

**Features flags** (controláveis via Customizer):
- `shell`, `tux`, `graffiti`, `cybercafe`, `csHud`, `easterEggs`

### 2. EventBus (Pub/Sub)
```javascript
import { eventBus } from './core.js';

// Subscribe
const unsubscribe = eventBus.on('shell:open', () => { ... });

// Emit
eventBus.emit('godmode:toggle', true);

// Once
eventBus.once('buyMenu:close', () => { ... });
```

**Eventos principais:**
| Evento | Payload | Descrição |
|--------|---------|-----------|
| `shell:open` / `shell:close` | — | Terminal aberto/fechado |
| `godmode:toggle` | `boolean` | God mode ativado/desativado |
| `buyMenu:open` / `buyMenu:close` | — | Buy Menu modal |
| `toast:show` | `{title, text, type}` | Notificação cybercafé |

### 3. Styles Injection
Cada módulo injeta seus estilos via `injectStyles(css, id)`:
```javascript
injectStyles(SHELL_STYLES, 'lk-shell-styles');
```
- Lê CSS custom properties em runtime (`getCSSVar`)
- IDs únicos previnem duplicação
- Automaticamente sincroniza com Customizer

### 4. Lazy Initialization (`gamification.js`)
```javascript
requestIdleCallbackPolyfill((deadline) => {
  if (deadline.timeRemaining() > 10 || deadline.didTimeout) {
    initGamification();
  }
}, { timeout: 5000 });
```
- Não bloqueia LCP/FCP
- Fallback 5s via `setTimeout`
- Cleanup em `beforeunload`

### 5. Accessibility (WCAG 2.1 AA)
- `prefers-reduced-motion`: Early return em todos módulos
- ARIA labels em elementos interativos
- Focus trap no Buy Menu (`Tab` cycle, `Esc` fecha)
- `aria-live="polite"` para toasts/kill feed
- Decorativos: `aria-hidden="true"`
- `:focus-visible` outlines (2px solid `--color-primary`)

### 6. Persistence (localStorage)
```javascript
import { lsGet, lsSet, migrateStorage } from './core.js';

// Migração sessionStorage → localStorage
migrateStorage('lk_shell_state', 'lk_shell_state');

// Save/Load
lsSet('lk_tux_state', { x, y, isGodMode, direction });
const saved = lsGet('lk_easter_eggs_state');
```
**Keys:**
| Key | Module | Data |
|-----|--------|------|
| `lk_shell_state` | shell | history[], isGodMode, unlockedEggs[] |
| `lk_tux_state` | tux | x, y, isGodMode, direction |
| `lk_easter_eggs_state` | easter-eggs | godMode, idkfaUnlocked |

### 7. Keyboard Sequences
```javascript
import { SequenceDetector } from './core.js';

new SequenceDetector(
  ['ArrowUp', 'ArrowUp', 'ArrowDown', ...], // Konami
  () => openBuyMenu()
).start();
```

## Customizer Integration

Settings salvos como `theme_mod`:
```php
// functions.php → wp_localize_script
$features_config = array(
  'shell'      => get_theme_mod('linuxkafe_gamification_shell', true),
  'tux'        => get_theme_mod('linuxkafe_gamification_tux', true),
  // ...
);
```

WP version fallback para `type="module"`:
```php
if (version_compare(get_bloginfo('version'), '6.3', '>=')) {
    wp_script_add_data($handle, 'type', 'module');
} else {
    add_filter('script_loader_tag', fn($tag, $h) => 
        $h === $handle ? str_replace('src=', 'type="module" src=', $tag) : $tag, 10, 2);
}
```

## Adding New Features

1. **Create module** (`js/nova-feature.js`):
   ```javascript
   import { CONFIG, eventBus, injectStyles, onDOMReady, ... } from './core.js';
   
   export class NovaFeature {
     async init() {
       await onDOMReady();
       if (!CONFIG.features.novaFeature) return;
       injectStyles(STYLES, 'lk-nova-styles');
       // ...
     }
   }
   ```

2. **Register in `gamification.js`**:
   ```javascript
   import { initNovaFeature } from './nova-feature.js';
   // ... initNovaFeature();
   ```

3. **Add Customizer toggle** (`inc/customizer.php`):
   ```php
   $wp_customize->add_setting('linuxkafe_gamification_nova', ...);
   $wp_customize->add_control('linuxkafe_gamification_nova', ...);
   ```

4. **Update config** (`functions.php`):
   ```php
   'novaFeature' => get_theme_mod('linuxkafe_gamification_nova', true),
   ```

## Performance

- **Bundle size**: ~15KB total (estimado, vanilla JS)
- **No external deps**: Zero npm packages
- **No layout shift**: Fixed positioning, `contain: layout paint`
- **Passive listeners**: `{ passive: true }` onde aplicável
- **RAF animations**: `requestAnimationFrame` para Tux/Graffiti

## Browser Support

| Feature | Min Version |
|---------|-------------|
| ES Modules | Chrome 61, FF 60, Safari 11, Edge 79 |
| `requestIdleCallback` | Chrome 47, FF 55, Safari 15.4 |
| `prefers-reduced-motion` | Chrome 74, FF 63, Safari 10.1 |
| CSS Custom Properties | Chrome 49, FF 31, Safari 9.1 |

## Debug

```javascript
// Console
localStorage.setItem('lk_debug', 'true');
// ou
CONFIG.debug = true; // via wp_localize_script WP_DEBUG
```

## Migration Notes (T002)

- `sessionStorage` → `localStorage` para shell history
- Tux position/state persistido
- Easter eggs (god mode, idkfa) persistidos
- Migração automática via `migrateStorage()`

## Build Tooling

```bash
npm install           # sass (Dart Sass) + @wordpress/scripts
npm run compile:css   # stylelint fix
npm run lint:js       # ESLint (config WP - requer tabs, não suporta ESM)
npm run watch         # sass --watch
```

**Nota**: ESLint config legado não suporta ES modules (spread operator, etc.). Novos arquivos usam sintaxe moderna; lint falha mas `node --check` passa.

---

*Generated: 2026-09-14 | Version: 2.1.0-gamified*