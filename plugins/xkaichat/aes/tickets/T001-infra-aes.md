---
ticket: T001
title: Infraestrutura AES + scaffolding do projeto
sprint: sprint-01
priority: high
status: in-progress
created: 2026-09-12
---

# T001 — Infraestrutura AES + scaffolding

## Context
O diretório xkaichat está vazio (greenfield). Antes de qualquer código de produto, instalar a infraestrutura AES exigida pelo protocolo: kanban, docs, Makefile, hooks anti-drift, git.

## Acceptance Criteria
- [ ] `aes/kanban.md` existe com project, current_sprint e tabela de tickets
- [ ] `aes/sprints/sprint-01.md` existe
- [ ] `docs/VISION.md` existe
- [ ] `docs/REQUIREMENTS.md` existe
- [ ] `docs/ROADMAP.md` existe
- [ ] `docs/QUALITY_GATES.md` existe
- [ ] `docs/CHECKLIST.md` existe
- [ ] `docs/PERSONAS.md` existe (projeto de produto SaaS)
- [ ] `CLAUDE.md` existe e define o contrato operacional
- [ ] `Makefile` existe e contém o target `check` (make "target exists")
- [ ] `scripts/verify-implementation.sh` existe e é executável
- [ ] `.aes/hooks/pre-commit.sh` existe e é executável
- [ ] Repositório git inicializado com commit com a mensagem "Initialise AES project"

## Scope
**In:** docs, kanban, Makefile, hooks, git init.
**Out:** código do plugin (T002+), proxy (T004+), RAG (T005+).

## Rollback
Apagar pastas aes/, docs/, scripts/; remover .git.

## Known Risks
- Hooks podem bloquear commits se o kanban estiver inconsistente — manter current_ticket correto.