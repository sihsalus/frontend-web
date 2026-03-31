#!/usr/bin/env node
'use strict';

require('dotenv').config({ quiet: true });
const { spawn } = require('child_process');
const { createReadStream, existsSync, readFileSync } = require('fs');
const { resolve, join, extname } = require('path');
const http = require('http');

const backend =
  process.env.SIHSALUS_BACKEND_URL || 'http://hii1sc-dev.inf.pucp.edu.pe';

// SIHSALUS_DEV_APPS=esm-login-app,esm-home-app  → hot-reload those apps
// Unset → serve pre-assembled importmap (no recompilation, just shell + proxy)
const devAppsEnv = process.env.SIHSALUS_DEV_APPS;

const assembledImportmap = resolve(__dirname, '..', 'dist', 'spa', 'importmap.json');
const assembledRoutes = resolve(__dirname, '..', 'dist', 'spa', 'routes.registry.json');
const distSpa = resolve(__dirname, '..', 'dist', 'spa');

const MIME_TYPES = {
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function createStaticServer(dir) {
  return http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const filePath = join(dir, pathname);

    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end();
      return;
    }

    res.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(filePath)] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    createReadStream(filePath).pipe(res);
  });
}

function rewriteImportmap(importmapPath, devApps, staticPort) {
  const importmap = JSON.parse(readFileSync(importmapPath, 'utf8'));

  for (const [name, url] of Object.entries(importmap.imports)) {
    const isDevApp = devApps.some((app) => name.includes(app));
    if (!isDevApp && typeof url === 'string' && url.startsWith('./')) {
      importmap.imports[name] = `http://localhost:${staticPort}/${url.slice(2)}`;
    }
  }

  return JSON.stringify(importmap);
}

function startDevServer(args) {
  const openmrsBin = resolve(__dirname, '..', 'node_modules', 'openmrs', 'dist', 'cli.js');
  const fullArgs = [openmrsBin, 'develop', '--backend', backend, ...args];

  const child = spawn('node', fullArgs, { stdio: 'inherit' });

  child.on('exit', (code) => process.exit(code ?? 1));
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}

if (devAppsEnv) {
  const apps = devAppsEnv.split(',').map((a) => a.trim()).filter(Boolean);
  const sourcesArgs = apps.flatMap((app) => {
    const dir = resolve(__dirname, '..', 'packages', 'apps', app);
    if (!existsSync(dir)) {
      console.error(`[start-dev] App not found: ${dir}`);
      process.exit(1);
    }
    return ['--sources', dir];
  });

  if (existsSync(assembledImportmap) && existsSync(assembledRoutes)) {
    // Start a static server for dist/spa/ so non-dev apps can load their bundles
    const staticServer = createStaticServer(distSpa);

    staticServer.listen(0, () => {
      const staticPort = staticServer.address().port;
      console.log(`[start-dev] Serving pre-built bundles from dist/spa/ on port ${staticPort}`);

      const importmapJson = rewriteImportmap(assembledImportmap, apps, staticPort);
      startDevServer(['--importmap', importmapJson, '--routes', assembledRoutes, ...sourcesArgs]);
    });

    process.on('exit', () => staticServer.close());
  } else {
    // No assembled SPA yet — only the dev apps will be available
    startDevServer(['--importmap', '{"imports":{}}', '--routes', '{}', ...sourcesArgs]);
  }
} else {
  // No apps to hot-reload: serve the pre-assembled SPA
  if (!existsSync(assembledImportmap)) {
    console.error('[start-dev] No pre-assembled importmap found.');
    console.error('  Run: yarn assemble   (builds the importmap from local packages)');
    console.error('  Or set SIHSALUS_DEV_APPS=esm-login-app,... for hot-reload dev');
    process.exit(1);
  }
  startDevServer(['--importmap', assembledImportmap, '--routes', assembledRoutes, '--run-project', 'false']);
}
