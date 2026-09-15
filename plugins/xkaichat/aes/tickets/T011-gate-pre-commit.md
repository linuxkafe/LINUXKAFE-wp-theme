---
id: T011
sprint: sprint-03
title: "Reforço do gate pre-commit — commits de fecho de ticket são sempre verificados"
created: 2026-09-13
status: pending
priority: high
---

# T011 — Gate pre-commit em commits de fecho

## Contexto
No fecho do T010, `current_ticket` foi avançado para `none` antes do commit que fechava o ticket. O pre-commit hook lê `current_ticket` da árvore de trabalho e, ao ver `none`, salta o gate. O T010 foi verificado manualmente (8/8) e o `make check` estava verde, mas o gate automatizado não correu sobre o commit de fecho.

## Objectivo
Nenhum commit que feche um ticket (transição `current_ticket: T0XX → none`) pode ficar sem gate: o hook deve detetar a transição no diff staged e verificar o ticket fechado.

## Acceptance Criteria
- [ ] `make lint` exits 0.
- [ ] `make test-php` exits 0.
- [ ] `bash -n .aes/hooks/pre-commit.sh` exits 0 (sintaxe válida).
- [ ] `tests/aes/test-pre-commit-close-gate.sh` exits 0 (smoke: fecho corre o gate).
- [ ] `Makefile` contém `test-aes` e `make check` inclui esse target.
- [ ] `.aes/hooks/pre-commit.sh` contains "CLOSING_TICKET" (lógica de fecho).

## Out of scope
- Alterar a lógica de bypass ou o verifier (`verify-implementation.sh`) — não é necessário para o reforço.
- Kanban-check.sh (não existe no repo).