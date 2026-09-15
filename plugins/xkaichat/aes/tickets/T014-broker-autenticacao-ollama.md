---
ticket: T014
title: Broker de autenticação à frente do Ollama (HMAC partilhada com Proxy)
sprint: sprint-01
priority: alto
status: in-progress
created: 2026-09-15
---

# T014 — Broker de autenticação à frente do Ollama

## Contexto
O Ollama expõe a API sem autenticação por omissão. Para reforçar a soberania e segurança (NF-Security, NF-Soberania), adiciona-se um **Broker** intermediário entre o Proxy Python e o Ollama. O Broker valida a identidade do Proxy via HMAC partilhada (padrão atual `X-Xkai-Proxy-Key`) antes de encaminhar pedidos ao Ollama.

Arquitetura alvo:
```
WordPress Plugin (PHP) → Proxy Python/FastAPI → Broker (HMAC) → Ollama
```

## Critérios de Aceitação
- [ ] Broker expõe `/api/chat` e `/api/tags` (health) compatíveis com a API do Ollama
- [ ] Broker valida header `X-Xkai-Proxy-Key` via HMAC `compare_digest` contra `BROKER_KEY` partilhada
- [ ] Proxy atualizado para chamar Broker em vez de Ollama direto (config `BROKER_URL`)
- [ ] Fallback: se Broker indisponível, Proxy cai para gateway OpenAI-compatível (comportamento atual mantido)
- [ ] Rate limiting por IP no Broker (igual ao Proxy: `RATE_LIMIT_PER_IP`, `RATE_WINDOW_SECONDS`)
- [ ] Testes unitários: auth válida, auth inválida, rate limit, health, chat mockado
- [ ] `make check` passa (lint, testes, docs-check)
- [ ] Documentação atualizada: CLAUDE.md, docs/REQUIREMENTS.md, docs/ROADMAP.md

## Escopo
**In scope:**
- Novo serviço Broker (Python/FastAPI) em `broker/`
- Configuração via `.env` (`BROKER_URL`, `BROKER_KEY`, `OLLAMA_URL`, `OLLAMA_MODEL`, rate limits)
- Atualização do Proxy para usar `BROKER_URL` em vez de `OLLAMA_URL` direto
- Testes pytest em `tests/broker/`

**Out of scope:**
- mTLS, JWT/OIDC (futuro)
- Proxy autenticar-se no Broker via certificado
- Mudanças no WordPress Plugin (usa Proxy como antes)

## Dependências
- Proxy Python existente (`proxy/`) — será modificado para apontar ao Broker
- Ollama local a correr em `OLLAMA_URL`

## Rollback
- Reverter `proxy/config.py` para usar `OLLAMA_URL` direto
- Remover diretório `broker/`
- `make check` deve passar sem o Broker

## Riscos Conhecidos
- Latência extra de 1 hop de rede (Proxy → Broker → Ollama)
- Ponto único de falha: se Broker cai, Proxy deve fazer fallback ao gateway (já implementado)
- Gestão de segredos: `BROKER_KEY` partilhada entre Proxy e Broker (usar `.env` não versionado)

## Notas
- Seguir padrões do `proxy/`: FastAPI, httpx, Pydantic, logging estruturado
- Manter compatibilidade com contrato Ollama `/api/chat` e `/api/tags`
- Não quebrar `make qa` (E2E contra Ollama local)