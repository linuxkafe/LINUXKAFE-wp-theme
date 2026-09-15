# REQUIREMENTS — linuxkafe Gamification

## Functional Requirements

### FR-01: Linux Shell Simulation
- **Descrição**: Terminal interativo estilo anos 2000 aparece no canto inferior direito
- **Comandos**: `help`, `whoami`, `ls`, `cat readme.txt`, `neofetch`, `cmatrix`, `apt moo`, `fortune`, `cowsay`
- **Trigger**: Clique no ícone `>_` ou tecla `~` (tilde)
- **Persistência**: Histórico em sessionStorage

### FR-02: Tux Walker
- **Descrição**: Pinguim Tux (SVG animado) passeia pela tela aleatoriamente
- **Comportamento**: Anda, para, olha para o cursor, "dorme" após inatividade
- **Interação**: Clique no Tux → mensagem aleatória (fortune/tips Linux)
- **Respeita**: `prefers-reduced-motion: reduce` → só aparece parado

### FR-03: Cybercafé References (Random)
- **Descrição**: Tooltips/notificações estilo "system message" aparecem aleatoriamente
- **Conteúdo**: "LAN House lotada — só tem PC 3 livre", "Counter-Strike 1.6 instalado", "MSN Messenger: 147 contatos online", "Orkut: novo depoimento!", "Baixando no eMule... 2% (3 dias restantes)"
- **Frequência**: 1 a cada 30-60s, max 3 simultâneos
- **Dismiss**: Click ou auto-fade 8s

### FR-04: Graffiti Writer
- **Descrição**: Efeito "spray paint" escrevendo tags na lateral da tela
- **Tags**: "linuxkafe", "root@", "sudo rm -rf /", "CT side", "rush B", "defuse kit", "eco round", "GG"
- **Estilo**: Cores do tema (#F8B400, #2d2d2d, #FFFFFF), fonte Fira Code
- **Canvas**: SVG ou Canvas 2D, limpa sozinho após ciclo completo

### FR-05: Counter-Strike HUD Elements
- **Descrição**: Elementos visuais sutis estilo CS 1.6
- **Radar**: Mini-mapa no canto (decoration only)
- **Buy Menu**: Easter egg — Konami code abre "buy menu" fake com itens Linux
- **Bomb Timer**: "C4 planted" → conta regressiva 35s → "Counter-Terrorists Win" / "Terrorists Win"
- **Kill Feed**: Notificações fake "linuxkafe > killed > windows_update [AK-47]"

### FR-06: Easter Eggs
- **Konami Code** (↑↑↓↓←→←→BA): Abre "Buy Menu" modal
- **Click 5x no logo**: "God mode" — Tux ganha asas, shell desbloqueia `sudo`
- **Digitar "idkfa"**: Todos os easter eggs desbloqueados
- **Console.log**: Mensagens escondidas no DevTools

## Non-Functional Requirements

### NFR-01: Performance
- JS total < 15KB gzipped
- Zero layout shift (CLS = 0)
- INP < 200ms
- Lazy load: scripts carregam após `requestIdleCallback` ou `DOMContentLoaded`

### NFR-02: Acessibilidade
- `prefers-reduced-motion: reduce` → desativa Tux walk, graffiti animation, shell cursor blink
- ARIA labels em todos elementos interativos
- Focus trap no shell modal
- Screen reader: elementos decorativos com `aria-hidden="true"`

### NFR-03: Compatibilidade
- Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- WordPress 6.0+, PHP 7.4+
- Sem dependências externas (zero npm packages novos)

### NFR-04: Manutenibilidade
- Código modular (ESM modules)
- Documentação JSDoc em funções públicas
- CSS organizado por componente com custom properties