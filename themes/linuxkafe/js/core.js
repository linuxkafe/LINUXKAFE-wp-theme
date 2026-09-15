/**
 * linuxkafe Gamification Core
 * Event bus, config, utilities — vanilla ESM, zero deps
 */

// ============================================================================
// CONFIG
// ============================================================================
const DEFAULT_CONFIG = {
  // Feature flags (podem ser sobrescritos via WP localize_script)
  features: {
    shell: true,
    tux: true,
    graffiti: true,
    cybercafe: true,
    csHud: true,
    easterEggs: true,
  },

  // Timing
  timing: {
    cybercafeMinInterval: 30000,   // 30s
    cybercafeMaxInterval: 60000,   // 60s
    cybercafeMaxVisible: 3,
    cybercafeAutoDismiss: 8000,    // 8s
    graffitiCycleDuration: 15000,  // 15s por tag
    tuxIdleThreshold: 10000,       // 10s sem interação = dorme
    shellAnimationDuration: 300,   // ms
  },

  // Selectors
  selectors: {
    shellTrigger: '[data-lk-shell-trigger]',
    shellContainer: '#lk-shell',
    tuxContainer: '#lk-tux',
    graffitiContainer: '#lk-graffiti',
    toastContainer: '#lk-toasts',
    buyMenuContainer: '#lk-buy-menu',
  },

  // Easter egg sequences
  konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
  godModeClicks: 5,
  idkfaSequence: ['KeyI', 'KeyD', 'KeyK', 'KeyF', 'KeyA'],
};

// Merge with WordPress localized config if available
function mergeConfig() {
  const wpConfig = typeof window !== 'undefined' && window.lkGamificationConfig ? window.lkGamificationConfig : {};
  return {
    ...DEFAULT_CONFIG,
    ...wpConfig,
    features: { ...DEFAULT_CONFIG.features, ...(wpConfig.features || {}) },
    timing: { ...DEFAULT_CONFIG.timing, ...(wpConfig.timing || {}) },
  };
}

export const CONFIG = mergeConfig();

// ============================================================================
// EVENT BUS (Pub/Sub simples)
// ============================================================================
export class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event, data) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[EventBus] Error in ${event}:`, err);
        }
      });
    }
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

export const eventBus = new EventBus();

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Debounce function
 */
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Random integer between min (inclusive) and max (inclusive)
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random element from array
 */
export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get CSS custom property value
 */
export function getCSSVar(name, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

/**
 * Set CSS custom property
 */
export function setCSSVar(name, value, element = document.documentElement) {
  element.style.setProperty(name, value);
}

/**
 * Check prefers-reduced-motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Lazy load callback using requestIdleCallback with fallback
 */
export function requestIdleCallbackPolyfill(callback, options = {}) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  // Fallback: setTimeout after 1ms
  return setTimeout(() => {
    const start = performance.now();
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (performance.now() - start)),
    });
  }, 1);
}

/**
 * Cancel idle callback polyfill
 */
export function cancelIdleCallbackPolyfill(id) {
  if ('cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id);
  }
  clearTimeout(id);
}

/**
 * Simple debug logger (noop in production if needed)
 */
export function debug(...args) {
  if (CONFIG.debug || localStorage.getItem('lk_debug') === 'true') {
    console.log('[linuxkafe]', ...args);
  }
}

/**
 * Create element with attributes and children
 */
export function createElement(tag, attributes = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });
  children.flat().forEach(child => {
    if (child instanceof Node) {
      el.appendChild(child);
    } else if (child != null) {
      el.appendChild(document.createTextNode(String(child)));
    }
  });
  return el;
}

/**
 * Inject stylesheet
 */
export function injectStyles(css, id) {
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}

/**
 * Wait for DOM ready
 */
export function onDOMReady() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    } else {
      resolve();
    }
  });
}

/**
 * Generate unique ID
 */
export function uid(prefix = 'lk') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================================
// LOCALSTORAGE UTILITIES
// ============================================================================

/**
 * Safe localStorage getter with fallback
 */
export function lsGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    debug('localStorage get error:', key, e);
    return defaultValue;
  }
}

/**
 * Safe localStorage setter
 */
export function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    debug('localStorage set error:', key, e);
    return false;
  }
}

/**
 * Safe localStorage remover
 */
export function lsRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    debug('localStorage remove error:', key, e);
    return false;
  }
}

/**
 * Migrate old sessionStorage keys to localStorage
 */
export function migrateStorage(oldKey, newKey) {
  try {
    const sessionData = sessionStorage.getItem(oldKey);
    if (sessionData && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, sessionData);
      sessionStorage.removeItem(oldKey);
      debug('Migrated', oldKey, '→', newKey);
    }
  } catch (e) {
    debug('Migration error:', e);
  }
}

// ============================================================================
// KEYBOARD SEQUENCE DETECTOR
// ============================================================================
export class SequenceDetector {
  constructor(sequence, callback) {
    this.sequence = sequence;
    this.callback = callback;
    this.buffer = [];
    this.boundHandler = this.handleKey.bind(this);
  }

  start() {
    document.addEventListener('keydown', this.boundHandler);
  }

  stop() {
    document.removeEventListener('keydown', this.boundHandler);
  }

  handleKey(event) {
    this.buffer.push(event.code);
    if (this.buffer.length > this.sequence.length) {
      this.buffer.shift();
    }
    if (this.buffer.join(',') === this.sequence.join(',')) {
      this.callback();
      this.buffer = []; // Reset after match
    }
  }
}