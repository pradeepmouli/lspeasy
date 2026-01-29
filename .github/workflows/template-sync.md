# Template Sync Workflow

This workflow automatically syncs changes from this template repository to downstream repositories that were created from it.

## Setup Instructions

### 1. Create a GitHub Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (fine-grained or classic)
2. Click "Generate new token"
3. Give it a descriptive name like "Template Sync Token"
4. Required scopes:
  - For fine-grained: `contents:read` on template repo, `contents:write`, `pull_requests:write`, `workflows:write` on downstream repos
  - For classic: `repo`, `workflow`
5. Generate the token and copy it

### 2. Add Token to Repository Secrets

1. Go to your template repository settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `TEMPLATE_SYNC_TOKEN`
5. Value: Paste your PAT
6. Click "Add secret"

### 3. Configure Downstream Repositories

Edit the workflow file (`.github/workflows/template-sync.yml`) and update the `matrix.repo` list with your downstream repositories:

```yaml
strategy:
  matrix:
    repo:
      - 'pradeepmouli/downstream-repo-1'
      - 'pradeepmouli/downstream-repo-2'
```

### 4. (Optional) Ignore Files via .templatesyncignore

Place a `.templatesyncignore` file in the downstream repository (root or `.github/`) to exclude files from syncing. Patterns follow glob syntax (similar to `.gitignore`). The file itself cannot be synced.

## How It Works

1. **Triggers**: The workflow runs:
   - When manually triggered via GitHub Actions UI
   - When changes are pushed to the master branch
   - Weekly on Mondays at 9 AM UTC

2. **Process**:
   - For each downstream repository:
     - Checks out the downstream repo into the runner workspace
     - Compares template files (`pradeepmouli/template-ts`) with downstream files
     - Creates a PR with template changes
     - Applies configured labels

3. **Review**: Downstream maintainers review and merge the PR

## Customization Options

### Change Sync Schedule

Modify the `cron` expression in the workflow:

```yaml
schedule:
  - cron: '0 9 * * 1'  # Weekly on Mondays at 9 AM UTC
```

### Add Reviewers/Assignees

Uncomment and configure in the workflow:

```yaml
pr_assignees: 'pradeepmouli'
pr_reviewers: 'reviewer1,reviewer2'
```

## Troubleshooting

### PR Not Created

- Verify `TEMPLATE_SYNC_TOKEN` has correct permissions
- Check that downstream repositories exist and are accessible
- Ensure target branch exists in downstream repository

### Files Not Syncing

- Check `.templatesyncignore` patterns in the downstream repo
- Verify files exist in template repository
- Review workflow logs for specific errors

### Conflicts

- Manual intervention required when conflicts occur
- Review and resolve conflicts in the created PR
- Consider adjusting `ignore_files` to prevent future conflicts

## Best Practices

1. **Test First**: Start with one downstream repository before adding more
2. **Review Changes**: Always review PRs before merging to avoid breaking changes
3. **Communicate**: Inform downstream maintainers about template sync setup
4. **Document**: Keep template changes documented in CHANGELOG.md
5. **Version Control**: Use semantic versioning for major template changes
