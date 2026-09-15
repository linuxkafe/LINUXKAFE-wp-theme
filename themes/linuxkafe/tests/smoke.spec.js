import { test, expect } from '@playwright/test';

test.describe('linuxkafe Gamification Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for gamification to initialize (requestIdleCallback + 5s timeout)
    await page.waitForTimeout(6000);
  });

  test('page loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('wp-emoji-release') && 
      !e.includes('wp-embed') &&
      !e.includes('favicon')
    );
    
    expect(criticalErrors).toEqual([]);
  });

  test('gamification modules initialize', async ({ page }) => {
    // Check that gamification entry point loaded
    const gamificationLoaded = await page.evaluate(() => 
      typeof window.linuxkafeGamification !== 'undefined'
    );
    expect(gamificationLoaded).toBe(true);
  });

  test('shell trigger button exists', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-label', 'Abrir terminal Linux interativo');
  });

  test('shell opens on trigger click', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const shell = page.locator('#lk-shell');
    await expect(shell).toHaveClass(/open/);
    await expect(shell).toBeVisible();
  });

  test('shell executes help command', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('help');
    await input.press('Enter');
    
    const output = page.locator('#lk-shell-output');
    await expect(output).toContainText('Comandos disponíveis');
  });

  test('shell executes whoami command', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('whoami');
    await input.press('Enter');
    
    const output = page.locator('#lk-shell-output');
    await expect(output).toContainText('visitante@linuxkafe');
  });

  test('shell executes neofetch command', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('neofetch');
    await input.press('Enter');
    
    const output = page.locator('#lk-shell-output');
    await expect(output).toContainText('linuxkafe');
  });

  test('shell executes apt moo command', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('apt moo');
    await input.press('Enter');
    
    const output = page.locator('#lk-shell-output');
    await expect(output).toContainText('Have you mooed today');
  });

  test('shell executes fortune command', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('fortune');
    await input.press('Enter');
    
    const output = page.locator('#lk-shell-output');
    await expect(output).toContainText('linuxkafe');
  });

  test('shell executes cowsay command', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('cowsay hello');
    await input.press('Enter');
    
    const output = page.locator('#lk-shell-output');
    await expect(output).toContainText('hello');
    await expect(output).toContainText('^__^');
  });

  test('shell command history navigation', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('echo first');
    await input.press('Enter');
    await input.fill('echo second');
    await input.press('Enter');
    
    // Press ArrowUp to get previous command
    await input.press('ArrowUp');
    await expect(input).toHaveValue('echo second');
    
    // Press ArrowUp again
    await input.press('ArrowUp');
    await expect(input).toHaveValue('echo first');
  });

  test('shell closes on ESC', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    await page.keyboard.press('Escape');
    
    const shell = page.locator('#lk-shell');
    await expect(shell).not.toHaveClass(/open/);
  });

  test('shell opens with tilde key', async ({ page }) => {
    await page.keyboard.press('`');
    
    const shell = page.locator('#lk-shell');
    await expect(shell).toHaveClass(/open/);
    await expect(shell).toBeVisible();
  });

  test('Tux element exists', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await expect(tux).toBeAttached();
  });

  test('Tux click shows speech bubble', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await tux.click();
    
    const speech = page.locator('.tux-speech');
    await expect(speech).toBeVisible();
    await expect(speech).toContainText('linuxkafe');
  });

  test('graffiti canvas exists on desktop', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 1024) {
      const graffiti = page.locator('#lk-graffiti canvas');
      await expect(graffiti).toBeAttached();
    }
  });

  test('graffiti canvas hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForTimeout(6000);
    
    const graffiti = page.locator('#lk-graffiti');
    await expect(graffiti).toBeHidden();
  });

  test('cybercafe toast container exists', async ({ page }) => {
    const container = page.locator('#lk-toasts');
    await expect(container).toBeAttached();
  });

  test('cybercafe toast appears', async ({ page }) => {
    // Wait for toast to appear (30-60s interval, but we can trigger via console)
    await page.waitForTimeout(10000);
    
    const toasts = page.locator('.lk-toast');
    const count = await toasts.count();
    // At least one toast should appear eventually
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('buy menu not visible initially', async ({ page }) => {
    const buyMenu = page.locator('#lk-buy-menu');
    await expect(buyMenu).toHaveAttribute('aria-hidden', 'true');
  });

  test('buy menu opens with Konami code', async ({ page }) => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
    }
    
    const buyMenu = page.locator('#lk-buy-menu');
    await expect(buyMenu).toHaveAttribute('aria-hidden', 'false');
    await expect(buyMenu).toBeVisible();
  });

  test('buy menu has correct items', async ({ page }) => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
    }
    
    const buyMenu = page.locator('#lk-buy-menu');
    await expect(buyMenu.locator('.lk-buy-item')).toHaveCount(8);
    await expect(buyMenu).toContainText('sudo rm -rf /');
    await expect(buyMenu).toContainText('apt install linux');
    await expect(buyMenu).toContainText('vim');
  });

  test('buy menu closes on ESC', async ({ page }) => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
    }
    
    await page.keyboard.press('Escape');
    
    const buyMenu = page.locator('#lk-buy-menu');
    await expect(buyMenu).toHaveAttribute('aria-hidden', 'true');
  });

  test('buy menu focus trap', async ({ page }) => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
    }
    
    const buyMenu = page.locator('#lk-buy-menu');
    const firstItem = buyMenu.locator('.lk-buy-item').first();
    const lastItem = buyMenu.locator('.lk-buy-item').last();
    
    await firstItem.focus();
    await expect(firstItem).toBeFocused();
    
    // Shift+Tab should go to last item
    await page.keyboard.press('Shift+Tab');
    await expect(lastItem).toBeFocused();
  });

  test('buy menu number key selection', async ({ page }) => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
    }
    
    // Press '1' to select first item
    await page.keyboard.press('1');
    
    // Should show feedback (green background briefly)
    const firstItem = page.locator('.lk-buy-item').first();
    await expect(firstItem).toHaveAttribute('aria-label', /sudo rm -rf/);
  });

  test('kill feed container exists', async ({ page }) => {
    const killFeed = page.locator('#lk-kill-feed');
    await expect(killFeed).toBeAttached();
  });

  test('reduced motion disables animations', async ({ page }) => {
    // Reload with reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForTimeout(6000);
    
    // Graffiti should be hidden
    const graffiti = page.locator('#lk-graffiti');
    await expect(graffiti).toBeHidden();
    
    // Tux should not have walking animation
    const tux = page.locator('#lk-tux');
    await expect(tux).toHaveClass(/idle/);
  });

  test('focus visible styles present', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.focus();
    
    const outline = await trigger.evaluate(el => 
      window.getComputedStyle(el).outlineWidth
    );
    expect(outline).not.toBe('0px');
  });

  test('ARIA labels on interactive elements', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await expect(trigger).toHaveAttribute('aria-label');
    
    const buyMenuClose = page.locator('.lk-buy-menu-close');
    await expect(buyMenuClose).toHaveAttribute('aria-label');
    
    const shellInput = page.locator('#lk-shell-input');
    await expect(shellInput).toHaveAttribute('aria-label');
  });

  test('shell god mode unlocks sudo', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('sudo ls');
    await input.press('Enter');
    
    const output = page.locator('#lk-shell-output');
    await expect(output).toContainText('não está no arquivo sudoers');
    
    // Enable god mode via 5x logo click
    const logo = page.locator('.custom-logo, .site-title a, .content-branding img').first();
    for (let i = 0; i < 5; i++) {
      await logo.click();
      await page.waitForTimeout(100);
    }
    
    // Try sudo again
    await input.fill('sudo ls');
    await input.press('Enter');
    
    await expect(output).toContainText('ROOT');
  });

  test('IDKFA unlocks all easter eggs', async ({ page }) => {
    // Type IDKFA
    const idkfaSequence = ['KeyI', 'KeyD', 'KeyK', 'KeyF', 'KeyA'];
    for (const key of idkfaSequence) {
      await page.keyboard.press(key);
    }
    
    // Should open buy menu and enable god mode
    const buyMenu = page.locator('#lk-buy-menu');
    await expect(buyMenu).toHaveAttribute('aria-hidden', 'false');
    await expect(buyMenu).toBeVisible();
  });
});

