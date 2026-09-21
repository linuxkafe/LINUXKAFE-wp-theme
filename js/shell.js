/**
 * linuxkafe Shell Terminal
 * Terminal interativo estilo anos 2000
 */

import { CONFIG, eventBus, createElement, injectStyles, debug, uid, onDOMReady, prefersReducedMotion, getCSSVar, lsGet, lsSet, migrateStorage } from './core.js';

// ============================================================================
// STYLES
// ============================================================================
const SHELL_STYLES = `
/* Shell Terminal */
#lk-shell {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 90vw;
  max-width: 700px;
  max-height: 70vh;
  background: var(--color-header, #2d2d2d);
  border: 1px solid var(--color-primary, #F8B400);
  border-radius: var(--border-radius, 8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(248, 180, 0, 0.15);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.9rem;
  color: var(--color-text-on-dark, #e0e0e0);
  transform: translateY(100%) scale(0.95);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out;
  contain: layout paint style;
}

#lk-shell.open {
  transform: translateY(0) scale(1);
  opacity: 1;
}

#lk-shell.minimized {
  transform: translateY(calc(100% - 44px)) scale(0.95);
  opacity: 0.7;
  max-height: 44px;
}

.lk-shell-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--color-border-dark, #444);
  user-select: none;
  cursor: default;
}

.lk-shell-title {
  font-weight: 500;
  color: var(--color-primary, #F8B400);
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.lk-shell-controls {
  display: flex;
  gap: 6px;
}

.lk-shell-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-text-on-dark, #e0e0e0);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  transition: all 0.15s ease;
}

.lk-shell-btn:hover {
  background: rgba(248, 180, 0, 0.15);
  border-color: var(--color-primary, #F8B400);
  color: var(--color-primary, #F8B400);
}

.lk-shell-btn:focus-visible {
  outline: 2px solid var(--color-primary, #F8B400);
  outline-offset: 2px;
}

.lk-shell-output {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.lk-shell-output::-webkit-scrollbar {
  width: 8px;
}

.lk-shell-output::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.lk-shell-output::-webkit-scrollbar-thumb {
  background: var(--color-primary, #F8B400);
  border-radius: 4px;
}

.lk-shell-line {
  margin: 2px 0;
}

.lk-shell-prompt-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.lk-shell-prompt {
  color: var(--color-primary, #F8B400);
  white-space: nowrap;
  flex-shrink: 0;
}

.lk-shell-input {
  flex: 1;
  background: transparent;
  border: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  caret-color: var(--color-primary, #F8B400);
}

.lk-shell-cursor {
  display: inline-block;
  width: 8px;
  height: 1.2em;
  background: var(--color-primary, #F8B400);
  animation: lk-blink 1s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 2px;
}

@keyframes lk-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .lk-shell-cursor { animation: none; opacity: 1; }
  #lk-shell { transition: none; }
}

.lk-shell-output .command { color: var(--color-cs-green, #00FF00); }
.lk-shell-output .output { color: var(--color-text-on-dark, #e0e0e0); }
.lk-shell-output .error { color: var(--color-cs-red, #FF3333); }
.lk-shell-output .info { color: var(--color-cs-blue, #3399FF); }
.lk-shell-output .warning { color: var(--color-cs-yellow, #FFFF00); }
.lk-shell-output .ascii { color: var(--color-primary, #F8B400); line-height: 1.1; }

/* Trigger button */
[data-lk-shell-trigger] {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-header, #2d2d2d);
  border: 2px solid var(--color-primary, #F8B400);
  color: var(--color-primary, #F8B400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 1rem;
  font-weight: bold;
  z-index: 2999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

[data-lk-shell-trigger]:hover {
  background: var(--color-primary, #F8B400);
  color: var(--color-header, #2d2d2d);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(248, 180, 0, 0.4);
}

[data-lk-shell-trigger]:focus-visible {
  outline: 2px solid var(--color-primary, #F8B400);
  outline-offset: 3px;
}

[data-lk-shell-trigger].hidden {
  display: none;
}

@media (max-width: 600px) {
  #lk-shell {
    width: calc(100vw - 20px);
    right: 10px;
    left: 10px;
    max-width: none;
    bottom: 10px;
    max-height: 80vh;
  }
  [data-lk-shell-trigger] {
    right: 10px;
    bottom: 10px;
  }
}
`;

