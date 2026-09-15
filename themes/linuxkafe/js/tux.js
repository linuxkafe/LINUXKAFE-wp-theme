/**
 * linuxkafe Tux Walker
 * Pinguim Tux animado em SVG que passeia pela viewport
 */

import { CONFIG, eventBus, createElement, injectStyles, debug, uid, onDOMReady, prefersReducedMotion, randomInt, randomChoice, clamp, lsGet, lsSet } from './core.js';

// ============================================================================
// TUx SVG
// ============================================================================
const TUX_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="80" height="95" aria-hidden="true">
  <!-- Body -->
  <ellipse cx="60" cy="95" rx="35" ry="40" fill="#000" />
  <ellipse cx="60" cy="88" rx="28" ry="30" fill="#fff" />
  
  <!-- Head -->
  <ellipse cx="60" cy="45" rx="30" ry="28" fill="#000" />
  
  <!-- White face -->
  <ellipse cx="60" cy="42" rx="20" ry="18" fill="#fff" />
  
  <!-- Eyes -->
  <ellipse cx="48" cy="38" rx="6" ry="7" fill="#000" class="tux-eye-left" />
  <ellipse cx="72" cy="38" rx="6" ry="7" fill="#000" class="tux-eye-right" />
  <circle cx="46" cy="36" r="2" fill="#fff" class="tux-eye-shine" />
  <circle cx="70" cy="36" r="2" fill="#fff" class="tux-eye-shine" />
  
  <!-- Beak -->
  <path d="M60 50 L70 60 L50 60 Z" fill="#FF9900" />
  <path d="M60 50 L70 58 L50 58 Z" fill="#FFCC00" />
  
  <!-- Wings -->
  <path d="M25 70 Q10 80 20 110 Q30 95 35 75 Z" fill="#000" class="tux-wing-left" />
  <path d="M95 70 Q110 80 100 110 Q90 95 85 75 Z" fill="#000" class="tux-wing-right" />
  
  <!-- Feet -->
  <path d="M45 130 Q45 140 55 135" stroke="#FF9900" stroke-width="4" fill="none" stroke-linecap="round" class="tux-foot-left" />
  <path d="M75 130 Q75 140 65 135" stroke="#FF9900" stroke-width="4" fill="none" stroke-linecap="round" class="tux-foot-right" />
  
  <!-- God mode wings (hidden by default) -->
  <g class="tux-god-wings" style="display:none;">
    <path d="M15 50 Q-10 30 5 10 Q20 30 30 50" fill="none" stroke="#F8B400" stroke-width="3" opacity="0.8" />
    <path d="M105 50 Q130 30 115 10 Q100 30 90 50" fill="none" stroke="#F8B400" stroke-width="3" opacity="0.8" />
    <path d="M15 50 Q-10 70 5 90 Q20 70 30 50" fill="none" stroke="#F8B400" stroke-width="2" opacity="0.5" />
    <path d="M105 50 Q130 70 115 90 Q100 70 90 50" fill="none" stroke="#F8B400" stroke-width="2" opacity="0.5" />
  </g>
  
  <!-- Halo for god mode -->
  <ellipse cx="60" cy="15" rx="25" ry="5" fill="none" stroke="#F8B400" stroke-width="2" class="tux-halo" style="display:none;" />
</svg>
`;

// ============================================================================
// STYLES
// ============================================================================
const TUX_STYLES = `
/* Tux Walker */
#lk-tux {
  position: fixed;
  pointer-events: none;
  z-index: 1500;
  transition: transform 0.1s linear;
  will-change: transform;
  contain: layout paint style;
}

#lk-tux.interactive {
  pointer-events: auto;
  cursor: pointer;
}

#lk-tux svg {
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease-out;
}

#lk-tux.walking svg {
  animation: tux-walk 0.6s ease-in-out infinite;
}

#lk-tux.idle svg {
  animation: tux-breathe 3s ease-in-out infinite;
}

#lk-tux.looking svg {
  animation: none;
}

#lk-tux.sleeping svg {
  animation: tux-sleep 2s ease-in-out infinite;
}

#lk-tux.celebrating svg {
  animation: tux-celebrate 0.5s ease-in-out infinite;
}

/* Walking animation */
@keyframes tux-walk {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(-3deg) translateY(-2px); }
  50% { transform: rotate(0deg) translateY(0); }
  75% { transform: rotate(3deg) translateY(-2px); }
}

