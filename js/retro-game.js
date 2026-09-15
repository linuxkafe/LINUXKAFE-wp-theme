/**
 * linuxkafe Retro Game — Snake Clone
 * HTML5 Canvas game triggered by triple-click on Tux
 * Vanilla ES module, zero deps, <5KB gzipped
 */

import { CONFIG, eventBus, createElement, injectStyles, debug, onDOMReady, prefersReducedMotion, lsGet, lsSet, getCSSVar } from './core.js';

// ============================================================================
// GAME CONSTANTS
// ============================================================================
const GRID_SIZE = 20;
const INITIAL_SPEED = 150; // ms per tick
const COLORS = {
  bg: '#0a0a0a',
  grid: '#1a1a1a',
  snake: '#F8B400',
  snakeHead: '#FFD600',
  food: '#ef4444',
  text: '#F8B400',
  overlay: 'rgba(0,0,0,0.9)',
};

// ============================================================================
// STYLES
// ============================================================================
const GAME_STYLES = `
/* Retro Game Modal */
#lk-retro-game {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: var(--color-header, #2d2d2d);
  border: 2px solid var(--color-primary, #F8B400);
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 30px rgba(248, 180, 0, 0.2);
  z-index: 5000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
  font-family: var(--font-mono, 'Fira Code', monospace);
  color: var(--color-text-on-dark, #e0e0e0);
  overflow: hidden;
  contain: layout paint style;
}

#lk-retro-game.open {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

.lk-game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-dark, #444);
  background: rgba(0, 0, 0, 0.3);
}

.lk-game-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary, #F8B400);
  letter-spacing: 1px;
}

.lk-game-score {
  display: flex;
  gap: 24px;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

.lk-game-score-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lk-game-score-label {
  color: var(--color-text-light, #888);
}

.lk-game-score-value {
  color: var(--color-primary, #F8B400);
  font-weight: 700;
}

.lk-game-close {
  background: transparent;
  border: 1px solid var(--color-border-dark, #444);
  color: var(--color-text-on-dark, #e0e0e0);
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  transition: all 0.15s;
}

.lk-game-close:hover {
  border-color: var(--color-primary, #F8B400);
  color: var(--color-primary, #F8B400);
}

.lk-game-close:focus-visible {
  outline: 2px solid var(--color-primary, #F8B400);
  outline-offset: 2px;
}

.lk-game-canvas-wrapper {
  position: relative;
  padding: 16px;
}

#lk-game-canvas {
  display: block;
  background: #0a0a0a;
  border: 1px solid var(--color-border-dark, #444);
  border-radius: 4px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.lk-game-overlay {
  position: absolute;
  inset: 16px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid var(--color-border-dark, #444);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.lk-game-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.lk-game-overlay-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary, #F8B400);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.lk-game-overlay-score {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-on-dark, #e0e0e0);
}

.lk-game-overlay-highscore {
  font-size: 1rem;
  color: var(--color-text-light, #888);
}

.lk-game-overlay-highscore span {
  color: var(--color-primary, #F8B400);
  font-weight: 700;
}

.lk-game-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--color-text-light, #888);
}

.lk-game-controls kbd {
  background: rgba(248, 180, 0, 0.15);
  border: 1px solid var(--color-primary, #F8B400);
  border-radius: 3px;
  padding: 2px 8px;
  font-family: inherit;
  color: var(--color-primary, #F8B400);
}

.lk-game-btn {
  background: var(--color-primary, #F8B400);
  color: var(--color-header, #2d2d2d);
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.lk-game-btn:hover {
  background: var(--color-primary-dark, #E6A500);
  transform: translateY(-1px);
}

.lk-game-btn:focus-visible {
  outline: 2px solid var(--color-primary, #F8B400);
  outline-offset: 2px;
}

.lk-game-mobile-controls {
  display: none;
  gap: 8px;
  margin-top: 16px;
}

.lk-game-dpad {
  display: grid;
  grid-template-areas:
    '. up .'
    'left . right'
    '. down .';
  gap: 4px;
}

.lk-game-dpad-btn {
  width: 56px;
  height: 56px;
  background: rgba(248, 180, 0, 0.1);
  border: 1px solid var(--color-primary, #F8B400);
  border-radius: 8px;
  color: var(--color-primary, #F8B400);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.lk-game-dpad-btn:active {
  background: var(--color-primary, #F8B400);
  color: var(--color-header, #2d2d2d);
}

.lk-game-dpad-btn[data-dir="up"] { grid-area: up; }
.lk-game-dpad-btn[data-dir="down"] { grid-area: down; }
.lk-game-dpad-btn[data-dir="left"] { grid-area: left; }
.lk-game-dpad-btn[data-dir="right"] { grid-area: right; }

@media (max-width: 600px) {
  .lk-game-mobile-controls { display: flex; }
  #lk-retro-game { width: 95vw; max-width: none; }
  .lk-game-header { padding: 10px 12px; }
  .lk-game-canvas-wrapper { padding: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  #lk-retro-game { transition: none; }
}
`;

