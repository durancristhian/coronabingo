#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
expected_node="$(cat .nvmrc)"
if ! command -v node >/dev/null || [[ "$(node --version)" != "v${expected_node}" ]]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    source "$NVM_DIR/nvm.sh"
    nvm install
    nvm use
  else
    echo "Node.js ${expected_node} is required. Install it or enable nvm." >&2
    exit 1
  fi
fi
node scripts/worktree-setup.js "$@"
