---
name: initialize-project
description: Initialize a new project from template-ts. Customize project name, author, description, and optionally remove example code. Generates package.json, README.md, and AGENTS.md tailored to your project.
---

# Initialize Project from Template

Use this prompt to initialize a fresh project from template-ts. I'll collect your project details and execute the initialization workflow.

## What You'll Provide

Required:
1. **Project name** (e.g., `my-awesome-app`)
2. **Author name** (e.g., `Jane Doe`)
3. **Project description** (e.g., `A modern TypeScript monorepo`)

Optional (defaults provided):
- **Author email** (default: empty)
- **Repository URL** (default: "CURRENT_GIT_URL" or "")
- **Package scope** (default: `company`)
- **Remove example packages** (default: `y`)
- **Remove example tests** (default: `y`)
- **Remove example E2E tests** (default: `y`)
- **Replace TEMPLATE_INITIALIZATION.md** (default: `y`)

## What Happens Next

Once you provide these details, I'll execute the full initialization workflow described in [.agents/skills/template-initialization/SKILL.md](.agents/skills/template-initialization/SKILL.md), which:

- Updates `package.json`, `README.md`, and `AGENTS.md` with your metadata
- Optionally removes example packages and tests
- Runs linting and tests to verify setup
- Reports results and next steps

## Ready?

Provide your project details above and I'll initialize the template for you. For technical details about what the initialization script does, see the [template-initialization skill](.agents/skills/template-initialization/SKILL.md).
