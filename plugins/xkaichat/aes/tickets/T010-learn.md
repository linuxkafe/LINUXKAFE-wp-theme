# T010-learn — Aprendizagens registadas

## Aprendizagens (P=insight, C=conserto, W=aviso)

- **[P] Consentimento dentro do fluxo > modal**: integrar os termos como primeiro passo do wizard (não um modal separado) mantém a coesão do widget e reduz complexidade — decisão de UX com custo quase nulo.
- **[W] `sessionStorage` ≠ persistência de consentimento**: aceitação por sessão reaparece em cada separador; para RGPD rigoroso exigiria localStorage + página de política (fica no backlog). Confiança no comportamento atual: apenas “best effort”.
- **[P] Prioridade do logo (URL → tema → fallback icon)**: resolvida no server com cascata simples e testada nos 3 ramos; o fallback graceful evita imagem quebrada quando não há fonte.
- **[C] Testes precisam dos 3 ramos do fallback**: o 1.º rascunho do teste `logo_url` falhou porque os globals do stub não foram limpos entre asserts — lição: reset de estado por caso, não por função.
- **[P] `textContent` como fronteira de XSS** para conteúdo admin-renderizado no frontend: config disponível ao admin (alto privilégio) mas defendida mesmo assim; custo zero.
- **[C] Defaults triangulados** (activator + sanitize + enqueue `wp_parse_args`): sistemas pré-existentes sem as novas chaves não quebram nem precisam de migração.

## Explicações (Feynman)

- **Para um miúdo (cliente)**: primeiro o robô pede “aceitas?”; depois pede o email e manda um código; só depois é que conversa. O botão verde é uma foto da loja.
- **Para um expert (engenheiro)**: o estado de entrada é deduzido de duas flags imparciais (token e aceitação), evitando “estados impossíveis”; a ferramenta de fallback do logo é uma cascata determinística coberta por testes nos três ramos.

## Auditoria hostil

- [x] Nenhum gate contornado (sem entradas em `bypass.log`).
- [x] ACs de T010 todas auto-verificáveis e passam (8/8).
- [x] Sem segredos; `widget_logo_url` sanificada com `esc_url_raw`.
- [x] Backlog registado: consentimento persistente + Playwright para o fluxo.

## Sugestão de skill

- **aes-ux-flow**: checklist para fluxos de onboarding multi-etapa (estados deriváveis de flags, fallback de assets, consentimento scoped, a11y da tooltip). (proposta — não criada.)