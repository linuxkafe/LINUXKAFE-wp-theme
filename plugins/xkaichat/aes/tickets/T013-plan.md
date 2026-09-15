---
ticket: T013
phase: plan
status: done
created: 2026-09-14
---

# T013 — Plan

## Phase 1 — Hostile Analysis

**INSIGHTS CONSULTADOS:** lição T012 (override `[hidden]` anulado por `display` de autor
requer `display:none !important`); defaults triangulados (activator+sanitize+enqueue) de T010.

**ASSUMPTIONS (com incerteza):**
- [KNOWN] Não existem filtros `wp_mail_from`/`wp_mail_from_name` no plugin — o remetente
  sai com o default WP, quebra SPF/DKIM e pode encurtar a entrega. Justificação: grep global.
- [KNOWN] `.xkaichat-tip { display:flex }` (public/css/xkaichat-chat.css:77) anula `[hidden]`;
  não existe `.xkaichat-tip[hidden]`. O JS já faz `tip.hidden = true` — o bug é 100% CSS.
- [KNOWN] `proxy/proxy.py` `GET /api/health` (:150-158) devolve `{status, mode, model,
  cache_items}` sem contactar o Ollama.
- [KNOWN] O span do estado tem "online" hardcoded e sem `data-role`.
- [KNOWN] O default `terms_text` (activator, enqueue, campo admin) não menciona tratamento
  automatizado, erros nem modelo local.
- [INFERRED] "Mensagem em queue não aparece" = falta feedback visível quando o envio do
  código falha; com `From` correto + mensagem de sucesso/erro no fluxo o sintoma resolve.
  Evidence: `send_code_email` devolve false/WP_Error mas o JS não apresenta mensagem específica.
- [ASSUMED] `admin_email` como remetente é suficiente (sem campo configurável). Impacto se
  falso: utilizador pedirá remetente próprio; mitigado — `admin_email` é o default WP.

**WHAT WASN'T SPECIFIED:** frequência do refresh do estado online (assumo: no load e a cada
abertura do painel); texto exato do estado offline (assumo: "offline" + dot cinza, sem bloquear
o chat).

**ALTERNATIVAS NÃO ESCOLHIDAS:**
- Campo "remetente" no admin — rejeitado: superfície extra; o pedido é alinhar com o admin.
- Health check síncrono no render PHP — rejeitado: latência por page load; AJAX assíncrono.
- Termos mais curtos — rejeitado: o pedido exige os 3 elementos (automatizado, pode errar, local).

**INVITE CONTRADICTION:** Se o SMTP do hosting for o problema (não o From), o envio continua a
falhar mesmo com `admin_email` — mas o feedback visível resolve o sintoma UX e não há como
diagnosticar SMTP do lado do plugin. Disprovação: se os emails já saírem com `admin_email` e
continuarem a falhar, o bug é de infraestrutura, fora de scope.

**CLAIM TYPES:**
- Empírico: tip é bug CSS; health não contacta LLM; falta filtro de From.
- Normativo: From=admin_email; mostrar "offline" quando o LLM está down; conteúdo dos termos.

**RISKS & SIDE EFFECTS:**
- `wp_mail_from` é global ao site — mitigado: `admin_email` é o default recomendado.
- Saúde upstream: +1 request ao Ollama por chamada — timeout curto (1,5s).
- `test_health` existente (asserta `status ok` + `cache_items`) não pode quebrar — adiciono
  `upstream: ok|down` sem remover campos.
- Default de termos: só novas instalações/limpezas — aceitável.

**COST OF BEING WRONG:** MÉDIO — mudanças em ficheiros públicos + proxy, reversíveis, sem
destruição de dados.

**REASONING SKELETON:**
- [Email] Sem From → default WP → SPF/DKIM falham → From=admin_email → maior taxa de entrega.
- [Tip] display:flex anula [hidden] → sem override → `.xkaichat-tip[hidden]{display:none!important}`.
- [Online] health sem LLM → markup hardcoded → upstream no proxy + AJAX + data-role + CSS.

**SCOPE BOUNDARIES:** cobre envio validação (from+feedback), tip, estado online
(proxy→PHP→JS→CSS), termos iniciais. Exclui SMTP hosting, redesign do widget, remetente
configurável.

## Phase 2 — Solution Proposal

**Mudar (12 ficheiros):**
1. `includes/class-xkaichat.php` — métodos `mail_from()` (admin_email) e `mail_from_name()`
   (blog name) registados com `add_filter` no `run()`.
2. `public/partials/xkaichat-chat-widget.php` — `data-role="online"`; `data-role="code-greeting"`.
3. `public/class-xkaichat-public.php` — AJAX `xkaichat_health` (nopriv+priv) que devolve
   `{online, mode, model, upstream}`; novas keys i18n (`online`, `offline`, `code_sent`,
   `mail_failed`); default `terms_text` atualizado.
4. `public/js/xkaichat-chat.js` — `refreshHealth()` chamado no init e em `openPanel()`;
   atualiza texto/classe do indicador; feedback "código enviado" na view de código e erro de
   envio quando `xkc_mail_failed`/falha AJAX.
5. `public/css/xkaichat-chat.css` — `.xkaichat-tip[hidden]{display:none!important}`;
   `.xkaichat-online.xkaichat-offline .xkaichat-dot` (cinza, sem brilho).
6. `proxy/proxy.py` — `health()`: probe `GET {ollama_url}/api/tags` (timeout 1,5s), campo
   `upstream: "ok"|"down"`.
7. `includes/class-xkaichat-activator.php` — default `terms_text` com os 3 elementos.
8. `admin/class-xkaichat-admin.php` — fallback do campo `terms_text` em sincronia.
9. `admin/partials/xkaichat-admin-display.php` — expor `upstream` no diagnóstico; nota de remetente.
10. `tests/php/bootstrap.php` — stub `get_bloginfo`; require `includes/class-xkaichat.php`.
11. `tests/php/run-all.php` — testes `test_mail_sender()` (remetente=admin_email; fallback) e
    default termos com "modelo local"/"tratamento automatizado".
12. `tests/proxy/test_api.py` — `test_health`: aceitar `upstream` in ok/down.

**NÃO mudar:** `class-xkaichat-verification.php` (funciona via filtros), SMTP, redesign.

**Verificação:** `make check` verde; `scripts/verify-implementation.sh T013` passa; manual:
tip some ao abrir; estado offline com proxy/LLM em baixo; email com From=admin.

## Decisões
- Feedback de envio: a view passa para "código" após sucesso (já acontece) e a saudação da
  view de código passa a incluir "Enviamos o código para {email}" (i18n `code_sent`); falha →
  mensagem i18n `mail_failed` em vez de silêncio.
- Estado online: `online = proxy.status=="ok" && upstream=="ok"`; qualquer falha de rede →
  offline.