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

let sourcesFlags = '';

if (devAppsEnv) {
  const apps = devAppsEnv.split(',').map((a) => a.trim()).filter(Boolean);
  sourcesFlags = apps
    .map((app) => {
      const dir = resolve(__dirname, '..', 'packages', 'apps', app);
      if (!existsSync(dir)) {
        console.error(`[start-dev] App not found: ${dir}`);
        process.exit(1);
      }
      return `--sources ${dir}`;
    })
    .join(' ');
} else {
  // No apps to hot-reload: serve the pre-assembled SPA
  const importmap = resolve(__dirname, '..', 'dist', 'spa', 'importmap.json');
  if (!existsSync(importmap)) {
    console.error('[start-dev] No pre-assembled importmap found.');
    console.error('  Run: yarn assemble   (builds the importmap from local packages)');
    console.error('  Or set SIHSALUS_DEV_APPS=esm-login-app,... for hot-reload dev');
    process.exit(1);
  }
  sourcesFlags = `--importmap ${importmap} --run-project false`;
}

const openmrsBin = resolve(__dirname, '..', 'node_modules', 'openmrs', 'dist', 'cli.js');
execSync(
  `node ${openmrsBin} develop --backend ${backend} ${sourcesFlags}`,
  { stdio: 'inherit' },
);
