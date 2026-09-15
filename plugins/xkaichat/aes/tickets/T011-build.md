# T011-build — Diffstory (gate pre-commit em commits de fecho)

## O que mudou e porquê
- **`.aes/hooks/pre-commit.sh`**: quando o working tree tem `current_ticket: none`, o hook consulta agora `git diff --cached aes/kanban.md`. Se a transição staged for `current_ticket: T0XX → none`, o gate CORRE sobre o ticket fechado (variável `CLOSING_TICKET`). Fecha a lacuna descoberta no fecho do T010. Comportamento de skip mantém-se para commits genuínos sem ticket (backlog/infra).
- **`AES_VERIFY_SCRIPT`** (env override, default inalterado): permite instanciar o verifier nos smoke tests sem tocar no repo.
- **`tests/aes/test-pre-commit-close-gate.sh`** (novo, exec.): repo git temporário → kanban com `current_ticket: T011` → commit init → fecho (`done` + `current_ticket: none` staged) → assert de que o hook invocou o verifier para T011. Passa (`make test-aes`).
- **`Makefile`**: target `test-aes` + integração no gate `check` (o gap em si nunca mais passa despercebido).
- **`scripts/verify-implementation.sh`**: deteção bilingue da secção de AC (`Acceptance Criteria` | `Critérios de aceitação`) + preferência **section-aware** (conta ACs em checkbox sob o heading, em vez de substring em prosa). O primeiro draft de verificação do T011 falhou por `T011-build.md` mencionar "Acceptance Criteria" em prosa (gate falso 0 ACs em `3f45b29`); corrigido antes do fecho.
- **`CLAUDE.md` + kanban Rules + ROADMAP**: regra de processo documentada (fecho verificado pelo hook) e roadmap corrigido (T002–T008 marcados done).

## Porque estes ficheiros
A falha era do processo, não do produto — as mudanças concentram-se no hook, no seu teste e na regra. Nenhum ficheiro de negócio (plugin/proxy/RAG) foi tocado.

## O que foi intencionalmente NÃO tocado
- Lógica de bypass (`AES_BYPASS`) e verifier de AC — continuam iguais.
- Produto XKaiChat (PHP/proxy/widget) — fora do scope do ticket.

## Riscos restantes
- `git diff --cached` exige repo git ligado; em ambiente sem git o hook cai no skip (cenário não real neste repo).
- Se um commit remover a linha `current_ticket` sem ser fecho real, o gate corre sobre o ticket antigo — comportamento seguro (falha em vez de silenciar).
- O smoke test exercita o caminho feliz; falta um caso negativo (fecho NÃO corre gate quando não há transição). Aceitável para o porte; backlog se endurecer.