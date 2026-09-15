---
schema: aes/design-v1
design_system: "linuxkafe-native"
version: "2.1.0-gamified"
tokens:
  colors:
    primary: "#F8B400"
    primary-dark: "#E6A500"
    primary-light: "#FFC433"
    background: "#FFFFFF"
    background-alt: "#F5F5F5"
    surface: "#FFFFFF"
    surface-elevated: "#FFFFFF"
    header: "#2d2d2d"
    header-sticky: "#1a1a1a"
    text: "#212121"
    text-light: "#555555"
    text-on-dark: "#E0E0E0"
    text-on-primary: "#212121"
    border: "#E0E0E0"
    border-dark: "#444444"
    link: "#0056b3"
    accent-success: "#22c55e"
    accent-error: "#ef4444"
    accent-info: "#3b82f6"
    graffiti-yellow: "#F8B400"
    graffiti-dark: "#2d2d2d"
    graffiti-white: "#FFFFFF"
    cs-green: "#00FF00"
    cs-red: "#FF3333"
    cs-blue: "#3399FF"
    cs-yellow: "#FFFF00"
  typography:
    font-family-base: "Inter, system-ui, -apple-system, sans-serif"
    font-family-heading: "Poppins, Inter, system-ui, sans-serif"
    font-family-mono: "'Fira Code', 'JetBrains Mono', monospace"
    font-family-graffiti: "'Fira Code', monospace"
    scale:
      display: "clamp(2.5rem, 5vw, 4rem)"
      h1: "clamp(2rem, 4vw, 3rem)"
      h2: "clamp(1.5rem, 3vw, 2.25rem)"
      h3: "clamp(1.25rem, 2.5vw, 1.75rem)"
      body: "1rem"
      small: "0.875rem"
      micro: "0.75rem"
      shell-prompt: "0.9rem"
    weights:
      regular: 400
      medium: 500
      semibold: 600
      bold: 700
  spacing:
    base: "4px"
    scale:
      - "4px"
      - "8px"
      - "16px"
      - "24px"
      - "32px"
      - "48px"
      - "64px"
  border-radius:
    sm: "4px"
    md: "8px"
    lg: "12px"
    full: "9999px"
  shadows:
    card: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    elevated: "0 10px 25px -5px rgba(0, 0, 0, 0.15)"
    shell: "0 8px 32px rgba(0, 0, 0, 0.4)"
    glow-primary: "0 0 20px rgba(248, 180, 0, 0.3)"
    glow-cs: "0 0 15px rgba(0, 255, 0, 0.4)"
  transitions:
    fast: "150ms ease-out"
    normal: "250ms ease-out"
    slow: "400ms ease-out"
  z-index:
    dropdown: 100
    sticky-header: 1000
    modal: 2000
    shell: 3000
    tux: 1500
    graffiti: 500
    toast: 4000
  breakpoints:
    mobile: "480px"
    tablet: "768px"
    desktop: "1024px"
    wide: "1440px"
components:
  - name: "Shell Terminal"
    description: "Terminal interativo estilo anos 2000 com prompt customizável"
    states: ["closed", "opening", "open", "minimized"]
    tokens_used: ["colors.primary", "colors.header", "colors.text-on-dark", "font-family-mono", "spacing.md", "border-radius.md", "shadows.shell", "z-index.shell"]
  - name: "Tux Walker"
    description: "Pinguim Tux animado em SVG que passeia pela viewport"
    states: ["walking", "idle", "looking", "sleeping", "celebrating"]
    tokens_used: ["colors.primary", "colors.cs-green", "spacing.base", "transitions.normal", "z-index.tux"]
  - name: "Graffiti Writer"
    description: "Efeito spray paint escrevendo tags na lateral"
    states: ["spraying", "dripping", "fading", "cleared"]
    tokens_used: ["colors.graffiti-yellow", "colors.graffiti-dark", "colors.graffiti-white", "font-family-graffiti", "transitions.slow", "z-index.graffiti"]
  - name: "Cybercafé Toast"
    description: "Notificações estilo system message anos 2000"
    states: ["entering", "visible", "exiting"]
    tokens_used: ["colors.header", "colors.text-on-dark", "colors.primary", "font-family-mono", "spacing.md", "border-radius.sm", "shadows.elevated", "z-index.toast"]
  - name: "CS HUD Elements"
    description: "Radar, buy menu, bomb timer, kill feed decorativos"
    states: ["idle", "active", "triggered"]
    tokens_used: ["colors.cs-green", "colors.cs-red", "colors.cs-blue", "colors.cs-yellow", "font-family-mono", "spacing.sm", "border-radius.sm"]
  - name: "Easter Egg Modal (Buy Menu)"
    description: "Modal estilo CS buy menu ativado por Konami code"
    states: ["closed", "opening", "open", "closing"]
    tokens_used: ["colors.header", "colors.primary", "colors.text-on-dark", "font-family-mono", "spacing.lg", "border-radius.md", "shadows.shell", "z-index.modal"]
---

# DESIGN — linuxkafe Gamification

## Visual Theme
**Cybercafé Linux Anos 2000** — Estética de LAN house brasileira/portuguesa: monitores CRT (simulado via scanlines opcional), teclados mecânicos barulhentos, cheiro de café e cigarro, Counter-Strike 1.6 no modo LAN, MSN Messenger piscando, Orkut no navegador.

