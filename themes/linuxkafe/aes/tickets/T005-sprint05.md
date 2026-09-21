---
ticket: T005
title: Sprint 05 — Game Polish, Audio & Leaderboard
sprint: sprint-05
priority: medium
status: pending
created: 2026-09-15
---

# T005 — Sprint 05: Game Polish, Audio & Leaderboard

## Context
Expand the retro game (Snake) with polish features: Web Audio API sounds, leaderboard, smoother animations, and game loop optimization.

## Acceptance Criteria
- [ ] **Web Audio API Sounds**: Retro beeps for eat, game over, level up (respects `prefers-reduced-motion` and user gesture)
- [ ] **Leaderboard**: Top 10 scores persisted in localStorage with name entry modal
- [ ] **Game Loop Optimization**: Separate `update()` (fixed timestep) from `draw()` (requestAnimationFrame)
- [ ] **Smoother Animations**: CSS transitions for modal open/close, score counter animation
- [ ] **Particle Effects**: Canvas particles on food eat, game over explosion
- [ ] **Mobile Touch Improvements**: Swipe gestures + D-pad haptic feedback (if supported)
- [ ] **Playwright Tests**: New tests for audio, leaderboard, particles
- [ ] **Docs Updated**: ROADMAP, CHECKLIST, js/README.md

## Scope
**In scope:**
- `js/retro-game.js` enhancements
- New `js/audio.js` module for Web Audio
- Playwright tests in `tests/smoke.spec.js`
- Documentation updates

**Out of scope:**
- Multiplayer/networked features
- Server-side leaderboard
- New game modes (keep Snake only)

## Dependencies
- T001-T004 completed
- Web Audio API (user gesture required)
- localStorage for leaderboard

## Known Risks
- **Audio autoplay policy**: Must handle user gesture requirement gracefully
- **localStorage quota**: Leaderboard ~2KB, well within limits
- **Performance**: Particle effects on low-end mobile — respect `prefers-reduced-motion`

## Notes
- Sounds: 8-bit style (square/sawtooth waves), short duration (<100ms)
- Leaderboard: Name entry on new high score, max 10 entries
- Particles: Canvas-based, respect reduced motion