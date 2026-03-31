#!/usr/bin/env node
'use strict';

require('dotenv').config({ quiet: true });
const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { resolve } = require('path');

const backend =
  process.env.SIHSALUS_BACKEND_URL || 'http://hii1sc-dev.inf.pucp.edu.pe';

// SIHSALUS_DEV_APPS=esm-login-app,esm-home-app  → hot-reload those apps
// Unset → serve pre-assembled importmap (no recompilation, just shell + proxy)
const devAppsEnv = process.env.SIHSALUS_DEV_APPS;

const assembledImportmap = resolve(__dirname, '..', 'dist', 'spa', 'importmap.json');
const assembledRoutes = resolve(__dirname, '..', 'dist', 'spa', 'routes.registry.json');

let flags = '';

if (devAppsEnv) {
  const apps = devAppsEnv.split(',').map((a) => a.trim()).filter(Boolean);
  const sourcesFlags = apps
    .map((app) => {
      const dir = resolve(__dirname, '..', 'packages', 'apps', app);
      if (!existsSync(dir)) {
        console.error(`[start-dev] App not found: ${dir}`);
        process.exit(1);
      }
      return `--sources ${dir}`;
    })
    .join(' ');

  // Use local assembled importmap as base (if available), otherwise empty.
  // This ensures the frontend is self-contained — the backend is only for APIs.
  if (existsSync(assembledImportmap) && existsSync(assembledRoutes)) {
    flags = `--importmap ${assembledImportmap} --routes ${assembledRoutes} ${sourcesFlags}`;
  } else {
    // No assembled SPA yet — only the dev apps will be available
    flags = `--importmap '{"imports":{}}' --routes '{}' ${sourcesFlags}`;
  }
} else {
  // No apps to hot-reload: serve the pre-assembled SPA
  if (!existsSync(assembledImportmap)) {
    console.error('[start-dev] No pre-assembled importmap found.');
    console.error('  Run: yarn assemble   (builds the importmap from local packages)');
    console.error('  Or set SIHSALUS_DEV_APPS=esm-login-app,... for hot-reload dev');
    process.exit(1);
  }
  flags = `--importmap ${assembledImportmap} --routes ${assembledRoutes} --run-project false`;
}

const openmrsBin = resolve(__dirname, '..', 'node_modules', 'openmrs', 'dist', 'cli.js');
execSync(
  `node ${openmrsBin} develop --backend ${backend} ${flags}`,
  { stdio: 'inherit' },
);
