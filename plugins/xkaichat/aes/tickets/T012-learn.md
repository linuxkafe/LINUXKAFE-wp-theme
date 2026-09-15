---
ticket: T012
phase: learn
status: done
created: 2026-09-12
requires:
  - aes/kanban.md
  - aes/tickets/T012-widget-fluxo.md
  - aes/tickets/T012-plan.md
  - aes/tickets/T012-build.md
  - aes/tickets/T012-review.md
produces:
  - aes/tickets/T012-learn.md
side_effects:
  - updates aes/sprints/sprint-03.md (learning section)
  - updates aes/kanban.md (Learning History)
blocked_by: ''
---

# T012 — Learn

## What Was Done (2 sentences)
Polimento do widget: painel fechado por omissão (opção `widget_auto_open`), logo no
cabeçalho, botão maximize e escrita simulada em bolha no histórico. Validação humana
(email+telefone→código→chat) preservada; gates verdes (68 asserts PHP, 24 pytest,
lint, docs, node --check).

---

## Feynman Method

### For a Child
O botão de conversa estava sempre fechado, como uma loja com a porta fechada e uma
campainha. Quando o cliente carrega na campainha, o dono pede primeiro "qual é o teu
email?" (e às vezes o telefone), manda um cartão por correio com um número secreto, e
só depois que o cliente diz esse número é que a conversa começa. Agora, a loja mostra
a fotografia da fachada lá dentro também, tem um botão para a loja ficar maior, e
enquanto o dono "pensa" na resposta, mostra três pontinhos a mexer-se com "A escrever…"
— para o cliente perceber que alguém está mesmo a responder.

### For an Expert
O tema real foi o estado derivado vs. DOM como fonte de estado. O widget vanilla JS
guarda o transcript serializado a partir de `querySelectorAll('.xkaichat-bubble')` —
o DOM é simultaneamente view e modelo. Ao introduzir um marcador decorativo (bolha
typing) com a MESMA classe das mensagens, ele seria capturado pela serialização e
persistido como conteúdo falso; a bolha de saudação já sofria disso (duplicação no
restore). Corrigido por exclusão identitária (`b === greetingBubble || b === thinking`),
não por seletor — decisão frágil mas mínima. O desenho mais robusto seria um array
lógico de mensagens como source of truth e o DOM a render-lo, fora do escopo cirúrgico.
Igualmente: `[hidden]` do UA é anulado por `display` de autor (`inline-flex`), exigindo
override explícito; e um indicador "pensando" no fim do histórico obriga a
`appendChild` para o reposicionar (bolhas são anexadas sequencialmente).

### Chain of Whys
- Why excluir greeting/typing do `persistTranscript`?
  → porque serializa todos os nós `.xkaichat-bubble`.
- Why serializar por classe?
  → era a forma mais curta de obter o estado a partir do DOM.
- Why obter estado do DOM em vez de um array?
  → sem framework, o DOM era a única fonte de conversa; manter um array duplicaria estado e arriscava des-sincronização.
- Porque é que isso continua a ser frágil?
  → "I don't know — hypothesis": o padrão vanilla aceita o DOM como modelo implícito; a separação modelo/view é uma disciplina que só um harness de testes ou um refactor imporia.

---

## First Principles

### Challenged Assumptions
| Assumption | fact/habit | Discovery |
|-----------|-----------|-----------|
| "Fechado por omissão = comportamento fixo" | habit | É uma opção de negócio; o admin deve escolher (auto_open default 0). |
| "Indicador de escrita = barra fora do chat" | habit | O pedido "simular a escrita" lê-se como bolha no histórico; velha barra nem usava o i18n `thinking`. |
| "DOM classes = transcript" | fact (código existente) | Fragilidade confirmada: decorativos capturados; exclusão por identidade é patch, não princípio. |

### The Real Problem
Separar estado (mensagens) de apresentação (marcadores visuais) num widget vanilla, sem
introduzir um modelo duplicado.

### If We Started Today
Mensagens seriam mantidas num array lógico (`state.messages`), o transcript seria
serializado desse array e o DOM renderizado a partir dele — bolha typing/saudação
seriam apenas flags de view. A exclusão por classe não existiria.

---

## Hostile Audit

### Where Our Learnings Fail
- A exclusão identitária quebrado se um novo marcador com `.xkaichat-bubble` for
  adicionado e esquecido na lista — a lição "excluir no persist" não é auto-aplicável.
- A lição "auto-open por página" é perigosa se aplicada cega a públicos sensíveis
  (RGPD, pop-ins) sem a opção default off.
- "Bolha typing no body" falha se o histórico for re-renderizado por outra via
  (ex.: futuro render por array) — a re-anexação no restore é do tipo patch.

### What We Do Not Know That We Do Not Know
- Não há harness de browser: nenhum teste prova o fluxo visual (maximize, typing,
  auto-open) em runtime real. Experimento: Playwright percorrendo terms→email→code→chat
  e assert do DOM do typing. (Backlog desde T010.)
- Não medimos impacto de UX do auto-open (conversão vs. irritação).

---

## Decisions We Would Change
- `persistTranscript` baseado em DOM → filtrar por array lógico quando houver refactor
  (fora deste escopo cirúrgico).
- ACs escritas primeiro como não-auto-verificáveis → desde o plan, escrever com ganchos
  do verifier (`[file exists]` / `make X passes`) para o gate de fecho verificar de facto.

## What Went Well
- Gates `make check` + `node --check` pegaram tudo; fix de persistência corrigido na
  própria revisão crítica (bug real evitado antes do commit).
- Sem novas dependências; backend/dados intactos; diff cirúrgico (12 ficheiros).
- Rever o verifier antes do fecho tornou as ACs auto-verificáveis (7/7).

## What Went Wrong
- Nada bloqueante. A infrequência de testes de browser obrigou a verificação estática
  e por construção — risco aceite e registado (backlog Playwright).

## Shadow Docs Created
- Nenhum (subsistema aes/shadow/ + `make index` não materializado neste repo — gap de
  governança em ROADMAP backlog). Insights do T012 ficam neste learn + HOSTILE_INSIGHTS.md.

## Sugestão de skill
- **aes-widget-state**: checklist para widgets vanilla com DOM como estado —
  serialização de transcript, indicadores decorativos vs. conteúdo, `[hidden]` vs.
  `display` de autor, state derivado de opções sanitizadas. (proposta — não criada.)