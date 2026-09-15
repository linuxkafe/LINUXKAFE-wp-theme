---
project: XKaiChat
created: 2026-09-15
current_sprint: sprint-01
current_ticket: T015
---

# Kanban — XKaiChat

## Sprint 01 — Broker de Autenticação Ollama

| ID | Título | Status |
|----|--------|--------|
| T014 | Broker de autenticação à frente do Ollama (HMAC partilhada com Proxy) | done |
| T015 | Estrutura GitHub: org wordpress, repos plugins/themes, xkaichat como submodule | in-progress |

## Backlog
- Consentimento persistente + página de política de privacidade (RGPD) `[DISCOVERED em T010]`
- Testes de browser (Playwright) para o fluxo termos → email → código → chat `[DISCOVERED em T010]`
- Exportação de lead (CRM/telefone → WhatsApp da equipa)
- Modo "encomenda" estruturado (seleção de produtos + quantidades + envio por email)
- Embeddings via Ollama (`nomic-embed-text`) para retrieval semântico além do BM25
- Multi-idioma (EN/FR) para turistas