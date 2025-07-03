#!/bin/bash

# Format After Agent Session Script
# Run this after each agent session to ensure code quality

set -e

echo "🤖 Post-Agent Session Code Quality Check"
echo "========================================"

# 1. Format code
echo "🎨 Formatting code..."
bun run format

# 2. Type check
echo "🔍 Type checking..."
bun run typecheck

# 3. Lint check
echo "🚨 Linting..."
bun run lint

# 4. Build verification (optional - comment out if too slow)
echo "🏗️ Build verification..."
bun run build

echo "✅ All quality checks passed!"
echo "💡 Don't forget to commit your changes if needed."