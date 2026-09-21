/**
 * linuxkafe Analytics
 * Event tracking for gamification interactions
 * Supports Plausible, GA4, and custom endpoints
 */

import { CONFIG, eventBus, debug } from './core.js';

const ANALYTICS_ENDPOINT = '/wp-json/linuxkafe/v1/analytics';
const EVENTS = {
  shell_open: 'shell_open',
  shell_close: 'shell_close',
  shell_command: 'shell_command',
  tux_click: 'tux_click',
  tux_god_mode: 'tux_god_mode',
  konami_code: 'konami_code',
  god_mode_toggle: 'god_mode_toggle',
  idkfa_unlock: 'idkfa_unlock',
  buy_menu_open: 'buy_menu_open',
  buy_item: 'buy_item',
  kill_feed: 'kill_feed',
  graffiti_cycle: 'graffiti_cycle',
  cybercafe_toast: 'cybercafe_toast',
};

function getAnalyticsConfig() {
  return window.lkAnalyticsConfig || {
    plausible: false,
    ga4: false,
    customEndpoint: ANALYTICS_ENDPOINT,
  };
}

function sendEvent(eventName, properties = {}) {
  const config = getAnalyticsConfig();
  const payload = {
    event: eventName,
    timestamp: Date.now(),
    url: window.location.href,
    referrer: document.referrer,
    ...properties,
  };

  debug('Analytics event:', eventName, properties);

  // Plausible
  if (config.plausible && window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // GA4
  if (config.ga4 && window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Custom endpoint (non-blocking)
  if (config.customEndpoint) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(config.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {
      // Silently fail - analytics should never break UX
    }).finally(() => clearTimeout(timeoutId));
  }
}

export function initAnalytics() {
  if (!CONFIG.features.easterEggs && !CONFIG.features.shell && !CONFIG.features.tux) {
    return;
  }

  // Listen for gamification events
  eventBus.on('shell:open', () => sendEvent(EVENTS.shell_open));
  eventBus.on('shell:close', () => sendEvent(EVENTS.shell_close));
  eventBus.on('shell:command', (cmd) => sendEvent(EVENTS.shell_command, { command: cmd }));
  eventBus.on('tux:click', () => sendEvent(EVENTS.tux_click));
  eventBus.on('tux:godmode', () => sendEvent(EVENTS.tux_god_mode));
  eventBus.on('konami', () => sendEvent(EVENTS.konami_code));
  eventBus.on('godmode:toggle', (enabled) => sendEvent(EVENTS.god_mode_toggle, { enabled }));
  eventBus.on('idkfa', () => sendEvent(EVENTS.idkfa_unlock));
  eventBus.on('buyMenu:open', () => sendEvent(EVENTS.buy_menu_open));
  eventBus.on('buy:item', (item) => sendEvent(EVENTS.buy_item, { item: item.name }));
  eventBus.on('killfeed', (msg) => sendEvent(EVENTS.kill_feed, { message: msg }));
  eventBus.on('graffiti:cycle', (tag) => sendEvent(EVENTS.graffiti_cycle, { tag }));
  eventBus.on('cybercafe:toast', (toast) => sendEvent(EVENTS.cybercafe_toast, { title: toast.title }));

  debug('Analytics initialized');
}

export { sendEvent, EVENTS };