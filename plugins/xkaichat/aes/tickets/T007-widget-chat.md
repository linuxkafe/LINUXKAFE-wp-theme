---
ticket: T007
title: Widget de chat frontend (estética Capuchinho Verde)
sprint: sprint-01
priority: medium
status: pending
created: 2026-09-12
---

# T007 — Widget de chat frontend

## Context
Widget de chat na frente do site (shortcode + injetado no footer via settings). Fluxo: pedido de email → código → chat. Estética profissional a condizer com a marca Capuchinho Verde (verde sobre branco, tipografia limpa). Acessibilidade e responsividade.

## Acceptance Criteria
- [ ] `public/partials/xkaichat-chat-widget.php` existe
- [ ] `public/css/xkaichat-chat.css` existe
- [ ] `public/js/xkaichat-chat.js` existe
- [ ] `public/js/xkaichat-chat.js` contém a string `xkaichat_ajax`
- [ ] O widget envia pedido de código (`request_code`) e verificação (`verify_code`) via AJAX
- [ ] O JS contém handling de erros e estado de loading
- [ ] `public/css/xkaichat-chat.css` usa uma paleta derivada da marca (verde)
- [ ] Widget é responsivo (regras `@media`) no CSS
- [ ] Shortcode `[xkaichat]` registado no public class
- [ ] O JS envia o número de telefone como opcional

## Scope
**In:** markup, CSS, JS, fluxo de email→código→chat, session token.
**Out:** resumo por email (T008), admin settings.

## Dependencies
T002, T003.

## Rollback
Remover shortcode; desregistar assets.

## Known Risks
- Conflito de estilos com o tema — prefixar todos os seletores com `.xkaichat-`.
- CSP do site pode bloquear injeção de script — usar enqueue padrão WP.