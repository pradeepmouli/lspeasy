# Release Workflow Review - GitHub Actions Run #22026627902

## Summary

The release workflow failed when attempting to publish packages to npm using OIDC (OpenID Connect) trusted publishing. The root cause is that the packages have never been published to npm before, and npm Trusted Publishers cannot be configured for packages that don't exist yet.

## Analysis of Failed Run

**Workflow Run:** https://github.com/pradeepmouli/lspeasy/actions/runs/22026627902/job/63644225951#step:7:1

### Error Details

All four packages failed to publish with the same error pattern:

```
🦋  error an error occurred while publishing @lspeasy/core: E404 Not Found - PUT https://registry.npmjs.org/@lspeasy%2fcore - Not found
🦋  error '@lspeasy/core@1.0.2' is not in this registry.
🦋  error npm notice Access token expired or revoked. Please try logging in again.
```

**Affected packages:**
- `@lspeasy/client@1.0.2`
- `@lspeasy/core@1.0.2`
- `@lspeasy/middleware-pino@1.0.2`
- `@lspeasy/server@1.0.2`

### Root Cause

This is a **chicken-and-egg problem** with npm Trusted Publishers:

1. The workflow is configured to use npm OIDC authentication (no `NPM_TOKEN` secret)
2. OIDC requires packages to exist on npm before Trusted Publishers can be configured
3. These packages have never been published to npm (they don't exist yet)
4. Therefore, npm rejects the publish attempt with a 404 error

**Evidence from logs:**
- Line 2026-02-15T00:14:45.0460401Z: `No NPM_TOKEN found, but OIDC is available - using npm trusted publishing`
- The workflow correctly detected OIDC mode but npm rejected the publish
- Provenance statements were successfully created (logged to Sigstore), indicating OIDC authentication worked
- The 404 error occurred because the package names don't exist in the registry yet

## Solutions

### Option 1: Initial Manual Publish (Recommended for First Release)

**Steps:**
1. Generate an npm automation token (classic or granular)
2. Publish packages manually from your local machine:
   ```bash
   npm login
   pnpm changeset:publish
   ```
3. After first publish, configure Trusted Publishers on npm:
   - Go to https://www.npmjs.com/settings/[username]/packages/[package-name]/access
   - For each package, enable "Trusted Publishers"
   - Add GitHub Actions publisher:
     - Provider: GitHub Actions
     - Repository: `pradeepmouli/lspeasy`
     - Workflow: `release.yml`
     - Environment: (leave empty)
4. Future releases will use OIDC automatically

### Option 2: Use NPM_TOKEN Secret for Initial Publish

**Steps:**
1. Generate an npm automation token
2. Add it to GitHub repository secrets as `NPM_TOKEN`
3. Update `.github/workflows/release.yml` to include the token:
   ```yaml
   env:
     GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
     NPM_TOKEN: ${{ secrets.NPM_TOKEN }}  # Add this line
     NPM_CONFIG_PROVENANCE: true
   ```
4. Workflow will use token authentication as fallback
5. After successful publish, configure Trusted Publishers
6. Remove `NPM_TOKEN` from env to switch back to OIDC

### Option 3: Granular Access Tokens with Package Creation

If using npm Granular Access Tokens with "create package" permission:

1. Generate granular token with permissions:
   - Publish packages
   - **Create packages** (this is key!)
2. Add as `NPM_TOKEN` secret
3. Publish will succeed on first run
4. Optionally switch to Trusted Publishers after

## Workflow Configuration Status

The current workflow (`.github/workflows/release.yml`) is **correctly configured** for OIDC:

✅ `id-token: write` permission is set (line 41)
✅ `NPM_CONFIG_PROVENANCE: true` is set (line 75)
✅ No conflicting `NPM_TOKEN`/`NODE_AUTH_TOKEN` environment variables
✅ `registry-url` is correctly set to `https://registry.npmjs.org` (line 57)

The workflow is ready for Trusted Publishers - it just needs the packages to exist first.

## Recommendations

**For immediate action:**
1. Use **Option 1** (manual initial publish) - this is cleanest and most secure
2. Document the Trusted Publisher configuration in the README
3. Keep the current workflow as-is (no changes needed)

**Documentation to add:**
Add a section to README or CONTRIBUTING guide:

```markdown
## Publishing Releases

This project uses npm Trusted Publishers for secure, token-free publishing.

### First-time Setup (Already Done)
The packages must be published manually once before automation works:
1. Ensure you have npm publish rights for @lspeasy scope
2. Run `npm login`
3. Run `pnpm changeset:publish`
4. Configure Trusted Publishers on npm (see instructions in release.yml)

### Ongoing Releases
After initial setup, releases are fully automated via GitHub Actions.
```

## Verification Steps

After implementing the solution:

1. Check that packages exist on npm:
   - https://www.npmjs.com/package/@lspeasy/core
   - https://www.npmjs.com/package/@lspeasy/client
   - https://www.npmjs.com/package/@lspeasy/server
   - https://www.npmjs.com/package/@lspeasy/middleware-pino

2. Verify Trusted Publishers are configured for each package

3. Test the workflow by creating a changeset and merging to master

## References

- [npm Trusted Publishers documentation](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Changesets documentation](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
