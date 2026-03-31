#!/usr/bin/env node
'use strict';

require('dotenv').config({ quiet: true });
const { spawn } = require('child_process');
const { createReadStream, existsSync, readFileSync, writeFileSync, mkdtempSync, statSync } = require('fs');
const { resolve, join, extname } = require('path');
const { tmpdir } = require('os');
const http = require('http');
const chalk = require('chalk');

const logInfo = (msg) => console.log(`${chalk.green.bold('[start-dev]')} ${msg}`);
const logWarn = (msg) => console.warn(`${chalk.yellow.bold('[start-dev]')} ${chalk.yellow(msg)}`);
const logFail = (msg) => console.error(`${chalk.red.bold('[start-dev]')} ${chalk.red(msg)}`);

const backend =
  process.env.SIHSALUS_BACKEND_URL || 'http://hii1sc-dev.inf.pucp.edu.pe';

if (!process.env.SIHSALUS_BACKEND_URL) {
  logWarn(`SIHSALUS_BACKEND_URL no definida, usando default: ${backend}`);
}

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

  // Write to a temp file because the CLI's getImportMap regex treats any string
  // containing "http://" as a URL, so inline JSON with http:// URLs won't work.
  const tmpDir = mkdtempSync(join(tmpdir(), 'sihsalus-dev-'));
  const tmpFile = join(tmpDir, 'importmap.json');
  writeFileSync(tmpFile, JSON.stringify(importmap));
  return tmpFile;
}

function startDevServer(args) {
  const openmrsBin = resolve(__dirname, '..', 'node_modules', 'openmrs', 'dist', 'cli.js');
  const fullArgs = [openmrsBin, 'develop', '--backend', backend, ...args];

  const child = spawn('node', ['--disable-warning=DEP0060', ...fullArgs], { stdio: 'inherit' });

  child.on('exit', (code) => process.exit(code ?? 1));
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}

if (devAppsEnv) {
  const apps = devAppsEnv.split(',').map((a) => a.trim()).filter(Boolean);
  const sourcesArgs = apps.flatMap((app) => {
    const dir = resolve(__dirname, '..', 'packages', 'apps', app);
    if (!existsSync(dir)) {
      logFail(`App no encontrada: ${dir}`);
      process.exit(1);
    }
    return ['--sources', dir];
  });

  if (existsSync(assembledImportmap) && existsSync(assembledRoutes)) {
    const importmapAge = Date.now() - statSync(assembledImportmap).mtimeMs;
    const hoursOld = Math.floor(importmapAge / 3_600_000);
    if (hoursOld >= 24) {
      logWarn(`El importmap ensamblado tiene ${hoursOld}h de antigüedad. Considera ejecutar: yarn assemble`);
    }

    // Start a static server for dist/spa/ so non-dev apps can load their bundles
    const staticServer = createStaticServer(distSpa);

    staticServer.listen(0, () => {
      const staticPort = staticServer.address().port;
      logInfo(`Sirviendo bundles pre-construidos desde dist/spa/ en puerto ${staticPort}`);

      const importmapFile = rewriteImportmap(assembledImportmap, apps, staticPort);
      startDevServer(['--importmap', importmapFile, '--routes', assembledRoutes, ...sourcesArgs]);
    });

    process.on('exit', () => staticServer.close());
  } else {
    logWarn('No se encontró importmap ensamblado. Solo las apps en SIHSALUS_DEV_APPS estarán disponibles.');
    logWarn('Para tener todas las apps: yarn assemble');
    startDevServer(['--importmap', '{"imports":{}}', '--routes', '{}', ...sourcesArgs]);
  }
} else {
  // No apps to hot-reload: serve the pre-assembled SPA
  if (!existsSync(assembledImportmap)) {
    logFail('No se encontró importmap ensamblado.');
    logFail('  Ejecuta: yarn assemble   (construye el importmap desde los paquetes locales)');
    logFail('  O define SIHSALUS_DEV_APPS=esm-login-app,... para hot-reload');
    process.exit(1);
  }
  logInfo('Sirviendo SPA pre-ensamblado (sin hot-reload). Define SIHSALUS_DEV_APPS para desarrollo.');
  startDevServer(['--importmap', assembledImportmap, '--routes', assembledRoutes, '--run-project', 'false']);
}
