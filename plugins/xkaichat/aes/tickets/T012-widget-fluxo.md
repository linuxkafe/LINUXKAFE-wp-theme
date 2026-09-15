---
ticket: T012
title: Polimento do widget — auto-open configurável, logo no chat, escrita simulada, maximize
sprint: sprint-03
priority: high
status: in-progress
created: 2026-09-12
---

# T012 — Polimento do widget

## Context
Pedido direto do utilizador: o widget deve **nascer fechado por omissão** (ou abrir segundo
configuração nas opções); manter a sequência de validação humana **email (obrigatório) +
telefone (opcional) → código no ecrã seguinte** (já implementada em T010 — verificar);
após o código, abrir o **espaço de chat com possibilidade de incrementar o tamanho**;
apresentar **o logótipo do site dentro do chat**; e **simular a escrita** enquanto o modelo
responde.

## Verificação (gap analysis)
| Requisito | Estado atual | Ação |
|---|---|---|
| Fechado por omissão | ✅ `panel` hidden; FAB + tooltip apenas | Add opção `widget_auto_open` (default 0) |
| Sequência email/telefone→código | ✅ T010 (`request_code` → `wp_mail` → view code) | Verificar só |
| Chat após código | ✅ `startChat(data.token)` | Verificar só |
| Incrementar tamanho do chat | ❌ sem maximize | Botão expandir no header |
| Logo no chat | ❌ só no FAB | Logo no header do painel |
| Escrita simulada | ⚠️ barra 3 dots sem texto, fora do chat | Bolha typing no body + "A escrever…" |

## Acceptance Criteria
- [ ] Opção `widget_auto_open` (0/1) registada nas settings com default 0 — quando ligado, painel abre no boot com tooltip suprimida [file exists]: `includes/class-xkaichat-activator.php`
- [ ] Header do chat renderiza o logótipo resolvido quando existe; fallback mantém o título [file exists]: `public/partials/xkaichat-chat-widget.php`
- [ ] Botão expandir no header alterna a classe `xkaichat-maximized` no JS do widget [file exists]: `public/js/xkaichat-chat.js`
- [ ] Indicador de escrita no body do chat com label "A escrever…" e dots animados [file exists]: `public/css/xkaichat-chat.css`
- [ ] Testes PHP incluem `widget_auto_open` (sanitize + defaults) [file exists]: `tests/php/run-all.php`
- [ ] `make test-php` passes
- [ ] `make lint` passes

## Scope
**In scope:** settings admin (`widget_auto_open`), partial do widget (header logo, maximize,
typing no body), CSS, JS, testes PHP, docs.
**Out of scope:** backend de verificação/email, proxy, cache, RAG, persistência de transcript,
novas dependências, testes de browser (sem harness — backlog).

## Dependencies
Nenhuma (base T010/T011).

## Rollback
Reverter o diff do repositório (features frontend só com alterações aditivas+classe).

## Known Risks
- Auto-open pode ser intrusivo em mobile → default OFF; e hasteado.
- Maximize com painel já em mobile (full width) → apenas incremento de altura.
- Typing bubble não é persistido no transcript (por desenho).