// ============================================================================
// GAME CLASS
// ============================================================================
export class RetroGame {
  constructor() {
    this.state = {
      canvas: null,
      ctx: null,
      gridSize: GRID_SIZE,
      tileCount: 0,
      snake: [],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: 0, y: 0 },
      score: 0,
      highScore: 0,
      gameLoop: null,
      speed: INITIAL_SPEED,
      isRunning: false,
      isPaused: false,
      lastTick: 0,
      elements: {},
    };
    this.audioCtx = null;
    this.init();
  }

  async init() {
    await onDOMReady();
    injectStyles(GAME_STYLES, 'lk-retro-game-styles');
    this.state.highScore = lsGet('lk_retro_highscore', 0);
    this.createElements();
    this.bindEvents();
    this.initAudio();
    debug('Retro Game initialized');
  }

  createElements() {
    this.state.elements.modal = createElement('div', {
      id: 'lk-retro-game',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Jogo Retrô — Snake',
    }, [
      createElement('div', { class: 'lk-game-header' }, [
        createElement('h2', { class: 'lk-game-title' }, 'SNAKE'),
        createElement('div', { class: 'lk-game-score' }, [
          createElement('div', { class: 'lk-game-score-item' }, [
            createElement('span', { class: 'lk-game-score-label' }, 'SCORE'),
            createElement('span', { class: 'lk-game-score-value', id: 'lk-game-score' }, '0'),
          ]),
          createElement('div', { class: 'lk-game-score-item' }, [
            createElement('span', { class: 'lk-game-score-label' }, 'BEST'),
            createElement('span', { class: 'lk-game-score-value', id: 'lk-game-highscore' }, String(this.state.highScore)),
          ]),
        ]),
        createElement('button', {
          class: 'lk-game-close',
          'aria-label': 'Fechar jogo',
          onclick: () => this.close(),
        }, 'Fechar'),
      ]),
      createElement('div', { class: 'lk-game-canvas-wrapper' }, [
        createElement('canvas', {
          id: 'lk-game-canvas',
          width: 400,
          height: 400,
          'aria-hidden': 'true',
        }),
        createElement('div', { class: 'lk-game-overlay', id: 'lk-game-overlay' }, [
          createElement('h3', { class: 'lk-game-overlay-title', id: 'lk-game-overlay-title' }, 'Game Over'),
          createElement('div', { class: 'lk-game-overlay-score', id: 'lk-game-overlay-score' }, '0'),
          createElement('div', { class: 'lk-game-overlay-highscore', id: 'lk-game-overlay-highscore' }, 'Best: <span>0</span>'),
          createElement('div', { class: 'lk-game-controls' }, [
            createElement('div', {}, 'Controles:'),
            createElement('div', {}, '<kbd>WASD</kbd> ou <kbd>Setas</kbd> para mover'),
            createElement('div', {}, '<kbd>Espaço</kbd> para pausar'),
            createElement('div', {}, '<kbd>ESC</kbd> para fechar'),
          ]),
          createElement('button', {
            class: 'lk-game-btn',
            id: 'lk-game-restart',
            onclick: () => this.restart(),
          }, 'Jogar Novamente'),
        ]),
        createElement('div', { class: 'lk-game-mobile-controls' }, [
          createElement('div', { class: 'lk-game-dpad' }, [
            createElement('button', { class: 'lk-game-dpad-btn', 'data-dir': 'up', 'aria-label': 'Cima', ontouchstart: (e) => { e.preventDefault(); this.handleDirection(0, -1); } }, '↑'),
            createElement('button', { class: 'lk-game-dpad-btn', 'data-dir': 'down', 'aria-label': 'Baixo', ontouchstart: (e) => { e.preventDefault(); this.handleDirection(0, 1); } }, '↓'),
            createElement('button', { class: 'lk-game-dpad-btn', 'data-dir': 'left', 'aria-label': 'Esquerda', ontouchstart: (e) => { e.preventDefault(); this.handleDirection(-1, 0); } }, '←'),
            createElement('button', { class: 'lk-game-dpad-btn', 'data-dir': 'right', 'aria-label': 'Direita', ontouchstart: (e) => { e.preventDefault(); this.handleDirection(1, 0); } }, '→'),
          ]),
        ]),
      ]),
    ]);
    document.body.appendChild(this.state.elements.modal);

    this.state.canvas = this.state.elements.modal.querySelector('#lk-game-canvas');
    this.state.ctx = this.state.canvas.getContext('2d');
    this.state.tileCount = this.state.canvas.width / this.state.gridSize;

    this.state.elements.overlay = this.state.elements.modal.querySelector('#lk-game-overlay');
    this.state.elements.overlayTitle = this.state.elements.modal.querySelector('#lk-game-overlay-title');
    this.state.elements.overlayScore = this.state.elements.modal.querySelector('#lk-game-overlay-score');
    this.state.elements.overlayHighscore = this.state.elements.modal.querySelector('#lk-game-overlay-highscore');
    this.state.elements.scoreEl = this.state.elements.modal.querySelector('#lk-game-score');
    this.state.elements.highscoreEl = this.state.elements.modal.querySelector('#lk-game-highscore');
  }

  initAudio() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      debug('Web Audio API not available:', e);
    }
  }

  playTone(frequency, duration, type = 'square') {
    if (!this.audioCtx || prefersReducedMotion()) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors
    }
  }

  bindEvents() {
    // Keyboard
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Close button
    this.state.elements.modal.querySelector('.lk-game-close').addEventListener('click', () => this.close());

    // D-pad buttons (touch)
    this.state.elements.modal.querySelectorAll('.lk-game-dpad-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const dir = btn.dataset.dir;
        const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
        if (dirs[dir]) this.handleDirection(...dirs[dir]);
      });
    });

    // Modal click outside
    this.state.elements.modal.addEventListener('click', (e) => {
      if (e.target === this.state.elements.modal) this.close();
    });

    // ESC key global
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.elements.modal.classList.contains('open')) {
        this.close();
      }
    });

    // Visibility change - pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.isRunning) {
        this.pause();
      }
    });
  }

  handleKeydown(e) {
    const key = e.key.toLowerCase();
    const dirs = {
      'arrowup': [0, -1], 'w': [0, -1],
      'arrowdown': [0, 1], 's': [0, 1],
      'arrowleft': [-1, 0], 'a': [-1, 0],
      'arrowright': [1, 0], 'd': [1, 0],
    };

    if (dirs[key]) {
      e.preventDefault();
      this.handleDirection(...dirs[key]);
      return;
    }

    if (key === ' ' || key === 'space') {
      e.preventDefault();
      this.togglePause();
    }
  }

  handleDirection(x, y) {
    // Prevent 180-degree turns
    if (this.state.direction.x === -x && this.state.direction.y === -y) return;
    this.state.nextDirection = { x, y };
  }

  open() {
    this.state.elements.modal.classList.add('open');
    this.state.elements.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus management
    const closeBtn = this.state.elements.modal.querySelector('.lk-game-close');
    closeBtn.focus();

    // Reset and start game
    this.reset();
    this.start();

    eventBus.emit('retroGame:open');
    debug('Retro Game opened');
  }

  close() {
    this.state.elements.modal.classList.remove('open');
    this.state.elements.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.pause();
    eventBus.emit('retroGame:close');
    debug('Retro Game closed');
  }

  reset() {
    const center = Math.floor(this.state.tileCount / 2);
    this.state.snake = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ];
    this.state.direction = { x: 1, y: 0 };
    this.state.nextDirection = { x: 1, y: 0 };
    this.state.score = 0;
    this.state.speed = INITIAL_SPEED;
    this.state.isPaused = false;
    this.spawnFood();
    this.updateScoreDisplay();
    this.hideOverlay();
  }

  start() {
    if (this.state.isRunning) return;
    this.state.isRunning = true;
    this.state.lastTick = performance.now();
    this.gameLoop = requestAnimationFrame((ts) => this.tick(ts));
  }

  pause() {
    this.state.isPaused = true;
    if (this.state.gameLoop) {
      cancelAnimationFrame(this.state.gameLoop);
      this.state.gameLoop = null;
    }
    this.showOverlay('Pausado', 'Pressione Espaço para continuar');
  }

  togglePause() {
    if (this.state.isPaused) {
      this.state.isPaused = false;
      this.hideOverlay();
      this.state.lastTick = performance.now();
      this.gameLoop = requestAnimationFrame((ts) => this.tick(ts));
    } else {
      this.pause();
    }
  }

  tick(timestamp) {
    if (!this.state.isRunning) return;

    const elapsed = timestamp - this.state.lastTick;
    if (elapsed >= this.state.speed) {
      this.update();
      this.draw();
      this.state.lastTick = timestamp;
    }

    if (this.state.isRunning) {
      this.state.gameLoop = requestAnimationFrame((ts) => this.tick(ts));
    }
  }

  update() {
    if (this.state.isPaused) return;

    // Update direction
    this.state.direction = { ...this.state.nextDirection };

    // Calculate new head position
    const head = this.state.snake[0];
    const newHead = {
      x: head.x + this.state.direction.x,
      y: head.y + this.state.direction.y,
    };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= this.state.tileCount ||
        newHead.y < 0 || newHead.y >= this.state.tileCount) {
      this.gameOver();
      return;
    }

    // Self collision
    for (const segment of this.state.snake) {
      if (segment.x === newHead.x && segment.y === newHead.y) {
        this.gameOver();
        return;
      }
    }

    // Move snake
    this.state.snake.unshift(newHead);

    // Food collision
    if (newHead.x === this.state.food.x && newHead.y === this.state.food.y) {
      this.state.score += 10;
      this.updateScoreDisplay();
      this.playTone(880, 0.1);
      this.spawnFood();
      // Increase speed slightly every 50 points
      if (this.state.score % 50 === 0 && this.state.speed > 60) {
        this.state.speed -= 5;
      }
    } else {
      this.state.snake.pop();
    }
  }

  spawnFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.state.tileCount),
        y: Math.floor(Math.random() * this.state.tileCount),
      };
    } while (this.state.snake.some(s => s.x === newFood.x && s.y === newFood.y));
    this.state.food = newFood;
  }

  draw() {
    const ctx = this.state.ctx;
    const gs = this.state.gridSize;

    // Clear
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= this.state.tileCount; i++) {
      const pos = i * gs;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, this.state.canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(this.state.canvas.width, pos);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = COLORS.food;
    ctx.fillRect(
      this.state.food.x * gs + 1,
      this.state.food.y * gs + 1,
      gs - 2,
      gs - 2,
    );

    // Snake body
    this.state.snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? COLORS.snakeHead : COLORS.snake;
      ctx.fillRect(
        segment.x * gs + 1,
        segment.y * gs + 1,
        gs - 2,
        gs - 2,
      );
    });
  }

  gameOver() {
    this.state.isRunning = false;
    if (this.state.gameLoop) {
      cancelAnimationFrame(this.state.gameLoop);
      this.state.gameLoop = null;
    }

    // Update high score
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      lsSet('lk_retro_highscore', this.state.highScore);
      this.state.elements.highscoreEl.textContent = String(this.state.highScore);
    }

    this.playTone(220, 0.3, 'sawtooth');
    this.showOverlay('Game Over', this.state.score);
  }

  showOverlay(title, score) {
    this.state.elements.overlayTitle.textContent = title;
    this.state.elements.overlayScore.textContent = String(score);
    this.state.elements.overlayHighscore.innerHTML = `Best: <span>${this.state.highScore}</span>`;
    this.state.elements.overlay.classList.add('visible');
  }

  hideOverlay() {
    this.state.elements.overlay.classList.remove('visible');
  }

  updateScoreDisplay() {
    this.state.elements.scoreEl.textContent = String(this.state.score);
  }

  restart() {
    this.reset();
    this.start();
  }

  destroy() {
    this.pause();
    if (this.state.elements.modal.parentNode) {
      this.state.elements.modal.remove();
    }
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }
}

// ============================================================================
// INIT
// ============================================================================
let retroGameInstance = null;

export function initRetroGame() {
  if (!CONFIG.features.easterEggs) return null;
  if (retroGameInstance) return retroGameInstance;
  retroGameInstance = new RetroGame();
  return retroGameInstance;
}