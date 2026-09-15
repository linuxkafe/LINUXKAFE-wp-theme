---
id: sprint-03
status: done
goal: "Fechar o gap de integridade descoberto no fecho do T010: nenhum commit que fecha um ticket pode correr sem gate pre-commit."
---

# Sprint 03 — Rigor do gate de fecho

## Tickets
| ID | Title | Status |
|----|-------|--------|
| T011 | Reforço do gate pre-commit: commits de fecho são sempre verificados | done |
| T012 | Polimento do widget: auto-open configurável, logo no chat, escrita simulada, maximize | done |

## Retrospective

### O que correu bem
- O gap do fecho do T010 foi transformado em ticket de processo (T011) e fechado com a mesma mecânica que protege: o commit de fecho do próprio T011 demonstrou o gate a correr sobre o ticket fechado.
- Smoke test reproduz o cenário real em repo temp — prova máquina, não opinião.
- T012: fix de persistência duplicada (greeting/typing) descoberto na revisão crítica antes do commit; gates verdes sem novas dependências; ACs reescritas com ganchos do verifier no próprio fecho (7/7 auto-verificáveis, não skips).

### O que melhorar
- O verifier ainda "conta" skips como passes (métrica `COUNT−FAIL`); a AC do `CLOSING_TICKET` foi afinada para verificação real, mas a métrica de skip continua ambígua.
- Falta caso negativo no smoke test (MINOR T011).
- ACs não-auto-verificáveis no plan obrigaram a reescrever no fecho — escrever com ganchos do verifier desde o plan.

### Ações
- [x] T011 fechado: hook + smoke test + `make check` (com `test-aes`) + docs.
- [x] T012 fechado: widget polish + learn; gates verdes; commit de fecho com gate T011.
- [ ] (sugestão) Caso negativo no teste; revisitar métrica de skip do verifier.

## Learning
T012: num widget vanilla o DOM é simultaneamente modelo e view — marcadores decorativos (bolha typing/saudação) vazam para o estado persistido; patchar por exclusão de identidade funciona mas a solução de princípio é um array lógico de mensagens. `[hidden]` do UA perde para `display` de autor (require override) e indicadores "pensando" no fim do histórico exigem `appendChild`/rerender. Auto-open deve ser opção default off, nunca imposição.