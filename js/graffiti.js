/**
 * linuxkafe Graffiti Writer
 * Efeito spray paint escrevendo tags na lateral
 */

import { CONFIG, eventBus, createElement, injectStyles, debug, uid, onDOMReady, prefersReducedMotion, randomInt, randomChoice, clamp, getCSSVar } from './core.js';

// ============================================================================
// GRAFFITI TAGS
// ============================================================================
const GRAFFITI_TAGS = [
  'linuxkafe',
  'root@',
  'sudo rm -rf /',
  'CT side',
  'rush B',
  'defuse kit',
  'eco round',
  'GG',
  'LAN house',
  'CS 1.6',
  'no steam',
  'wallbang',
  'ace',
  'clutch',
  'plant',
  'defuse',
  'headshot',
  'awp',
  'ak47',
  'deagle',
  'flash',
  'smoke',
  'molotov',
  'kit',
  'vip',
  't side',
  'ct side',
  'mid',
  'long',
  'short',
  'catwalk',
  'heaven',
  'hell',
  'spawn',
  'buy zone',
  'bombsite A',
  'bombsite B',
];

// ============================================================================
// STYLES
// ============================================================================
const GRAFFITI_STYLES = `
/* Graffiti Writer */
#lk-graffiti {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  pointer-events: none;
  z-index: 500;
  overflow: hidden;
  contain: layout paint style;
}

#lk-graffiti canvas {
  display: block;
  width: 100%;
  height: 100%;
}

@media (max-width: 1024px) {
  #lk-graffiti { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  #lk-graffiti { display: none; }
}
`;

// ============================================================================
// PARTICLE SYSTEM
// ============================================================================
class SprayParticle {
  constructor(x, y, targetX, targetY, color, size) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.size = size;
    this.life = 1;
    this.maxLife = randomInt(60, 120);
    this.velocityX = (targetX - x) / this.maxLife * randomInt(80, 120) / 100;
    this.velocityY = (targetY - y) / this.maxLife * randomInt(80, 120) / 100;
    this.gravity = 0.05;
    this.drift = (randomInt(-10, 10) / 100);
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += this.gravity;
    this.velocityX += this.drift;
    this.life++;
    return this.life < this.maxLife;
  }

  draw(ctx) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class DripParticle {
  constructor(x, y, color, length) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.length = length;
    this.currentLength = 0;
    this.growthRate = randomInt(2, 5);
    this.maxLength = length;
    this.fallSpeed = randomInt(1, 3);
    this.wobble = randomInt(-1, 1) * 0.5;
  }

  update() {
    this.currentLength += this.growthRate;
    this.y += this.fallSpeed;
    this.x += this.wobble;
    return this.currentLength < this.maxLength && this.y < window.innerHeight;
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = randomInt(1, 3);
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.currentLength);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// ============================================================================
// GRAFFITI CLASS
// ============================================================================
class GraffitiWriter {
  constructor() {
    this.state = {
      currentTag: '',
      tagIndex: 0,
      charIndex: 0,
      phase: 'idle', // idle, spraying, dripping, fading, clearing
      particles: [],
      drips: [],
      canvas: null,
      ctx: null,
      animationId: null,
      cycleTimeout: null,
      colors: [],
      fontSize: 24,
      lineHeight: 32,
      startX: 50,
      startY: 100,
      charWidth: 14,
    };
    this.elements = {};
    this.init();
  }

  async init() {
    await onDOMReady();
    
    if (prefersReducedMotion()) {
      debug('Graffiti disabled: prefers-reduced-motion');
      return;
    }

    injectStyles(GRAFFITI_STYLES, 'lk-graffiti-styles');
    this.createElements();
    this.loadColors();
    this.setupCanvas();
    this.startCycle();
    debug('Graffiti Writer initialized');
  }

  createElements() {
    this.elements.container = createElement('div', { id: 'lk-graffiti', 'aria-hidden': 'true' });
    document.body.appendChild(this.elements.container);
  }

  loadColors() {
    // Get colors from CSS custom properties
    const primary = getCSSVar('--color-primary') || '#F8B400';
    const dark = getCSSVar('--color-header') || '#2d2d2d';
    const white = getCSSVar('--color-bg') || '#FFFFFF';
    const csGreen = getCSSVar('--color-cs-green') || '#00FF00';
    const csRed = getCSSVar('--color-cs-red') || '#FF3333';
    const csBlue = getCSSVar('--color-cs-blue') || '#3399FF';
    const csYellow = getCSSVar('--color-cs-yellow') || '#FFFF00';

    this.state.colors = [primary, dark, white, csGreen, csRed, csBlue, csYellow];
  }

  setupCanvas() {
    this.state.canvas = createElement('canvas', {
      width: 300,
      height: window.innerHeight,
      style: 'display:block;width:100%;height:100%;',
    });
    this.elements.container.appendChild(this.state.canvas);
    this.state.ctx = this.state.canvas.getContext('2d');

    // Font setup
    this.state.ctx.font = `${this.state.fontSize}px '${getCSSVar('--font-family-graffiti') || 'Fira Code'}', monospace`;
    this.state.ctx.textBaseline = 'top';

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    if (this.state.canvas) {
      this.state.canvas.height = window.innerHeight;
    }
  }

  startCycle() {
    if (this.state.animationId) {
      cancelAnimationFrame(this.state.animationId);
    }
    if (this.state.cycleTimeout) {
      clearTimeout(this.state.cycleTimeout);
    }

    this.pickNewTag();
    this.animate();
  }

