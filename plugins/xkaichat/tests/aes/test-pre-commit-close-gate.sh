#!/usr/bin/env bash
# Smoke test: o pre-commit gate deve correr mesmo quando o commit fecha o último
# ticket (current_ticket -> none). Cenário que escapou no fecho do T010.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && cd ../.. && pwd)"
HOOK="$ROOT/.aes/hooks/pre-commit.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$TMP"
git init -q
git config user.email "test@aes.local"
git config user.name "AES test"

mkdir -p aes scripts
cat > aes/kanban.md <<'EOF'
current_sprint: sprint-03
current_ticket: T011
EOF
git add aes/kanban.md
git commit -qm init

# Cenário de fecho: T011 passa a done e current_ticket vai para none no working tree
sed -i 's/current_ticket: T011/current_ticket: none/' aes/kanban.md
git add aes/kanban.md

# Mock do verifier: regista o ticket pedido e passa
cat > scripts/verify-implementation.sh <<'EOF'
#!/bin/sh
echo "VERIFY_RAN=$1" >> "$AES_GATE_LOG"
exit 0
EOF
chmod +x scripts/verify-implementation.sh

export AES_VERIFY_SCRIPT="scripts/verify-implementation.sh"
export AES_GATE_LOG="$TMP/gate.log"

"$HOOK" >/dev/null 2>&1 || true

if [ ! -f "$AES_GATE_LOG" ] || ! grep -q "VERIFY_RAN=T011" "$AES_GATE_LOG"; then
  echo "❌ gate não correu no commit de fecho (esperado VERIFY_RAN=T011)"
  exit 1
fi

echo "✅ gate correu no commit de fecho (T011)"