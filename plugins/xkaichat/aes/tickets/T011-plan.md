---
id: T011
sprint: sprint-03
title: "Reforço do gate pre-commit — commits de fecho de ticket são sempre verificados"
---

# T011-plan — Gate pre-commit em commits de fecho

## Phase 1 — Análise hostil

### Causa raiz
`pre-commit.sh` decide o gate por `current_ticket` da **árvore de trabalho** (linha 31). Ao fechar o último ticket, o agente (ou humano) atualiza o kanban (`current_ticket: none`, linha `done`) **no mesmo working tree** antes de `git commit` → o hook salta limpo, sem evidência.

### Cenários a cobrir
- C1. **Fecho do último ticket** (T0XX → none): gate TEM de correr sobre T0XX. ← cenário real do T010.
- C2. Rotação normal (T0XX → T0YY): gate corre sobre T0YY (working tree já tem o novo) — inalterado.
- C3. Commit de backlog/infra sem ticket: continua a saltar (comportamento legítimo).

### Como detetar C1
`git diff --cached aes/kanban.md` — se a linha removida do staged for `-current_ticket: T0XX` (T0XX ≠ none) e o working tree tem `none`, é um commit de fecho → correr o verifier sobre T0XX.

### Riscos
- R1. Subshell com `set -e` + `grep` sem match abortar: mitigado porque a substituição está em contexto `if` (set -e suspenso).
- R2. Mock para smoke test: o hook referencia `scripts/verify-implementation.sh` por caminho fixo → adicionar override por env `AES_VERIFY_SCRIPT` (default inalterado).
- R3. Falso positivo: se um commit remove `current_ticket` sem fechar nada — improvável (validação T0XX ≠ none + verificação falha ao invés de silenciar).

## Phase 2 — Solução proposta

### Ficheiros
| Ficheiro | Mudança |
|----------|---------|
| `.aes/hooks/pre-commit.sh` | Deteção de fecho via `git diff --cached`; `VERIFY_SCRIPT` via `AES_VERIFY_SCRIPT` |
| `tests/aes/test-pre-commit-close-gate.sh` | Smoke: repo temp → fecho T0XX→none → gate corre e verifica T0XX |
| `Makefile` | Target `test-aes` + integração em `check` |
| `CLAUDE.md` | Regra de processo: fecho verificado pelo hook (C1) |
| `docs/ROADMAP.md` | T011 registado |

### Passos
1. Patch do hook: bloco `CLOSING_TICKET` no ramo "none".
2. Smoke test com repo temporário + mock verifier.
3. Marcação no Makefile; `make check` passa.
4. Docs de processo.

### Critérios de fecho (verificáveis)
Ver `Critérios de aceitação` em `T011-gate-pre-commit.md` (6 ACs).