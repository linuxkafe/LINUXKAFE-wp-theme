# T011-review — Revisão crítica

## Veredicto
**APROVADO** — sem BLOCKER nem MAJOR. 1 MINOR.

## Lentes

### Correctness
- Fecho detetado por `git diff --cached aes/kanban.md` (linha removida `-current_ticket: T0XX` com `T0XX != none`); gate corre sobre o ticket fechado. Rotação normal (T0XX → T0YY) usa o novo `current_ticket` como antes; backup/sem-ticket continua a saltar.
- Smoke test prova o cenário real (fecho do T010) em repo temp com mock verifier: hook invocou `VERIFY_RAN=T011`.
- `AES_VERIFY_SCRIPT` mantém default → comportamento igual em produção.

### Simplicity
- ~10 linhas novas no hook + override env; um único smoke script `tests/aes/test-pre-commit-close-gate.sh`.
- Lógica de bypass e verifier intactos — mudança cirúrgica.

### Maintainability
- Regra documentada no kanban Rules e no CLAUDE.md (Processo de commit).
- Verifier bilingue (EN/PT) evita o mesmo erro de marcador no futuro.

### Security
- O gate torna-se **não-ignorável por omissão** em fechos — a falha do T010 (skip silencioso) já não é possível sem bypass explícito e logado.

### Performance
- Custo por commit: 1 `git diff --cached` apenas no ramo "none" — desprezível.

## Ações requeridas (MINOR)
1. **Caso negativo no smoke test**: garantir que um commit sem transição de ticket NÃO trabalha o gate (evita falsos positivos futuros). Sugestão: próxima iteração do teste; não bloqueia.

## Contrato
- Percorra o hook com `bash -n` (ok) e `make check` (inclui `test-aes`) — verde. Fecho pela mesma mecânica do T011: o commit de fecho do próprio ticket demonstrará o gate a correr.