// ============================================================================
// COMMANDS
// ============================================================================
const COMMANDS = {
  help: {
    description: 'Mostra comandos disponíveis',
    execute: () => ({
      lines: [
        { type: 'info', text: 'Comandos disponíveis:' },
        { type: 'output', text: '' },
        { type: 'command', text: '  help              - Mostra esta ajuda' },
        { type: 'command', text: '  whoami            - Mostra usuario atual' },
        { type: 'command', text: '  ls [dir]          - Lista arquivos' },
        { type: 'command', text: '  cat <arquivo>     - Mostra conteúdo' },
        { type: 'command', text: '  neofetch          - Info do sistema (fake)' },
        { type: 'command', text: '  cmatrix           - Matrix rain (fake)' },
        { type: 'command', text: '  apt moo           - Easter egg do apt' },
        { type: 'command', text: '  fortune           - Conselho aleatório' },
        { type: 'command', text: '  cowsay <msg>      - Vaca falante' },
        { type: 'command', text: '  sudo <cmd>        - Executa como root (precisa god mode)' },
        { type: 'command', text: '  clear             - Limpa terminal' },
        { type: 'command', text: '  exit              - Fecha terminal' },
      ],
    });
  },

  whoami: {
    description: 'Mostra usuario atual',
    execute: (args, state) => ({
      lines: [
        { type: 'output', text: state.isGodMode ? 'root (god mode)' : 'visitante@linuxkafe' },
      ],
    });
  },

  ls: {
    description: 'Lista arquivos',
    execute: (args) => {
      const dirs = ['Documentos', 'Downloads', 'Imagens', 'Musica', 'Videos', 'Area de Trabalho'];
      const files = ['readme.txt', 'todo.md', 'senhas.txt', 'photo.jpg', 'script.sh'];
      const target = args[0] || '.';
      return {
        lines: [
          { type: 'output', text: `${target}/` },
          ...dirs.map(d => ({ type: 'output', text: `  📁 ${d}/` })),
          ...files.map(f => ({ type: 'output', text: `  📄 ${f}` })),
        ],
      };
    },
  },

  cat: {
    description: 'Mostra conteúdo de arquivo',
    execute: (args) => {
      const file = args[0];
      const contents = {
        'readme.txt': 'Bem-vindo ao linuxkafe!\n\nEste é um cybercafé virtual inspirado nos anos 2000.\nAqui você encontra:\n- Shell Linux interativo\n- Tux passeando pela tela\n- Graffiti digital\n- Referências a CS 1.6\n- Easter eggs escondidos\n\nDigite "help" para ver comandos.',
        'todo.md': '- [x] Instalar Linux\n- [x] Jogar CS 1.6\n- [x] Configurar MSN\n- [ ] Aprender vim\n- [ ] Compilar kernel\n- [ ] Converter amigos ao Linux',
        'senhas.txt': 'senha123\nadmin123\nlinuxkafe2024\n# Brincadeira! Use gerenciador de senhas :)',
      };
      if (!file) {
        return { lines: [{ type: 'error', text: 'cat: arquivo não especificado' }] };
      }
      if (!contents[file]) {
        return { lines: [{ type: 'error', text: `cat: ${file}: Arquivo ou diretório inexistente` }] };
      }
      return { lines: [{ type: 'output', text: contents[file] }] };
    },
  },

  neofetch: {
    description: 'Info do sistema (fake)',
    execute: () => ({
      lines: [
        { type: 'ascii', text: '            .:-=++++=-:.            visitante@linuxkafe' },
        { type: 'ascii', text: '         .:+++=-:.    .-=+++:.        ----------------' },
        { type: 'ascii', text: '       .++++:.             .:++++.      OS: linuxkafe 2.1.0-gamified' },
        { type: 'ascii', text: '      :+++.      ..      .:+++.       Kernel: 6.9.0-ck-generic' },
        { type: 'ascii', text: '     .+++.    .:+++:.    .+++.        Uptime: 23 anos, 4 meses' },
        { type: 'ascii', text: '    .+++.   .++++++++.   .+++.        Shell: bash 5.2' },
        { type: 'ascii', text: '   .+++.   .++++++++.   .+++.         Terminal: linuxkafe-shell' },
        { type: 'ascii', text: '  .+++.    .:++++:.    .+++.          CPU: Pentium III (simulado)' },
        { type: 'ascii', text: '  ++++      .::::.      ++++          GPU: Software rendering' },
        { type: 'ascii', text: ' .+++                      .+++         Mem: 512MB / 1GB' },
        { type: 'ascii', text: ' .++                        ++.         Disk: 20GB / 40GB' },
        { type: 'ascii', text: ' .++                        ++.         ' },
        { type: 'ascii', text: '  +++                    +++          "A liberdade não é grátis,"' },
        { type: 'ascii', text: '   +++                +++           "mas o Linux é." - Linus' },
        { type: 'ascii', text: '    +++            +++            ' },
        { type: 'ascii', text: '     +++        +++             ' },
      ],
    });
  },

  cmatrix: {
    description: 'Matrix rain (fake)',
    execute: () => ({
      lines: [
        { type: 'output', text: 'Iniciando matrix rain...' },
        { type: 'ascii', text: '  ﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱ' },
        { type: 'ascii', text: '  ﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱ' },
        { type: 'ascii', text: '  ﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱﾊｱ' },
        { type: 'output', text: '... (pressione Ctrl+C para parar na vida real)' },
        { type: 'output', text: 'Dica: no terminal real: cmatrix -b -C yellow' },
      ],
    });
  },

  'apt moo': {
    description: 'Easter egg do apt',
    execute: () => ({
      lines: [
        { type: 'ascii', text: '         (____)' },
        { type: 'ascii', text: '         (oo)' },
        { type: 'ascii', text: '   /------\\/' },
        { type: 'ascii', text: '  / |    ||  ' },
        { type: 'ascii', text: ' *  /\\---/\\  ' },
        { type: 'ascii', text: '    ~~   ~~   ' },
        { type: 'output', text: '"Have you mooed today?"' },
      ],
    });
  },

  fortune: {
    description: 'Conselho aleatório',
    execute: () => {
      const fortunes = [
        'O código que você escreve hoje será legado amanhã.',
        'rm -rf / não resolve bugs, só cria outros maiores.',
        'Sempre faça backup. Sempre.',
        'A melhor documentacao é o código limpo.',
        'Não otimize prematuramente. Meça primeiro.',
        'Linux é como uma tenda: sem Windows, sem Gates, Apache dentro.',
        'There are 10 types of people: those who understand binary and those who don\'t.',
        'sudo make me a sandwich.',
        'git push --force: a roleta russa do desenvolvedor.',
        'Comentários são desculpas para código confuso.',
      ];
      return { lines: [{ type: 'output', text: randomChoice(fortunes) }] };
    },
  },

  cowsay: {
    description: 'Vaca falante',
    execute: (args) => {
      const msg = args.join(' ') || 'Moo!';
      const len = Math.max(msg.length, 4);
      const top = ' ' + '_'.repeat(len + 2);
      const mid = `< ${msg} >`;
      const bot = ' ' + '-'.repeat(len + 2);
      return {
        lines: [
          { type: 'ascii', text: top },
          { type: 'ascii', text: mid },
          { type: 'ascii', text: bot },
          { type: 'ascii', text: '        \\   ^__^' },
          { type: 'ascii', text: '         \\  (oo)\\_______' },
          { type: 'ascii', text: '            (__)\\       )\\/\\' },
          { type: 'ascii', text: '                ||----w |' },
          { type: 'ascii', text: '                ||     ||' },
        ],
      };
    },
  },

  sudo: {
    description: 'Executa como root (precisa god mode)',
    execute: (args, state) => {
      if (!state.isGodMode) {
        return {
          lines: [
            { type: 'error', text: '[sudo] senha para visitante:' },
            { type: 'error', text: 'visitante não está no arquivo sudoers. Este incidente será reportado.' },
            { type: 'info', text: 'Dica: clique 5x no logo para god mode' },
          ],
        };
      }
      const cmd = args[0];
      if (!cmd) {
        return { lines: [{ type: 'error', text: 'sudo: comando não especificado' }] };
      }
      return {
        lines: [
          { type: 'warning', text: `[ROOT] Executando: ${cmd} ${args.slice(1).join(' ')}` },
          { type: 'output', text: '(simulacao) Comando executado com privilégios de root.' },
        ],
      };
    },
  },

  clear: {
    description: 'Limpa terminal',
    execute: () => ({ lines: [], clear: true }),
  },

  exit: {
    description: 'Fecha terminal',
    execute: () => ({ lines: [], exit: true }),
  },
};

