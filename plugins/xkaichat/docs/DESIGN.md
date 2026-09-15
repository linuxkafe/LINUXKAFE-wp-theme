# DESIGN — XKaiChat (Widget de chat)

Tema visual do widget derivado da marca **Capuchinho Verde** (pastelaria vegan artesanal): limpo, acolhedor, verde como acento.

## Tokens

### Cores
| Token | Valor | Uso |
|-------|-------|-----|
| `--xkc-brand` | `#5a8a4b` | Acento principal (verde da marca), botões, estados ativos |
| `--xkc-brand-dark` | `#3f6a33` | Hover de botões |
| `--xkc-bg` | `#ffffff` | Fundo do widget |
| `--xkc-surface` | `#f7f7f2` | Bolhas do agente, header footer |
| `--xkc-border` | `#e5e5e0` | Bordas |
| `--xkc-text` | `#1c1c1a` | Texto |
| `--xkc-muted` | `#73736f` | Texto secundário |
| `--xkc-error` | `#c0392b` | Erros |

### Tipografia
`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

| Elemento | Tamanho | Peso |
|----------|---------|------|
| Título widget | 15px | 600 |
| Mensagens | 14px | 400 |
| Timestamp | 11px | 400 |
| Botões | 13px | 500 |

### Espaçamento
Base 4px: 8 · 12 · 16 · 24 · 32.

## Componentes
- **Botão flutuante** (FOA): círculo com ícone SVG de chat, brand.
- **Janela**: header com título + estado ("online"), corpo de mensagens, footer com campo e botão enviar (ícone seta, não emoji).
- **Passos**: (1) email+telefone → (2) código → (3) chat. Indicador de passo discreto.
- **Estados**: erro inline (borda erro + texto muted), loading (bolhas com animação CSS pulse), timeout de sessão com botão "revalidar".

## Regras
- Todos os seletores prefixados com `.xkaichat-` para evitar colisão com o tema.
- Sem emojis no código; ícones apenas SVG inline.
- Responsivo: desktop coluna 380px; ≤ 640px full-screen bottom sheet.
- Acessível: `aria-label` no botão FOA, `role="log"` no corpo, focus visível, contraste AA.