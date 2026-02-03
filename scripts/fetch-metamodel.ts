#!/usr/bin/env tsx
/**
 * Fetch metaModel.json from GitHub or npm fallback
 *
 * This script fetches the official LSP metaModel.json from the VSCode Language Server
 * repository on GitHub. If GitHub is unavailable, it falls back to extracting the
 * metaModel from the installed vscode-languageserver-protocol npm package.
 *
 * The fetched metaModel is cached locally to avoid repeated downloads.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as https from 'node:https';

/**
 * Options for fetching the metaModel
 */
export interface FetchMetaModelOptions {
  /**
   * LSP protocol version to fetch (e.g., '3.17.0')
   * @default 'latest' - fetches from main branch
   */
  version?: string;

  /**
   * Whether to use cached version if available
   * @default true
   */
  cache?: boolean;

  /**
   * Force refetch even if cached version exists
   * @default false
   */
  force?: boolean;

  /**
   * Directory to store cached metaModel files
   * @default '.cache/metamodel'
   */
  cacheDir?: string;
}

/**
 * MetaModel root structure (minimal typing for return value)
 */
export interface MetaModel {
  requests: unknown[];
  notifications: unknown[];
  structures: unknown[];
  enumerations: unknown[];
  typeAliases: unknown[];
  [key: string]: unknown;
}

const DEFAULT_CACHE_DIR = '.cache/metamodel';
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/microsoft/vscode-languageserver-node';

/**
 * Download content from a URL using https module
 */
function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          // Handle redirects
          const location = res.headers.location;
          if (location) {
            return httpsGet(location).then(resolve).catch(reject);
          }
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      })
      .on('error', reject);
  });
}

/**
 * Fetch metaModel.json from GitHub
 */
async function fetchFromGitHub(version: string): Promise<string> {
  const branch = version === 'latest' ? 'main' : `release/protocol/${version}`;
  const url = `${GITHUB_RAW_URL}/${branch}/protocol/metaModel.json`;

  console.log(`📡 Fetching metaModel.json from GitHub (${branch})...`);
  return httpsGet(url);
}

/**
 * Try to extract metaModel.json from installed npm package
 */
async function fetchFromNpmModule(): Promise<string> {
  console.log('📦 Attempting npm module fallback...');

  // Try to locate vscode-languageserver-protocol module
  const possiblePaths = [
    // Local node_modules
    path.join(
      process.cwd(),
      'node_modules/vscode-languageserver-protocol/lib/common/metaModel.json'
    ),
    // Parent monorepo node_modules
    path.join(
      process.cwd(),
      '../node_modules/vscode-languageserver-protocol/lib/common/metaModel.json'
    ),
    // Global fallback
    path.join(
      process.cwd(),
      '../../node_modules/vscode-languageserver-protocol/lib/common/metaModel.json'
    )
  ];

  for (const modulePath of possiblePaths) {
    if (fs.existsSync(modulePath)) {
      console.log(`✅ Found metaModel.json in npm module: ${modulePath}`);
      return fs.readFileSync(modulePath, 'utf-8');
    }
  }

  throw new Error(
    'Could not find vscode-languageserver-protocol module. Please install it: pnpm add -D vscode-languageserver-protocol'
  );
}

/**
 * Get cache file path for a specific version
 */
function getCachePath(cacheDir: string, version: string): string {
  return path.join(cacheDir, `metaModel-${version}.json`);
}

/**
 * Load metaModel from cache if available
 */
function loadFromCache(cachePath: string): string | null {
  if (fs.existsSync(cachePath)) {
    console.log(`💾 Loading from cache: ${cachePath}`);
    return fs.readFileSync(cachePath, 'utf-8');
  }
  return null;
}

/**
 * Save metaModel to cache
 */
function saveToCache(cachePath: string, content: string): void {
  const dir = path.dirname(cachePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(cachePath, content, 'utf-8');
  console.log(`💾 Cached to: ${cachePath}`);
}

/**
 * Fetch the LSP metaModel.json
 *
 * @param options - Fetch options
 * @returns Parsed metaModel object
 *
 * @example
 * ```typescript
 * // Fetch latest version with caching
 * const metaModel = await fetchMetaModel();
 *
 * // Fetch specific version
 * const metaModel317 = await fetchMetaModel({ version: '3.17.0' });
 *
 * // Force refetch
 * const fresh = await fetchMetaModel({ force: true });
 * ```
 */
export async function fetchMetaModel(options: FetchMetaModelOptions = {}): Promise<MetaModel> {
  const { version = 'latest', cache = true, force = false, cacheDir = DEFAULT_CACHE_DIR } = options;

  const cachePath = getCachePath(cacheDir, version);

  // Try cache first (unless force refresh)
  if (cache && !force) {
    const cached = loadFromCache(cachePath);
    if (cached) {
      try {
        return JSON.parse(cached) as MetaModel;
      } catch (parseError) {
        console.warn('⚠️  Cached file is invalid, will refetch');
      }
    }
  }

  let content: string;

  try {
    // Try GitHub first
    content = await fetchFromGitHub(version);
  } catch (githubError) {
    console.warn(`⚠️  GitHub fetch failed: ${(githubError as Error).message}`);

    try {
      // Fallback to npm module
      content = await fetchFromNpmModule();
    } catch (npmError) {
      throw new Error(
        `Failed to fetch metaModel.json:\n` +
          `  GitHub: ${(githubError as Error).message}\n` +
          `  NPM: ${(npmError as Error).message}`
      );
    }
  }

  // Validate JSON
  let metaModel: MetaModel;
  try {
    metaModel = JSON.parse(content) as MetaModel;
  } catch (error) {
    throw new Error(`Invalid JSON in metaModel.json: ${(error as Error).message}`);
  }

  // Basic validation
  if (!metaModel.requests || !metaModel.notifications) {
    throw new Error('Invalid metaModel.json structure: missing requests or notifications');
  }

  // Save to cache
  if (cache) {
    saveToCache(cachePath, content);
  }

  console.log('✅ Successfully fetched and parsed metaModel.json');
  return metaModel;
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const options: FetchMetaModelOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--version' && args[i + 1]) {
      options.version = args[++i];
    } else if (arg === '--no-cache') {
      options.cache = false;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--cache-dir' && args[i + 1]) {
      options.cacheDir = args[++i];
    } else if (arg === '--help') {
      console.log(`
Usage: fetch-metamodel.ts [options]

Options:
  --version <version>    LSP protocol version (default: latest)
  --no-cache            Disable caching
  --force               Force refetch even if cached
  --cache-dir <dir>     Cache directory (default: .cache/metamodel)
  --help                Show this help

Examples:
  pnpm tsx scripts/fetch-metamodel.ts
  pnpm tsx scripts/fetch-metamodel.ts --version 3.17.0
  pnpm tsx scripts/fetch-metamodel.ts --force
`);
      process.exit(0);
    }
  }

  try {
    const metaModel = await fetchMetaModel(options);
    console.log('\n📊 MetaModel Statistics:');
    console.log(`  Requests: ${metaModel.requests.length}`);
    console.log(`  Notifications: ${metaModel.notifications.length}`);
    console.log(`  Structures: ${metaModel.structures.length}`);
    console.log(`  Enumerations: ${metaModel.enumerations.length}`);
    console.log(`  Type Aliases: ${metaModel.typeAliases.length}`);
  } catch (error) {
    console.error(`\n❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Run if executed directly - only when tsx is running this file
if (process.argv[1]?.includes('fetch-metamodel')) {
  main();
}
