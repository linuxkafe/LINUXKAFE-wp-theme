---
ticket: T013
phase: learn
status: done
created: 2026-09-14
---

# T013 — Learn

## O que aprendemos (resumo Feynman)

**Para um criança:** o assistente era como um servo com o chapéu errado — mandava
cartas com o carimbo do vizinho (o "wordpress@") e o dono nunca recebia. Trocámos o
carimbo pelo do dono (admin). Além disso, a luzinha verde acendia mesmo quando o
motor estava desligado — agora só acende quando o motor e o substituto estão a
funcionar.

**Para um especialista:** o plugin não registava filtros `wp_mail_from`, ficando
sujeito ao default WP; a exposição de `upstream` no health do proxy permite ao
widget distinguir "proxy up + LLM down" de "tudo ok"; a regra `[hidden] + display`
de autor continua a ser a causa #1 de bugs visuais no widget — segundo trigger.

## O que causou o erro
1. Omissão de filtros de remetente — nunca testado porque os emails eram
   recebidos em ambiente de dev (sem SPF/DKIM restritivo).
2. Reutilização de um padrão CSS (`display:flex`) sem pensar na cascata
   com `[hidden]` — o mesmo erro do T012.
3. Health check do proxy que só validava a camada proxy, não o upstream
   real (Ollama).

## Lição registrada
**Regra do projeto (adicionar a CLAUDE.md se repetir 3×):**
Sempre que um seletor base define `display` (flex, grid, etc.), adicionar
imediatamente o override `[hidden] { display: none !important; }` para
esse seletor. Esta é a 2ª ocorrência (T012, T013).

## Métricas
- ACs: 11/11 passaram (verificados via verify-implementation.sh)
- make check: verde (lint 23 ficheiros, 79 asserts PHP, 24 tests proxy)
- Tempo estimado vs. real: dentro do previsto (medium effort)
- Pre-existing issues encontrados: 0 (os bugs reportados eram os targets)

## Ação follow-up
- Nenhuma. T013 é auto-contido.