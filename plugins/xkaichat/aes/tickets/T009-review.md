# T009-review — Revisão crítica (hostile review)

## Veredicto

**APROVADO com MINOR** — sem BLOCKER nem MAJOR.

## Lentes

### Correctness
- PHP: 55 asserts (runner), 0 falhas; `make lint` (php -l ×23) limpo.
- Proxy: 24 testes unit + 4 E2E reais (Ollama qwen3:8b) — `docs/QA.md` regenerado com sucesso.
- Ficheiros testados individualmente; máquina de estados JS revisada (restore de sessão não mata a sessão).

### Simplicity
- Proxy dividido em 6 módulos coesos (config/normalize/cache/rag/proxy). Sem dependências PHP externas; proxy auto-suficiente.
- O plugin apenas proxeia `/api/chat` via HTTP com timeouts — sem lógica duplicada de RAG no lado WP.

### Maintainability
- Nomes consistentes (`xkaichat_*`, classes por responsabilidade); timeouts centralizados em `config.py` e defaults do settings.
- Conhecimento temporário (que gera index) é determinístico; `make qa` regenera `docs/QA.md`.

### Security
- Nonces em todos os AJAX (admin + public, 9 pontos verificados).
- Output sempre escapado (`esc_html/attr/textarea`, `checked/selected`).
- Sem segredos em ficheiros versionados; `PROXY_KEY` opcional via `.env`/settings, comparação em tempo constante.
- Proxy sem acesso a dados de clientes fora do runtime; sem API externa obrigatória (Ollama local).
- Códigos de verificação só em hash; rate-limit por IP e cooldown por email.

### Performance
- Cache por palavras-chave (Jaccard) + SQLite WAL; harness E2E tem warm-up para arranque a frio.
- Hot path `_generate` bloqueante por natureza (LLM local em CPU-only ≈ 105 s): aceite, com timeouts 150/180 s.

## Ações requeridas (MINOR, não bloqueiam)
1. `proxy/cache_store/` é diretório legado vazio — remover em manutenção futura.
2. Failover gateway nunca exercitado em E2E (sem chave) — cobrir em sprint seguinte ou no arranque de produção.
3. Warm-up/implicações de latência documentados no README do proxy (já referido em QA.md) — considerar nota visual na página de admin quando a resposta for lenta.
4. LSP aponta falsos positivos de funções WP (ambiente sem runtime) — não acionáveis, não bloqueiam.

## Condições de fecho
Todas as MINOR têm resolução planeada/opcional — nenhuma é condição de bloqueio. Revisão concluída em 2026-09-12.