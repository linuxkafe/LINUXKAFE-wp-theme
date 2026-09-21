/**
 * linuxkafe Easter Eggs & CS HUD
 * Konami code, buy menu, god mode, idkfa, kill feed, console logs
 */

import { CONFIG, eventBus, createElement, injectStyles, debug, uid, onDOMReady, prefersReducedMotion, SequenceDetector, randomChoice, getCSSVar, lsGet, lsSet, randomInt } from './core.js';

// ============================================================================
// EASTER EGG DATA
// ============================================================================
const BUY_MENU_ITEMS = [
  { key: '1', name: 'sudo rm -rf /', price: '$4750', desc: 'Destrói tudo (simulado)', icon: '☠️' },
  { key: '2', name: 'apt install linux', price: '$3100', desc: 'Instala liberdade', icon: '🐧' },
  { key: '3', name: 'vim', price: 'FREE', desc: 'Editor supremo', icon: '⌨️' },
  { key: '4', name: 'neofetch', price: 'FREE', desc: 'System info bonito', icon: '📊' },
  { key: '5', name: 'cmatrix', price: 'FREE', desc: 'Matrix rain', icon: '🌧️' },
  { key: '6', name: 'fortune | cowsay', price: 'FREE', desc: 'Sabedoria bovina', icon: '🐄' },
  { key: '7', name: 'htop', price: 'FREE', desc: 'Gerenciador de processos', icon: '📈' },
  { key: '8', name: 'ls -la /', price: 'FREE', desc: 'Lista tudo', icon: '📁' },
];

const KILL_FEED_MESSAGES = [
  'linuxkafe > killed > windows_update [AK-47]',
  'root@ > headshot > systemd [AWP]',
  'tux > knifed > proprietary_driver [KNIFE]',
  'sudo > exploded > bloatware [HE GRENADE]',
  'kernel > wallbanged > microsoft_edge [AWP]',
  'bash > flashed > ie6 [FLASHBANG]',
  'grep > smoked > telemetry [SMOKE]',
];

const CONSOLE_MESSAGES = [
  '%c🐧 linuxkafe v2.1.0-gamified %cBem-vindo ao cybercafé virtual!',
  '%c💡 Dica: Digite "~" para abrir o terminal',
  '%c🎮 Konami code: ↑↑↓↓←→←→BA',
  '%c🖱️ Clique 5x no logo para GOD MODE',
  '%c⌨️ Digite "idkfa" para desbloquear tudo',
  '%c☕ Café: preto, forte, livre.',
  '%c💻 "Linux é como uma tenda: sem Windows, sem Gates, Apache dentro."',
];

