# REQUIREMENTS — XKaiChat

## Funcionais (F)

**F1 — Widget de chat**
- F1.1 Widget acionável na frente do site (shortcode `[xkaichat]` + opção de injeção automática no footer); FAB mostra o logótipo do site (URL configurável → custom logo do tema → ícone do chat).
- F1.2 Fechado por omissão (configurável via opção `widget_auto_open`); mostra uma tooltip de interação com o FAB em destaque ("ressalto") até à primeira interação (por sessão).
- F1.3 Onboarding conduzido: 1) **consentimento** (texto configurável; menciona tratamento automatizado, possibilidade de erros e modelo local) → 2) email (obrigatório) + telefone (opcional) → 3) código (feedback visível de envio) → 4) chat com **mensagem inicial configurável**.
- F1.4 A aceitação dos termos é por sessão (sessionStorage); utilizadores com sessão de chat ativa saltam para o chat.
- F1.5 O painel de chat tem um botão de **maximizar** (aumento de tamanho; em mobile ≈ ecrã inteiro).
- F1.6 O chat apresenta o **logótipo do site** no cabeçalho (mesma fonte que o FAB) e simula a **escrita do assistente** (bolha com "A escrever…") enquanto aguarda a resposta do modelo.
- F1.7 O **indicador de estado** no cabeçalho reflete se o proxy e o LLM estão contactáveis: atualiza no arranque e a cada abertura do painel; em caso de falha mostra "offline" (dot cinza, sem animação) sem impedir o chat.

**F2 — Verificação de email**
- F2.1 Código temporário de 6 dígitos enviado por `wp_mail` com remetente = `admin_email` do site (filtros `wp_mail_from`/`wp_mail_from_name`).
- F2.2 Validação do código; sucesso cria sessão autenticada (token).
- F2.3 Rate-limit por IP/email (máx. 3 códigos/10 min). Tentativas erradas limitadas.

**F3 — Conversa**
- F3.1 O utilizador envia mensagens; o proxy responde com streaming.
- F3.2 O chat conhece o contexto do Capuchinho Verde (produtos, preços, encomendas, eventos).
- F3.3 A resposta é em PT-PT, cordial, sem invenção de preços fora do RAG.

**F4 — RAG**
- F4.1 Conteúdo baseado em PDFs (menu/tabela de preços) carregados pelo admin.
- F4.2 FAQ keyword-triggered em `proxy/knowledge_base.json`.
- F4.3 Retrieval: BM25 sobre chunks + triggers de FAQ; prioridade a factos oficiais.

**F5 — Cache por palavras-chave**
- F5.1 Respostas geradas guardadas com keywords (PT-PT, stopwords removidas).
- F5.2 Perguntas novas com overlap ≥ limiar servem resposta em cache.
- F5.3 Respostas com avisos (manutenção/indisponível/falha) NUNCA são cacheadas.
- F5.4 TTL de cache configurável.

**F6 — Resumo por email**
- F6.1 Fim de conversa → resumo (transcrição + email + telefone + intenção) via `wp_mail`.
- F6.2 Destinatário configurável; default `capuchinho@capuchinhoverde.com`.

**F7 — Admin**
- F7.1 Settings: endpoint do proxy, modelo, RAG on/off, limiar de cache, endereço de resumo, aparência.
- F7.2 Persistência de conversas/mensagens acessível no admin.

## Não-funcionais (NF)

- **NF-Docs**: documentado (docs/, CLAUDE.md); sem documentação a feature não existe.
- **NF-Test**: PHP e Python testados; gates em `make check`.
- **NF-Security**: nonces; escaping; sanitização de inputs; anti prompt-injection no proxy; PII mínima com retenção.
- **NF-Security**: Broker HMAC à frente do Ollama (`X-Xkai-Proxy-Key`); rate limit por IP; validação constante-time.
- **NF-Perf**: resposta em cache servida em <100ms; LLM só quando necessário.
- **NF-UX**: widget responsivo, acessível, estética Capuchinho Verde.
- **NF-Compat**: WordPress 6.x, PHP 7.4+ (40/60 fps budget não aplicável).
- **NF-Soberania**: LLM local (Ollama); proxy pode cair para rota direta sem gateway.

## Fora de âmbito (não-goals)
- Não substitui o WhatsApp/telefone como canal de encomenda.
- Não gere pagamentos nem reservas.
- Não treina modelos; não usa APIs externas por omissão.