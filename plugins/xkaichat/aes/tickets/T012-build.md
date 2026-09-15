# T012-build — Diffstory (polimento do widget)

## O que mudou e porquê

- **Fechado por omissão / auto-abrir configurável**: novo default `widget_auto_open=0` (activator, admin sanitize, public defaults). Quando ligado, o painel abre no boot na view de entrada correta (`terms`/`email`/`chat` conforme o progresso) e a tooltip é suprimida (`openPanel()` → `dismissTip()`).
- **Logo no chat**: `<img class="xkaichat-header-logo">` no cabeçalho do painel, usando a mesma resolução `logo_url()` do FAB; título truncável (ellipsis) para conviver com ações. Campo admin relicenciado de "URL do logótipo (FAB)" para "URL do logótipo".
- **Maximize**: botão no header (SVG expand/collapse, `aria-pressed`) alterna `.xkaichat-maximized` no root → painel 520px × 82vh (desktop) / 94vh (mobile).
- **Escrita simulada**: o indicador passou de uma barra estática sem texto (fora do chat) para uma bolha no histórico — 3 dots animados + label i18n "A escrever…" — movida para o fim da conversa em `setThinking(true)` e removida/recolocada hidrada no fim da resposta.
- **Fix pré-existente**: `persistTranscript` incluía a bolha de saudação → duplicada no restore; agora exclui `greetingBubble` e a bolha typing (que usa a classe `.xkaichat-bubble` e vazaria como mensagem falsa).

## Porque estes ficheiros

A funcionalidade é frontend (partial/CSS/JS) + exposição da opção em admin/public/activator + testes do sanitizer. Não tocou backend de verificação, proxy, cache, RAG.

## O que foi intencionalmente NÃO tocado

- Backend de email/código/sessão (`class-xkaichat-verification.php`).
- Proxy, cache, RAG; nonces e endpoints AJAX.
- Persistência de mensagens no servidor; admin partials.
- Dependências: nenhuma nova (vanilla JS, CSS puro, SVGs inline).

## Riscos restantes

- **Sem testes de browser**: maximize, auto-open e typing não têm harness JS/E2E no repo (registado no backlog — Playwright).
- **Auto-open por página**: repetido em cada recarga se ligado; o utilizador pode fechar. Decisão consciente com a opção nas settings.
- **`aria-pressed`** reflete o estado; falta `aria-expanded` no painel (MINOR, não bloqueante — painel usa `role=dialog` + hidden).
- **Maximize em mobile**: apenas altura (94vh); largura já é 100%.