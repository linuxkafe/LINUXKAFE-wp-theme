# VISION — XKaiChat

## Problema
O Capuchinho Verde (pastelaria vegan artesanal no Porto) recebe diariamente as mesmas perguntas de clientes: preços, disponibilidade de produtos, encomendas, alergénios, horários, eventos. Responder manualmente consome tempo à equipa. O site já tem uma tabela de preços em PDF e FAQs dispersas.

## Solução
Um plugin WordPress — **XKaiChat** — que apresenta um widget de chat acionado por um LLM baseado em **Ollama** (local, soberano), com **RAG** sobre o menu/PDFs e FAQs do Capuchinho Verde. O widget abre **fechado por omissão** (configurável para abrir automaticamente); o FAB e o cabeçalho do chat mostram o logótipo do site. Antes de conversar, o utilizador passa por um onboarding conduzido: **consentimento dos termos** → valida o email (código temporário) com telefone opcional → abre o chat com uma mensagem inicial configurável, **simulando a escrita** enquanto o modelo responde, com botão para **maximizar** o painel. As respostas são **cacheadas por palavras-chave** para minimizar invocações ao LLM e, no fim de cada conversa, um **resumo é enviado por email** para a equipa (default `capuchinho@capuchinhoverde.com`).

## Arquitetura em três camadas
1. **Plugin WordPress (PHP)** — widget de chat, verificação de email, settings admin, resumo por email, persistência.
2. **Proxy intermediário (Python/FastAPI)** — recebe pedidos do plugin, decide a rota (gateway OpenAI-compatível ou **Ollama direto**), faz failover por disponibilidade/carga, aplica RAG e cache.
3. **LLM (Ollama local)** — gera respostas; embeddings de texto para retrieval.

## Proposta de valor
- Atendimento 24/7 em português de Portugal, com tom institucional cordial.
- Soberania de dados: nada de dados de clientes sai da infraestrutura.
- Redução de custo: cache por palavras-chave limita o uso do LLM.
- Custo humano: intenção/lead do cliente chega à equipa por email.
- Rigor AES: documentado, testado, questionado.

## Indica a direção
`This task is done when: o proxy responde com RAG a partir do PDF do menu + FAQ, o fluxo de email→código→chat funciona, respostas em cache são servidas por palavras-chave, e o resumo do chat chega por email ao endereço configurado.`