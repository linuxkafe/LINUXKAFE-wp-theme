---
ticket: T009
title: Validação, revisão crítica e aprendizagem
sprint: sprint-01
priority: high
status: pending
created: 2026-09-12
---

# T009 — Validação, revisão crítica e aprendizagem

## Context
Gates finais AES: testes, lint, revisão crítica multi-lente, registo de aprendizagens, retrospective.

## Acceptance Criteria
- [ ] `make lint` passa sem erros [command "exits 0"]
- [ ] `make test` corre os testes PHP e pytest e sai 0 [command "exits 0"]
- [ ] Teste end-to-end com Ollama local real (qwen3:8b) documentado em `docs/QA.md` [file exists]
- [ ] `aes/tickets/T009-build.md` existe com diffstory
- [ ] `aes/tickets/T009-review.md` existe com conclusão aprovada/condicional
- [ ] `aes/tickets/T009-learn.md` existe com aprendizagens registadas
- [ ] Retrospective preenchida em `aes/sprints/sprint-01.md` [contains "Retrospective"]

## Scope
**In:** validação técnica, revisão, aprendizagem.
**Out:** reescrita de funcionalidades (novos tickets em backlog).

## Dependencies
T001–T008.

## Rollback
N/A.

## Known Risks
- Sem instância WordPress completa para E2E de navegação — mitigado por testes unitários com mocks e validação manual documentada.