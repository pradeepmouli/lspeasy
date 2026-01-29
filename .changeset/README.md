# Changesets

This folder contains [changesets](https://github.com/changesets/changesets) - a way to manage versioning and changelogs.

## How to use

1. **Create a changeset**: When you make changes that should be released, run:
   ```bash
   pnpm changeset
   ```
   Follow the prompts to describe your changes.

2. **Version packages**: When ready to release, run:
   ```bash
   pnpm version
   ```
   This consumes changesets and updates package versions and CHANGELOG.md.

3. **Publish**: After versioning, commit the changes and run:
   ```bash
   pnpm release
   ```
   This publishes the package to npm (requires authentication).

## In CI/CD

The GitHub Actions workflow handles versioning and publishing automatically when changesets are merged to main.
