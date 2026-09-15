/**
 * linuxkafe Gamification — Main Entry Point
 * Inicializa todos os módulos de gamificação
 */

import { CONFIG, requestIdleCallbackPolyfill, cancelIdleCallbackPolyfill, debug, onDOMReady } from './core.js';
import { initShell } from './shell.js';
import { initTux } from './tux.js';
import { initGraffiti } from './graffiti.js';
import { initCybercafe } from './cybercafe.js';
import { initEasterEggs } from './easter-eggs.js';
import { initAnalytics } from './analytics.js';
import { initRetroGame } from './retro-game.js';

// ============================================================================
// GLOBAL STATE
// ============================================================================
let idleCallbackId = null;
let modulesInitialized = false;

// ============================================================================
// INITIALIZATION
// ============================================================================
async function initGamification() {
  if (modulesInitialized) {
    debug('Gamification already initialized');
    return;
  }

  debug('Initializing linuxkafe gamification...');

  // Wait for DOM
  await onDOMReady();

  // Initialize all modules
  initShell();
  initTux();
  initGraffiti();
  initCybercafe();
  initEasterEggs();
  initAnalytics();
  retroGameInstance = initRetroGame();

  modulesInitialized = true;
  debug('All gamification modules initialized');
}

// ============================================================================
// LAZY LOAD
// ============================================================================
function scheduleLazyInit() {
  // Use requestIdleCallback with fallback
  idleCallbackId = requestIdleCallbackPolyfill((deadline) => {
    if (deadline.timeRemaining() > 10 || deadline.didTimeout) {
      initGamification();
    } else {
      // Not enough time, reschedule
      scheduleLazyInit();
    }
  }, { timeout: 5000 }); // Force after 5s max
}

// ============================================================================
// START
// ============================================================================
// If document already loaded, init immediately (but still deferred)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleLazyInit, { once: true });
} else {
  scheduleLazyInit();
}

// ============================================================================
// EXPORTS (for debugging)
// ============================================================================
let retroGameInstance = null;

if (typeof window !== 'undefined') {
  window.linuxkafeGamification = {
    CONFIG,
    init: initGamification,
    version: '2.1.0-gamified',
    get retroGame() { return retroGameInstance; },
    set retroGame(val) { retroGameInstance = val; },
  };
}

// ============================================================================
// CLEANUP ON PAGE UNLOAD (for SPA navigation if any)
// ============================================================================
window.addEventListener('beforeunload', () => {
  if (idleCallbackId) {
    cancelIdleCallbackPolyfill(idleCallbackId);
  }
}, { once: true });

export { initGamification, CONFIG };