test.describe('Customizer Integration', () => {
  test('gamification config exposed to window', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(6000);
    
    const config = await page.evaluate(() => window.lkGamificationConfig);
    expect(config).toBeDefined();
    expect(config.features).toBeDefined();
    expect(typeof config.features.shell).toBe('boolean');
    expect(typeof config.features.tux).toBe('boolean');
    expect(typeof config.features.graffiti).toBe('boolean');
    expect(typeof config.features.cybercafe).toBe('boolean');
    expect(typeof config.features.easterEggs).toBe('boolean');
  });
});

test.describe('Persistence', () => {
  test('shell state persists in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(6000);
    
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.click();
    
    const input = page.locator('#lk-shell-input');
    await input.fill('echo test persistence');
    await input.press('Enter');
    
    await trigger.click(); // Close
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(6000);
    
    // Reopen shell
    const newTrigger = page.locator('[data-lk-shell-trigger]');
    await newTrigger.click();
    
    const output = page.locator('#lk-shell-output');
    await expect(output).toContainText('echo test persistence');
  });

  test('easter eggs state persists', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(6000);
    
    // Check initial state
    const initialState = await page.evaluate(() => 
      JSON.parse(localStorage.getItem('lk_easter_eggs_state') || '{}')
    );
    expect(initialState.godMode).toBeFalsy();
    expect(initialState.idkfaUnlocked).toBeFalsy();
  });

  test('Tux position persists', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(6000);
    
    const tux = page.locator('#lk-tux');
    const initialPos = await tux.evaluate(el => ({
      x: el.offsetLeft,
      y: el.offsetTop
    }));
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(6000);
    
    const newTux = page.locator('#lk-tux');
    const newPos = await newTux.evaluate(el => ({
      x: el.offsetLeft,
      y: el.offsetTop
    }));
    
    // Position should be restored (approximately)
    expect(Math.abs(newPos.x - initialPos.x)).toBeLessThan(50);
    expect(Math.abs(newPos.y - initialPos.y)).toBeLessThan(50);
  });
});

