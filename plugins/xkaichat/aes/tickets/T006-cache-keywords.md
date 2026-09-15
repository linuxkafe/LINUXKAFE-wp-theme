---
ticket: T006
title: Cache por palavras-chave + armazenamento de respostas
sprint: sprint-01
priority: high
status: pending
created: 2026-09-12
---

# T006 — Cache de respostas por palavras-chave

## Context
Minimizar uso do LLM: cada resposta gerada é armazenada com as suas palavras-chave. Uma nova pergunta com keywords sobrepostas (score ≥ limiar) serve a resposta em cache sem tocar no LLM. Nunca cachear respostas com avisos de falha/manutenção.

## Acceptance Criteria
- [ ] `proxy/cache.py` existe
- [ ] `proxy/cache.py` extrai palavras-chave (removendo stopwords PT)
- [ ] `proxy/cache.py` calcula overlap Jaccard entre keywords da pergunta e resposta
- [ ] `proxy/cache.py` contém lista de keywords proibidas para cache (manutenção, indisponível, falha, etc.)
- [ ] `proxy/cache.py` persist em disco (JSON/SQLite) com TTL
- [ ] `proxy/proxy.py` consulta cache antes de chamar o LLM
- [ ] `proxy/proxy.py` guarda resposta na cache após gerar (respeitando keywords proibidas)
- [ ] Testes pytest da cache passam: `make test-proxy` [command "exits 0"]

## Scope
**In:** extração de keywords PT, Jaccard, TTL, persistência, integração no proxy.
**Out:** armazenamento WP por chat/por resposta é responsabilidade do plugin (T008).

## Dependencies
T004, T005.

## Rollback
Remover ficheiro de cache; proxy responde sempre via LLM.

## Known Risks
- Falso positivo: duas perguntas com keywords comuns mas intenção diferente. Mitigação: limiar configurável + exigir ≥N keywords.