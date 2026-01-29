#!/bin/bash
# Template initialization script
# This script helps initialize a new project from this template-ts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
  echo -e "${BLUE}$1${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# Validate input
validate_input() {
  if [ -z "$1" ]; then
    return 1
  fi
  return 0
}

# Main initialization
print_header "🚀 Initializing project from template-ts..."
echo ""

# Get project details
read -p "📝 Enter project name (e.g., my-awesome-app): " PROJECT_NAME
if ! validate_input "$PROJECT_NAME"; then
  print_error "Project name is required"
  exit 1
fi

read -p "👤 Enter author name (e.g., John Doe): " AUTHOR_NAME
if ! validate_input "$AUTHOR_NAME"; then
  print_error "Author name is required"
  exit 1
fi

read -p "📧 Enter author email: " AUTHOR_EMAIL

read -p "📚 Enter project description: " PROJECT_DESCRIPTION

read -p "🌐 Enter repository URL (optional): " REPO_URL

echo ""
print_header "Configuration Summary:"
echo "  Name: $PROJECT_NAME"
echo "  Author: $AUTHOR_NAME ${AUTHOR_EMAIL:+<$AUTHOR_EMAIL>}"
echo "  Description: $PROJECT_DESCRIPTION"
echo "  Repository: ${REPO_URL:-Not set}"
echo ""

read -p "Continue with these settings? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  print_error "Initialization cancelled"
  exit 1
fi

# Get package scope
echo ""
read -p "📦 Enter package scope (e.g., company, org) [default: company]: " PACKAGE_SCOPE
PACKAGE_SCOPE=${PACKAGE_SCOPE:-company}

# Update package.json
print_header ""
print_header "Updating configuration files..."

AUTHOR_STR="$AUTHOR_NAME"
if [ -n "$AUTHOR_EMAIL" ]; then
  AUTHOR_STR="$AUTHOR_NAME <$AUTHOR_EMAIL>"
fi

cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "0.1.0",
  "private": true,
  "description": "$PROJECT_DESCRIPTION",
  "type": "module",
  "author": "$AUTHOR_STR",
  "license": "MIT",
  $([ -n "$REPO_URL" ] && cat <<REPO
"repository": {
    "type": "git",
    "url": "$REPO_URL"
  },
REPO
)
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "pnpm -r run build",
    "clean": "pnpm -r run clean && rm -rf node_modules/.cache",
    "clean:all": "pnpm -r exec rm -rf dist node_modules && rm -rf node_modules",
    "dev": "pnpm -r --parallel run dev",
    "format": "oxfmt .",
    "format:check": "oxfmt --check .",
    "fresh": "pnpm clean:all && pnpm install",
    "lint": "oxlint .",
    "lint:fix": "oxlint --fix .",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest",
    "type-check": "pnpm -r run type-check"
  },
  "devDependencies": {
    "@changesets/cli": "^2.29.8",
    "@types/node": "^25.0.3",
    "@vitest/coverage-v8": "^4.0.16",
    "@vitest/ui": "^4.0.16",
    "lint-staged": "^16.2.7",
    "oxfmt": "^0.21.0",
    "oxlint": "^1.36.0",
    "simple-git-hooks": "^2.13.1",
    "typescript": "^5.9.3",
    "vitest": "^4.0.16"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=10.0.0"
  },
  "packageManager": "pnpm@10.34.0"
}
EOF
print_success "Updated package.json"

# Update README.md
cat > README.md << EOF
# $PROJECT_NAME

$PROJECT_DESCRIPTION

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0

### Installation

