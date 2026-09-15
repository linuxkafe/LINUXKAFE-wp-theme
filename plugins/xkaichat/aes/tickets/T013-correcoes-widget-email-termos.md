---
ticket: T013
title: "Correções widget: email de validação (remetente admin + feedback), tip escondida, estado online real, termos com tratamento automatizado e modelo local"
sprint: sprint-03
priority: high
status: in-progress
created: 2026-09-14
---

# T013 — Correções widget: email, tip, estado online, termos

## Context
Quatro defeitos no widget de chat reportados após a v1:

1. O email de validação (código) não é enviado de forma fiável: o plugin não regista
   filtros `wp_mail_from`/`wp_mail_from_name`, pelo que o remetente sai com o default
   do WordPress (`wordpress@dominio`) que quebra SPF/DKIM e pode nunca chegar. Além
   disso, o utilizador não tem feedback visível quando o pedido de código falha
   ("mensagem em queue" que não aparece).
2. A mensagem inicial "Olá, como podemos ajudar?" não desaparece quando o painel é
   aberto — `.xkaichat-tip { display:flex }` anula o atributo `[hidden]` (lição T012
   repetida).
3. O estado "online" está hardcoded no markup; o proxy `/api/health` não contacta o
   Ollama/LLM, logo o indicador pode mostrar "online" com o LLM em baixo.
4. As condições de utilização exibidas inicialmente não mencionam tratamento
   automatizado, possibilidade de erros nem modelo local.

## Acceptance Criteria
- [ ] O loader do plugin registra o filtro de remetente `wp_mail_from` — contains 'wp_mail_from' in `includes/class-xkaichat.php`
- [ ] O loader do plugin registra o filtro de nome de remetente `wp_mail_from_name` — contains 'wp_mail_from_name' in `includes/class-xkaichat.php`
- [ ] O override `[hidden]` do tip existe literalmente no CSS — `grep -qF 'xkaichat-tip[hidden]' public/css/xkaichat-chat.css` exits 0
- [ ] O indicador de estado tem identidade para o JS (data-role) — contains 'data-role="online"' in `public/partials/xkaichat-chat-widget.php`
- [ ] Existe ação AJAX de saúde do proxy/LLM — contains 'xkaichat_health' in `public/class-xkaichat-public.php`
- [ ] O frontend chama o health check para atualizar o estado — contains 'xkaichat_health' in `public/js/xkaichat-chat.js`
- [ ] O health do proxy deteta o estado do LLM upstream — contains 'upstream' in `proxy/proxy.py`
- [ ] Os termos default mencionam tratamento automatizado — contains 'tratamento automatizado' in `includes/class-xkaichat-activator.php`
- [ ] Os termos default mencionam o modelo local — contains 'modelo local' in `includes/class-xkaichat-activator.php`
- [ ] Os testes PHP passam — `make test-php` passes
- [ ] Os testes do proxy passam — `make test-proxy` passes

## Scope
**In scope:** filtros de remetente devolutivos (admin_email + blog name), feedback
visível de envio/erro do código, override `[hidden]` do tip, estado online com verificação
do LLM (proxy→PHP AJAX→JS→CSS), termos default com os 3 elementos.

**Out of scope:** diagnóstico/configuração do servidor SMTP do hosting, campo de
remetente configurável no admin, redesenho do widget.

## Dependencies
Nenhuma. Reproduz a lição T012 (override de `[hidden]`).

## Rollback
Reverter o commit do T013 restaura o comportamento anterior; os dados (tabelas,
mensagens, opções) não são alterados.

## Known Risks
- `wp_mail_from` é global ao site (todos os `wp_mail`): usar `admin_email`, que é o
  default recomendado pelo WP — risco baixo.
- Health upstream adiciona um request ao Ollama por chamada: timeout curto (1,5s).
- Mudar o default dos termos só afeta instalações sem valor guardado.

## Notes
Plano completo (Hostile Analysis + Solution Proposal) em `T013-plan.md`.