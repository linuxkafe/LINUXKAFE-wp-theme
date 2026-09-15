---
ticket: T003
title: Verificação de email (códigos temporários, sessões, rate-limit)
sprint: sprint-01
priority: high
status: pending
created: 2026-09-12
---

# T003 — Verificação de email do utilizador

## Context
O chat só funciona após o utilizador fornecer um email válido, validado com código temporário enviado por email (wp_mail). Telefone opcional. Proteger com rate-limit contra abuso.

## Acceptance Criteria
- [ ] `includes/class-xkaichat-verification.php` existe
- [ ] `includes/class-xkaichat-verification.php` gera e valida códigos de 6 dígitos com TTL configurável
- [ ] Tabela `xkaichat_codes` criada na activação do plugin com `dbDelta`
- [ ] `includes/class-xkaichat-verification.php` contém função que envia código via `wp_mail`
- [ ] Endpoints AJAX `xkaichat_request_code` e `xkaichat_verify_code` registados no public class
- [ ] Rate-limit por IP e por email implementado com transients (máx N pedidos por janela)
- [ ] Telefone é opcional e validado com regex PT
- [ ] `includes/class-xkaichat-verification.php` contém a string `nonce`
- [ ] Tolerance: tentativas máximas de código errado antes de bloquear

## Scope
**In:** tabela de códigos, envio, validação, sessão autenticada (token), rate-limit.
**Out:** desenho do widget (T007), envio do resumo (T008).

## Dependencies
T002.

## Rollback
DROP TABLE `xkaichat_codes`; remover hooks AJAX.

## Known Risks
- Abuso de código (spam de emails) — mitigado por rate-limit e throttling.
- Entrega de email depende de SMTP configurado em WordPress.