\`\`\`bash
git clone $REPO_URL
cd $PROJECT_NAME
pnpm install
\`\`\`

### Development

\`\`\`bash
# Start development
pnpm run dev

# Run tests
pnpm run test

# Lint and format
pnpm run lint
pnpm run format
\`\`\`

## Project Structure

This project uses pnpm workspaces for managing multiple packages:

\`\`\`
$PROJECT_NAME/
├── packages/
│   └── [your packages here]
├── docs/
├── .github/workflows/
├── package.json
└── README.md
\`\`\`

## Creating Your First Package

See [docs/WORKSPACE.md](docs/WORKSPACE.md) for detailed instructions on adding packages.

## Documentation

- [Workspace Guide](docs/WORKSPACE.md) - Managing packages
- [Development Workflow](docs/DEVELOPMENT.md) - Development process
- [Testing Guide](docs/TESTING.md) - Testing setup
- [Examples](docs/EXAMPLES.md) - Usage examples

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](LICENSE) for details

---

**Author**: $AUTHOR_NAME
**Created**: $(date +%B\ %d,\ %Y)
EOF
print_success "Updated README.md"

# Create AGENTS.md
cat > AGENTS.md << EOF
# Agent Guide

This repository is designed for multi-agent collaboration (Copilot, Claude, Gemini, Codex). Use this guide to stay consistent when automating tasks.

## Project Metadata
- Name: $PROJECT_NAME
- Language: TypeScript (pnpm workspaces)
- Tooling: pnpm, oxlint, oxfmt, Vitest, simple-git-hooks, lint-staged

## Ground Rules
- Prefer non-destructive changes; never reset user work.
- Follow conventional commits.
- Keep formatting consistent with .editorconfig and .oxfmtrc.json.
- Run pnpm run lint and pnpm test after code changes when practical.
- Keep docs current when changing scripts or workflows.

## Workflow Checklist
1) Install deps: pnpm install
2) Lint: pnpm run lint
3) Test: pnpm test
4) Format: pnpm run format (or pnpm run format:check)
5) Type-check (if added): pnpm run type-check

## Coding Standards
- 2-space indentation; spaces (no tabs).
- Semicolons required; single quotes; no trailing commas.
- Keep public API docs concise; avoid documenting internals.
- Use vitest for tests; add coverage for public APIs.

## Agent-Specific Notes
- Coordinate with other agents by updating docs (README, TEMPLATE_INITIALIZATION.md) when workflows change.
- When modifying scripts, explain any new prompts or defaults in TEMPLATE_INITIALIZATION.md.
- If adding hooks, prefer simple-git-hooks and lint-staged already in package.json.

## Deliverables Expectation
- Summaries should include what changed, where, and how to verify.
- For automation runs, report commands executed and their results.
EOF
print_success "Created AGENTS.md"

# Clean up template files
print_header ""
print_header "Cleaning up template files..."

rm -f REVIEW_PROPOSALS.md COVERAGE_ANALYSIS.md IMPLEMENTATION.md COMPLETION_CHECKLIST.md

# Remove example packages
read -p "Remove example packages (core, utils, test-utils)? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf packages/core packages/utils packages/test-utils
  mkdir -p packages
  print_success "Removed example packages"
fi

# Remove example tests
read -p "Remove example test files? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -f src/index.test.ts src/index.ts integration.test.ts
  mkdir -p src
  cat > src/index.ts << 'SRCEOF'
/**
 * Main entry point for your application
 */

export function hello(): string {
  return 'Hello, World!';
}
SRCEOF
  print_success "Removed example test files"
fi

# Remove example E2E tests
read -p "Remove example E2E tests? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf e2e
  print_success "Removed example E2E tests"
fi

# Replace TEMPLATE_INITIALIZATION guide
read -p "Replace scripts/TEMPLATE_INITIALIZATION.md with project-specific details? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cat > scripts/TEMPLATE_INITIALIZATION.md << 'TIEOF'
# Project Initialization Guide

This guide describes how to initialize and maintain this repository.

## Quick Start

1) Clone the repo
2) Install dependencies: pnpm install
3) Initialize git (if not already): git init && git add . && git commit -m "chore: initial project setup"

## Local Development

- Run dev: pnpm run dev
- Test: pnpm test
- Lint: pnpm run lint
- Format: pnpm run format

## Notes

- Update this guide with project-specific workflows, environments, and deployment steps.
TIEOF
  print_success "Replaced scripts/TEMPLATE_INITIALIZATION.md"
else
  print_warning "Left scripts/TEMPLATE_INITIALIZATION.md unchanged"
fi

print_success "Cleaned up template files"

# Initialize git
echo ""
print_header "Setting up git..."

if [ -d .git ]; then
  print_warning "Git repository already initialized"
else
  git init
  git add .
  git commit -m "chore: initialize project from template-ts"
  print_success "Git repository initialized"
fi

# Install dependencies
echo ""
print_header "Installing dependencies..."

if ! command -v pnpm &> /dev/null; then
  print_warning "pnpm not found, installing..."
  npm install -g pnpm
fi

pnpm install

echo ""
print_success "Project initialization complete!"
echo ""

print_header "Next steps:"
echo "  1. Customize your project in README.md"
echo "  2. Create your first package: mkdir packages/my-package"
echo "  3. See docs/WORKSPACE.md for package structure"
echo "  4. Start developing: pnpm run dev"
echo "  5. Run tests: pnpm run test"
echo ""
print_header "Useful commands:"
echo "  pnpm run lint     - Check code quality"
echo "  pnpm run format   - Format all code"
echo "  pnpm run test     - Run tests"
echo "  pnpm run dev      - Start development"
echo ""
print_header "Documentation:"
echo "  📖 docs/WORKSPACE.md - Workspace management"
echo "  📖 docs/DEVELOPMENT.md - Development workflow"
echo "  📖 docs/TESTING.md - Testing guide"
echo "  📖 CONTRIBUTING.md - Contributing guidelines"
echo ""
print_success "Happy coding! 🚀"
