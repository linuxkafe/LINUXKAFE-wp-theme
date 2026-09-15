---
sprint: sprint-02
period: 2026-09-13 → 2026-09-20
status: done
goal: "Melhorar o onboarding do widget: consentimento explícito antes da validação, fluxo conduzido (termos → email → código → chat), FAB com logótipo + tooltip de interação."
---

# Sprint 02 — Onboarding do widget XKaiChat

## Tickets
| ID | Title | Status |
|----|-------|--------|
| T010 | Onboarding: termos → email → código → chat (logo FAB + tooltip) | done |

## Retrospective

### O que correu bem
- Desacoplar a mensagem inicial do chat (`widget_initial_message`) da saudação do email tornou a mudança cirúrgica.
- Fronteira de XSS garantida e barata (`textContent`).
- Gates: `make check` verde; ACs de T010 auto-verificáveis 8/8.

### O que melhorar
- Consentimento por sessão reabre em cada separador — se o cliente pedir rigor RGPD, mover para localStorage + política (backlog T010).
- Ferramenta tooltip acessível (anúncio ARIA) ficou como MINOR.
- Falta harneash de browser para o fluxo completo — registado no backlog.

### Ações
- [x] T010 fechado com build/review/learn.
- [ ] (backlog) Playwright do onboarding; consentimento persistente; a11y da tooltip.