  pickNewTag() {
    this.state.currentTag = randomChoice(GRAFFITI_TAGS);
    this.state.tagIndex = GRAFFITI_TAGS.indexOf(this.state.currentTag);
    this.state.charIndex = 0;
    this.state.phase = 'spraying';
    this.state.particles = [];
    this.state.drips = [];

    // Random position for tag
    this.state.startX = randomInt(20, 200);
    this.state.startY = randomInt(80, window.innerHeight - 200);
  }

  animate() {
    this.draw();
    this.state.animationId = requestAnimationFrame(() => this.animate());
  }

  draw() {
    const ctx = this.state.ctx;
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);

    // Draw completed characters
    this.drawCompletedChars(ctx);

    // Draw current character being sprayed
    if (this.state.phase === 'spraying' || this.state.phase === 'dripping') {
      this.drawCurrentChar(ctx);
    }

    // Draw particles
    this.drawParticles(ctx);

    // Draw drips
    this.drawDrips(ctx);

    // Update state
    this.updateState();
  }

  drawCompletedChars(ctx) {
    const tag = this.state.currentTag;
    for (let i = 0; i < this.state.charIndex; i++) {
      const char = tag[i];
      const x = this.state.startX + (i * this.state.charWidth);
      const y = this.state.startY;
      const color = this.getCharColor(i);
      
      ctx.fillStyle = color;
      ctx.font = `${this.state.fontSize}px '${getCSSVar('--font-family-graffiti') || 'Fira Code'}', monospace`;
      ctx.fillText(char, x, y);
    }
  }

  drawCurrentChar(ctx) {
    if (this.state.charIndex >= this.state.currentTag.length) return;

    const char = this.state.currentTag[this.state.charIndex];
    const x = this.state.startX + (this.state.charIndex * this.state.charWidth);
    const y = this.state.startY;
    const color = this.getCharColor(this.state.charIndex);

    // Spray particles toward character position
    if (this.state.phase === 'spraying') {
      this.spawnParticles(x, y, color);
    }

    // Draw character with fade-in
    const progress = Math.min(this.state.particles.length / 30, 1);
    ctx.globalAlpha = progress;
    ctx.fillStyle = color;
    ctx.font = `${this.state.fontSize}px '${getCSSVar('--font-family-graffiti') || 'Fira Code'}', monospace`;
    ctx.fillText(char, x, y);
    ctx.globalAlpha = 1;
  }

  spawnParticles(targetX, targetY, color) {
    // Spray from "can" position (right edge)
    const canX = this.state.canvas.width - 20;
    const canY = this.state.startY + this.state.fontSize / 2;

    for (let i = 0; i < 3; i++) {
      const size = randomInt(1, 3);
      this.state.particles.push(new SprayParticle(
        canX + randomInt(-10, 10),
        canY + randomInt(-10, 10),
        targetX + randomInt(-5, 5),
        targetY + randomInt(-5, 5),
        color,
        size,
      ));
    }
  }

  drawParticles(ctx) {
    this.state.particles = this.state.particles.filter(p => {
      const alive = p.update();
      if (alive) p.draw(ctx);
      return alive;
    });
  }

  drawDrips(ctx) {
    this.state.drips = this.state.drips.filter(d => {
      const alive = d.update();
      if (alive) d.draw(ctx);
      return alive;
    });
  }

  updateState() {
    switch (this.state.phase) {
      case 'spraying':
        // Check if current char is done
        if (this.state.particles.length === 0 && this.state.charIndex < this.state.currentTag.length) {
          // Start drips for this character
          this.spawnDrips();
          this.state.charIndex++;
          
          if (this.state.charIndex >= this.state.currentTag.length) {
            this.state.phase = 'dripping';
          }
        }
        break;

      case 'dripping':
        if (this.state.drips.length === 0) {
          this.state.phase = 'fading';
          this.state.cycleTimeout = setTimeout(() => {
            this.state.phase = 'clearing';
            this.clearCanvas();
          }, 5000); // Show tag for 5s
        }
        break;

      case 'fading':
        // Wait for timeout
        break;

      case 'clearing':
        // Canvas cleared, pick new tag
        this.pickNewTag();
        break;
    }
  }

  spawnDrips() {
    const x = this.state.startX + (this.state.charIndex * this.state.charWidth);
    const y = this.state.startY + this.state.fontSize;
    const color = this.getCharColor(this.state.charIndex);
    
    for (let i = 0; i < randomInt(1, 3); i++) {
      this.state.drips.push(new DripParticle(
        x + randomInt(-5, 5),
        y,
        color,
        randomInt(20, 60),
      ));
    }
  }

  clearCanvas() {
    this.state.particles = [];
    this.state.drips = [];
    this.state.phase = 'idle';
    
    // Delay before next tag
    this.state.cycleTimeout = setTimeout(() => {
      this.startCycle();
    }, 1000);
  }

  getCharColor(index) {
    // Cycle through colors
    return this.state.colors[index % this.state.colors.length];
  }

  destroy() {
    if (this.state.animationId) cancelAnimationFrame(this.state.animationId);
    if (this.state.cycleTimeout) clearTimeout(this.state.cycleTimeout);
    if (this.elements.container.parentNode) {
      this.elements.container.remove();
    }
  }
}

// ============================================================================
// INIT
// ============================================================================
let graffitiInstance = null;

export function initGraffiti() {
  if (!CONFIG.features.graffiti) return null;
  if (graffitiInstance) return graffitiInstance;
  graffitiInstance = new GraffitiWriter();
  return graffitiInstance;
}

export { GraffitiWriter };