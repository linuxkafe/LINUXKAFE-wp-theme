# T011-learn — Aprendizagens registadas

## Aprendizagens (P=insight, C=conserto, W=aviso)

- **[C] Gap de integridade do fecho do T010**: nunca avançar `current_ticket: none` sem que o commit de fecho corra gate. Agora detetado por diff staged (`CLOSING_TICKET`). Reflexo promotor: a própria infraestrutura tinha o buraco — descoberto por autorrevisão do processo.
- **[P] Gates silenciosos são piores que gates lentos**: o hook "saltava" sem aviso; o custo honesto é correr o verifier sobre o ticket fechado (não sobre `none`).
- **[C] Marcadores de AC têm de ser uniformes**: o verifier só lia `Acceptance Criteria`; o T011 chegou a ser escrito com `Critérios de aceitação` e o gate "passou" por skip enganoso (0 ACs). Corrigido: deteção bilingue + ACs em formato checkbox `- [ ]`.
- **[C] Docs de fase em prosa «Acceptance Criteria» sequestram o verifier (real!)**: no commit `3f45b29` do próprio T011 o verifier escolheu `T011-build.md` (que menciona a frase em prosa) → gate passou em falso com 0 ACs. Correção definitiva: preferência **section-aware** — conta checkboxes reais sob o heading de AC e escolhe o ficheiro com maior contagem. Regressão positiva: T010 volta a 8/8.
- **[P] Testar a infraestrutura com a própria mecânica que ela protege**: o smoke test monta o cenário real (repo temp + fecho) e prova o comportamento esperado — mais fiável que revisão estática.
- **[W] `set -e` + subshell**: iterar `find | while` com variável capturada funciona via output do subshell; mas marcações fora do padrão do verifier caem em "skip counted as pass" (métrica enganadora: `COUNT−FAIL`). Verificado e mitigado.

## Explicações (Feynman)

- **Para um miúdo**: quando fechamos um trabalho, alguém tem de confirmar que o trabalho está bom antes de carimbar "concluído". Antes, havia uma porta para esquecer isso; agora a porta tranca sozinha.
- **Para um expert (engenheiro)**: o state do kanban é fonte de verdade transitória; a decisão de gate depende do **diff staged**, não apenas do working tree — eliminando a condição de corrida commit-tempo de atualização do `current_ticket`.

## Auditoria hostil

- [x] Nenhum bypass (log vazio); a falha do T010 foi justificada e corrigida por processo, não por `AES_BYPASS`.
- [x] ACs do T011 auto-verificáveis (6/6 passam; a AC do `CLOSING_TICKET` verifica conteúdo real no hook).
- [x] Sem alterações de produto disfarçadas: T011 tocou apenas hook/verifier/testes/docs.
- [x] Smoke test é determinístico (repo temp isolado, mock verifier).

## Sugestão de skill
- Reforçar `tests/aes/` com caso negativo (não-corredo de gate sem transição) na próxima oportunidade — fechou o MINOR do review.