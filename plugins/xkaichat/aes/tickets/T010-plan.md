# T010-plan — Onboarding conduzido do widget

## Phase 1 — Hostile Analysis

INSIGHTS CONSULTED: T009-learn (ACs verificáveis; warm-up; gate `make.*target`), T009-build (estrutura do widget).

ASSUMPTIONS I'M MAKING:
- [KNOWN] O widget abre no passo email diretamente (`setView('email')` no boot, sem consentimento) — `public/js/xkaichat-chat.js:330-334`.
- [KNOWN] `widget_greeting` é usado no intro do email E na bolha inicial do chat — `class-xkaichat-public.php:154-156` e `xkaichat-chat.js:46-49,156-158`.
- [INFERRED] "logo do website" → custom logo do tema (`get_theme_mod('custom_logo')`); se não existir, uma URL configurável; senão cai no ícone de chat. Premissa → inferência: WordPress expõe `custom_logo` via theme mod; o site usa um tema WP com logo (não confirmado em runtime).
- [ASSUMED] Consentimento por sessão (sessionStorage), não persistente — espelha o âmbito do token de chat. Impacto se falso: exigência jurídica de consentimento persistente ficaria fora do escopo; é assumido como aceite o pedido "voluntário" do negócio.
- [ASSUMED] O texto da tooltip = `widget_heading` (configurável). Impacto se falso: é um prompt genérico, aceitável.

WHAT WASN'T SPECIFIED:
- Origem do logo (tema vs URL) → decidido: URL configurável primeiro, custom logo do tema a seguir, ícone como fallback final.
- Reaparição da tooltip por página → por sessão de separador; some no primeiro clique/FAB.
- Texto dos termos: não fornecido → default "store-friendly" em PT-PT, editável.

ALTERNATIVES I DIDN'T CHOOSE:
- Modal de consentimento separado antes do panel — rejeitado: complexidade extra; um passo dentro do wizard é coerente com o design atual.
- localStorage persistente para termos — rejeitado nesta sprint (ver Risks): consentimento persistente requeríа cookie-consent + política, fora do escopo; anotado em ROADMAP.
- USAR sempre `widget_greeting` como mensagem inicial do chat — rejeitado: o negócio pede mensagem inicial distinta e configurável; adiciona-se `widget_initial_message`.

WHAT COULD BE WRONG IN THIS ANALYSIS:
- Se o tema não tiver `custom_logo` e o admin não configurar URL, o FAB mostra o ícone — provável mas aceite (graceful).
- `get_theme_mod` sem stub em testes: a função `logo_url()` é pouco testável no runner sem estub; mitigar testando `sanitize_settings` (campos) e deixando `logo_url()` validada por review + código simples.

RISKS & SIDE EFFECTS:
- XSS por `terms_text` → renderizado via `textContent`, sanitizado no save (`sanitize_textarea_field`), sem HTML permitido.
- Quebra de fluxos antigos (sessionStorage token) → entrada direta no chat continua válida; flag de termos apenas apié quando não há token.
- Acessibilidade: tooltip com `aria-hidden` controlado; FAB mantém `aria-label`.

COST OF BEING WRONG: MÉDIO — UX/frontend revertível sem impacto ao backend; consentimento é requisito legal leve (solicitado pelo negócio, opcional por default em settings? não — ativo por default).

## Phase 2 — Solution Proposal

**Mudanças:**
1. `includes/class-xkaichat-activator.php` — defaults de `widget_logo_url`, `terms_text`, `widget_initial_message`.
2. `admin/class-xkaichat-admin.php` — registar campos + renderers + sanitização dos 3 novos campos.
3. `public/class-xkaichat-public.php` — defaults no `wp_parse_args`; resolver logo (`widget_logo_url` → custom_logo → ''); localizar `terms_text`, `tooltip`, `initial_message`, `logo`; método `logo_url()`.
4. `public/partials/xkaichat-chat-widget.php` — `<img>` do logo (condicional), tooltip com close, secção `view-terms` com botão aceitar; `$logo_url` passada por `render_widget`.
5. `public/css/xkaichat-chat.css` — tooltip, animação de atenção do FAB, view de termos, logo.
6. `public/js/xkaichat-chat.js` — estado inicial 'terms' (quando sem token e sem aceitação); aceitar→email; mensagem inicial do chat configurável; dismiss de tooltip.
7. `tests/php/bootstrap.php` — stub `sanitize_hex_color`.
8. `tests/php/run-all.php` — testes de `sanitize_settings` (novos campos) e de `logo_url()`.
9. Docs: `docs/REQUIREMENTS.md` (F1.x consentimento), `docs/VISION.md` (fluxo + consentimento), `docs/ROADMAP.md` (T010 done + backlog de consentimento persistente).

**NÃO muda:** verificação (PHP), proxy, RAG, cache, admin fingerprint, nonces.

**Verificação:** `make lint`, `make test-php` (novos asserts), `make check`; gates de AC do T010; sem E2E de browser (sem harness).