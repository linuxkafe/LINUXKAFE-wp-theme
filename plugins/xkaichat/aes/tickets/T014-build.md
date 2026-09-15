# T014 — Build Output (Diffstory)

## What Changed

### New Files
- `broker/__init__.py` — package marker
- `broker/config.py` — configuração do Broker (BROKER_URL, BROKER_KEY, OLLAMA_URL, rate limits)
- `broker/broker.py` — serviço FastAPI com endpoints `/api/tags`, `/api/chat`, `/api/health`
- `broker/requirements.txt` — dependências (fastapi, uvicorn, httpx, pydantic, python-dotenv)
- `broker/.env.example` — template de configuração
- `tests/broker/test_broker.py` — 8 testes unitários (auth, rate limit, encaminhamento, modelo forçado)
- `aes/tickets/T014-broker-autenticacao-ollama.md` — ticket AES
- `aes/tickets/T014-plan.md` — plan output (hostile analysis)

### Modified Files
- `proxy/config.py` — adicionado `broker_url` e `broker_key`
- `proxy/proxy.py` — `_llm_ollama` agora chama Broker se `broker_url` configurado; `_upstream_online` verifica Broker; `health` reflete modo "broker"
- `Makefile` — adicionado `test-broker`, `run-broker`, setup instala `broker/requirements.txt`, clean limpa `broker/__pycache__`
- `CLAUDE.md` — documentado broker, comandos, estrutura crítica
- `docs/REQUIREMENTS.md` — adicionado NF-Security para Broker HMAC
- `docs/ROADMAP.md` — adicionado T014 como done
- `aes/kanban.md` — T014 marked done, current_ticket limpo

## Why These Files

- **Broker isolado**: separa responsabilidade de auth do Proxy (que faz RAG/cache) — segue single responsibility
- **HMAC partilhada**: reutiliza padrão existente (`X-Xkai-Proxy-Key` com `compare_digest`) — minimiza superfície de bug
- **Proxy backward-compatible**: se `BROKER_URL` vazio, cai para Ollama direto (zero breaking change)
- **Rate limit no Broker**: protege Ollama de abusos mesmo se Proxy comprometido
- **Modelo forçado no Broker**: ignora `model` do request — previne model confusion attacks

## What Was Intentionally Untouched

- **WordPress Plugin** — continua a falar só com Proxy; zero mudanças PHP
- **RAG/Cache no Proxy** — continuam iguais; Broker só faz auth + encaminhamento
- **Gateway fallback** — mantido no Proxy (se Broker falha, Proxy tenta gateway)
- **Streaming** — não implementado (Proxy usa `stream: false`; Broker respeita)
- **mTLS/JWT** — fora de escopo v1 (HMAC partilhada suficiente para rede isolada)

## Remaining Risks

1. **Latência extra** — 1 hop rede (Proxy→Broker→Ollama). Mitigação: ambos localhost, overhead ~1-5ms.
2. **Rate limit em memória** — não escala multi-instância. Aceitável v1 (single replica); futuro: Redis.
3. **Segredo partilhado** — `BROKER_KEY` em `.env` de ambos. Mitigação: rotação periódica, rede isolada, não versionado.
4. **Health do Broker** — `/api/health` sem auth (para monitorização). Baixo risco (só expõe status/modelo).
5. **Testes E2E** — `make qa` requer Ollama + Broker + Proxy a correr. Documentar no README se necessário.