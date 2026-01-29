---
name: template-initialization
description: Initialize a new project from template-ts non-interactively. Use when the user wants to set up a fresh repository from the template, customize project metadata (name, author, description), configure package scope, and optionally remove example packages/tests. This automates the entire scripts/init-template.sh workflow without manual prompts.
---

# Template Initialization

Automate project initialization from template-ts by driving the interactive script non-interactively.

## Workflow

1. **Gather inputs** - Ask user for required fields (project name, author, description) and optional fields (email, repo URL, scope, cleanup preferences)
2. **Validate environment** - Check Node.js >= 20, pnpm >= 10, and scripts are executable
3. **Execute initialization** - Run init script with piped answers
4. **Verify setup** - Run lint and tests, report results

## Required Inputs

Collect these from the user before proceeding:

- `project_name` - Project name (e.g., "my-awesome-app")
- `author_name` - Author name (e.g., "Jane Doe")
- `description` - Project description

Optional (use defaults if not provided):

- `author_email` - Author email (default: "")
- `repository_url` - Repository URL (default: "")
- `package_scope` - Package scope (default: "company")
- `remove_example_packages` - Remove example packages? (default: "y")
- `remove_example_tests` - Remove example tests? (default: "y")
- `remove_example_e2e` - Remove E2E tests? (default: "y")
- `replace_template_initialization` - Replace TEMPLATE_INITIALIZATION.md? (default: "y")

## Execution

Make scripts executable and pipe answers to init script:

```bash
chmod +x scripts/*.sh

printf '%s\n' \
  "$project_name" \
  "$author_name" \
  "$author_email" \
  "$description" \
  "$repository_url" \
  y \
  "$package_scope" \
  "$remove_example_packages" \
  "$remove_example_tests" \
  "$remove_example_e2e" \
  "$replace_template_initialization" \
  | scripts/init-template.sh
```

**Note**: The 6th line (`y`) confirms to proceed after showing the configuration summary.

## Post-Initialization

Run validation commands:

```bash
pnpm run lint
pnpm test
```

## What Gets Updated

- `package.json` - Project metadata, author, description, repository
- `README.md` - Generated with project details
- `AGENTS.md` - Generated with project name and agent guidance
- `scripts/TEMPLATE_INITIALIZATION.md` - Optionally replaced with starter guide
- Example packages/tests - Optionally removed based on user choices
- Git repository - Initialized with initial commit if not already present

## Deliverables

Report to user:

- Configuration summary (inputs used)
- Commands executed
- Lint results
- Test results
- Location of updated files