/* Breathing idle */
@keyframes tux-breathe {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.02) translateY(-1px); }
}

/* Sleeping */
@keyframes tux-sleep {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(1px) rotate(1deg); }
}

/* Celebrate (god mode) */
@keyframes tux-celebrate {
  0%, 100% { transform: scale(1) rotate(-5deg); }
  50% { transform: scale(1.05) rotate(5deg); }
}

/* Eye tracking */
.tux-eye-left, .tux-eye-right {
  transition: transform 0.1s linear;
  transform-origin: center;
  transform-box: fill-box;
}

/* Foot movement during walk */
.tux-foot-left, .tux-foot-right {
  transform-origin: center top;
  transition: transform 0.1s linear;
}

#lk-tux.walking .tux-foot-left {
  animation: tux-foot-left 0.6s ease-in-out infinite;
}

#lk-tux.walking .tux-foot-right {
  animation: tux-foot-right 0.6s ease-in-out infinite;
}

@keyframes tux-foot-left {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  50% { transform: rotate(-15deg) translateY(3px); }
}

@keyframes tux-foot-right {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  50% { transform: rotate(15deg) translateY(3px); }
}

/* Wing flap during walk */
#lk-tux.walking .tux-wing-left {
  animation: tux-wing-flap-left 0.6s ease-in-out infinite;
  transform-origin: 35px 75px;
}

#lk-tux.walking .tux-wing-right {
  animation: tux-wing-flap-right 0.6s ease-in-out infinite;
  transform-origin: 85px 75px;
}

@keyframes tux-wing-flap-left {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-10deg); }
}

@keyframes tux-wing-flap-right {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
}

/* God mode wings visible */
#lk-tux.god-mode .tux-god-wings {
  display: block;
  animation: tux-god-wings-flap 1s ease-in-out infinite;
  transform-origin: 60px 45px;
}

#lk-tux.god-mode .tux-halo {
  display: block;
  animation: tux-halo-spin 4s linear infinite;
}

@keyframes tux-god-wings-flap {
  0%, 100% { transform: scaleY(1); opacity: 0.8; }
  50% { transform: scaleY(1.3); opacity: 1; }
}