// ============================================================================
// STYLES
// ============================================================================
const EASTER_EGG_STYLES = `
/* Buy Menu Modal */
#lk-buy-menu {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  background: var(--color-header, #2d2d2d);
  border: 2px solid var(--color-primary, #F8B400);
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 30px rgba(248, 180, 0, 0.2);
  z-index: 5000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
  font-family: var(--font-mono, 'Fira Code', monospace);
  overflow: hidden;
  contain: layout paint style;
}

#lk-buy-menu.open {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

.lk-buy-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-dark, #444);
  background: rgba(0, 0, 0, 0.3);
}

.lk-buy-menu-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary, #F8B400);
  letter-spacing: 1px;
}

.lk-buy-menu-money {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-cs-green, #00FF00);
  font-variant-numeric: tabular-nums;
}

.lk-buy-menu-close {
  background: transparent;
  border: 1px solid var(--color-border-dark, #444);
  color: var(--color-text-on-dark, #e0e0e0);
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8rem;
  transition: all 0.15s;
}

.lk-buy-menu-close:hover {
  border-color: var(--color-primary, #F8B400);
  color: var(--color-primary, #F8B400);
}

.lk-buy-menu-close:focus-visible {
  outline: 2px solid var(--color-primary, #F8B400);
  outline-offset: 2px;
}

.lk-buy-menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.lk-buy-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border-dark, #444);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}

.lk-buy-item:hover {
  border-color: var(--color-primary, #F8B400);
  background: rgba(248, 180, 0, 0.1);
  transform: translateY(-1px);
}

.lk-buy-item:focus-visible {
  outline: 2px solid var(--color-primary, #F8B400);
  outline-offset: 2px;
}

.lk-buy-item-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.lk-buy-item-info {
  flex: 1;
  min-width: 0;
}

.lk-buy-item-name {
  font-weight: 600;
  color: var(--color-text-on-dark, #e0e0e0);
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lk-buy-item-desc {
  font-size: 0.7rem;
  color: var(--color-text-light, #888);
  margin-top: 2px;
}

.lk-buy-item-price {
  font-weight: 700;
  color: var(--color-cs-green, #00FF00);
  font-variant-numeric: tabular-nums;
  font-size: 0.85rem;
  white-space: nowrap;
}

.lk-buy-item-key {
  position: absolute;
  top: 6px;
  left: 8px;
  background: var(--color-primary, #F8B400);
  color: var(--color-header, #2d2d2d);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  font-variant-numeric: tabular-nums;
}

.lk-buy-menu-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--color-border-dark, #444);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--color-text-light, #888);
}

.lk-buy-menu-hint {
  color: var(--color-primary, #F8B400);
}

.lk-buy-menu-hint kbd {
  background: rgba(248, 180, 0, 0.2);
  border: 1px solid var(--color-primary, #F8B400);
  border-radius: 3px;
  padding: 1px 6px;
  font-family: inherit;
  font-size: 0.7rem;
}

/* Kill Feed */
#lk-kill-feed {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
  contain: layout paint style;
}

.lk-kill-feed-item {
  pointer-events: auto;
  background: var(--color-header, #2d2d2d);
  border: 1px solid var(--color-border-dark, #444);
  border-left: 3px solid var(--color-cs-yellow, #FFFF00);
  border-radius: 4px;
  padding: 8px 12px;
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.75rem;
  color: var(--color-text-on-dark, #e0e0e0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transform: translateX(120%);
  opacity: 0;
  animation: lk-kill-feed-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards,
             lk-kill-feed-out 0.3s ease-in 4.7s forwards;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes lk-kill-feed-in {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes lk-kill-feed-out {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(120%); opacity: 0; }
}

.lk-kill-feed-item .victim { color: var(--color-cs-red, #FF3333); }
.lk-kill-feed-item .killer { color: var(--color-cs-green, #00FF00); }
.lk-kill-feed-item .weapon { color: var(--color-primary, #F8B400); }

@media (prefers-reduced-motion: reduce) {
  #lk-buy-menu { transition: none; }
  .lk-kill-feed-item { animation: none; transform: translateX(0); opacity: 1; }
}

@media (max-width: 600px) {
  #lk-buy-menu { width: 95vw; max-width: none; }
  .lk-buy-menu-grid { grid-template-columns: 1fr; }
  #lk-kill-feed { right: 10px; left: 10px; }
}
`;

// ============================================================================
// EASTER EGGS CLASS
// ============================================================================
class EasterEggs {
  constructor() {
    this.state = {
      buyMenuOpen: false,
      godMode: false,
      idkfaUnlocked: false,
      konamiDetector: null,
      idkfaDetector: null,
      logoClickCount: 0,
      logoClickTimeout: null,
      killFeedInterval: null,
      consoleLogged: false,
    };
    this.elements = {};
    this.init();
  }

  async init() {
    await onDOMReady();
    injectStyles(EASTER_EGG_STYLES, 'lk-easter-egg-styles');
    this.loadState();
    this.createElements();
    this.setupDetectors();
    this.startKillFeed();
    this.logConsoleMessages();
    debug('Easter Eggs initialized');
  }

  loadState() {
    try {
      const saved = lsGet('lk_easter_eggs_state');
      if (saved) {
        this.state.godMode = saved.godMode || false;
        this.state.idkfaUnlocked = saved.idkfaUnlocked || false;
        
        // Apply god mode if previously enabled
        if (this.state.godMode) {
          eventBus.emit('godmode:toggle', true);
        }
      }
    } catch (e) {
      debug('Failed to load Easter Eggs state:', e);
    }
  }

  saveState() {
    try {
      lsSet('lk_easter_eggs_state', {
        godMode: this.state.godMode,
        idkfaUnlocked: this.state.idkfaUnlocked,
      });
    } catch (e) {
      debug('Failed to save Easter Eggs state:', e);
    }
  }

