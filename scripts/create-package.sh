#!/bin/bash
# Create a new package scaffold in the monorepo
# Usage: scripts/create-package.sh <package-name>
# Example: scripts/create-package.sh my-feature

set -e

if [ $# -ne 1 ]; then
  echo "Usage: $0 <package-name>"
  echo "Example: $0 my-feature"
  exit 1
fi

PACKAGE_NAME=$1
SCOPE=${2:-company}
PACKAGE_DIR="packages/$PACKAGE_NAME"

if [ -d "$PACKAGE_DIR" ]; then
  echo "❌ Package directory already exists: $PACKAGE_DIR"
  exit 1
fi

echo "📦 Creating new package: $PACKAGE_NAME"
echo ""

# Create directory structure
mkdir -p "$PACKAGE_DIR/src"
mkdir -p "$PACKAGE_DIR/dist"

echo "✅ Created directory structure"

# Create package.json
cat > "$PACKAGE_DIR/package.json" << EOF
{
  "name": "@$SCOPE/$PACKAGE_NAME",
  "version": "0.1.0",
  "description": "Package description",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsgo -p tsconfig.json",
    "clean": "rm -rf dist",
    "dev": "tsgo -p tsconfig.json --watch",
    "type-check": "tsgo -p tsconfig.json --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@types/node": "^25.0.3",
    "@vitest/ui": "^4.0.16",
    "typescript": "^5.9.3",
    "vitest": "^4.0.16"
  },
  "license": "MIT"
}
EOF
echo "✅ Created package.json"

# Create tsconfig.json
cat > "$PACKAGE_DIR/tsconfig.json" << EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "references": []
}
EOF
echo "✅ Created tsconfig.json"

# Create src/index.ts
cat > "$PACKAGE_DIR/src/index.ts" << EOF
/**
 * $PACKAGE_NAME - Main entry point
 * @packageDocumentation
 */

/**
 * Example function
 * @param message - Message to display
 * @returns Formatted message
 */
export function greet(message: string): string {
  return \`Hello, \${message}!\`;
}
EOF
echo "✅ Created src/index.ts"

# Create test file
cat > "$PACKAGE_DIR/src/index.test.ts" << EOF
import { describe, it, expect } from 'vitest';
import { greet } from './index';

describe('$PACKAGE_NAME', () => {
  it('should greet with message', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});
EOF
echo "✅ Created src/index.test.ts"

# Create README.md
cat > "$PACKAGE_DIR/README.md" << EOF
# @$SCOPE/$PACKAGE_NAME

Package description.

## Installation

\`\`\`bash
pnpm add @$SCOPE/$PACKAGE_NAME
\`\`\`

## Usage

\`\`\`typescript
import { greet } from '@$SCOPE/$PACKAGE_NAME';

console.log(greet('World'));  // 'Hello, World!'
\`\`\`

## API

### \`greet(message: string): string\`

Returns a greeting message.

## Testing

\`\`\`bash
pnpm --filter @$SCOPE/$PACKAGE_NAME test
\`\`\`
EOF
echo "✅ Created README.md"

echo ""
echo "🎉 Package created successfully!"
echo ""
echo "Next steps:"
echo "  1. Update package description in $PACKAGE_DIR/package.json"
echo "  2. Implement your functionality in $PACKAGE_DIR/src/index.ts"
echo "  3. Write tests in $PACKAGE_DIR/src/index.test.ts"
echo "  4. Update $PACKAGE_DIR/README.md"
echo ""
echo "Build the package:"
echo "  pnpm --filter @$SCOPE/$PACKAGE_NAME build"
echo ""
echo "Run tests:"
echo "  pnpm --filter @$SCOPE/$PACKAGE_NAME test"
