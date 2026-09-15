# T014 — Plan Output

## Insights Consultados
- SD-CODE-PROXY (proxy/proxy.py:68-72) — padrão HMAC atual `_check_proxy_key`
- SD-CODE-PROXY (proxy/proxy.py:94-101) — rate limiting em memória `_rate_limit`
- SD-CODE-PROXY (proxy/proxy.py:123-150) — chamadas `_llm_ollama` e `_llm_gateway`
- SD-CONFIG (proxy/config.py:22-48) — estrutura `ProxyConfig` com chaves partilhadas
- SD-ARCH (docs/VISION.md:9-12) — arquitetura 3 camadas
- SD-REQ (docs/REQUIREMENTS.md:47-51) — NF-Security, NF-Soberania

## Assumptions I'm Making

| Tipo | Assumption | Justification / Impact if False |
|------|------------|--------------------------------|
| [KNOWN] | Proxy já usa HMAC `X-Xkai-Proxy-Key` para autenticar chamadas do WordPress | Código em `proxy.py:68-72` — padrão estabelecido |
| [KNOWN] | Ollama expõe `/api/chat` e `/api/tags` sem auth | Comportamento padrão do Ollama |
| [INFERRED] | Broker deve ser stateless (sem BD, só memória para rate limit) | Segue padrão do Proxy (`_rate` dict em memória) |
| [INFERRED] | Proxy chamará Broker via HTTP (mesmo padrão que usa para Ollama) | `httpx.Client` já usado em `_llm_ollama` |
| [ASSUMED] | `BROKER_KEY` partilhada entre Proxy e Broker via `.env` | Consistente com `PROXY_KEY` atual |
| [ASSUMED] | Falha do Broker → Proxy faz fallback ao gateway (já existe) | `proxy.py:160-166` trata exceção de Ollama e tenta gateway |
| [UNKNOWN] | Se Broker deve suportar streaming (`stream: true`) | Ollama suporta; Proxy hoje usa `stream: false` — manter simples |

## What Wasn't Specified (That Matters)
- **Streaming**: Proxy hoje não usa streaming; Broker pode omitir por ora
- **Métricas/Observabilidade**: Prometheus metrics? Logs estruturados? (omitir v1)
- **Timeouts**: Broker deve ter timeout próprio + propagar timeout do Proxy?
- **Model selection**: Broker fixa `OLLAMA_MODEL` ou aceita override por request? (fixo v1)

## Alternatives I Didn't Choose

| Option | Rejected Because |
|--------|------------------|
| mTLS entre Proxy e Broker | Overhead operacional (certificados); HMAC partilhada já funciona |
| JWT assinado pelo Proxy | Complexidade de chaves/rotação; HMAC `compare_digest` é constante-time e simples |
| Broker em Go/Rust | Consistência: projeto usa Python no Proxy; manter stack único |
| Broker no mesmo processo do Proxy | Viola separação de responsabilidades; Broker protege Ollama independentemente |

## Invite Contradiction
- **O Broker adiciona latência** — se >50ms perceptível, rever. Métrica: `make qa` mede E2E.
- **Rate limit em memória não escala multi-instância** — aceitável v1 (single replica); futuro: Redis.
- **Se `BROKER_KEY` vazar, atacante acede ao Ollama via Broker** — mitigação: rotação periódica, rede isolada.

## Distinguish Claim Types
- **Empírico**: "HMAC `compare_digest` previne timing attacks" — verificável (std lib)
- **Empírico**: "Rate limit em memória funciona para single replica" — testável
- **Normativo**: "Broker deve ser Python/FastAPI" — decisão de consistência de stack
- **Normativo**: "Não implementar streaming v1" — tradeoff simplicidade vs. feature

## Reasoning Skeleton
1. **Premissa**: Ollama sem auth é risco (NF-Security, NF-Soberania)
2. **Premissa**: Proxy já tem padrão HMAC estabelecido e testado
3. **Inferência**: Reutilizar padrão HMAC no Broker minimiza superfície de bug
4. **Conclusão**: Broker valida `X-Xkai-Proxy-Key` → encaminha para Ollama → devolve resposta

## Scope Boundaries
**In bounds**: Broker service, Proxy config update, testes, docs.
**Out of bounds**: WordPress plugin changes, mTLS/JWT, streaming, métricas, multi-replica rate limit.

## Verification Criteria
- `make test-proxy` passa (inclui novos testes `tests/broker/`)
- `make test` passa (PHP + proxy)
- `make check` passa (lint + test + test-aes + docs-check)
- `make qa` passa (E2E com Ollama local via Broker)
- `curl -H "X-Xkai-Proxy-Key: errada" $BROKER_URL/api/chat` → 401
- `curl $BROKER_URL/api/tags` → 200 com modelos