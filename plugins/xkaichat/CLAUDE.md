# CLAUDE.md — Contrato Operacional do XKaiChat

## Identidade
Plugin WordPress **XKaiChat**: assistente IA (Ollama + RAG) para o Capuchinho Verde. Plugin PHP + proxy Python intermédio + broker de autenticação Ollama.

## Comandos essenciais
- `make check` — gates completos (lint PHP, testes PHP, pytest, test-aes, docs-check)
- `make test` — testes PHP + pytest (proxy + broker)
- `make test-php` — runner de testes PHP (sem deps WP)
- `make test-proxy` — pytest do proxy
- `make test-broker` — pytest do broker
- `make test-aes` — smoke test do gate pre-commit (fecho de tickets)
- `make lint` — php -l em todos os .php
- `make setup` — venv + deps do proxy + broker
- `make run-proxy` — arranca proxy (porta 5001)
- `make run-broker` — arranca broker (porta 5002)
- `make qa` — E2E contra Ollama local (regenera docs/QA.md)
- `make doctor` — verifica ambiente (php, python, ollama)

## Estrutura crítica
- `xkaichat.php` — bootstrap do plugin (não mexer sem T002).
- `includes/class-xkaichat.php` — loader central.
- `proxy/proxy.py` — serviço intermediário (FastAPI), chama Broker ou Ollama direto.
- `proxy/rag.py` — motor RAG (PDF + FAQ).
- `proxy/cache.py` — cache por palavras-chave.
- `proxy/knowledge_base.json` — FAQ do Capuchinho Verde (editar com cuidado; é a fonte de verdade dos factos).
- `broker/broker.py` — camada de auth HMAC à frente do Ollama (valida `X-Xkai-Proxy-Key`).
- `broker/config.py` — configuração do Broker (`BROKER_URL`, `BROKER_KEY`, `OLLAMA_URL`).
- `aes/kanban.md` — sempre atualizar `current_ticket`.

## Fonte de verdade do negócio
- Menu/preços: `https://www.capuchinhoverde.com/tabela-de-precos/` (PDF tabela-precos-2026).
- Contacto: `912423483`, Praceta Francisco Borges, Porto.
- Estética: verde sobre branco (`--xkc-brand: #5a8a4b`).

## Never-do
- Não adicionar API keys/segredos a ficheiros versionados (usar `.env.example`).
- Não enviar dados de clientes a APIs externas (soberania local, Ollama).
- Não inventar preços fora do RAG (PDF/FAQ).
- Não ecoar HTML sem escaping WordPress (`esc_html_e`/`wp_kses`).
- Não usar emojis em código de frontend (SVG/texto).
- Não passar por cima de um gate AES sem registar bypass em `aes/metrics/bypass.log`.

## Processo de commit (gate AES)
- O pre-commit hook verifica o `current_ticket`. Não aplico `make check`+fecho antes de o commit do fecho correr com o gate.
- O commit que fecha o último ticket pode (e deve) correr com `current_ticket: none` no working tree — o hook (T011) deteta a transição no diff staged e verifica o ticket fechado na mesma.
- Fecho sem verificação é gap de integridade: confirmar sempre o `make check` antes de marcar um ticket como done.

## Evidência requerida
- "Está feito" = gates de T009 passaram (lint, testes, review, learn) + diffstory.
- Mudanças de comportamento exigem atualização de VISION/REQUIREMENTS/ROADMAP.