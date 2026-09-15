---
ticket: T005
title: Motor RAG (PDF menu + FAQ + retrieval)
sprint: sprint-01
priority: high
status: pending
created: 2026-09-12
---

# T005 — Motor RAG

## Context
O assistente responde sobre o Capuchinho Verde com base em: (1) PDFs (menu/tabela de preços, promoções) carregados pelo dono do site; (2) FAQ em JSON com triggers (padrão da referência otobo/llm). Retrieval: BM25 sobre chunks de PDF + matching de triggers de FAQ, com prioridade aos factos oficiais.

## Acceptance Criteria
- [ ] `proxy/rag.py` existe
- [ ] `proxy/rag.py` extrai texto de PDF com `pypdf`
- [ ] `proxy/rag.py` divide o texto em chunks e constrói índice BM25
- [ ] `proxy/consulta` prioriza factos de FAQ sobre contexto genérico
- [ ] `proxy/knowledge_base.json` existe com entradas FAQ do Capuchinho Verde (triggers + conteúdo)
- [ ] Índice regenerável via script `proxy/index_pdfs.py` [file exists]
- [ ] `proxy/rag.py` contém função `normalize` que remove acentos e lowercase
- [ ] Testes pytest do RAG passam: `make test-proxy` [command "exits 0"]

## Scope
**In:** ingestão de PDFs, chunking, BM25, FAQ triggers, normalização, API de retrieval.
**Out:** cache (T006), proxy routing (T004 integra rag).

## Dependencies
T004.

## Rollback
Remover índice; plugin mantém funcionalidade base com FAQ.

## Known Risks
- PDFs mal estruturados (scanned/imagem) não extraem texto — registar aviso e cair para FAQ.
- Menus mudam — "tabela-precos-2026.pdf" específico do ano.