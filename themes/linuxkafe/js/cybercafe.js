/**
 * linuxkafe Cybercafé Toasts
 * Notificações estilo system message anos 2000
 */

import { CONFIG, eventBus, createElement, injectStyles, debug, uid, onDOMReady, prefersReducedMotion, randomInt, randomChoice } from './core.js';

// ============================================================================
// CYBERCAFÉ MESSAGES
// ============================================================================
const CYBERCAFE_MESSAGES = [
  // LAN House vibes
  { title: '[SYSTEM]', text: 'LAN House lotada — só tem PC 3 livre', type: 'info' },
  { title: '[SYSTEM]', text: 'PC 7 reiniciando... tela azul de novo', type: 'warning' },
  { title: '[SYSTEM]', text: 'Impressora travou no meio do curriculo', type: 'error' },
  { title: '[SYSTEM]', text: 'Internet caiu — ligando pro provedor', type: 'error' },
  { title: '[SYSTEM]', text: 'Mouse do PC 12 sem bola (roubaram)', type: 'warning' },

  // xchat / IRC
  { title: '[XCHAT]', text: 'xchat conectado em irc.brasnet.org #linux-br', type: 'info' },
  { title: '[XCHAT]', text: 'CTCP VERSION reply: xchat 2.8.4 Linux', type: 'info' },
  { title: '[XCHAT]', text: 'DCC SEND aceito: kernel-2.6.tar.gz (14MB)', type: 'success' },
  { title: '[XCHAT]', text: '/join #debian-br — 234 usuarios', type: 'info' },
  { title: '[XCHAT]', text: 'PING? PONG! 12ms', type: 'info' },
  { title: '[IRC]', text: 'NickServ: "Senha aceita. Bem-vindo, root_"', type: 'success' },
  { title: '[IRC]', text: 'ChanServ set +o vo', type: 'info' },
  { title: '[IRC]', text: '/me esta compilando o kernel', type: 'info' },

  // Counter-Strike 1.6
  { title: '[CS 1.6]', text: 'Counter-Strike 1.6 instalado — 5v5 no Dust2', type: 'info' },
  { title: '[CS 1.6]', text: 'Server: 200.123.45.67:27015 — sem cheat', type: 'info' },
  { title: '[CS 1.6]', text: 'rush B! rush B! rush B!', type: 'info' },
  { title: '[CS 1.6]', text: 'eco round — so deagle', type: 'info' },
  { title: '[CS 1.6]', text: 'wallbang na box! headshot!', type: 'success' },
  { title: '[CS 1.6]', text: 'bomb planted — 35 segundos', type: 'warning' },
  { title: '[CS 1.6]', text: 'defuse kit comprado — $400', type: 'info' },
  { title: '[CS 1.6]', text: 'clutch 1v3! ninja defuse!', type: 'success' },
  { title: '[CS 1.6]', text: 'AWP no carrinho — $4750', type: 'info' },
  { title: '[CS 1.6]', text: 'AK-47 one-deag no long A', type: 'success' },
  { title: '[CS 1.6]', text: 'wallbang na dust2 long doors', type: 'success' },
  { title: '[CS 1.6]', text: 'eco round rush B com glock', type: 'info' },
  { title: '[CS 1.6]', text: 'defuse kit ninja no ultimo segundo', type: 'success' },

  // MSN Messenger
  { title: '[MSN]', text: 'MSN Messenger: 147 contatos online', type: 'info' },
  { title: '[MSN]', text: 'fulano123@hotmail.com quer adicionar voce', type: 'info' },
  { title: '[MSN]', text: 'Zumbido recebido de: crush_2004', type: 'success' },
  { title: '[MSN]', text: 'Mensagem offline: "vc viu meu away msg?"', type: 'info' },
  { title: '[MSN]', text: 'Status: Ocupado — "Estudando" (jogando CS)', type: 'info' },
  { title: '[MSN]', text: 'Zumbido enviado para: crush_2004', type: 'info' },
  { title: '[MSN]', text: 'Status: "Ouvindo: Linkin Park - Numb"', type: 'info' },
  { title: '[MSN]', text: 'Convite para webcam recusado', type: 'warning' },
  { title: '[MSN]', text: 'Foto de exibicao atualizada (96x96)', type: 'info' },

  // Orkut
  { title: '[ORKUT]', text: 'Orkut: novo depoimento de melhor amiga', type: 'success' },
  { title: '[ORKUT]', text: 'Convite para comunidade: "Eu amo Linux"', type: 'info' },
  { title: '[ORKUT]', text: 'Scrap recebido: "lindo seu perfil!"', type: 'info' },
  { title: '[ORKUT]', text: 'Atualizou foto do perfil (300x300px)', type: 'info' },

  // Netscape Navigator
  { title: '[NETSCAPE]', text: 'Netscape 4.7 travou no Java applet', type: 'error' },
  { title: '[NETSCAPE]', text: 'Carregando... ████████░░ 73%', type: 'info' },
  { title: '[NETSCAPE]', text: 'Plugin Shockwave Flash necessario', type: 'warning' },
  { title: '[NETSCAPE]', text: 'Erro 404: Documento nao encontrado', type: 'error' },
  { title: '[NETSCAPE]', text: 'Baixando RealPlayer 8... 1.2MB/12MB', type: 'info' },

  // Quake
  { title: '[QUAKE]', text: 'Quake III Arena: "Impressive!"', type: 'success' },
  { title: '[QUAKE]', text: 'Rocket jump no q3dm17', type: 'success' },
  { title: '[QUAKE]', text: 'Railgun hit sound — *chung*', type: 'info' },
  { title: '[QUAKE]', text: 'Quad Damage powerup coletado', type: 'success' },
  { title: '[QUAKE]', text: 'Frag: vo > victim [RAILGUN]', type: 'success' },

  // GTA Vice City
  { title: '[GTA VC]', text: 'GTA Vice City: "Welcome to Vice City"', type: 'info' },
  { title: '[GTA VC]', text: 'Tommy Vercetti suit desbloqueado', type: 'success' },
  { title: '[GTA VC]', text: 'Radio Flash FM: Michael Jackson - Billie Jean', type: 'info' },
  { title: '[GTA VC]', text: 'Missao "Demolition Man" completada', type: 'success' },
  { title: '[GTA VC]', text: 'Cheat: PRECIOUSPROTECTION (armadura maxima)', type: 'info' },

  // Counter-Strike (additional)
  { title: '[CS 1.6]', text: 'Counter-Strike 1.6 instalado — 5v5 no Dust2', type: 'info' },
  { title: '[CS 1.6]', text: 'Server: 200.123.45.67:27015 — sem cheat', type: 'info' },
  { title: '[CS 1.6]', text: 'rush B! rush B! rush B!', type: 'info' },
  { title: '[CS 1.6]', text: 'eco round — so deagle', type: 'info' },
  { title: '[CS 1.6]', text: 'wallbang na box! headshot!', type: 'success' },
  { title: '[CS 1.6]', text: 'bomb planted — 35 segundos', type: 'warning' },
  { title: '[CS 1.6]', text: 'defuse kit comprado — $400', type: 'info' },
  { title: '[CS 1.6]', text: 'clutch 1v3! ninja defuse!', type: 'success' },
  { title: '[CS 1.6]', text: 'AWP no carrinho — $4750', type: 'info' },

  // MSN Messenger (original)
  { title: '[MSN]', text: 'MSN Messenger: 147 contatos online', type: 'info' },
  { title: '[MSN]', text: 'fulano123@hotmail.com quer adicionar voce', type: 'info' },
  { title: '[MSN]', text: 'Zumbido recebido de: crush_2004', type: 'success' },
  { title: '[MSN]', text: 'Mensagem offline: "vc viu meu away msg?"', type: 'info' },
  { title: '[MSN]', text: 'Status: Ocupado — "Estudando" (jogando CS)', type: 'info' },

  // Orkut
  { title: '[ORKUT]', text: 'Orkut: novo depoimento de melhor amiga', type: 'success' },
  { title: '[ORKUT]', text: 'Convite para comunidade: "Eu amo Linux"', type: 'info' },
  { title: '[ORKUT]', text: 'Scrap recebido: "lindo seu perfil!"', type: 'info' },
  { title: '[ORKUT]', text: 'Atualizou foto do perfil (300x300px)', type: 'info' },

  // Downloads/P2P
  { title: '[EMULE]', text: 'Baixando no eMule... 2% (3 dias restantes)', type: 'warning' },
  { title: '[KAZAA]', text: 'Kazaa: "mp3 - linkin park - numb" — 56k modem', type: 'info' },
  { title: '[TORRENT]', text: 'BitTorrent: Linux ISO — 700MB — 2 seeds', type: 'info' },
  { title: '[DOWNLOAD]', text: 'Download completo: patch_ptbr_cs.exe', type: 'success' },

  // Linux/Terminal
  { title: '[TERMINAL]', text: 'sudo apt update && sudo apt upgrade -y', type: 'info' },
  { title: '[TERMINAL]', text: 'Compilando kernel... make -j4', type: 'info' },
  { title: '[TERMINAL]', text: 'vim: salvando arquivo... :wq', type: 'info' },
  { title: '[TERMINAL]', text: 'git commit -m "fix: arrumei tudo"', type: 'info' },
  { title: '[TERMINAL]', text: 'neofetch rodando no background', type: 'info' },

  // Hardware
  { title: '[HARDWARE]', text: 'Cooler do Pentium 4 fazendo barulho de aviao', type: 'warning' },
  { title: '[HARDWARE]', text: '512MB RAM — "rodou Crysis?"', type: 'info' },
  { title: '[HARDWARE]', text: 'HD de 40GB — 98% cheio (ISOs, MP3s, mods)', type: 'warning' },
  { title: '[HARDWARE]', text: 'Monitor CRT 15" — 1024x768 @ 85Hz', type: 'info' },
];

