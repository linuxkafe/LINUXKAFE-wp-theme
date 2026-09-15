---
ticket: T013
phase: build
status: done
created: 2026-09-14
---

# T013 — Build

## Diffstory

**O que mudou (12 ficheiros de código + 4 docs/testes):**

### `includes/class-xkaichat.php`
Adicionados métodos `mail_from()` e `mail_from_name()` que retornam
`get_option('admin_email')` e `get_bloginfo('name')` respetivamente;
registados via `add_filter('wp_mail_from')` e `add_filter('wp_mail_from_name')`
no `run()`. O email de validação e de resumo saem agora com o email e nome
do site — fixa o problema de SPF/DKIM que podia impedir a chegada dos emails.

### `proxy/proxy.py`
Nova função `_upstream_online()` — probe HTTP GET ao endpoint `/api/tags`
do Ollama (ou `/models` do gateway) com timeout de 1,5s. Não levanta
exceções: qualquer falha de rede → `"down"`. A função é chamada dentro
de `health()` e o resultado é exposto no campo `upstream`.

### `public/class-xkaichat-public.php`
- Novas 4 keys i18n: `online`, `offline`, `code_sent`, `mail_failed`.
- Default `terms_text` atualizado com "tratamento automatizado", "modelo local",
  "pode cometer erros".
- Nova AJAX action `xkaichat_health` (nopriv+priv) → devolve `{online, upstream,
  mode, model}`.
- Novo método `is_online($health)` — lógica pura extraída para teste unitário.

### `public/partials/xkaichat-chat-widget.php`
- `data-role="online"` no `<span class="xkaichat-online">` para atualização JS.
- `data-role="code-greeting"` na saudação da view de código para feedback.

### `public/css/xkaichat-chat.css`
- `.xkaichat-tip[hidden] { display: none !important; }` — fixa o bug do tip que
  não desaparece (display:flex do seletor base anulava [hidden]).
- `.xkaichat-online.xkaichat-offline` — cor cinza, sem animação pulse, no dot
  quando o estado é offline.

### `public/js/xkaichat-chat.js`
- Nova função `refreshHealth()` — chamada no init e em `openPanel()`.
  Atualiza texto e classe do indicador.
- No submit do email: sucesso define `codeGreeting.textContent` com `I.code_sent`
  ("Enviamos o código…"); caso contrário mostra `I.mail_failed`.
- No `mapErr`: novo case `xkc_mail_failed` com a mensagem dedicada.

### `includes/class-xkaichat-activator.php` + `admin/class-xkaichat-admin.php`
Default `terms_text` sincronizado nos 3 pontos (activator, enqueue_assets,
campo admin) — novo texto com tratamento automatizado, modelo local,
pode cometer erros, telefone para confirmação.

### `admin/partials/xkaichat-admin-display.php`
Diagnóstico inclui campo `upstream`. Nota sobre o remetente (admin_email)
visível na página de settings.

### Testes (4 ficheiros)
- `tests/php/bootstrap.php`: stubs `get_bloginfo`, constante `XKAICHAT_VERSION`,
  require `includes/class-xkaichat.php`.
- `tests/php/run-all.php`: `test_mail_sender()` (4 asserts: remetente ok/fallback,
  nome ok/fallback), `test_public_health()` (4 asserts: online, offline, WP_Error,
  sem upstream). Extensão do `test_activator` com "tratamento automatizado" e
  "modelo local". Proxy health mock inclui campo `upstream`. `reset_state()`
  limpa `xkc_bloginfo`.
- `tests/proxy/test_api.py`: `test_health` aceita `upstream` in ("ok","down").

### Docs
- `docs/REQUIREMENTS.md`: F1.3 atualizado (termos mencionam automatizado/local),
  F1.7 novo (indicador reflete LLM), F2.1 atualizado (remetente=admin_email).
- `docs/ROADMAP.md`: T013 adicionado como done.

## O que NÃO foi tocado
- Fluxo de verificação (class-xkaichat-verification.php) — funciona via filtros.
- Fluxo de resumo (class-xkaichat-summary.php) — funciona via filtros.
- Proxy: chat, RAG, cache — sem mudança.
- Persistência (tabelas, opções) — sem mudança.

## Riscos residuais
- `wp_mail_from` é global — usando `admin_email`, o default recomendado do WP.
- Health check upstream: +1 request HTTP ao Ollama por abertura do painel; timeout
  curto (1,5s) limita impacto; o resultado é usado apenas para indicator visual.
