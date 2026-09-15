# linuxkafe WordPress Theme

Tema WordPress gamificado com terminal Linux, Tux walker, graffiti, cybercafé toasts, easter eggs e jogo retro (Snake).

## Estrutura

```
.
├── README.md
├── plugins/
│   ├── xkaichat/     # WordPress AI Assistant (Ollama + RAG)
│   └── xkinstagram/  # Instagram posts import
└── themes/
    └── linuxkafe/    # Tema principal
```

## Instalação

1. Copie `themes/linuxkafe/` para `wp-content/themes/`
2. Copie `plugins/` para `wp-content/plugins/`
3. Ative o tema e plugins no WordPress

## Requisitos

- WordPress 6.0+
- PHP 7.4+
- Node.js 18+ (para build do tema)

## Build do Tema

```bash
cd themes/linuxkafe
npm install
npm run compile:css
```

## Funcionalidades

- **Terminal Linux** interativo (`~` para abrir)
- **Tux Walker** - Pinguim animado (triple-click = jogo retro)
- **Graffiti Writer** - Canvas animado
- **Cybercafé Toasts** - Mensagens nostálgicas
- **Easter Eggs** - Konami code, God mode, IDKFA
- **Jogo Retro** - Snake clone (triple-click no Tux)
- **Analytics** - Plausible/GA4 + endpoint customizado

## Documentação

Ver `themes/linuxkafe/docs/` para documentação completa (VISION, REQUIREMENTS, DESIGN, ROADMAP, CHECKLIST).
