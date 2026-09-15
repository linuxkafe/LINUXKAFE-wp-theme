#!/bin/bash
# Pre-review hook for AES (XKaiChat)
# Anti-drift real do repo: exige (1) gates `make check` verdes e (2) build com diffstory.
# Sem magia: só verificações que existem de facto (nenhuma chamada a make wake/debt-gate/GF).

echo "=================================================="
echo "  PRE-REVIEW: gates reais (XKaiChat)"
echo "=================================================="

if [ ! -f "aes/kanban.md" ]; then
    echo "Error: Not in an AES project (missing aes/kanban.md)"
    exit 1
fi

CURRENT_TICKET=$(grep "^current_ticket:" aes/kanban.md | awk '{print $2}' | head -1 | tr -d '[:space:]')
TICKET_ID=$(printf '%s' "$CURRENT_TICKET" | grep -oE '^T[0-9]+')
if [ -z "$CURRENT_TICKET" ] || [ "$CURRENT_TICKET" = "none" ]; then
    echo "Error: No current ticket in aes/kanban.md (current_ticket: '$CURRENT_TICKET')"
    exit 1
fi
if [ -z "$TICKET_ID" ]; then
    echo "Error: current_ticket inválido: '$CURRENT_TICKET' (esperado T<num>-slug)"
    exit 1
fi

# 1) Build com diffstory (o reviewer consome isto)
BUILD_FILE="aes/tickets/${TICKET_ID}-build.md"
if [ ! -f "$BUILD_FILE" ]; then
    echo "Error: Build file not found: $BUILD_FILE"
    exit 1
fi
if ! grep -qi "diffstory" "$BUILD_FILE"; then
    echo "Error: Diffstory ausente em $BUILD_FILE (esperado no H1 ou secção)"
    exit 1
fi
echo "  OK  diffstory presente em $(basename "$BUILD_FILE")"

# 2) Gates de teste reais do repo
echo ""
echo "  A correr make check (lint + testes PHP/pytest + test-aes + docs)..."
if ! make check > /tmp/pre-review-make-check.log 2>&1; then
    echo "Error: make check falhou — ver /tmp/pre-review-make-check.log"
    tail -20 /tmp/pre-review-make-check.log
    exit 1
fi
echo "  OK  make check verde"

echo ""
echo "PRE-REVIEW PASSED: diffstory + make check."
exit 0