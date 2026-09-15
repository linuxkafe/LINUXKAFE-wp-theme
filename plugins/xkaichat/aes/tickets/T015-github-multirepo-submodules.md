---
ticket: T015
title: Estrutura GitHub: org wordpress, repos plugins/themes, xkaichat como submodule
sprint: sprint-01
priority: alto
status: in-progress
created: 2026-09-15
---

# T015 — Estrutura GitHub Multi-Repo com Submodules

## Contexto
O projeto XKaiChat atualmente vive num único diretório local. Para escalar e seguir boas práticas de separação de responsabilidades, deve ser organizada uma estrutura GitHub:

- **Organização**: `wordpress` (ou utilizador)
- **Repo `plugins`**: meta-repo que agrega plugins via submodules
- **Repo `themes`**: meta-repo para temas (vazio inicialmente)
- **Repo `xkaichat`**: plugin isolado, referenciado como submodule em `plugins`

Arquitetura alvo:
```
github.com/wordpress/
├── plugins/          (meta-repo)
│   └── xkaichat/     (submodule → github.com/wordpress/xkaichat)
├── themes/           (meta-repo, vazio)
└── xkaichat/         (repo independente do plugin)
```

## Critérios de Aceitação
- [ ] Organização/repositórios criados no GitHub
- [ ] Repo `xkaichat` com código atual + histórico
- [ ] Repo `plugins` com submodule `xkaichat`
- [ ] Repo `themes` criado (vazio, com README)
- [ ] `.gitmodules` correto em `plugins`
- [ ] Clone recursivo funciona: `git clone --recursive github.com/wordpress/plugins`
- [ ] Workflow CI/CD no `xkaichat` roda `make check`
- [ ] Workflow no `plugins` testa submodule (checkout recursivo + make check)
- [ ] Documentação atualizada: CLAUDE.md, ROADMAP.md, README.md
- [ ] `make check` passa no repo xkaichat clonado fresh

## Escopo
**In scope:**
- Criação de repos via GitHub API
- Push do código atual para `xkaichat`
- Criação de `plugins` com submodule
- Criação de `themes` vazio
- GitHub Actions para CI em ambos
- Atualização de docs

**Out of scope:**
- Migração de issues/PR history (repo novo)
- Outros plugins/themes (futuro)
- GitHub Pages / deployment

## Dependências
- Token GitHub com permissão `repo`, `admin:org`, `workflow`
- Código atual em `/home/seyon/dev/wordpress/plugins/xkaichat` limpo (`make check` passa)

## Rollback
- Apagar repos criados no GitHub
- Manter código local intacto

## Riscos Conhecidos
- Submodules requerem `git clone --recursive` ou `git submodule update --init`
- CI no meta-repo `plugins` deve fazer checkout recursivo
- Permissões de token podem falhar se não tiver `admin:org`
- Histórico do repo local não inclui `.github/workflows` ainda