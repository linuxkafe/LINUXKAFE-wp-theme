# T015 — Plan Output (Hostile Analysis)

## Insights Consultados
- SD-GIT-SUBMODULE: Git submodules são padrão para agregação mas requerem disciplina (recursive clone, update)
- SD-CI-GITHUB: GitHub Actions em meta-repo precisa `submodules: recursive` no checkout
- SD-REPO-STRUCTURE: Monorepo vs multi-repo — tradeoff entre atomicidade de commits e independência de versionamento
- SD-AES-KANBAN: Ticket T014 acabou de fechar; estrutura AES (`aes/`) deve ir no repo `xkaichat`, não no `plugins`

## Assumptions I'm Making

| Tipo | Assumption | Justification / Impact if False |
|------|------------|--------------------------------|
| [KNOWN] | Token GitHub tem permissões `repo`, `admin:org`, `workflow` | Necessário para criar org/repos e Actions; se faltar, falha na criação |
| [KNOWN] | Código atual passa `make check` | Verificado no T014; base limpa para novo repo |
| [INFERRED] | Organização `wordpress` não existe ainda | Se existir, reutilizar; se não, criar |
| [INFERRED] | Submodule é a melhor opção para "agregado dentro de plugins" | Decisão do usuário; alternativas: subtree, monorepo, Actions sync |
| [ASSUMED] | Repo `xkaichat` deve conter TUDO (plugin + proxy + broker + AES + tests) | Separation of concerns: plugin é unidade deployável |
| [ASSUMED] | Repo `plugins` é meta-repo (só submodules + README + CI) | Não código duplicado; só referências |
| [UNKNOWN] | Se `wordpress` é org ou user account | Afeta URL: `github.com/wordpress/xkaichat` vs `github.com/user/wordpress-xkaichat` |

## What Wasn't Specified (That Matters)
- **Visibilidade**: Repos públicos ou privados? (assumir privado inicial, tornar público depois)
- **Branch strategy**: `main` only? `develop` + `main`? (assumir `main` only, tags para releases)
- **Release strategy**: Tags no `xkaichat` → submodule update no `plugins` manual ou bot?
- **Secrets**: Como partilhar secrets (Ollama keys, etc.) entre repos? (GitHub Environments/Org secrets)
- **Branch protection**: Requerir PR + CI pass no `xkaichat`? No `plugins`?

## Alternatives I Didn't Choose

| Option | Rejected Because |
|--------|------------------|
| Monorepo único (`wordpress-plugins` com pastas) | Acopla versionamento; PRs tocam múltiplos plugins; CI mais lento |
| Git Subtree | Histórico misto; mais complexo para push/pull de mudanças upstream |
| GitHub Actions sync (repos separados, Action copia releases) | Latência; dois fontes de verdade; submodule é nativo Git |
| Manter tudo num repo só | Não escala; viola separação plugin/tema; CI roda tudo sempre |

## Invite Contradiction
- **Submodules são dolorosos** — desenvolvedores esquecem `--recursive`, `submodule update`. Mitigação: documentar no README, scripts helper.
- **Meta-repo `plugins` vazio de código** — pode parecer "inútil". Justificativa: ponto único para CI agregado, discovery, gestão de permissões.
- **Org `wordpress` pode conflitar com wordpress.org** — usar prefixo ou conta pessoal se necessário.

## Distinguish Claim Types
- **Empírico**: "Submodule `git clone --recursive` funciona" — testável
- **Empírico**: "GitHub Actions `submodules: recursive` faz checkout correto" — verificável
- **Normativo**: "Org deve chamar-se `wordpress`" — decisão de branding
- **Normativo**: "CI no meta-repo deve testar submodules" — política de qualidade

## Reasoning Skeleton
1. **Premissa**: Plugin XKaiChat é unidade independente (deploy, versioning, CI)
2. **Premissa**: Organização quer múltiplos plugins/temas no futuro
3. **Inferência**: Meta-repo `plugins` com submodules permite gestão centralizada + independência
4. **Conclusão**: Estrutura org + xkaichat repo + plugins meta-repo + themes meta-repo

## Scope Boundaries
**In bounds**: Criação repos, submodule setup, CI/CD, docs.
**Out of bounds**: Outros plugins, deployment WP, GitHub Pages, secrets rotation automation.

## Verification Criteria
- `git clone --recursive git@github.com:wordpress/plugins.git` → `plugins/xkaichat/` tem código
- `cd plugins/xkaichat && make check` → passa
- GitHub Action no `xkaichat` roda `make check` em PR/push
- GitHub Action no `plugins` faz checkout recursivo + testa submodule
- `github.com/wordpress/themes` existe (pode estar vazio)