---
ticket: T008
title: Email de resumo do chat + admin settings + docs
sprint: sprint-01
priority: medium
status: pending
created: 2026-09-12
---

# T008 — Resumo por email, painel admin e documentação

## Context
(1) No fim de cada conversa, um resumo (transcrição, email, telefone, palavras-chave/intenção) é enviado para o endereço configurado (default `capuchinho@capuchinhoverde.com`) via `wp_mail`. (2) Página de settings no admin: endpoint do proxy, endereço de resumo, modelo, RAG on/off, limiar de cache, aparência do widget. (3) Persistência de conversas e respostas.

## Acceptance Criteria
- [ ] `includes/class-xkaichat-summary.php` existe
- [ ] `includes/class-xkaichat-summary.php` envia resumo via `wp_mail` para endereço configurado
- [ ] Default do endereço de resumo é `capuchinho@capuchinhoverde.com` em `includes/class-xkaichat-admin.php`
- [ ] `admin/partials/xkaichat-admin-display.php` existe
- [ ] `admin/partials/xkaichat-admin-display.php` contém campos de settings com nonce
- [ ] Settings do proxy (URL/host) persisted via `register_setting`
- [ ] Tabela `xkaichat_messages` existe (persistência conversa + respostas)
- [ ] `docs/QUALITY_GATES.md` documenta os gates do projeto
- [ ] `README.md` na raiz existe com instalação e configuração do proxy
- [ ] `docs/HOSTILE_INSIGHTS.md` existe

## Scope
**In:** resumo por email, settings, persistência de mensagens, docs.
**Out:** revisão crítica (T009).

## Dependencies
T003, T007.

## Rollback
Remover tabelas; remover settings.

## Known Risks
- GDPR: emails/telefones de clientes armazenados — política de retenção e nota de privacidade.