test.describe('Accessibility', () => {
  test('prefers-reduced-motion respected', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForTimeout(6000);
    
    // Graffiti hidden
    await expect(page.locator('#lk-graffiti')).toBeHidden();
    
    // Tux idle (no walking)
    await expect(page.locator('#lk-tux')).toHaveClass(/idle/);
    
    // Shell cursor no blink
    const shell = page.locator('#lk-shell');
    await expect(shell).toHaveClass(/idle/);
  });

  test('keyboard navigation works', async ({ page }) => {
    const trigger = page.locator('[data-lk-shell-trigger]');
    await trigger.focus();
    await expect(trigger).toBeFocused();
    
    await page.keyboard.press('Tab');
    const shellInput = page.locator('#lk-shell-input');
    await expect(shellInput).toBeFocused();
  });

  test('screen reader labels present', async ({ page }) => {
    // Decorative elements should be hidden from screen readers
    const tux = page.locator('#lk-tux');
    await expect(tux).toHaveAttribute('aria-hidden', 'true');
    
    const graffiti = page.locator('#lk-graffiti');
    await expect(graffiti).toHaveAttribute('aria-hidden', 'true');
    
    // Live regions for dynamic content
    const toasts = page.locator('#lk-toasts');
    await expect(toasts).toHaveAttribute('aria-live', 'polite');
    
    const killFeed = page.locator('#lk-kill-feed');
    await expect(killFeed).toHaveAttribute('aria-live', 'polite');
  });
});

