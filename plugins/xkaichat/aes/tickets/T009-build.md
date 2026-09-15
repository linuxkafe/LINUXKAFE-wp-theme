# T009-build — Diffstory (implementação T002–T008)

## O que mudou e porquê

- **Bootstrap** (`xkaichat.php`): passou a registar `register_activation_hook`/`register_deactivation_hook` e a carregar activator/deactivator. Antes o plugin não tinha ganchos de instalação — a AC de T002 exigia `uninstall.php` na raiz e activação real.
- **Núcleo** (`includes/class-xkaichat.php`): registou i18n, admin, public e require dos módulos.
- **Verificação/sessões** (T003): `includes/class-xkaichat-verification.php` (códigos TTL 10 min, 5 tentativas, rate-limit IP 3/10 min, cooldown email 60 s, tokens por sessão) + `class-xkaichat-messages.php` (store por tranche de horas) — sem dependências do WP runtime nos runners de teste.
- **Proxy** (T004–T006): `proxy/proxy.py` (FastAPI: `/api/health`, `/api/chat`, `/api/cache/clear`, `/api/rag/reindex`), `rag.py` (FAQMatcher + BM25 + chunk), `cache.py` (SQLite WAL + Jaccard + no-cache), `config.py` (env-driven, `LLM_TIMEOUT` 150 s). Decisão de rota e persona PT-PT na resposta (factos oficiais do RAG apenas).
- **Widget** (T007): `public/` — partial + CSS + JS (máquina de estados email→código→chat, `sessionStorage`, erros mapeados), estética verde/branco.
- **Admin/resumo** (T008): settings page + ações AJAX (clear cache / reindex RAG) + `class-xkaichat-summary.php` (email de resumo pós-conversa).
- **Testes**: `tests/php/` (stubs WP, 55 asserts), `tests/proxy/` (24 unit + 4 e2e), `pytest.ini`, `docs/QA.md` (E2E real com qwen3:8b — regenerado por `make qa`).
- **README.md** raiz com instalação e configuração do proxy.

## Porque estes ficheiros

Cada módulo é uma unidade com teste correspondente; o proxy é auto-suficiente (não depende do plugin) e o plugin apenas chama `/api/chat` via HTTP.

## O que foi intencionalmente NÃO tocado

- `Makefile` targets existentes (`check`, `qa`, `doctor`) — apenas adicionados `run-proxy` e filtro `-m 'not e2e'` no `test-proxy`.
- `docs/VISION.md`, `docs/REQUIREMENTS.md`, `docs/ROADMAP.md`, `docs/QUALITY_GATES.md`, `docs/CHECKLIST.md`, `docs/PERSONAS.md` — verificados ainda coerentes (docs-check verde).
- `aes/` fora das tickets/kanban/retrospective — mecânica confirmada sem alterações.
- Nenhuma dependência PHP externa (sem Composer) e nenhuma dependência Python além de `requirements.txt`.

## Riscos restantes

- **Ollama em CPU-only é lento** (~105 s/pedido com qwen3:8b). Mitigado por timeouts (proxy 150 s, PHP 180 s) e warm-up no harness E2E; ainda assim, a conversa em produção pode demorar.
- **Soberania do poder de preços**: o proxy depende do PDF `tabela-precos-2026.pdf` + `knowledge_base.json` para respostas com factos; sem eles cai para resposta "sem fonte" (não é cacheada).
- **Gateway fallback** desligado por omissão (sem chave) — comportamento é seguro por omissão mas o failover não foi exercitado em E2E.