  createElements() {
    // Buy Menu
    this.elements.buyMenu = createElement('div', {
      id: 'lk-buy-menu',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Buy Menu — Easter Egg',
    }, [
      createElement('div', { class: 'lk-buy-menu-header' }, [
        createElement('h2', { class: 'lk-buy-menu-title' }, 'BUY MENU'),
        createElement('span', { class: 'lk-buy-menu-money' }, '$16000'),
        createElement('button', {
          class: 'lk-buy-menu-close',
          'aria-label': 'Fechar Buy Menu',
          onclick: () => this.closeBuyMenu(),
        }, 'Fechar (ESC)'),
      ]),
      createElement('div', { class: 'lk-buy-menu-grid', role: 'list' },
        BUY_MENU_ITEMS.map(item => createElement('button', {
          class: 'lk-buy-item',
          role: 'listitem',
          tabindex: '0',
          'aria-label': `${item.name} — ${item.price} — ${item.desc}`,
          onclick: () => this.buyItem(item),
        }, [
          createElement('span', { class: 'lk-buy-item-key' }, item.key),
          createElement('span', { class: 'lk-buy-item-icon' }, item.icon),
          createElement('div', { class: 'lk-buy-item-info' }, [
            createElement('div', { class: 'lk-buy-item-name' }, item.name),
            createElement('div', { class: 'lk-buy-item-desc' }, item.desc),
          ]),
          createElement('span', { class: 'lk-buy-item-price' }, item.price),
        ])),
      ),
      createElement('div', { class: 'lk-buy-menu-footer' }, [
        createElement('span', {}, 'F1: Auto-buy  |  F2: Rebuy'),
        createElement('span', { class: 'lk-buy-menu-hint' }, 'ESC ou clique fora para fechar'),
      ]),
    ]);
    document.body.appendChild(this.elements.buyMenu);

    // Kill Feed
    this.elements.killFeed = createElement('div', { id: 'lk-kill-feed', 'aria-live': 'polite', 'aria-label': 'Kill feed' });
    document.body.appendChild(this.elements.killFeed);

    // Focus trap for buy menu
    this.elements.buyMenu.addEventListener('keydown', (e) => this.handleBuyMenuKeydown(e));
  }

  setupDetectors() {
    // Konami Code
    this.state.konamiDetector = new SequenceDetector(CONFIG.konamiCode, () => {
      if (!this.state.buyMenuOpen) {
        this.openBuyMenu();
        debug('Konami code detected!');
      }
    });
    this.state.konamiDetector.start();

    // IDKFA sequence
    this.state.idkfaDetector = new SequenceDetector(CONFIG.idkfaSequence, () => {
      this.unlockAllEggs();
      debug('IDKFA detected!');
    });
    this.state.idkfaDetector.start();

    // Logo click for god mode
    const logo = document.querySelector('.custom-logo, .site-title a, .content-branding img');
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', (e) => this.handleLogoClick(e));
    }

