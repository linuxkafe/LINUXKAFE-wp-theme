# QUALITY_GATES — XKaiChat

Gates executados por `make check`. Não declarar a tarefa como feita até todos passarem.

| Gate | Comando | Falha | Severidade |
|------|---------|-------|-----------|
| Lint PHP | `make lint` (php -l em todos os .php) | Syntax error | BLOCKER |
| Testes PHP | `make test-php` (runner sem deps) | Teste falha | BLOCKER |
| Testes Python | `make test-proxy` (pytest) | Teste falha | BLOCKER |
| Docs | `make docs-check` (VISION/REQUIREMENTS/ROADMAP presentes) | Docs em falta | BLOCKER |
| Kanban | `.aes/hooks/pre-commit.sh` | kanban inconsistente | BLOCKER (commit) |
| E2E Ollama | `docs/QA.md` regenerado com `make qa` | Proxy não responde | WARNING |

## Regras do projeto
- **Escaping obrigatório** (`esc_html_e`, `esc_attr`, `wp_json_encode` + `wp_kses` adequado). Qualquer eco sem escaping = BLOCKER.
- **Nonce obrigatório** em todos os AJAX públicos.
- **Sem emojis no código-fonte** de frontend (FR-D1). Usar SVG/Lucide ou texto.
- **Sem `console.log`** em produção; logging PHP via `error_log` monitorado.
- **Sem TODOs** no código entregue.
- **Pyton de proxy**: nunca logar segredos (API keys) em texto plano; log de contexto estrutural.

## Retenção de dados (GDPR)
- Códigos de verificação apagados após validar (ou expirados ≤ 15 min).
- Mensagens retidas 30 dias por omissão (configurável); email/telefone apenas com o propósito de contacto/serviço.
- Nota de privacidade disponível ao utilizador no widget.