## Color Palette
### Core (Preservado do tema original)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-primary` | `#F8B400` | Amarelo LinuxKafé — links hover, accents, graffiti |
| `--color-header` | `#2d2d2d` | Header, shell background, CS HUD |
| `--color-bg` | `#FFFFFF` | Background principal |
| `--color-text` | `#212121` | Texto principal |
| `--color-text-light` | `#555555` | Texto secundário |

### Gamification Extensions
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-cs-green` | `#00FF00` | Radar, bomb timer CT, success states |
| `--color-cs-red` | `#FF3333` | Bomb timer T, error states |
| `--color-cs-blue` | `#3399FF` | CT team, info states |
| `--color-cs-yellow` | `#FFFF00` | Flashbang, warnings |
| `--color-graffiti-yellow` | `#F8B400` | Graffiti primary (mesmo primary) |
| `--color-graffiti-dark` | `#2d2d2d` | Graffiti outline (mesmo header) |
| `--color-graffiti-white` | `#FFFFFF` | Graffiti highlight |

## Typography Scale
| Element | Size | Weight | Font |
|---------|------|--------|------|
| Display | clamp(2.5rem, 5vw, 4rem) | 700 | Poppins |
| H1 | clamp(2rem, 4vw, 3rem) | 700 | Poppins |
| H2 | clamp(1.5rem, 3vw, 2.25rem) | 600 | Poppins |
| H3 | clamp(1.25rem, 2.5vw, 1.75rem) | 600 | Poppins |
| Body | 1rem | 400 | Inter |
| Small | 0.875rem | 400 | Inter |
| Shell Prompt | 0.9rem | 400 | Fira Code |
| Graffiti | 1rem | 400 | Fira Code |
| Micro | 0.75rem | 400 | Inter |

## Spacing System
Base unit: **4px** → Scale: 4, 8, 16, 24, 32, 48, 64px

## Component Patterns

### Shell Terminal
```
┌─ linuxkafe@cybercafe:~ ──────────────────┐
│ █                                        │
│ user@linuxkafe:~$ _                      │
└──────────────────────────────────────────┘
```
- **Background**: `var(--color-header)` com `rgba(0,0,0,0.95)`
- **Border**: `1px solid var(--color-primary)` + `box-shadow: var(--shadows.shell)`
- **Prompt**: `user@linuxkafe:~$` em `var(--color-primary)`, cursor blinking
- **Output**: `var(--color-text-on-dark)` com `var(--font-family-mono)`
- **Animation**: Slide up from bottom (300ms ease-out)

### Tux Walker
SVG animado com keyframes:
- **Walk**: `translateX` + perna alternando (rotate ±15°)
- **Idle**: `breathe` (scale 1 ↔ 1.02)
- **Look at cursor**: `rotate` head toward mouse
- **Sleep**: `Zzz` bubbles, olhos fechados
- **Reduced motion**: Estado estático `idle` apenas

### Graffiti Writer
Canvas 2D com partículas:
1. **Spray**: Partículas cônicas da "lata" → parede
2. **Drip**: Gravidade simulada nas bordas
3. **Fade**: Opacity decay 1 → 0 over 10s
4. **Clear**: Limpa canvas, novo ciclo
- **Cores**: Sorteadas entre tokens graffiti
- **Textos**: Array pré-definido (tags Linux/CS)

### Cybercafé Toast
```
┌────────────────────────────────────┐
│  [SYSTEM] LAN House: PC 3 livre    │
│  CS 1.6 • 5v5 • Sem cheat          │
└────────────────────────────────────┘
```
- **Style**: `var(--color-header)` bg, `var(--color-primary)` border-left 3px
- **Font**: `var(--font-family-mono)` 0.8rem
- **Animation**: Slide-in right → pause → fade-out

### CS Buy Menu (Easter Egg)
Modal central, grid 4x4:
```
┌─ BUY MENU ────────────────────────┐
│ $16000  [F1] Auto-buy  [F2] Rebuy │
├────────────────────────────────────┤
│ [1] sudo rm -rf /      $4750     │
│ [2] apt install linux    $3100   │
│ [3] vim                  $0 (free)│
│ [4] neofetch             $0       │
│ [5] cmatrix              $0       │
│ [6] fortune | cowsay     $0       │
└────────────────────────────────────┘
```

## Do's and Don'ts

### Do's
✅ Usar **custom properties** para todas as cores — permite theming dinâmico
✅ Respeitar **`prefers-reduced-motion`** — desativa animações não-essenciais
✅ **Lazy load** scripts com `requestIdleCallback` + fallback
✅ **ARIA labels** em tudo interativo — `aria-label="Terminal Linux interativo"`
✅ **Focus visible** — outline `2px solid var(--color-primary)` em `:focus-visible`
✅ **Performance first** — `will-change` apenas onde necessário, `contain: layout paint`

### Don'ts
❌ **Não** adicionar dependências npm — vanilla JS only
❌ **Não** usar `!important` exceto overrides WP específicos (header.php:359)
❌ **Não** bloquear thread principal — `requestAnimationFrame` para animações
❌ **Não** assumir viewport — usar `clamp()` e unidades relativas
❌ **Não** poluir `console.log` em produção — wrapper `debug()` condicional
❌ **Não** quebrar navegação por teclado — shell deve ser `Tab`-navegável