# Release Workflow Setup Guide

## Issue Summary

The release workflow (GitHub Actions run #22026627902) failed during the "Create Release Pull Request or Publish" step when attempting to publish version 1.0.2.

### Root Cause

The workflow attempted to publish packages to npm but authentication failed. The packages already exist on npm (v1.0.1 was manually published), but the workflow cannot authenticate to publish v1.0.2.

**Likely causes:**
1. **OIDC not configured** - npm Trusted Publishers (OIDC) is not set up on npmjs.com for these packages
2. **Invalid/expired NPM_TOKEN** - If NPM_TOKEN secret exists, it may be expired, revoked, or have insufficient permissions
3. **NPM_TOKEN blocking OIDC** - If both NPM_TOKEN and OIDC are configured, NPM_TOKEN takes precedence and may be invalid

### Error Details

```
E404 Not Found - PUT https://registry.npmjs.org/@lspeasy%2f<package-name>
'@lspeasy/<package>@1.0.2' is not in this registry.
npm notice Access token expired or revoked. Please try logging in again.
```

Note: npm returns 404 errors for authentication failures, not just missing packages.

## Solution: Choose Your Publishing Method

You have two options for npm authentication. Since packages already exist, either option will work.

### Option 1: Token-Based Publishing

This method uses a long-lived npm token. Use this if you prefer traditional token-based auth or need to publish quickly.

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

### Option 2: OIDC Trusted Publishing (Recommended)

OIDC provides passwordless, token-free publishing with better security and supply chain attestation. Since your packages already exist on npm, you can configure OIDC directly.

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
   - https://www.npmjs.com/settings/pradeepmouli/packages/@lspeasy/middleware-pino/access (if it exists)

2. **Remove NPM_TOKEN Secret** (Critical!)
   - Go to: https://github.com/pradeepmouli/lspeasy/settings/secrets/actions
   - If `NPM_TOKEN` exists, click "Remove"
   - **Why?** NPM_TOKEN takes precedence over OIDC. Even an invalid/expired NPM_TOKEN will prevent OIDC from working.

3. **Re-run the Workflow**
   - Go to: https://github.com/pradeepmouli/lspeasy/actions/runs/22026627902
   - Click "Re-run failed jobs"
   - The workflow will now publish using OIDC

4. **Verify OIDC Publishing**
   - Packages will be published with provenance attestation
   - Check package pages on npm for the provenance badge

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
- **If using tokens**: Check that NPM_TOKEN secret is set and valid (not expired/revoked)
- **If using OIDC**: Ensure NPM_TOKEN secret is completely removed from repository settings

### "404 Not Found" during publish
- npm returns 404 for authentication failures, not just missing packages
- Check authentication configuration (NPM_TOKEN validity or OIDC setup)
- Verify the package exists on npm and you have publish permissions

### "OIDC not working"
- Verify NPM_TOKEN secret is completely removed (not just set to empty)
- Verify trusted publisher is configured on npmjs.com for ALL packages
- Verify workflow filename matches exactly: `release.yml`
- Verify repository name matches exactly: `pradeepmouli/lspeasy`
- Check that packages already exist on npm (OIDC requires one prior publish)

## References

- [npm Trusted Publishing Documentation](https://docs.npmjs.com/trusted-publishers)
- [GitHub Actions OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Changesets Documentation](https://github.com/changesets/changesets)

## Summary

**For immediate fix**: 
- Option 1 (token-based): Quick setup with NPM_TOKEN secret
- Option 2 (OIDC): More secure, requires configuration on npmjs.com

**Recommendation**: Use OIDC (Option 2) for better security and automatic provenance attestation. Since packages already exist on npm, you can configure OIDC directly.
