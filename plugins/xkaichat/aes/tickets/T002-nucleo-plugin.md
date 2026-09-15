---
ticket: T002
title: Núcleo do plugin WordPress (skeleton, activação, i18n, uninstall)
sprint: sprint-01
priority: high
status: pending
created: 2026-09-12
---

# T002 — Núcleo do plugin WordPress

## Context
Base do plugin. Sem este esqueleto corretamente estruturado (WordPress Coding Standards), nenhum outro ticket é fiável.

## Acceptance Criteria
- [ ] `xkaichat.php` existe na raiz e contém o header de plugin com `Plugin Name`
- [ ] `xkaichat.php` contém a string `XKaiChat` e a constante `XKAICHAT_VERSION`
- [ ] `includes/class-xkaichat.php` existe e é a classe principal loader
- [ ] `includes/class-xkaichat-activator.php` existe
- [ ] `includes/class-xkaichat-deactivator.php` existe
- [ ] `includes/class-xkaichat-i18n.php` existe
- [ ] `uninstall.php` existe na raiz
- [ ] `admin/class-xkaichat-admin.php` existe
- [ ] `public/class-xkaichat-public.php` existe
- [ ] Todos os ficheiros PHP passam `make lint` [command "exits 0"]
- [ ] `make lint` target exists (corre `php -l` em todos os ficheiros)

## Scope
**In:** estrutura de classes do plugin, hooks de activação/desactivação, carregamento de assets, i18n.
**Out:** lógica de chat, verificação, proxy, RAG (tickets seguintes).

## Dependencies
T001.

## Rollback
Desativar e apagar as classes novas.

## Known Risks
- Violação das WPCS (naming, escaping) — mitigado com php -l + revisão manual de escaping.