// ============================================================================
// SHELL CLASS
// ============================================================================
export class Shell {
  constructor() {
    this.state = {
      isOpen: false,
      isMinimized: false,
      history: [],
      historyIndex: -1,
      currentInput: '',
      isGodMode: false,
      unlockedEggs: new Set(),
    };
    this.elements = {};
    this.init();
  }

  async init() {
    await onDOMReady();
    injectStyles(SHELL_STYLES, 'lk-shell-styles');
    this.createElements();
    this.bindEvents();
    this.loadState();
    debug('Shell initialized');
  }

  createElements() {
    // Trigger button
    this.elements.trigger = createElement('button', {
      'data-lk-shell-trigger': '',
      'aria-label': 'Abrir terminal Linux interativo',
      'aria-expanded': 'false',
      title: 'Terminal Linux (~ para abrir)',
    }, '>_');
    document.body.appendChild(this.elements.trigger);

    // Shell container
    this.elements.container = createElement('div', {
      id: 'lk-shell',
      role: 'dialog',
      'aria-label': 'Terminal Linux',
      'aria-modal': 'true',
    }, [
      createElement('div', { class: 'lk-shell-header' }, [
        createElement('span', { class: 'lk-shell-title' }, 'linuxkafe@cybercafe:~'),
        createElement('div', { class: 'lk-shell-controls' }, [
          createElement('button', { class: 'lk-shell-btn', 'aria-label': 'Minimizar', onclick: () => this.minimize() }, '—'),
          createElement('button', { class: 'lk-shell-btn', 'aria-label': 'Fechar', onclick: () => this.close() }, '×'),
        ]),
      ]),
      createElement('div', { class: 'lk-shell-output', id: 'lk-shell-output', role: 'log', 'aria-live': 'polite' }),
      createElement('div', { class: 'lk-shell-prompt-line' }, [
        createElement('span', { class: 'lk-shell-prompt' }, 'visitante@linuxkafe:~$'),
        createElement('input', {
          class: 'lk-shell-input',
          id: 'lk-shell-input',
          type: 'text',
          autocomplete: 'off',
          spellcheck: 'false',
          'aria-label': 'Comando',
        }),
        createElement('span', { class: 'lk-shell-cursor', 'aria-hidden': 'true' }),
      ]),
    ]);
    document.body.appendChild(this.elements.container);

    this.elements.output = this.elements.container.querySelector('#lk-shell-output');
    this.elements.input = this.elements.container.querySelector('#lk-shell-input');

    // Welcome message
    this.printWelcome();
  }

