---
ticket: T010
title: Onboarding do widget — consentimento → email → código → chat (logo FAB + tooltip)
sprint: sprint-02
priority: high
status: in-progress
created: 2026-09-13
---

# T010 — Onboarding conduzido do widget

## Context
O widget abre hoje diretamente no passo de email/validação, com um FAB que mostra um ícone de chat. O negócio exige:
1. consentimento explícito antes de pedir dados;
2. fluxo conduzido: termos → email (telefone opcional) → código → chat;
3. FAB com o logótipo do website + tooltip atrativa quando fechado;
4. textos (termos, saudação de chat) configuráveis no painel de administração;
5. mensagem inicial do chat configurável.

## Acceptance Criteria
- [ ] `make lint` [command "exits 0"]
- [ ] `make test-php` [command "exits 0"]
- [ ] `public/partials/xkaichat-chat-widget.php` contains "view-terms"
- [ ] `public/js/xkaichat-chat.js` contains "terms"
- [ ] `admin/class-xkaichat-admin.php` contains "terms_text"
- [ ] `admin/class-xkaichat-admin.php` contains "widget_initial_message"
- [ ] `public/class-xkaichat-public.php` contains "widget_logo_url"
- [ ] `docs/REQUIREMENTS.md` contains "consentimento"

## Scope
**In scope:**
- Novas definições admin: `widget_logo_url`, `terms_text`, `widget_initial_message` (+ sanitização e defaults).
- Partial: view de termos, tooltip, FAB com `<img>` do logo (fallback ao ícone de chat/close).
- CSS: tooltip, “ressalto” (atenção) do FAB, view de termos.
- JS: fluxo termos → email; flag de aceitação por sessão; entrada com token → chat; mensagem inicial configurável.
- Resolução do logo: `widget_logo_url` → senão custom logo do tema (`get_theme_mod('custom_logo')`) → senão ícone de chat.
- Docs: REQUIREMENTS/VISION atualizados; testes PHP de sanitização dos novos campos.

**Out of scope:**
- Consentimento persistente (localStorage/cookie) e política de privacidade em página dedicada.
- Testes de browser automatizados (sem harness JS/E2E no repo).
- Alterações ao proxy/backend (fluxo de verificação inalterado).

## Dependencies
- Nenhuma nova. Reutiliza strings i18n e nonce `xkaichat_public`.

## Rollback
- Reverter o commit remove os campos; os defaults cobrem a ausência das chaves em `wp_parse_args`.

## Known Risks
- Temas sem `custom_logo` e sem URL configurada → FAB volta ao ícone de chat (graceful).
- `terms_text` introduzido como texto plano sanitizado e renderizado via `textContent` (sem HTML → sem XSS).
- Utilizadores com sessão ativa saltam os termos (já validaram) — comportamento intencional.

## Notes
- Flag de aceitação dos termos guardada em `sessionStorage` (`xkaichat_terms_accepted`), espelhando o âmbito da sessão de chat.