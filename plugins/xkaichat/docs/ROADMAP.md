# ROADMAP — XKaiChat

| Item | Impact | Effort | Priority | Status |
|------|--------|--------|----------|--------|
| Infraestrutura AES (T001) | alto | baixo | 1 | done |
| Núcleo do plugin (T002) | alto | médio | 1 | done |
| Verificação de email (T003) | alto | médio | 1 | done |
| Proxy Python (T004) | alto | médio | 1 | done |
| Motor RAG (T005) | alto | médio | 1 | done |
| Cache por palavras-chave (T006) | alto | médio | 1 | done |
| Widget de chat (T007) | alto | médio | 2 | done |
| Resumo email + admin (T008) | médio | médio | 2 | done |
| Validação + revisão (T009) | alto | médio | 1 | done |
| Onboarding do widget (T010) | alto | médio | 1 | done |
| Gate pre-commit em fechos (T011) | médio | baixo | 2 | done |
| Polimento do widget (T012) | alto | baixo | 1 | done |
| Correções widget: email remetente, tip hidden, estado online, termos (T013) | alto | médio | 1 | done |
| Broker autenticação Ollama (T014) | alto | médio | 1 | done |

## Backlog
- Consentimento persistente + página de política de privacidade (RGPD) `[DISCOVERED em T010]`.
- Testes de browser (Playwright) para o fluxo termos → email → código → chat `[DISCOVERED em T010]`.
- Discrepância de governança (RESOLVIDO — subset mínimo): a promessa de `make wake`/`aes/INDEX.md`/shadow docs vive nos skills instalados (`~/.config/opencode/skills/`), não no repo; o repo opera no subset mínimo real (kanban + tickets + `make check`). Decidido: **não fabricar** infra ausente; `pre-review.sh` reescrito só com gates reais (`make check` + diffstory no build), removendo as chamadas fantasma (wake/debt-gate/GF/epistemics/hostile-lint) que passavam sempre `[RESOLVED em T012]`.
- Gap de deteção do gate de fecho T011: se abertura e fecho de um ticket viajam no MESMO commit (open não foi commitado previamente), o diff staged de `aes/kanban.md` não tem `-current_ticket: <TXXX>` → o hook faz skip silencioso. Mitigação: commit separado da abertura, ou verificação manual obrigatória antes do fecho (em T012 foi feita: `verify-implementation.sh T012` 7/7 + `make check`; omissão registada em `aes/metrics/bypass.log`) `[DISCOVERED em T012]`.

## Ideias futuras
- Exportação de lead (CRM/telefone → WhatsApp da equipa).
- Modo "encomenda" estruturado (seleção de produtos + quantidades + envio por email).
- Embeddings via Ollama (`nomic-embed-text`) para retrieval semântico além do BM25.
- Multi-idioma (EN/FR) para turistas.