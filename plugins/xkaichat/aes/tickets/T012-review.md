---
ticket: T012
phase: review
status: done
created: 2026-09-12
requires:
  - aes/tickets/T012-widget-fluxo.md
  - aes/tickets/T012-plan.md
  - aes/tickets/T012-build.md
produces:
  - aes/tickets/T012-review.md
verdict: approved
blocked_by: ''
---

# T012 — Review

## Decision: APPROVED

## Summary
Implementação cirúrgica que satisfaz as 5 ACs (fechado por omissão/configurável, fluxo
de validação humano preservado, maximize, logo no chat, escrita simulada). Detetou e
corrigiu um bug pré-existente de persistência do transcript. Gates verdes (make check:
68 asserts PHP, 24 pytest, lint, docs; node --check JS).

## Problems Found

### Blocking
None

### Important
None

### Suggestions
- **Acessibilidade**: `aria-pressed` reflete o maximize, mas o FAB e o botão maximize
  não expõem `aria-expanded`/`aria-controls` sobre o painel. Melhoria incremental, não
  bloqueante (o painel usa `role="dialog"` + `hidden`, já sinalizado em T012-build).
- **Testes de browser**: typing/maximize/auto-open não têm harness JS/E2E (reportado no
  backlog ROADMAP — Playwright). Verificação por revisão estática + node --check apenas.

## Highlights
- `openPanel()/closePanel()` simplificaram o handler do FAB (antes inline e com lógica
  duplicada de estado).
- Fix pré-existente do `persistTranscript`: a bolha de saudação era guardada e duplicada
  no restore; na mesma correção, a bolha typing (classe `.xkaichat-bubble`) foi excluída
  antes de poder vazar como "mensagem" falsa.
- Sem novas dependências; sem tocar em verificação/proxy/cache/RAG/nonces.
- Estética mantida (verde #5a8a4b, SVG sem emojis, escaping obrigatório).

## Backlog Tickets Created
None (testes Playwright já em ROADMAP backlog desde T010).

## Context for Learn
- **Persistência de transcript vs DOM extra** (bolha typing/saudação): funções que
  serializam o DOM por classes correm risco de capturar marcadores visuais como
  conteúdo. Lição aplicável a qualquer indicador decorativo dentro do histórico.
- **Indicador "pensando"**: foi reposicionado de barra fixa (fora do denominado
  histórico) para bolha dentro do body — requer mover o nó para o fim (appendChild)
  porque as bolhas são anexadas sequencialmente.
- **hidden em flex container**: `display:inline-flex` precisa de override explícito
  `[hidden]{display:none}` (o `display` do autor anula o `[hidden]` do UA) — armadilha
  recorrente em indicadores visuais.
- Trade-off: auto-open repetido por página (sem persistência de preferência) —
  comportamento literal pedido, controlado pelo admin.