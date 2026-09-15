# T009-learn — Aprendizagens registadas

## Aprendizagens (P=insight, C=conserto, W=aviso)

- **[C] Verificador AES e ACs com comandos**: padrões `[command "exits 0"]` só passam se o primeiro backtick for um comando que sai 0. Caminhos que não existem → *skip* (não falha). ACs antigas tipo "Testes pytest em `tests/proxy/`" falhavam (bash -c num diretório = exit 126). **Lição:** ACs verificáveis = `` `make <target>` [command "exits 0"] ``.
- **[W] Ciladão "make.*target"**: qualquer AC com `Makefile` + `target` na mesma linha dispara a heurística do gate (grep -i) e falha ("target NOT found") porque "Makefile" contém "make". **Lição:** usar `` `make lint` target exists `` para que o sed extraia o target real.
- **[C] Arranque a frio do Ollama**: qwen3:8b em CPU-only demora ~2 min no 1.º pedido (502/timeout) antes de ficar quente. O harness E2E precisa de warm-up (chamada ignorada antes dos asserts). **Lição:** gates E2E reais exigem warm-up explícito.
- **[C] Latença pós-cache em E2E**: 2 dos 4 testes E2E passaram mesmo com o 1.º pedido a 502 — cache hit responde sem LLM. A cache não só poupa tokens como suaviza a latência.
- **[W] Stubs WP precisam de defaults**: o `FauxWpdb` só acertou inserts após adicionar defaults por coluna e operadores de comparação (IN/!=/>). **Lição:** ao esboçar o runtime, modelar o contrato real (wpdb semantics), não só o happy path.
- **[P] Interface proxy/chave**: header `X-Xkai-Proxy-Key` + `PROXY_KEY` vazia por omissão mantém o setup "funciona sem chave" mas pronto a endurecer. Segurança em camadas sem custo de arranque.
- **[P] Soberania do conhecimento**: o preço só vem do RAG (PDF + FAQ); quando não há facto, resposta é "sem fonte" e não é cacheada — nunca inventar contra a fonte de verdade do negócio.

## Explicações (Feynman)

- **Para um miúdo (cliente)**: o robô só responde o que está no caderninho de preços da loja; se não encontrar, diz que não sabe, e guarda as respostas para não ter de pensar duas vezes na mesma pergunta.
- **Para um expert (engenheiro)**: gate com ACs em forma de comando testa *intenção verificável* (exit code de `make`), enquanto ACs descritivas caem em heurísticas frágeis (grep de "target"). Thermal priming necessário no E2E porque o alvo (modelo local) não garante latência de steady-state.

## Auditoria hostil

- [x] Nenhum gate foi contornado: bypass.log sem entradas novas.
- [x] `docs/QA.md` regenerado por `make qa` com o modelo real.
- [x] ACs de T002–T008 reescritas para formas verificáveis e passam nos gates.
- [x] Sem segredos em ficheiros versionados.
- [ ] (seguimento) Exercitar failover do gateway e remover `proxy/cache_store/` legado.

## Sugestão de skill

- **aes-ticket-ac**: helper para escrever ACs em forma verificável (comando vs ficheiro vs contains), com exemplo de armadilha `Makefile`+`target`. (proposta — não criada nesta sprint)