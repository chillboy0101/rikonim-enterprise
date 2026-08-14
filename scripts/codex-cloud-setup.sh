#!/usr/bin/env bash

set -euo pipefail

if [[ "$(node --version)" != v24.* ]]; then
  echo "Rikonim Enterprise requires Node.js 24.x (found $(node --version))." >&2
  exit 1
fi

echo "Installing website dependencies..."
npm ci

echo "Installing Sanity Studio dependencies..."
npm --prefix studio ci

echo "Codex Cloud setup complete."
