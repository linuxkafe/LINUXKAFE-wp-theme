---
ticket: T004
title: Serviço proxy Python (Ollama router/directo, failover, carga)
sprint: sprint-01
priority: high
status: pending
created: 2026-09-12
---

# T004 — Proxy intermediário para o LLM

## Context
O plugin WordPress comunica com um proxy Python (referência: `linuxkafe/otobo/llm/chat-proxy/chat_proxy.py`). O proxy pode ligar-se ao LLM via router/gateway OpenAI-compatível (rota primária) ou diretamente ao Ollama (rota de failover). Decisão por carga do sistema e disponibilidade.

## Acceptance Criteria
- [ ] `proxy/proxy.py` existe
- [ ] `proxy/proxy.py` contém o endpoint `/api/chat`
- [ ] `proxy/proxy.py` contém o endpoint `/api/health`
- [ ] `proxy/proxy.py` implementa failover: router → Ollama direto quando indisponível
- [ ] `proxy/proxy.py` suporta streaming de resposta
- [ ] `proxy/proxy.py` usa `httpx` ou `urllib` para chamadas HTTP
- [ ] `proxy/proxy.py` contém proteção anti prompt-injection com tags `#<chat_input>`
- [ ] `proxy/requirements.txt` existe
- [ ] `proxy/.env.example` existe com chaves de configuração
- [ ] `proxy/README.md` existe com instruções de execução e systemd
- [ ] Testes pytest que cobrem a decisão de rota passam: `make test-proxy` [command "exits 0"]

## Scope
**In:** servidor FastAPI, rotas, decisão router/directo, health, sanitização de inputs.
**Out:** RAG (T005), cache (T006), widget (T007).

## Dependencies
T002 (integração later), nenhum.

## Rollback
Desativar serviço proxy; plugin fica com endpoint configurado para outro.

## Known Risks
- Latência em modo streaming — mitigado com stream e timeout longo.
- Ollama direto não suporta chat completions OpenAI-style — usar `/api/chat` nativo.