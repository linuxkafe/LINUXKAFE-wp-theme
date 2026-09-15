# T014 — Learn Output

## Feynman Explanation

### Para uma criança (5 anos)
> "Imagina que o Ollama é um cofre com respostas. O **Proxy** é o porteiro que sabe falar com clientes e procura nos papéis (RAG) antes de perguntar ao cofre. O **Broker** é um **segundo porteiro** à porta do cofre: só deixa entrar quem tiver a **chave secreta** (HMAC). Se alguém tentar entrar sem chave, o Broker diz 'não'. Assim, mesmo se o primeiro porteiro (Proxy) for enganado, o cofre (Ollama) continua seguro."

### Para um especialista
> **Arquitetura**: Adicionamos uma camada de autenticação (Broker) entre o Proxy (RAG/cache) e o Ollama (LLM). O Broker expõe API compatível com Ollama (`/api/chat`, `/api/tags`) mas valida HMAC `X-Xkai-Proxy-Key` via `hmac.compare_digest` (constant-time) antes de encaminhar. Rate limit por IP no Broker fornece defesa em profundidade. O Proxy torna-se backward-compatible: usa Broker se `BROKER_URL` configurado, senão Ollama direto. Chaves separadas (`PROXY_KEY` vs `BROKER_KEY`) limitam blast radius. Modelo forçado no Broker previne model confusion attacks. Fallback gateway mantido no Proxy.

## First Principles Analysis

1. **Princípio da menor superfície de ataque**: Ollama não deve ser exposto directamente. Broker é o mínimo necessário (auth + forward).
2. **Defesa em profundidade**: Duas camadas de auth (Proxy + Broker) com chaves independentes.
3. **Fail-safe defaults**: Sem `BROKER_URL` → comportamento original (Ollama direto). Zero breaking changes.
4. **Simplicidade over features**: Sem streaming, métricas, mTLS v1. YAGNI.

## Hostile Audit Findings (Self-Correction During Build)

| Finding | Severity | Resolution |
|---------|----------|------------|
| Broker `/api/health` sem auth expõe modelo/status | LOW | Aceitável para monitorização; não expõe dados sensíveis |
| Rate limit em memória não escala | MEDIUM | Documentado como limitação v1; backlog item criado |
| `BROKER_KEY` em `.env` de ambas máquinas | MEDIUM | Padrão existente (`PROXY_KEY`); mitigação: rede isolada, rotação |
| Proxy → Broker → Ollama adiciona latência | LOW | ~1-5ms localhost; dentro de budget NF-Perf |

## Pattern Detection (≥2 Reflexes → Rule)

> **Pattern**: "Adicionar camada de auth HMAC entre serviços internos" apareceu em T014 (Proxy→Broker) e implicitamente em T004 (WordPress→Proxy).
>
> **Rule Proposal** (protocol): Padronizar criação de serviços internos com:
> - Header padrão: `X-Xkai-Proxy-Key`
> - Validação: `hmac.compare_digest(key, config.KEY)`
> - Rate limit por IP em memória (configurável)
> - Health endpoint sem auth para monitorização
> - Config via `.env` com `.env.example`
>
> → Candidato a `scripts/aes-internal-service-template.sh` futuro.

## Sprint Retrospective (Sprint 01)

### What Went Well
- Hostile analysis identificou necessidade de chaves separadas e modelo forçado
- Reutilização de padrões existentes acelerou implementação
- Todos os gates passaram na primeira execução (`make check` ✅)
- Zero mudanças no WordPress Plugin — isolamento de responsabilidades funcionou

### What Went Wrong
- Import issues no pytest (relative vs absolute) — resolvido com `sys.path.insert` no teste
- Teste E2E (`make qa`) não validado (requer Ollama running) — documentar dependência

### What to Change Next Sprint
- Template de serviço interno para evitar boilerplate
- Documentar `make qa` com Broker + Proxy + Ollama
- Considerar `ruff` no `make format` para broker/tests