// ============================================================================
// STYLES
// ============================================================================
const TOAST_STYLES = `
/* Cybercafé Toasts Container */
#lk-toasts {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 4000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  max-width: 360px;
  contain: layout paint style;
}

.lk-toast {
  pointer-events: auto;
  background: var(--color-header, #2d2d2d);
  border-left: 3px solid var(--color-primary, #F8B400);
  border-radius: 4px;
  padding: 10px 12px;
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--color-text-on-dark, #e0e0e0);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transform: translateX(120%);
  opacity: 0;
  animation: lk-toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  contain: layout paint style;
}

.lk-toast.removing {
  animation: lk-toast-out 0.2s ease-in forwards;
}

@keyframes lk-toast-in {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes lk-toast-out {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(120%); opacity: 0; }
}

.lk-toast-header {
  font-weight: 600;
  color: var(--color-primary, #F8B400);
  margin-bottom: 4px;
}

.lk-toast-text {
  color: var(--color-text-on-dark, #e0e0e0);
}

/* Type variants */
.lk-toast.success { border-left-color: var(--color-cs-green, #00FF00); }
.lk-toast.warning { border-left-color: var(--color-cs-yellow, #FFFF00); }
.lk-toast.error { border-left-color: var(--color-cs-red, #FF3333); }
.lk-toast.info { border-left-color: var(--color-cs-blue, #3399FF); }

.lk-toast-close {
  position: absolute;
  top: 4px;
  right: 8px;
  background: transparent;
  border: none;
  color: var(--color-text-light, #888);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: color 0.15s, background 0.15s;
}

.lk-toast-close:hover {
  color: var(--color-primary, #F8B400);
  background: rgba(248, 180, 0, 0.1);
}

.lk-toast-close:focus-visible {
  outline: 2px solid var(--color-primary, #F8B400);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .lk-toast { animation: none; transform: translateX(0); opacity: 1; }
  .lk-toast.removing { display: none; }
}

@media (max-width: 600px) {
  #lk-toasts {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  .lk-toast { font-size: 0.75rem; }
}
`;

