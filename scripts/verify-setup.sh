#!/bin/bash
# Verify template setup and dependencies
# Checks that all required tools and configurations are in place

set -e

echo "🔍 Verifying template setup..."
echo ""

ERRORS=0
WARNINGS=0

# Check Node.js
echo -n "Checking Node.js version... "
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v | cut -d'v' -f2)
  MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
  if [ "$MAJOR" -ge 20 ]; then
    echo "✅ $NODE_VERSION"
  else
    echo "⚠️  $NODE_VERSION (recommended: >=20.0.0)"
    ((WARNINGS++))
  fi
else
  echo "❌ Not installed"
  ((ERRORS++))
fi

# Check pnpm
echo -n "Checking pnpm version... "
if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm -v)
  echo "✅ $PNPM_VERSION"
else
  echo "❌ Not installed"
  ((ERRORS++))
fi

# Check TypeScript
echo -n "Checking TypeScript... "
if [ -f "node_modules/typescript/package.json" ]; then
  TS_VERSION=$(grep '"version"' node_modules/typescript/package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
  echo "✅ $TS_VERSION"
else
  echo "❌ Not installed"
  ((ERRORS++))
fi

# Check Vitest
echo -n "Checking Vitest... "
if [ -f "node_modules/vitest/package.json" ]; then
  VT_VERSION=$(grep '"version"' node_modules/vitest/package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
  echo "✅ $VT_VERSION"
else
  echo "❌ Not installed"
  ((ERRORS++))
fi

# Check oxlint
echo -n "Checking oxlint... "
if command -v oxlint &> /dev/null; then
  OXLINT_VERSION=$(oxlint --version 2>&1 | head -1)
  echo "✅ $OXLINT_VERSION"
else
  echo "❌ Not installed"
  ((ERRORS++))
fi

# Check oxfmt
echo -n "Checking oxfmt... "
if command -v oxfmt &> /dev/null; then
  echo "✅ Installed"
else
  echo "❌ Not installed"
  ((ERRORS++))
fi

echo ""
echo "📁 Checking project structure..."

# Check key files
REQUIRED_FILES=(
  "package.json"
  "tsconfig.json"
  "pnpm-workspace.yaml"
  "vitest.config.ts"
  "oxlintrc.json"
  ".editorconfig"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ Missing: $file"
    ((ERRORS++))
  fi
done

echo ""
echo "📚 Checking documentation..."

DOC_FILES=(
  "README.md"
  "CONTRIBUTING.md"
  "LICENSE"
  "docs/WORKSPACE.md"
  "docs/TESTING.md"
  "docs/DEVELOPMENT.md"
)

for file in "${DOC_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "⚠️  Missing: $file"
    ((WARNINGS++))
  fi
done

echo ""
echo "🔧 Checking scripts..."

SCRIPTS=(
  "scripts/init-template.sh"
  "scripts/create-package.sh"
  "scripts/rename-scope.sh"
)

for script in "${SCRIPTS[@]}"; do
  if [ -f "$script" ]; then
    echo "✅ $script"
  else
    echo "⚠️  Missing: $script"
    ((WARNINGS++))
  fi
done

echo ""
echo "📊 Summary:"
echo "  ✅ Passed: $(grep '✅' <<< "$(echo $ERRORS $WARNINGS)" | wc -l)"
if [ $ERRORS -gt 0 ]; then
  echo "  ❌ Errors: $ERRORS"
fi
if [ $WARNINGS -gt 0 ]; then
  echo "  ⚠️  Warnings: $WARNINGS"
fi

echo ""

if [ $ERRORS -eq 0 ]; then
  echo "🎉 All required setup checks passed!"
  echo ""
  echo "You can now:"
  echo "  • Run tests: pnpm test"
  echo "  • Start development: pnpm run dev"
  echo "  • Create new packages: scripts/create-package.sh my-package"
  exit 0
else
  echo "❌ Setup incomplete. Please install missing dependencies:"
  echo "  pnpm install"
  exit 1
fi