@keyframes tux-halo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Speech bubble */
.tux-speech {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  background: var(--color-header, #2d2d2d);
  border: 2px solid var(--color-primary, #F8B400);
  border-radius: 12px;
  padding: 8px 12px;
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.75rem;
  color: var(--color-primary, #F8B400);
  white-space: nowrap;
  white-space: normal;
  max-width: 200px;
  text-align: center;
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  animation: tux-speech-in 0.3s ease-out forwards, tux-speech-out 0.3s ease-in 3.7s forwards;
}

.tux-speech::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: var(--color-primary, #F8B400);
  border-bottom: none;
}

@keyframes tux-speech-in {
  from { opacity: 0; transform: translateX(-50%) translateY(-5px); }
  to { opacity: 1; transform: translateX(-50%) translateY(-10px); }
}

@keyframes tux-speech-out {
  from { opacity: 1; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 0; transform: translateX(-50%) translateY(-15px); }
}

@media (prefers-reduced-motion: reduce) {
  #lk-tux svg { animation: none !important; transition: none !important; }
  .tux-speech { animation: none !important; opacity: 1; }
  #lk-tux.god-mode .tux-god-wings { animation: none; }
  #lk-tux.god-mode .tux-halo { animation: none; }
}

@media (max-width: 600px) {
  #lk-tux svg { width: 60px; height: 70px; }
}
`;

// ============================================================================
// TUx MESSAGES
// ============================================================================
const TUx_MESSAGES = [
  'linuxkafe.org — desde 2003',
  'sudo apt install felicidade',
  'rm -rf /windows',
  'Tux te vê...',
  'Kernel panic? Não aqui.',
  'Café: preto, forte, livre.',
  'Vim > Emacs (não discuta)',
  'git push --force? Corajoso.',
  'Arch Linux: I use it btw',
  'systemd? Mais como systemdont.',
  'Wayland ou X11? Sim.',
  'Flatpak, Snap, AppImage... escolha seu veneno.',
  'Less is more. Exceto em RAM.',
  'RTFM — Read The Friendly Manual',
  'Hello World! 🐧',
  'Compilando kernel... 99%',
  'Seu uptime: 23 anos',
  'Liberdade não é grátis.',
  'Código aberto, mente aberta.',
  'Nenhum pinguim foi machucado.',
];

// ============================================================================
// TUx CLASS
// ============================================================================
class TuxWalker {
  constructor() {
    this.state = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      velocityX: 0,
      velocityY: 0,
      direction: 1, // 1 = right, -1 = left
      currentState: 'idle', // idle, walking, looking, sleeping, celebrating
      isGodMode: false,
      lastInteraction: Date.now(),
      speechTimeout: null,
      walkTimeout: null,
      idleCheckInterval: null,
    };
    this.elements = {};
    this.mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.init();
  }

  async init() {
    await onDOMReady();
    injectStyles(TUX_STYLES, 'lk-tux-styles');
    this.createElements();
    this.bindEvents();
    this.loadState();
    this.startIdleChecker();
    this.startWalking();
    this.startPeriodicSave();
    debug('Tux Walker initialized');
  }

  loadState() {
    try {
      const saved = lsGet('lk_tux_state');
      if (saved) {
        this.state.x = saved.x || 0;
        this.state.y = saved.y || 0;
        this.state.isGodMode = saved.isGodMode || false;
        this.state.direction = saved.direction || 1;
        
        // Apply god mode class if needed
        if (this.state.isGodMode) {
          this.elements.container.classList.add('god-mode');
        }
        
        // If position is valid, use it; otherwise random
        if (saved.x && saved.y) {
          this.updatePosition(true);
        } else {
          this.positionRandomly();
        }
      } else {
        this.positionRandomly();
      }
    } catch (e) {
      debug('Failed to load Tux state:', e);
      this.positionRandomly();
    }
  }

  saveState() {
    try {
      lsSet('lk_tux_state', {
        x: this.state.x,
        y: this.state.y,
        isGodMode: this.state.isGodMode,
        direction: this.state.direction,
      });
    } catch (e) {
      debug('Failed to save Tux state:', e);
    }
  }

  createElements() {
    this.elements.container = createElement('div', {
      id: 'lk-tux',
      class: 'idle',
      'aria-hidden': 'true',
      role: 'img',
      'aria-label': 'Tux, o mascote do Linux',
    }, TUX_SVG);
    document.body.appendChild(this.elements.container);

    this.elements.svg = this.elements.container.querySelector('svg');
    this.elements.eyeLeft = this.elements.container.querySelector('.tux-eye-left');
    this.elements.eyeRight = this.elements.container.querySelector('.tux-eye-right');
  }

  bindEvents() {
    // Mouse tracking for "looking" behavior
    document.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    }, { passive: true });

    // Click on Tux
    this.elements.container.addEventListener('click', (e) => {
      e.stopPropagation();
      this.say(randomChoice(TUx_MESSAGES));
      this.state.lastInteraction = Date.now();
      this.setState('celebrating');
      setTimeout(() => this.setState('idle'), 1000);

      // Triple-click detection for retro game (3 clicks in 800ms)
      this.state.clickCount = (this.state.clickCount || 0) + 1;
      if (this.state.clickTimeout) clearTimeout(this.state.clickTimeout);
      this.state.clickTimeout = setTimeout(() => {
        this.state.clickCount = 0;
      }, 800);

      if (this.state.clickCount >= 3) {
        this.state.clickCount = 0;
        if (this.state.clickTimeout) clearTimeout(this.state.clickTimeout);
        eventBus.emit('retroGame:trigger');
        this.say('JOGO RETRO ATIVADO! 🐧🎮');
        this.setState('celebrating');
        setTimeout(() => this.setState('idle'), 1500);
      }
    });

    // God mode event
    eventBus.on('godmode:toggle', (enabled) => {
      this.state.isGodMode = enabled;
      this.elements.container.classList.toggle('god-mode', enabled);
      this.saveState();
      if (enabled) {
        this.setState('celebrating');
        this.say('GOD MODE! 🐧✨');
        setTimeout(() => this.setState('idle'), 2000);
      }
    });

    // Shell open/close - Tux watches
    eventBus.on('shell:open', () => this.setState('looking'));
    eventBus.on('shell:close', () => this.setState('idle'));
  }

  positionRandomly() {
    const margin = 100;
    this.state.x = randomInt(margin, window.innerWidth - margin - 80);
    this.state.y = randomInt(margin, window.innerHeight - margin - 95);
    this.updatePosition(true);
  }

  updatePosition(immediate = false) {
    const { x, y } = this.state;
    if (immediate) {
      this.elements.container.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      // Smooth interpolation
      this.elements.container.style.transform = `translate(${x}px, ${y}px)`;
    }
    // Flip horizontally based on direction
    this.elements.container.style.transform += ` scaleX(${this.state.direction})`;
  }

  setState(newState) {
    if (prefersReducedMotion()) return; // Stay idle
    if (this.state.currentState === newState) return;
    this.state.currentState = newState;
    this.elements.container.className = newState;
    debug('Tux state:', newState);
  }

  startIdleChecker() {
    this.state.idleCheckInterval = setInterval(() => {
      const timeSinceInteraction = Date.now() - this.state.lastInteraction;
      if (timeSinceInteraction > CONFIG.timing.tuxIdleThreshold) {
        if (this.state.currentState !== 'sleeping') {
          this.setState('sleeping');
        }
      } else if (this.state.currentState === 'sleeping') {
        this.setState('idle');
      }
    }, 2000);
  }

  startWalking() {
    if (prefersReducedMotion()) return;

    const walk = () => {
      if (this.state.currentState === 'sleeping') {
        this.state.walkTimeout = setTimeout(walk, 5000);
        return;
      }

      // Random walk
      const margin = 100;
      const maxX = window.innerWidth - margin - 80;
      const maxY = window.innerHeight - margin - 95;

      this.state.targetX = clamp(randomInt(margin, maxX), margin, maxX);
      this.state.targetY = clamp(randomInt(margin, maxY), margin, maxY);

      // Determine direction
      this.state.direction = this.state.targetX > this.state.x ? 1 : -1;

      this.setState('walking');

      const duration = randomInt(3000, 8000);
      const startTime = Date.now();
      const startX = this.state.x;
      const startY = this.state.y;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        this.state.x = startX + (this.state.targetX - startX) * eased;
        this.state.y = startY + (this.state.targetY - startY) * eased;
        this.updatePosition();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.setState('idle');
          this.saveState(); // Save position at end of walk
          // Random pause before next walk
          this.state.walkTimeout = setTimeout(walk, randomInt(2000, 5000));
        }
      };

      requestAnimationFrame(animate);
    };

    // Initial delay
    this.state.walkTimeout = setTimeout(walk, randomInt(1000, 3000));
  }

  // Periodic save (every 30s) for position updates during walk
  startPeriodicSave() {
    setInterval(() => {
      if (this.state.currentState === 'walking') {
        this.saveState();
      }
    }, 30000);
  }

  // Eye tracking toward mouse
  updateEyes() {
    if (this.state.currentState !== 'looking') return;

    const rect = this.elements.container.getBoundingClientRect();
    const tuxCenterX = rect.left + rect.width / 2;
    const tuxCenterY = rect.top + rect.height / 2;

    const dx = this.mousePos.x - tuxCenterX;
    const dy = this.mousePos.y - tuxCenterY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 100, 1);
    const maxOffset = 3 * distance;

    const offsetX = Math.cos(angle) * maxOffset;
    const offsetY = Math.sin(angle) * maxOffset;

    if (this.elements.eyeLeft && this.elements.eyeRight) {
      this.elements.eyeLeft.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      this.elements.eyeRight.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    requestAnimationFrame(() => this.updateEyes());
  }

  say(message) {
    // Remove existing speech
    const existing = this.elements.container.querySelector('.tux-speech');
    if (existing) existing.remove();

    const speech = createElement('div', { class: 'tux-speech' }, message);
    this.elements.container.appendChild(speech);

    if (this.state.speechTimeout) clearTimeout(this.state.speechTimeout);
    this.state.speechTimeout = setTimeout(() => {
      if (speech.parentNode) speech.remove();
    }, 4000);
  }

  destroy() {
    if (this.state.walkTimeout) clearTimeout(this.state.walkTimeout);
    if (this.state.idleCheckInterval) clearInterval(this.state.idleCheckInterval);
    if (this.state.speechTimeout) clearTimeout(this.state.speechTimeout);
    if (this.elements.container.parentNode) {
      this.elements.container.remove();
    }
  }
}

// ============================================================================
// INIT
// ============================================================================
let tuxInstance = null;

export function initTux() {
  if (!CONFIG.features.tux) return null;
  if (tuxInstance) return tuxInstance;
  tuxInstance = new TuxWalker();
  return tuxInstance;
}

export { TuxWalker };