# CHECKLIST — XKaiChat

## Pre-commit (rápido)
- [ ] `make lint` passa
- [ ] `make test` passa
- [ ] Sem `console.log`/debug em produção
- [ ] Sem TODOs no código entregue
- [ ] Docs atualizados
- [ ] Diffstory escrito (output de build)
- [ ] Sem emojis no código-fonte de frontend

## Pre-release (roçado)
- [ ] Plugin zipavel e instalável em WordPress limpo
- [ ] Proxy testado com Ollama local real (`make qa`)
- [ ] FAQ do Capuchinho Verde carregada
- [ ] PDF do menu indexado
- [ ] Resumo de email entregue para o endereço configurado
- [ ] Nonce + escaping + sanitização verificados
- [ ] Privacidade/GDPR: retenção e política explicadas

## Domain-specific (WordPress)
- [ ] `load_plugin_textdomain` chamado
- [ ] `register_activation_hook`/`register_deactivation_hook`/`uninstall.php`
- [ ] `dbDelta` para schemas
- [ ] Tradução: funções `i18n` usadas em strings de UI
- [ ] Capability checks no admin (`manage_options`)
- [ ] JSDelivr/CDN sem chamadas externas desnecessárias
- [ ] Shortcode sem conflitos de nome (`xkaichat`)