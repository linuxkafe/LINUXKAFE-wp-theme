# CHECKLIST — linuxkafe Gamification Quality Gates

## Pre-commit (Quick) — BLOCKER
- [ ] **Tests pass** — `npm run lint:js` (ESLint) exit 0
- [ ] **Lint passes** — `npm run lint:scss` (Stylelint) exit 0
- [ ] **Format correct** — `npx prettier --check .` (se configurado) ou manual
- [ ] **No console.log/debug em produção** — grep `console\.(log|debug|warn)` em `js/*.js` retorna apenas wrappers condicionais
- [ ] **No TODO/FIXME em src** — grep `TODO\|FIXME` em `js/*.js` e `style.css` retorna vazio
- [ ] **Docs atualizadas** — VISION, REQUIREMENTS, ROADMAP, DESIGN, CHECKLIST refletem mudanças
- [ ] **Diffstory escrita** — `aes/tickets/T001-build.md` completo

## Pre-release (Thorough) — BLOCKER

### Performance
- [ ] **JS total < 15KB gzipped** — `gzip-size js/*.js` somado < 15360 bytes
- [ ] **CLS = 0** — Layout Shift nulo (Lighthouse/Chrome DevTools)
- [ ] **INP < 200ms** — Interaction to Next Paint dentro do limite
- [ ] **LCP < 2.5s** — Largest Contentful Paint sem regressão
- [ ] **RequestIdleCallback usado** — Scripts gamificação carregam após idle

### Acessibilidade (WCAG 2.1 AA)
- [ ] **prefers-reduced-motion respeitado** — `@media (prefers-reduced-motion: reduce)` desativa Tux walk, graffiti, shell cursor blink
- [ ] **ARIA labels** — Todos elementos interativos têm `aria-label` ou `aria-labelledby`
- [ ] **Focus visible** — `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }`
- [ ] **Focus trap no shell** — Tab cycle dentro do modal, Esc fecha
- [ ] **Screen reader silent** — Elementos decorativos com `aria-hidden="true"`
- [ ] **Contraste** — Texto/UI 4.5:1 mínimo (verificar cores graffiti/CS HUD)

### Funcionalidade
- [ ] **Shell abre/fecha** — Clique no `>_` + tecla `~` + Esc
- [ ] **Comandos shell funcionam** — `help`, `whoami`, `ls`, `cat readme.txt`, `neofetch`, `cmatrix`, `apt moo`, `fortune`, `cowsay`
- [ ] **Tux aparece e anima** — Anda, para, olha cursor, dorme
- [ ] **Clique no Tux** — Mostra mensagem aleatória
- [ ] **Graffiti escreve/cicla** — Spray → drip → fade → clear → repeat
- [ ] **Cybercafé toasts aparecem** — 1 a cada 30-60s, max 3, dismissible
- [ ] **Konami code** — ↑↑↓↓←→←→BA abre Buy Menu
- [ ] **Click 5x logo** — God mode (Tux asas, shell sudo)
- [ ] **Digitar "idkfa"** — Todos easter eggs desbloqueados
- [ ] **Console.log easter eggs** — Mensagens no DevTools

### Cross-browser
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### WordPress Integration
- [ ] **Enqueue correto** — `wp_enqueue_script` com `in_footer=true`, dependências vazias
- [ ] **Versão dinâmica** — `filemtime()` para cache busting
- [ ] **Sem conflitos jQuery** — Vanilla JS only, sem `$`
- [ ] **Customizer ready** — Hooks preparados para toggle futuro (Sprint 02)

### Código
- [ ] **ESM modules** — `type="module"` no enqueue, `import`/`export` usados
- [ ] **JSDoc** — Funções públicas documentadas
- [ ] **CSS organizado** — Por componente, custom properties usadas
- [ ] **Zero dependências externas** — `package.json` inalterado exceto devDeps se necessário

## Domain-Specific Gates (Frontend)

### UX Manifests (se aplicável)
- [ ] `docs/UX/pages/*.yaml` válidos (schema `aes/ux-v1`)
- [ ] `make ux-check` passa (FC-1 a FC-9)

### Design System Consistency
- [ ] `docs/DESIGN.md` tokens match CSS custom properties
- [ ] Cores gamificação usam tokens (não hardcoded)
- [ ] Tipografia segue escala DESIGN.md

## WARNING (Non-blocking, but tracked)
- [x] Analytics events instrumentados (Sprint 02) ✅ Done
- [x] Persistência localStorage funcionando (Sprint 02) ✅ Done
- [x] Documentação usuário/README gamificação (Sprint 02) ✅ Done (js/README.md)
- [x] ESLint flat config para ES modules (Sprint 03) ✅ Done
- [x] Playwright config cleanup (Sprint 03) ✅ Done
- [x] Stylelint line-length fix (Sprint 03) ✅ Done
- [x] Customizer postMessage transport (Sprint 03) ✅ Done
- [x] Playwright coverage expandido (Sprint 03) ✅ Done
- [x] Web Audio API sounds (eat, game over, level up) (Sprint 05) ✅ Done
- [x] HTML5 Retro Game (Snake clone) (Sprint 04) ✅ Done
- [x] Tux triple-click trigger (Sprint 04) ✅ Done
- [x] Game modal with focus trap (Sprint 04) ✅ Done
- [x] High score persistence (Sprint 04) ✅ Done
- [x] Reduced motion support for game (Sprint 04) ✅ Done

## Como rodar localmente
```bash
# Lint JS
npm run lint:js

# Lint CSS/SCSS
npm run lint:scss

# Build CSS
npm run compile:css

# Verificar tamanho JS gzipped
gzip-size js/*.js

# Lighthouse CI (performance + a11y)
npx lighthouse http://localhost:8000 --output=json --output-path=./lighthouse-report.json

# Playwright Tests
npm run test:install    # Instala browsers (primeira vez)
npm run test            # Executa testes headless
npm run test:headed     # Executa com UI visível
npm run test:ui         # Abre Playwright UI
```