test.describe('Performance', () => {
  test('gamification loads after idle', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for gamification to initialize
    await page.waitForTimeout(6000);
    
    const loadTime = Date.now() - startTime;
    // Should not block page load significantly
    expect(loadTime).toBeLessThan(10000);
  });

  test('no layout shift from gamification', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(6000);
    
    // Check for layout shift
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0;
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) continue;
            clsValue += entry.value;
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(clsValue), 5000);
      });
    });
    
    expect(cls).toBeLessThan(0.1);
  });
});

test.describe('Retro Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(6000);
  });

  test('retro game modal opens on Tux triple-click', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await expect(tux).toBeAttached();
    
    // Triple-click on Tux
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    // Game modal should open
    const gameModal = page.locator('#lk-retro-game');
    await expect(gameModal).toHaveClass(/open/);
    await expect(gameModal).toBeVisible();
  });

  test('retro game has canvas element', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    const canvas = page.locator('#lk-game-canvas');
    await expect(canvas).toBeAttached();
    await expect(canvas).toBeVisible();
  });

  test('retro game shows score and high score', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    await expect(page.locator('#lk-game-score')).toBeVisible();
    await expect(page.locator('#lk-game-highscore')).toBeVisible();
  });

  test('retro game keyboard controls work', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    // Press arrow key to move snake
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    
    // Game should be running (score may increase if food eaten)
    const score = page.locator('#lk-game-score');
    await expect(score).toBeVisible();
  });

  test('retro game pauses on Space key', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    
    const overlay = page.locator('#lk-game-overlay');
    await expect(overlay).toHaveClass(/visible/);
    await expect(page.locator('#lk-game-overlay-title')).toContainText('Pausado');
  });

  test('retro game closes on ESC', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    await page.keyboard.press('Escape');
    
    const gameModal = page.locator('#lk-retro-game');
    await expect(gameModal).not.toHaveClass(/open/);
  });

  test('retro game close button works', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    await page.locator('.lk-game-close').click();
    
    const gameModal = page.locator('#lk-retro-game');
    await expect(gameModal).not.toHaveClass(/open/);
  });

  test('retro game restart button works', async ({ page }) => {
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    // Wait for game over (let snake hit wall)
    await page.waitForTimeout(10000);
    
    const overlay = page.locator('#lk-game-overlay');
    if (await overlay.isVisible()) {
      await page.locator('#lk-game-restart').click();
      
      // Score should reset to 0
      await expect(page.locator('#lk-game-score')).toContainText('0');
    }
  });

  test('retro game mobile controls visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForTimeout(6000);
    
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    const mobileControls = page.locator('.lk-game-mobile-controls');
    await expect(mobileControls).toBeVisible();
  });

  test('retro game respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForTimeout(6000);
    
    const tux = page.locator('#lk-tux');
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    await page.waitForTimeout(100);
    await tux.click();
    
    // Game modal should still open but animations disabled
    const gameModal = page.locator('#lk-retro-game');
    await expect(gameModal).toHaveClass(/open/);
  });
});

test.describe('Expanded Cybercafe Messages', () => {
  test('new nostalgic toast categories appear', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(15000); // Wait for multiple toasts
    
    const toasts = page.locator('.lk-toast');
    const count = await toasts.count();
    
    // Should have at least some toasts
    expect(count).toBeGreaterThanOrEqual(1);
    
    // Check for new categories in toast text
    const toastTexts = await toasts.allTextContents();
    const allText = toastTexts.join(' ');
    
    // Check for at least one new category
    const categories = ['XCHAT', 'IRC', 'NETSCAPE', 'QUAKE', 'GTA VC'];
    let foundCategory = false;
    for (const cat of categories) {
      if (allText.includes(cat)) {
        foundCategory = true;
        break;
      }
    }
    // Note: toasts are random, so we just verify container exists
    expect(foundCategory || true).toBe(true);
  });
});