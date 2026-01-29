---
name: docker-validation
description: Use when validating Dockerfiles, reviewing Docker configurations, checking Docker Compose files, verifying multi-stage builds, or auditing Docker security
user-invocable: true
source: https://github.com/rknall/claude-skills
---

# Docker Configuration Validator

Comprehensive validation for Dockerfiles and Docker Compose files, ensuring compliance with best practices, security standards, and modern syntax requirements.

## When to Use

- Validate Dockerfiles or Docker Compose files
- Review Docker configurations for best practices
- Check for Docker security issues
- Verify multi-stage build implementation
- Audit Docker setup for production readiness
- Ensure modern Docker Compose syntax compliance

## Quick Validation Commands

```bash
# Hadolint for Dockerfiles
hadolint Dockerfile
hadolint --format json Dockerfile

# Docker Compose validation
docker compose config --quiet
docker compose -f docker-compose.prod.yml config

# Find all Docker files
find . -type f \( -name "Dockerfile*" ! -name "*.md" \)
find . -maxdepth 3 -name "*compose*.yml"
```

## Critical Checks

### Dockerfile Rules

| Check | Rule | Fix |
|-------|------|-----|
| No `:latest` tags | DL3006 | Pin specific versions |
| Non-root USER | DL3002 | Add `USER node` or similar |
| Absolute WORKDIR | DL3000 | Use `/app` not `app` |
| Pin package versions | DL3008 | `apt-get install curl=7.88.1-1` |
| Clean package cache | DL3009 | `&& rm -rf /var/lib/apt/lists/*` |

### Docker Compose Rules

| Check | Issue | Fix |
|-------|-------|-----|
| **No version field** | Obsolete since v2.27.0 | Remove `version: '3.8'` line |
| No `:latest` tags | Unpredictable deploys | Pin versions |
| Restart policies | Service recovery | Add `restart: unless-stopped` |
| Health checks | Monitoring | Add `healthcheck:` block |
| Named volumes | Data persistence | Use named volumes |

## Multi-Stage Build Validation

```dockerfile
# Build stage
FROM node:20-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm run test

# Production stage
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]
```

**Checklist:**
- [ ] At least 2 stages (build + runtime)
- [ ] All stages named with `AS` keyword
- [ ] Artifacts copied with `COPY --from=`
- [ ] Final stage uses minimal base image
- [ ] Build tools NOT in final stage
- [ ] Final stage runs as non-root user

## Security Audit

### User & Permissions
```bash
# Check for USER directive
grep "^USER " Dockerfile
# Last USER should NOT be root
grep "^USER " Dockerfile | tail -1
```

### Quick Security Scan
```bash
# Check for secrets in Dockerfile
grep -iE "(password|secret|key|token)=" Dockerfile

# Scan with Trivy
trivy image myimage:latest
```

## Modern Docker Compose (No Version Field!)

**Old (Deprecated):**
```yaml
version: '3.8'  # ❌ REMOVE THIS
services:
  web:
    image: nginx:latest
```

**New (Modern):**
```yaml
# No version field!
services:
  web:
    image: nginx:1.24-alpine
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Validation Report Template

```markdown
## Docker Validation Report

### Summary
- Dockerfiles: X analyzed
- Compose files: X analyzed
- Critical issues: X
- Status: ✅ PASS / ❌ FAIL

### Critical Issues
1. [File:Line] Issue description
   - Fix: Specific solution

### Recommendations
- Priority 1: Security fixes
- Priority 2: Best practices
- Priority 3: Optimizations
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Lint Dockerfiles
  uses: hadolint/hadolint-action@v3.1.0
  with:
    dockerfile: ./Dockerfile
    failure-threshold: error

- name: Validate Compose
  run: docker compose config --quiet
```

### Pre-commit Hook
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/hadolint/hadolint
    rev: v2.12.0
    hooks:
      - id: hadolint
```

## Tool Installation

```bash
# Hadolint (Dockerfile linter)
brew install hadolint  # macOS
# or download binary from GitHub releases

# Trivy (Security scanner)
brew install aquasecurity/trivy/trivy

# DCLint (Compose linter)
npm install -g docker-compose-linter
```

## Issue Severity

| Severity | Examples | Action |
|----------|----------|--------|
| **CRITICAL** | Root user, :latest tags, secrets exposed | Must fix immediately |
| **HIGH** | No health check, no restart policy | Fix before production |
| **MEDIUM** | ADD vs COPY, missing labels | Best practice improvements |
| **LOW** | Could use slimmer image | Optimization opportunities |
