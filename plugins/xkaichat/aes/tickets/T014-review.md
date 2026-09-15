# T014 — Review Output

## Verdict: APPROVE

### Correctness ✅
- Broker valida HMAC via `compare_digest` (constant-time) — previne timing attacks
- Rate limit por IP no Broker protege Ollama independentemente do Proxy
- Modelo forçado no Broker (`config.ollama_model`) ignora `model` do request — previne model confusion
- Proxy backward-compatible: sem `BROKER_URL` usa Ollama direto; com `BROKER_URL` usa Broker
- Fallback gateway mantido no Proxy (se Broker falha → gateway)

### Simplicity ✅
- Broker ~150 linhas, single responsibility (auth + forward)
- Reutiliza padrões do Proxy: FastAPI, httpx, Pydantic, HMAC, rate limit em memória
- Zero abstrações especulativas; código direto e legível

### Maintainability ✅
- Config via `.env` (não versionado); `.env.example` documentado
- Testes cobrem: auth válida/inválida, rate limit, health, chat mockado, modelo forçado
- Logs de erro claros (`broker_key_invalida`, `rate_limit_atingido`, `ollama_indisponivel`)

### Security ✅
- HMAC `compare_digest` — constant-time comparison
- Rate limit por IP no Broker (defesa em profundidade)
- `BROKER_KEY` separada de `PROXY_KEY` — compromisso de um não afeta o outro
- Modelo fixo no Broker — request não escolhe modelo
- `/api/health` sem auth (baixo risco: só expõe status/modelo)

### Performance ✅
- Overhead: 1 hop localhost (~1-5ms)
- Rate limit em memória O(1) por request
- Sem BD, sem serialização extra

## Conditions (None)

## Backlog Items Created
- [ ] Rate limit distribuído (Redis) para multi-instância Broker
- [ ] Métricas Prometheus no Broker (requests, latency, errors)
- [ ] Rotação automática de `BROKER_KEY` / `PROXY_KEY`
- [ ] Suporte streaming (`stream: true`) se Proxy migrar
- [ ] mTLS entre Proxy e Broker para redes não isoladas

## Hostile Insights Registry (docs/HOSTILE_INSIGHTS.md)
> **Security — Defense in Depth** (T014)
> - **Task**: Broker HMAC à frente do Ollama
> - **Insight**: Separar auth (Broker) de lógica de negócio (Proxy/RAG) permite proteger Ollama mesmo se Proxy for comprometido. Duas chaves distintas (`PROXY_KEY` para WordPress→Proxy, `BROKER_KEY` para Proxy→Broker) limitam blast radius.
> - **Origin**: Hostile analysis — "what if Proxy is compromised?"
> - **Impact**: Arquitetura v1 usa HMAC partilhada em ambas camadas; futuro pode diferenciar (mTLS no Broker, JWT no Proxy).
> - **Applied To**: T014 implementação; docs/REQUIREMENTS.md NF-Security atualizado.
> - **Date**: 2026-09-15