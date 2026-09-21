/**
 * linuxkafe Audio — Web Audio API
 * Retro 8-bit sound effects for the Snake game
 * Respects user gesture requirement and prefers-reduced-motion
 */

import { prefersReducedMotion, debug } from './core.js';

const AUDIO_CONFIG = {
  enabled: true,
  volume: 0.15,
  userGestureReceived: false,
};

let audioContext = null;

/**
 * Initialize AudioContext (requires user gesture)
 */
export function initAudio() {
  if (prefersReducedMotion()) {
    debug('Audio disabled: prefers-reduced-motion');
    AUDIO_CONFIG.enabled = false;
    return;
  }

  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    
    // Resume on first user gesture
    const resumeAudio = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          AUDIO_CONFIG.userGestureReceived = true;
          debug('AudioContext resumed');
        });
      }
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
      document.removeEventListener('touchstart', resumeAudio);
    };
    
    document.addEventListener('click', resumeAudio, { once: true, passive: true });
    document.addEventListener('keydown', resumeAudio, { once: true, passive: true });
    document.addEventListener('touchstart', resumeAudio, { once: true, passive: true });
    
    debug('Audio initialized');
  } catch (e) {
    debug('Web Audio API not available:', e);
    AUDIO_CONFIG.enabled = false;
  }
}

/**
 * Play a retro beep tone
 */
export function playTone(frequency, duration, type = 'square', volume = AUDIO_CONFIG.volume) {
  if (!AUDIO_CONFIG.enabled || !audioContext || audioContext.state !== 'running') {
    return;
  }

  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (e) {
    debug('Audio play error:', e);
  }
}

/**
 * Predefined sound effects
 */
export const SOUNDS = {
  eat: () => playTone(880, 0.08, 'square', 0.12),
  eatBonus: () => {
    playTone(1046, 0.1, 'square', 0.15);
    setTimeout(() => playTone(1318, 0.1, 'square', 0.12), 50);
  },
  gameOver: () => {
    playTone(329, 0.3, 'sawtooth', 0.18);
    setTimeout(() => playTone(246, 0.3, 'sawtooth', 0.15), 150);
    setTimeout(() => playTone(196, 0.5, 'sawtooth', 0.12), 300);
  },
  levelUp: () => {
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'square', 0.12), i * 80);
    });
  },
  start: () => {
    playTone(440, 0.1, 'square', 0.1);
    setTimeout(() => playTone(554, 0.1, 'square', 0.1), 80);
    setTimeout(() => playTone(659, 0.15, 'square', 0.12), 160);
  },
  pause: () => playTone(329, 0.15, 'sine', 0.1),
  unpause: () => {
    playTone(440, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(523, 0.1, 'sine', 0.1), 80);
  },
  move: () => playTone(220, 0.03, 'square', 0.05), // subtle move sound
};

export function setVolume(volume) {
  AUDIO_CONFIG.volume = Math.max(0, Math.min(1, volume));
}

export function toggleAudio(enabled) {
  AUDIO_CONFIG.enabled = enabled;
}

export { AUDIO_CONFIG };