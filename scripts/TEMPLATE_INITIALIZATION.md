# Template Initialization Guide

This guide explains how to use the template-ts template for new projects.

## Quick Start

### 1. Use as GitHub Template

Click "Use this template" on the GitHub repository to create a new repository.

```bash
# Clone your new repository
git clone https://github.com/your-org/your-new-project.git
cd your-new-project
```

### 2. Run Initialization Script

The easiest way to customize the template for your project:

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Run the interactive initialization script
scripts/init-template.sh
```

This script will prompt you for:
- Project name
- Author name and email
- Project description
- Repository URL
- Package scope (default: company)
- Whether to replace scripts/TEMPLATE_INITIALIZATION.md with project details

The script will then:
- Update package.json with your project details
- Generate a new README.md
- Generate AGENTS.md with agent guidance
- Clean up template-specific files
- Remove example packages and tests (optional)
- Replace scripts/TEMPLATE_INITIALIZATION.md with a project-specific guide (optional)
- Initialize git repository
- Install dependencies

Agent-run option: you can ask the agent to run the entire flow non-interactively using the prompt `template-initialization` (see .agents/skills/template-initialization/SKILL.md). The agent will feed answers to the script in order and report results back.

## Helper Scripts

All scripts are located in the `scripts/` directory and should be made executable:

```bash
chmod +x scripts/*.sh
```

### scripts/init-template.sh

**Purpose**: Interactive project initialization

**Usage**:
```bash
scripts/init-template.sh
```

**What it does**:
- Prompts for project details (name, author, description)
- Updates package.json
- Generates new README.md
- Cleans up template files
- Optionally rewrites scripts/TEMPLATE_INITIALIZATION.md with your project guide
- Initializes git repository
- Installs dependencies

**Interactive prompts**:
- ✅ Project name (required)
- ✅ Author name (required)
- ✅ Author email (optional)
- ✅ Project description
- ✅ Repository URL (optional)
- ✅ Package scope (default: company)
- ✅ Remove example packages
- ✅ Remove example tests
- ✅ Remove example E2E tests

### scripts/create-package.sh

**Purpose**: Create a new package scaffold in the monorepo

**Usage**:
```bash
# Create a new package with default scope (company)
scripts/create-package.sh my-feature

# Or specify a custom scope
scripts/create-package.sh my-feature myorg
```

**Creates**:
```
packages/my-feature/
├── src/
│   ├── index.ts        # Main entry point
│   └── index.test.ts   # Test file
├── package.json        # Package configuration
├── tsconfig.json       # TypeScript config
└── README.md          # Package documentation
```

**Next steps after creation**:
```bash
# Implement your code
nano packages/my-feature/src/index.ts

# Run tests
pnpm --filter @company/my-feature test

# Build the package
pnpm --filter @company/my-feature build
```

### scripts/rename-scope.sh

**Purpose**: Rename package scope across the entire project

**Usage**:
```bash
# Rename from @company to @myorg
scripts/rename-scope.sh company myorg

# Rename from @acme to @mycompany
scripts/rename-scope.sh acme mycompany
```

**What it updates**:
- All package.json files
- All TypeScript/JavaScript imports
- All documentation files
- Package directory names

**After renaming**:
```bash
# Reinstall with new package names
pnpm install

# Run tests to verify
pnpm test
```

### scripts/verify-setup.sh

**Purpose**: Verify template setup and dependencies

**Usage**:
```bash
scripts/verify-setup.sh
```

**Checks**:
- ✅ Node.js version (>= 20.0.0)
- ✅ pnpm installation and version (>= 10.0.0)
- ✅ Required tools (TypeScript, Vitest, oxlint, oxfmt)
- ✅ Project structure and key files
- ✅ Documentation files
- ✅ Helper scripts

**Output example**:
```
🔍 Verifying template setup...

Checking Node.js version... ✅ 20.10.0
Checking pnpm version... ✅ 9.0.0
Checking TypeScript... ✅ 5.9.3
Checking Vitest... ✅ 4.0.16
Checking oxlint... ✅ oxlint 1.36.0
Checking oxfmt... ✅ Installed

📁 Checking project structure...
✅ package.json
✅ tsconfig.json
✅ pnpm-workspace.yaml
✅ vitest.config.ts
...

🎉 All required setup checks passed!
```

## Typical Workflow

### 1. Initialize Template

```bash
# Clone from GitHub template
git clone https://github.com/your-org/new-project.git
cd new-project

# Run initialization
scripts/init-template.sh
```

Follow the prompts to customize your project.

### 2. Verify Setup

```bash
# Check that everything is configured correctly
scripts/verify-setup.sh
```

### 3. Create First Package

```bash
# Create your first package
scripts/create-package.sh core

# Or with custom scope
scripts/create-package.sh core myorg
```

### 4. Implement Features

```bash
# Start development
pnpm run dev

# Run tests
pnpm run test

# Check code quality
pnpm run lint
```

### 5. Version and Release

```bash
# Create a changeset when ready to release
pnpm run changeset

# Update versions
pnpm run changeset:version

# Publish to npm
pnpm run changeset:publish
```

## Customization Examples

### Example 1: Simple Project

Using the template for a single package project:

```bash
# Initialize
scripts/init-template.sh
# → Project name: my-utils
# → Author: Jane Doe
# → Remove example packages? y

# Create your package
scripts/create-package.sh utils

# Start working
pnpm run dev
```

### Example 2: Large Monorepo

Using the template for multiple packages:

```bash
# Initialize
scripts/init-template.sh
# → Project name: my-platform
# → Author: John Doe
# → Package scope: mycompany
# → Remove example packages? n

# Rename packages to your scope
scripts/rename-scope.sh company mycompany

# Create additional packages
scripts/create-package.sh api
scripts/create-package.sh web
scripts/create-package.sh cli

# Start working
pnpm run dev
```

### Example 3: Organization Migration

Migrating an existing project to use this template:

```bash
# Clone the template first
git clone template-ts.git my-existing-project

# Initialize with your details
scripts/init-template.sh
# → Customize with your project info

# Merge your existing code
# → Copy packages from your old project
# → Copy docs/
# → Update CONTRIBUTING.md and SECURITY.md

# Verify everything works
scripts/verify-setup.sh
pnpm test
```

## Troubleshooting

### Scripts Not Executable

If scripts fail with "Permission denied":

```bash
# Make all scripts executable
chmod +x scripts/*.sh

# Or make individual script executable
chmod +x scripts/init-template.sh
```

### pnpm Not Found

```bash
# Install pnpm globally
npm install -g pnpm@8.15.0

# Or use with npm
npm init -y
npm install pnpm
npx pnpm install
```

### Dependencies Won't Install

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Script Errors on macOS

If you get "command not found" errors on macOS:

```bash
# Use bash explicitly
bash scripts/init-template.sh
bash scripts/create-package.sh my-package
```

## Environment Variables

No special environment variables are required, but you can customize:

```bash
# Default package scope (used by create-package.sh)
export PACKAGE_SCOPE=mycompany
scripts/create-package.sh my-feature

# Or set in the script directly
PACKAGE_SCOPE=mycompany scripts/create-package.sh my-feature
```

## Next Steps

After initialization:

1. **Review Documentation**
   - Read [docs/WORKSPACE.md](../docs/WORKSPACE.md) for monorepo management
   - Read [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) for development workflow
   - Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

2. **Configure CI/CD**
   - Update `.github/workflows/` for your repository
   - Set up GitHub Actions secrets if needed for npm publishing

3. **Add Your Code**
   - Create packages using `scripts/create-package.sh`
   - Implement your features
   - Write tests

4. **Prepare for Release**
   - Use `pnpm changeset` for version management
   - Update CHANGELOG.md
   - Follow the release workflow in docs/DEVELOPMENT.md

## Support

For questions or issues:

1. Check [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)
2. Review [docs/TESTING.md](../docs/TESTING.md)
3. See [CONTRIBUTING.md](../CONTRIBUTING.md)
4. Refer to [docs/WORKSPACE.md](../docs/WORKSPACE.md)

---

**Happy templating! 🚀**