// ============================================================================
// TOAST CLASS
// ============================================================================
class CybercafeToasts {
  constructor() {
    this.state = {
      toasts: [],
      intervalId: null,
      maxVisible: CONFIG.timing.cybercafeMaxVisible,
    };
    this.elements = {};
    this.init();
  }

  async init() {
    await onDOMReady();
    
    if (prefersReducedMotion()) {
      debug('Cybercafé toasts disabled: prefers-reduced-motion');
      return;
    }

    injectStyles(TOAST_STYLES, 'lk-toast-styles');
    this.createElements();
    this.startSpawning();
    debug('Cybercafé Toasts initialized');
  }

  createElements() {
    this.elements.container = createElement('div', { id: 'lk-toasts', 'aria-live': 'polite', 'aria-label': 'Notificações do cybercafé' });
    document.body.appendChild(this.elements.container);
  }

  startSpawning() {
    const spawn = () => {
      if (this.state.toasts.length >= this.state.maxVisible) {
        this.state.intervalId = setTimeout(spawn, randomInt(5000, 10000));
        return;
      }

      this.showToast(randomChoice(CYBERCAFE_MESSAGES));
      
      // Next spawn in 30-60s
      this.state.intervalId = setTimeout(spawn, randomInt(
        CONFIG.timing.cybercafeMinInterval,
        CONFIG.timing.cybercafeMaxInterval,
      ));
    };

    // Initial delay
    this.state.intervalId = setTimeout(spawn, randomInt(5000, 15000));
  }

  showToast(message) {
    const id = uid('toast');
    const toast = createElement('div', {
      id,
      class: `lk-toast ${message.type || 'info'}`,
      role: 'status',
      'aria-live': 'polite',
    }, [
      createElement('div', { class: 'lk-toast-header' }, message.title),
      createElement('div', { class: 'lk-toast-text' }, message.text),
      createElement('button', {
        class: 'lk-toast-close',
        'aria-label': 'Fechar notificação',
        onclick: () => this.removeToast(id),
      }, '×'),
    ]);

    this.elements.container.appendChild(toast);
    this.state.toasts.push({ id, element: toast });

    // Auto dismiss
    setTimeout(() => this.removeToast(id), CONFIG.timing.cybercafeAutoDismiss);
  }

  removeToast(id) {
    const index = this.state.toasts.findIndex(t => t.id === id);
    if (index === -1) return;

    const toast = this.state.toasts[index];
    toast.element.classList.add('removing');

    toast.element.addEventListener('animationend', () => {
      if (toast.element.parentNode) {
        toast.element.remove();
      }
      this.state.toasts.splice(index, 1);
    }, { once: true });
  }

  destroy() {
    if (this.state.intervalId) clearTimeout(this.state.intervalId);
    this.state.toasts.forEach(t => {
      if (t.element.parentNode) t.element.remove();
    });
    if (this.elements.container.parentNode) {
      this.elements.container.remove();
    }
  }
}

// ============================================================================
// INIT
// ============================================================================
let toastInstance = null;

export function initCybercafe() {
  if (!CONFIG.features.cybercafe) return null;
  if (toastInstance) return toastInstance;
  toastInstance = new CybercafeToasts();
  return toastInstance;
}

export { CybercafeToasts };