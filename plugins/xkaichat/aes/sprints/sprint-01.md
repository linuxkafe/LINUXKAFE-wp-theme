---
sprint: sprint-01
period: 2026-09-12 → 2026-09-19
status: done
goal: "Entregar o plugin XKaiChat completo: widget de chat com verificação de email, proxy Ollama+RAG, cache por palavras-chave e resumo por email."
---

# Sprint 01 — Entrega do plugin XKaiChat

## Tickets
| ID | Title | Status |
|----|-------|--------|
| T001 | Infraestrutura AES + scaffolding | done |
| T002 | Núcleo do plugin WordPress | done |
| T003 | Verificação de email | done |
| T004 | Proxy Python | done |
| T005 | Motor RAG | done |
| T006 | Cache por palavras-chave | done |
| T007 | Widget de chat | done |
| T008 | Email de resumo + admin | done |
| T009 | Validação, revisão, aprendizagem | done |

## Retrospective

### O que correu bem
- Entrega completa T002–T008 num único arranque do pipeline: núcleo, verificação, proxy, RAG, cache, widget, admin/resumo e docs.
- Gates intermédios decisivos: `make check` verde e E2E real (`make qa`) verde com o modelo local (qwen3:8b) e warm-up.
- O runner PHP sem deps WP (stubs) provou que o plugin se testa fora do runtime WordPress.

### O que melhorar
- ACs descritivas em forma não-verificável causaram 4 gate-failures desnecessários (pytest-por-caminho, `php -l` solto). Escrever ACs em forma de comando desde o início.
- Ollama CPU-only é limitante (105 s/pedido) — arrastou o E2E para ~9 min. Aquecer/paralelizar ou documentar latency para produção.
- `proxy/cache_store/` legado ficou para trás (limpar).

### Ações
- [x] Todos os tickets T002–T009 fechados com gates.
- [x] `docs/QA.md` regenerado via `make qa`.
- [ ] (backlog) Exercitar failover gateway; remover `proxy/cache_store/`; automação de warm-up em produção.