  printWelcome() {
    const lines = [
      { type: 'ascii', text: '┌────────────────────────────────────────┐' },
      { type: 'ascii', text: '│  linuxkafe Shell v2.1.0-gamified       │' },
      { type: 'ascii', text: '│  Cybercafé virtual • Est. 2003         │' },
      { type: 'ascii', text: '└────────────────────────────────────────┘' },
      { type: 'output', text: '' },
      { type: 'info', text: 'Digite "help" para comandos. Tecla ~ abre/fecha.' },
      { type: 'output', text: '' },
    ];
    this.appendLines(lines);
  }

  bindEvents() {
    // Trigger click
    this.elements.trigger.addEventListener('click', () => this.toggle());

    // Keyboard: tilde (~) to toggle
    document.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.state.isOpen && !this.state.isMinimized) {
        this.close();
      }
    });

    // Input handling
    this.elements.input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
    this.elements.input.addEventListener('input', (e) => {
      this.state.currentInput = e.target.value;
    });

    // Focus management
    this.elements.container.addEventListener('mousedown', () => {
      if (this.state.isOpen && !this.state.isMinimized) {
        this.elements.input.focus();
      }
    });

    // Listen for god mode
    eventBus.on('godmode:toggle', (enabled) => {
      this.state.isGodMode = enabled;
      this.updatePrompt();
    });
  }

  handleInputKeydown(e) {
    const input = this.elements.input;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.executeCommand(input.value.trim());
        input.value = '';
        this.state.currentInput = '';
        this.state.historyIndex = -1;
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.navigateHistory(-1);
        break;

      case 'ArrowDown':
        e.preventDefault();
        this.navigateHistory(1);
        break;

      case 'Tab':
        e.preventDefault();
        this.autocomplete(input.value);
        break;
    }
  }

  navigateHistory(direction) {
    const { history, historyIndex } = this.state;
    if (history.length === 0) return;

    let newIndex = historyIndex + direction;
    if (newIndex < -1) newIndex = history.length - 1;
    if (newIndex >= history.length) newIndex = -1;

    this.state.historyIndex = newIndex;
    this.elements.input.value = newIndex === -1 ? this.state.currentInput : history[newIndex];
  }

  autocomplete(input) {
    const commands = Object.keys(COMMANDS);
    const parts = input.trim().split(/\s+/);
    const partial = parts[parts.length - 1].toLowerCase();

    if (parts.length === 1) {
      const matches = commands.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        this.elements.input.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.appendLines([{ type: 'output', text: matches.join('  ') }]);
      }
    }
  }

  executeCommand(rawInput) {
    if (!rawInput) return;

    this.state.history.push(rawInput);
    if (this.state.history.length > 100) this.state.history.shift();

    // Echo command
    this.appendLines([{ type: 'command', text: `visitante@linuxkafe:~$ ${rawInput}` }]);

    const [cmdName, ...args] = rawInput.split(/\s+/);
    const cmd = COMMANDS[cmdName.toLowerCase()];

    if (cmd) {
      const result = cmd.execute(args, this.state);
      if (result.lines) this.appendLines(result.lines);
      if (result.clear) this.clear();
      if (result.exit) this.close();
    } else {
      this.appendLines([{ type: 'error', text: `bash: ${cmdName}: comando não encontrado` }]);
    }

    this.saveState();
  }

  appendLines(lines) {
    lines.forEach(line => {
      const div = createElement('div', { class: `lk-shell-line ${line.type || 'output'}` }, line.text);
      this.elements.output.appendChild(div);
    });
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.elements.output.scrollTop = this.elements.output.scrollHeight;
  }

  clear() {
    this.elements.output.innerHTML = '';
  }

  updatePrompt() {
    const prompt = this.elements.container.querySelector('.lk-shell-prompt');
    if (prompt) {
      prompt.textContent = this.state.isGodMode ? 'root@linuxkafe:~#' : 'visitante@linuxkafe:~$';
    }
  }

  toggle() {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.state.isOpen = true;
    this.state.isMinimized = false;
    this.elements.container.classList.add('open');
    this.elements.container.classList.remove('minimized');
    this.elements.trigger.classList.add('hidden');
    this.elements.trigger.setAttribute('aria-expanded', 'true');
    this.elements.container.setAttribute('aria-hidden', 'false');
    this.elements.input.focus();
    eventBus.emit('shell:open');
    debug('Shell opened');
  }

  close() {
    this.state.isOpen = false;
    this.state.isMinimized = false;
    this.elements.container.classList.remove('open', 'minimized');
    this.elements.trigger.classList.remove('hidden');
    this.elements.trigger.setAttribute('aria-expanded', 'false');
    this.elements.container.setAttribute('aria-hidden', 'true');
    eventBus.emit('shell:close');
    debug('Shell closed');
  }

  minimize() {
    if (this.state.isMinimized) {
      this.elements.container.classList.remove('minimized');
      this.state.isMinimized = false;
    } else {
      this.elements.container.classList.add('minimized');
      this.state.isMinimized = true;
    }
  }

  enableGodMode() {
    this.state.isGodMode = true;
    this.updatePrompt();
    this.appendLines([{ type: 'warning', text: 'GOD MODE ATIVADO. sudo desbloqueado.' }]);
    this.saveState();
    eventBus.emit('godmode:toggle', true);
  }

  unlockEgg(name) {
    this.state.unlockedEggs.add(name);
    this.saveState();
  }

  saveState() {
    try {
      lsSet('lk_shell_state', {
        history: this.state.history.slice(-50),
        isGodMode: this.state.isGodMode,
        unlockedEggs: Array.from(this.state.unlockedEggs),
      });
    } catch (e) {
      debug('Failed to save shell state:', e);
    }
  }

  loadState() {
    try {
      // Migrate from old sessionStorage key
      migrateStorage('lk_shell_state', 'lk_shell_state');
      
      const saved = lsGet('lk_shell_state');
      if (saved) {
        this.state.history = saved.history || [];
        this.state.isGodMode = saved.isGodMode || false;
        this.state.unlockedEggs = new Set(saved.unlockedEggs || []);
        this.updatePrompt();
      }
    } catch (e) {
      debug('Failed to load shell state:', e);
    }
  }
}

// ============================================================================
// INIT
// ============================================================================
let shellInstance = null;

export function initShell() {
  if (!CONFIG.features.shell) return null;
  if (shellInstance) return shellInstance;
  shellInstance = new Shell();
  return shellInstance;
}

export { Shell };