    // Global ESC to close buy menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.buyMenuOpen) {
        this.closeBuyMenu();
      }
    });

    // Click outside buy menu to close
    document.addEventListener('click', (e) => {
      if (this.state.buyMenuOpen && !e.target.closest('#lk-buy-menu')) {
        this.closeBuyMenu();
      }
    });
  }

  handleLogoClick(e) {
    this.state.logoClickCount++;
    
    if (this.state.logoClickTimeout) {
      clearTimeout(this.state.logoClickTimeout);
    }

    this.state.logoClickTimeout = setTimeout(() => {
      this.state.logoClickCount = 0;
    }, 1000);

    if (this.state.logoClickCount >= CONFIG.godModeClicks) {
      this.toggleGodMode();
      this.state.logoClickCount = 0;
      debug('God mode activated via logo clicks!');
    }
  }

  openBuyMenu() {
    this.state.buyMenuOpen = true;
    this.elements.buyMenu.classList.add('open');
    this.elements.buyMenu.setAttribute('aria-hidden', 'false');
    
    // Focus first item
    const firstItem = this.elements.buyMenu.querySelector('.lk-buy-item');
    if (firstItem) firstItem.focus();

    // Trap focus
    document.body.style.overflow = 'hidden';
    
    eventBus.emit('buyMenu:open');
    debug('Buy Menu opened');
  }

  closeBuyMenu() {
    this.state.buyMenuOpen = false;
    this.elements.buyMenu.classList.remove('open');
    this.elements.buyMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    eventBus.emit('buyMenu:close');
    debug('Buy Menu closed');
  }

  handleBuyMenuKeydown(e) {
    if (e.key === 'Escape') {
      this.closeBuyMenu();
      return;
    }

    // Number keys 1-8
    if (e.key >= '1' && e.key <= '8') {
      const index = parseInt(e.key, 10) - 1;
      const items = this.elements.buyMenu.querySelectorAll('.lk-buy-item');
      if (items[index]) {
        items[index].click();
      }
    }

    // Tab trapping
    if (e.key === 'Tab') {
      const focusable = this.elements.buyMenu.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  buyItem(item) {
    debug('Buy item:', item.name);
    
    // Visual feedback
    const btn = this.elements.buyMenu.querySelector(`[aria-label*="${item.name}"]`);
    if (btn) {
      btn.style.background = 'rgba(0, 255, 0, 0.2)';
      setTimeout(() => btn.style.background = '', 200);
    }

    // Special items
    if (item.name === 'sudo rm -rf /') {
      this.say('ERROR: Permission denied. Try god mode.');
    } else if (item.name === 'apt install linux') {
      this.say('Instalando liberdade... 100% ✓');
      eventBus.emit('godmode:toggle', true);
    } else {
      this.say(`${item.name} adquirido! (simulado)`);
    }
  }

  toggleGodMode() {
    this.state.godMode = !this.state.godMode;
    eventBus.emit('godmode:toggle', this.state.godMode);
    this.saveState();
    
    if (this.state.godMode) {
      this.say('GOD MODE ATIVADO! 🐧✨');
      this.showKillFeed('root@ > GOD MODE ACTIVATED [ADMIN]');
    } else {
      this.say('God mode desativado.');
    }
  }

  unlockAllEggs() {
    this.state.idkfaUnlocked = true;
    this.toggleGodMode();
    this.openBuyMenu();
    this.say('IDKFA — ALL EASTER EGGS UNLOCKED! 🎮');
    this.showKillFeed('linuxkafe > IDKFA ENTERED [CHEAT CODE]');
    debug('All eggs unlocked!');
  }

  startKillFeed() {
    if (prefersReducedMotion()) return;

    const spawn = () => {
      if (!this.state.idkfaUnlocked && Math.random() > 0.3) {
        // Only spawn occasionally before idkfa
        this.state.killFeedInterval = setTimeout(spawn, randomInt(30000, 60000));
        return;
      }

      this.showKillFeed(randomChoice(KILL_FEED_MESSAGES));
      this.state.killFeedInterval = setTimeout(spawn, randomInt(15000, 45000));
    };

    this.state.killFeedInterval = setTimeout(spawn, randomInt(10000, 20000));
  }

  showKillFeed(message) {
    const item = createElement('div', { class: 'lk-kill-feed-item' });
    
    // Parse and colorize
    const parts = message.split(' ');
    const formatted = parts.map(part => {
      if (part.endsWith('>') || part.startsWith('>')) return `<span class="killer">${part}</span>`;
      if (part.includes('[') && part.includes(']')) return `<span class="weapon">${part}</span>`;
      if (part === 'killed' || part === 'headshot' || part === 'knifed' || part === 'wallbanged' || part === 'flashed' || part === 'smoked') {
        return `<span class="victim">${part}</span>`;
      }
      return part;
    }).join(' ');

    item.innerHTML = formatted;
    this.elements.killFeed.appendChild(item);

    // Remove after animation
    setTimeout(() => {
      if (item.parentNode) item.remove();
    }, 5000);
  }

  say(message) {
    eventBus.emit('toast:show', { title: '[EASTER EGG]', text: message, type: 'info' });
  }

  logConsoleMessages() {
    if (this.state.consoleLogged) return;
    this.state.consoleLogged = true;

    const styles = [
      'font-size: 14px; font-weight: bold; color: #F8B400;',
      'font-size: 12px; color: #e0e0e0;',
    ];

    CONSOLE_MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        console.log(msg, ...styles);
      }, i * 500);
    });
  }

  destroy() {
    if (this.state.konamiDetector) this.state.konamiDetector.stop();
    if (this.state.idkfaDetector) this.state.idkfaDetector.stop();
    if (this.state.logoClickTimeout) clearTimeout(this.state.logoClickTimeout);
    if (this.state.killFeedInterval) clearTimeout(this.state.killFeedInterval);
    if (this.elements.buyMenu.parentNode) this.elements.buyMenu.remove();
    if (this.elements.killFeed.parentNode) this.elements.killFeed.remove();
    document.body.style.overflow = '';
  }
}

// ============================================================================
// INIT
// ============================================================================
let easterEggsInstance = null;

export function initEasterEggs() {
  if (!CONFIG.features.easterEggs) return null;
  if (easterEggsInstance) return easterEggsInstance;
  easterEggsInstance = new EasterEggs();
  return easterEggsInstance;
}

export { EasterEggs };