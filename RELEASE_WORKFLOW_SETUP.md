# Release Workflow Setup Guide

## Issue Summary

The release workflow (GitHub Actions run #22026627902) failed during the "Create Release Pull Request or Publish" step.

### Root Cause

The workflow attempted to publish packages to npm using OIDC (OpenID Connect) Trusted Publishing, but:

1. **The packages have never been published before** - All four packages (`@lspeasy/client`, `@lspeasy/core`, `@lspeasy/middleware-pino`, `@lspeasy/server`) returned 404 errors from npm registry
2. **OIDC cannot be used for initial publish** - npm requires at least one successful manual publish before OIDC trusted publishing can be configured
3. **No authentication was available** - Neither NPM_TOKEN nor OIDC was properly configured, resulting in "Access token expired or revoked" error

### Error Details

```
E404 Not Found - PUT https://registry.npmjs.org/@lspeasy%2f<package-name>
'@lspeasy/<package>@1.0.2' is not in this registry.
npm notice Access token expired or revoked. Please try logging in again.
```

## Solution: Choose Your Publishing Method

You have two options for npm authentication. **Option 1 is recommended for the initial publish.**

### Option 1: Token-Based Publishing (Recommended for First Publish)

This is the traditional method using a long-lived npm token.

#### Steps:

1. **Create an npm Automation Token**
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Automation"
   - Copy the token (you'll only see it once!)

2. **Add Token to Repository Secrets**
   - Go to: https://github.com/pradeepmouli/lspeasy/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

3. **Re-run the Failed Workflow**
   - Go to: https://github.com/pradeepmouli/lspeasy/actions/runs/22026627902
   - Click "Re-run failed jobs"
   - The workflow will now publish using your token

4. **Verify Publication**
   - Check that packages appear on npm:
     - https://www.npmjs.com/package/@lspeasy/core
     - https://www.npmjs.com/package/@lspeasy/client
     - https://www.npmjs.com/package/@lspeasy/server
     - https://www.npmjs.com/package/@lspeasy/middleware-pino

5. **(Optional) Migrate to OIDC**
   - After successful publish, you can switch to OIDC (see Option 2)
   - OIDC is more secure and doesn't require managing tokens

### Option 2: OIDC Trusted Publishing (Recommended After First Publish)

OIDC provides passwordless, token-free publishing with better security and supply chain attestation.

#### Prerequisites:
- Packages must already be published at least once (use Option 1 first, or publish manually)

#### Steps:

1. **Configure Trusted Publisher on npm** (repeat for each package)
   
   For `@lspeasy/core`:
   - Go to: https://www.npmjs.com/settings/pradeepmouli/packages/@lspeasy/core/access
   - Scroll to "Trusted Publishers" section
   - Click "Add trusted publisher"
   - Select "GitHub Actions"
   - Fill in:
     - **Owner**: `pradeepmouli`
     - **Repository**: `lspeasy`
     - **Workflow filename**: `release.yml`
     - **Environment name**: (leave empty)
   - Click "Add"

   Repeat for:
   - https://www.npmjs.com/settings/pradeepmouli/packages/@lspeasy/client/access
   - https://www.npmjs.com/settings/pradeepmouli/packages/@lspeasy/server/access
   - https://www.npmjs.com/settings/pradeepmouli/packages/@lspeasy/middleware-pino/access

2. **Remove NPM_TOKEN Secret** (Important!)
   - Go to: https://github.com/pradeepmouli/lspeasy/settings/secrets/actions
   - Find `NPM_TOKEN`
   - Click "Remove"
   - **Why?** NPM_TOKEN takes precedence over OIDC. If NPM_TOKEN is set (even to empty), npm won't use OIDC.

3. **Verify OIDC Publishing**
   - Merge a PR that bumps package versions
   - The release workflow will automatically publish using OIDC
   - Packages will have provenance attestation for supply chain security

## Workflow Details

The release workflow (`.github/workflows/release.yml`) now includes:

- ✅ Detailed documentation for both auth methods
- ✅ `id-token: write` permission for OIDC
- ✅ `NPM_CONFIG_PROVENANCE: true` for supply chain attestation
- ✅ Proper environment variable configuration

### How It Works:

1. **With NPM_TOKEN set**: Uses token-based authentication
2. **With NPM_TOKEN removed + OIDC configured**: Uses OIDC authentication
3. **With neither**: Fails with authentication error (as expected)

## Troubleshooting

### "Access token expired or revoked"
- **If using tokens**: Check that NPM_TOKEN secret is set and valid
- **If using OIDC**: Ensure NPM_TOKEN secret is removed and OIDC is configured on npmjs.com

### "404 Not Found" during publish
- Packages must be published at least once before OIDC works
- Use Option 1 (token-based) for first publish, then switch to OIDC

### "OIDC not working"
- Verify NPM_TOKEN secret is completely removed (not just set to empty)
- Verify trusted publisher is configured on npmjs.com
- Verify workflow filename matches exactly: `release.yml`
- Verify repository name matches exactly: `pradeepmouli/lspeasy`

## References

- [npm Trusted Publishing Documentation](https://docs.npmjs.com/trusted-publishers)
- [GitHub Actions OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Changesets Documentation](https://github.com/changesets/changesets)

## Summary

**For immediate fix**: Use Option 1 (token-based) to complete the initial publish.

**For long-term security**: After first publish, migrate to Option 2 (OIDC) for better security and automatic provenance attestation.
