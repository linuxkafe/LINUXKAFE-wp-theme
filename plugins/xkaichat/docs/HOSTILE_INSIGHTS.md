# HOSTILE_INSIGHTS — XKaiChat

*Registo de insights da análise hostil. Adicionar com categoria, task, insight, origem, impacto, aplicação e data.*

## Segurança - Defense in Depth: Broker HMAC à frente do Ollama
- **Task**: T014
- **Insight**: Separar auth (Broker) de lógica de negócio (Proxy/RAG) permite proteger Ollama mesmo se Proxy for comprometido. Duas chaves distintas (`PROXY_KEY` para WordPress→Proxy, `BROKER_KEY` para Proxy→Broker) limitam blast radius.
- **Origin**: análise hostil — "what if Proxy is compromised?"
- **Impact**: Arquitetura v1 usa HMAC partilhada em ambas camadas; futuro pode diferenciar (mTLS no Broker, JWT no Proxy).
- **Applied To**: T014 implementação; docs/REQUIREMENTS.md NF-Security atualizado.
- **Date**: 2026-09-15

## Arquitetura - Proxy como fonte de verdade única para LLM
- **Task**: T004/T005/T006
- **Insight**: On revisão do `chat_proxy.py` da referência, o proxy concentra decisão de rota, RAG, cache e sanitização. Duplicar lógica no PHP do plugin geraria dois sistemas divergentes.
- **Origin**: análise hostil da referência otobo/llm.
- **Impact**: se ignorado, o plugin e o proxy poderiam divergir em normalização/cache.
- **Applied To**: plugin PHP mantém só I/O (persistência, email) e delega tudo a `/api/chat` e `/api/health`.
- **Date**: 2026-09-12

## Segurança - Prompt injection via input do utilizador
- **Task**: T004
- **Insight**: A referência envolve input do utilizador em tags `<chat_input>` + directiva de segurança. Sem isso, o utilizador pode fazer "jailbreak" do sistema.
- **Origin**: análise do `SECURITY_DIRECTIVE` no `chat_proxy.py`.
- **Impact**: se ignorado, chat poderia ser manipulado para revelar instruções ou responder fora do RAG.
- **Applied To**: replicado e reforçado no `proxy.py`.
- **Date**: 2026-09-12

## Domínio - DOM como estado em widget vanilla vaza marcadores decorativos
- **Task**: T012
- **Insight**: O `persistTranscript` serializa `querySelectorAll('.xkaichat-bubble')` — o DOM é simultaneamente modelo e view. A bolha de saudação já duplicava no restore; a nova bolha typing (mesma classe) repetiria o bug. Patched por exclusão de identidade (`b === greetingBubble || b === thinking`), mas a solução de princípio é um array lógico de mensagens e o DOM a render-lo. `[hidden]` perde para `display:inline-flex` do autor (require override); indicador no fim do histórico exige `appendChild`.
- **Origin**: revisão crítica do T012 sobre o JS do widget.
- **Impact**: se ignorado, mensagens decorativas persistem como conversa e estados falsos "funcionam".
- **Applied To**: persist exclui greeting+typing; typing re-anexado no restore; auto-open default off.
- **Date**: 2026-09-12

## Arquitetura - Superfície de modelos é server-side via env, sem endpoint de listagem
- **Task**: /models (sessão T011+)
- **Insight**: O modelo LLM do XKaiChat é decidido só no proxy (`OLLAMA_MODEL`/`GATEWAY_MODEL` em `proxy/config.py`), sem endpoint `/api/models` e sem qualquer referência a modelos no PHP do plugin. `llava:7b` existe no Ollama local mas está fora do fluxo (multimodal). Confundir "modelo disponível" com "modelo selecionável" é um erro de produto.
- **Origin**: pergunta `/models` durante reverificação da governança.
- **Impact**: se decidido selecionar modelos no widget, é um endpoint novo + testes + decisão de UI — não só um picker.
- **Applied To**: mantido env-only; decisão registada apenas como documentação.
- **Date**: 2026-09-12

## Performances - Cache por keywords reduz LLM, mas exige limiar anti-falsos-positivos
- **Task**: T006
- **Insight**: Cache por overlap de keywords pode colidir perguntas distintas com keywords comuns ("bola" aparece em múltiplos contextos). Exigir limiar configurável e ≥N keywords evita respostas erradas.
- **Origin**: análise do pedido do utilizador (cache por palavras-chave) vs referência (cache por query normalizada exata).
- **Impact**: se mal usado, respostas erradas ou cache inútil.
- **Applied To**: limiar de similaridade configurável + top de keywords obrigatórias.
- **Date**: 2026-09-12