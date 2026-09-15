# T012-plan — Polimento do widget

## Phase 1 — Hostile Analysis

INSIGHTS CONSULTED: T011 review/learn, T010-build (estrutura do widget), docs/REQUIREMENTS.md (F1.x).

ASSUMPTIONS I'M MAKING:
- [KNOWN] Fluxo email/telefone → código → chat já implementado e verificado (T010; `class-xkaichat-verification.php:105-212` → `wp_mail`; `setView('code')`). Sem alterações ao backend.
- [KNOWN] Chat fechado por omissão atualmente (`panel[hidden]`), só FAB + tooltip.
- [INFERRED] "incrementar o tamanho" = maximize toggle (painel maior), não resize com drag — evidência: painel `position: fixed`; drag adicionaria complexidade frágil em mobile.
- [ASSUMED] `widget_auto_open` default 0 (não intrusivo) — lê das opções; se ligado, painel abre no boot.
- [ASSUMED] Escrita simulada = bolha no histórico com dots animados + label (i18n `thinking` "A escrever…").

WHAT WASN'T SPECIFIED:
- Persistência do estado maximize → não persistir (excluído; paragem ao pedido mínimo).
- Texto exato do typing → reutilizar i18n `thinking` já existente (era definido no backend mas nunca renderizado — bug de UI detetado).

ALTERNATIVES I DIDN'T CHOOSE:
- Resize com drag/handles — rejeitado: custo alto, frágil em mobile, fora do escopo.
- Auto-open por sessão persistido — rejeitado: comportamento literal "abre por omissão" é por página; o utilizador fecha.

INVITE CONTRADICTION:
- A bolha typing reutiliza a classe `.xkaichat-bubble` (estilo do agente) — risco de ser colhida por `persistTranscript` e persistida como mensagem falsa. Confirmado e mitigado (exclusão no persist).
- `restoreTranscript` limpa o body com `innerHTML=''` e reconstrói — a bolha typing seria destacada do DOM; mitigado (re-anexa no restore e no `setThinking(true)` via appendChild ao fim).

RISKS & SIDE EFFECTS:
- Auto-open + tooltip simultâneos → tooltip suprimida quando auto_open (openPanel → dismissTip).
- Maximize em mobile (painel já 100% width) → só incrementa altura (94vh).
- Label typing em `textContent` (sem HTML → sem XSS).
- Bug pré-existente detetado: `persistTranscript` persistia a bolha de saudação → duplicação no restore. Corrigido de passagem (exclusão de greetingBubble), necessário também para a integridade das ACs 4.

COST OF BEING WRONG: MÉDIO — frontend, revertível, sem impacto a dados/backend.

## Phase 2 — Solution Proposal

**Mudanças:**
1. `includes/class-xkaichat-activator.php` — default `widget_auto_open => 0`.
2. `admin/class-xkaichat-admin.php` — campo `widget_auto_open` (checkbox, sanitize `empty()?0:1`); relabel "URL do logótipo (FAB)" → "URL do logótipo".
3. `public/class-xkaichat-public.php` — default + `auto_open` (int) no `wp_localize_script`.
4. `public/partials/xkaichat-chat-widget.php` — header com logo `<img>` (esq. do título) + botão maximize (SVG expand/collapse); bolha typing movida para dentro do `.xkaichat-body` com 3 dots + label `data-role="thinking-text"`; removido o antigo bloco `.xkaichat-thinking` fora do chat.
5. `public/css/xkaichat-chat.css` — header-left/logo/btns; `.xkaichat-maximized` (520px × 82vh; mobile 94vh); bolha typing (dots animados via `xkaichat-pulse` com delays).
6. `public/js/xkaichat-chat.js` — `openPanel()/closePanel()`; maximize toggle com `aria-pressed`; `setThinking` move bolha para o fim + scroll; `restoreTranscript` re-anexa bolha; `persistTranscript` exclui bolha typing e greeting (fix pré-existente); boot: `if (Number(cfg.auto_open)===1) openPanel()`.
7. `tests/php/run-all.php` — +3 asserts (68 total): default `widget_auto_open` no activator; sanitize aceita 1; sanitize default 0.
8. Docs — REQUIREMENTS (F1.2 auto-open; F1.5 maximize; F1.6 logo+typing), VISION (fluxo), ROADMAP (T012 in-progress).

**NÃO muda:** verificação/email (`class-xkaichat-verification.php`), proxy, cache, RAG, nonces, AJAX endpoints, persistência de mensagens, admin partials.

**Verificação:** `make lint`, `make test-php` (68 asserts), `make check` completo (24 pytest + lint + docs + gate pre-commit), `node --check` no JS.