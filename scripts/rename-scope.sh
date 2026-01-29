#!/bin/bash
# Rename package scope across the entire project
# Usage: scripts/rename-scope.sh old-scope new-scope
# Example: scripts/rename-scope.sh company myorg

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 <old-scope> <new-scope>"
  echo "Example: $0 company myorg"
  exit 1
fi

OLD_SCOPE=$1
NEW_SCOPE=$2

echo "🔄 Renaming package scope from @$OLD_SCOPE to @$NEW_SCOPE..."
echo ""

# Count files that will be affected
COUNT=$(grep -r "@$OLD_SCOPE" --include="package.json" --include="*.ts" --include="*.md" . 2>/dev/null | grep -v node_modules | wc -l)

if [ "$COUNT" -eq 0 ]; then
  echo "❌ No references to @$OLD_SCOPE found"
  exit 1
fi

echo "Found $COUNT references to update"
echo ""

# Update package.json files
find . -name "package.json" -not -path "./node_modules/*" -type f -exec sed -i '' "s/@$OLD_SCOPE/@$NEW_SCOPE/g" {} \;
echo "✅ Updated package.json files"

# Update TypeScript/JavaScript files
find . -name "*.ts" -not -path "./node_modules/*" -not -path "./.next/*" -type f -exec sed -i '' "s/@$OLD_SCOPE/@$NEW_SCOPE/g" {} \;
echo "✅ Updated TypeScript files"

# Update Markdown files
find . -name "*.md" -not -path "./node_modules/*" -type f -exec sed -i '' "s/@$OLD_SCOPE/@$NEW_SCOPE/g" {} \;
echo "✅ Updated documentation files"

# Rename directories if packages exist
if [ -d "packages" ]; then
  for dir in packages/*/; do
    if [ -d "$dir" ]; then
      PACKAGE_NAME=$(basename "$dir")
      UPDATED_NAME=$(echo "$PACKAGE_NAME" | sed "s/^$OLD_SCOPE-/$NEW_SCOPE-/")
      if [ "$PACKAGE_NAME" != "$UPDATED_NAME" ]; then
        mv "$dir" "${dir%/*}/$UPDATED_NAME"
        echo "✅ Renamed package: $PACKAGE_NAME → $UPDATED_NAME"
      fi
    fi
  done
fi

echo ""
echo "🎉 Package scope renamed successfully!"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Reinstall dependencies: pnpm install"
echo "  3. Run tests: pnpm run test"
