#!/usr/bin/env tsx
/**
 * Generator: produce apps/cli/skills/cli/ from buildProgram() + README.md.
 *
 * Run via: pnpm --filter @lsproxy/cli run skill:gen
 *   (requires an up-to-date dist/; run `pnpm build` first if program.ts changed)
 *
 * Source of truth:
 *   - Command surface  → apps/cli/src/program.ts  (buildProgram)
 *   - Prose / examples → apps/cli/README.md
 *
 * Never hand-edit the generated output; re-run this script instead.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCliSkill, writeCliSkill } from '@skillit/cli';
import { buildProgram } from '../dist/program.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliDir = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Metadata from package.json
// ---------------------------------------------------------------------------
interface Pkg {
  description: string;
  keywords?: string[];
  repository?: { url: string };
  author?: string;
  license?: string;
}
const pkg = JSON.parse(readFileSync(resolve(cliDir, 'package.json'), 'utf-8')) as Pkg;

// ---------------------------------------------------------------------------
// README section extractor
// Reads content under the first level-2 (## ) heading that matches any alias
// (exact match OR startsWith). Stops at the next ## heading.
// ---------------------------------------------------------------------------
function extractSection(markdown: string, headingAliases: string[]): string | undefined {
  const normalized = headingAliases.map((h) => h.toLowerCase().trim());
  const lines = markdown.split('\n');
  let collecting = false;
  const collected: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (collecting) break; // end of section
      const text = line.slice(3).toLowerCase().trim();
      if (normalized.some((alias) => text === alias || text.startsWith(alias))) {
        collecting = true;
        continue;
      }
    }
    if (collecting) collected.push(line);
  }

  return collected.join('\n').trim() || undefined;
}

const readme = readFileSync(resolve(cliDir, 'README.md'), 'utf-8');

// Core SKILL.md prose fields
const features = extractSection(readme, ['features', 'key features', 'highlights']);
const quickStart = extractSection(readme, ['quick start', 'getting started', 'basic usage']);
const troubleshooting = extractSection(readme, ['troubleshooting', 'common issues', 'faq']);

// Additional sections → references/docs/ (progressive disclosure)
const helpOutput = extractSection(readme, ['help output']);
const serverDiscovery = extractSection(readme, ['server discovery']);
const configInterop = extractSection(readme, ['config interop']);
const globalFlags = extractSection(readme, ['global flags']);
const proxyDaemon = extractSection(readme, ['proxy daemon']);
const programmaticUse = extractSection(readme, ['programmatic use']);

type Doc = { title: string; content: string; description: string };

function makeDoc(title: string, content: string | undefined, description: string): Doc | null {
  return content ? { title, content, description } : null;
}

const documents = [
  makeDoc(
    'Dynamic discovery model',
    helpOutput,
    'Depth-aware --help surface built from live server capabilities'
  ),
  makeDoc(
    'Server discovery (lsp.json)',
    serverDiscovery,
    'lsp.json file format and walk-up resolution order'
  ),
  makeDoc(
    'Config interop (lsproxy config)',
    configInterop,
    'Multi-platform config bridge: lsp.json ↔ Copilot CLI, Claude Code, Codex'
  ),
  makeDoc('Global flags', globalFlags, 'Flags available on every lsproxy command'),
  makeDoc(
    'Proxy daemon',
    proxyDaemon,
    'Background daemon for warm LSP connections (sub-100ms subsequent calls)'
  ),
  makeDoc(
    'Programmatic use',
    programmaticUse,
    'TypeScript API: RefactorSession, applyWorkspaceEdit, planWorkspaceEdit'
  )
].filter(Boolean) as Doc[];

// ---------------------------------------------------------------------------
// Flatten subcommands into top-level surfaces so references/commands.md
// renders ALL subcommands (config list/import/export/diff, textDocument
// codeAction with --code-action-only / --code-action-trigger-kind, etc.).
//
// @skillit/core@1.5.0's renderCommandsReference does not recurse into
// surface.subcommands, so we must flatten before writing.
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenSurfaces(surfaces: any[], parentName?: string): any[] {
  const result: any[] = [];
  for (const surface of surfaces) {
    const fullName = parentName ? `${parentName} ${surface.name}` : surface.name;
    // Emit this surface with its full command path as the name
    result.push({ ...surface, name: fullName, subcommands: undefined });
    // Recurse into subcommands
    if (Array.isArray(surface.subcommands) && surface.subcommands.length > 0) {
      result.push(...flattenSurfaces(surface.subcommands, fullName));
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Extract skill from Commander program
// ---------------------------------------------------------------------------
const program = buildProgram();

const skill = await extractCliSkill({
  program,
  metadata: {
    name: 'cli',
    description: pkg.description,
    keywords: pkg.keywords,
    repository: pkg.repository?.url,
    // Strip email / URL from "Name <email> (url)" author string
    author:
      typeof pkg.author === 'string'
        ? (pkg.author.match(/^([^<(]+)/)?.[1]?.trim() ?? pkg.author)
        : undefined
  }
});

// flattenSurfaces expands the subcommand tree so each command is an individually
// addressable surface in SKILL.md. (Note: writeCliSkill truncates references/commands.md
// at a fixed limit, so later commands like `config`/`call` appear only in SKILL.md,
// not commands.md — an @skillit/core@1.5.0 limitation.)
const flatSurfaces = flattenSurfaces(skill.configSurfaces ?? []);

// Enrich with README prose — these fields are part of ExtractedSkill but
// extractCliSkill does not populate them automatically (no readme option in
// CliExtractionOptions). Dynamic discovery, config interop, and other prose
// sections are captured as `documents` → references/docs/ for progressive
// disclosure.
const enrichedSkill = {
  ...skill,
  configSurfaces: flatSurfaces,
  ...(features !== undefined ? { readmeFeatures: features } : {}),
  ...(troubleshooting !== undefined ? { readmeTroubleshooting: troubleshooting } : {}),
  ...(quickStart !== undefined ? { examples: [quickStart] } : {}),
  ...(documents.length > 0 ? { documents } : {})
};

// ---------------------------------------------------------------------------
// Write generated skill files
// ---------------------------------------------------------------------------
const outDir = resolve(cliDir, 'skills');
const results = writeCliSkill(enrichedSkill, { outDir });

console.log('Generated skill files:');
for (const result of results) {
  const status =
    result.action === 'written' ? '✓ written' : `~ preserved (${result.preserveReason ?? ''})`;
  console.log(`  ${status}: ${result.root}/${result.skillName}`);
}
