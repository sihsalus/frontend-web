const fs = require('fs');
const path = require('path');
const glob = require('glob');

const importmap = { imports: {} };
const routesRegistry = {};
const outDir = 'dist/spa';

// Backend URL for downloading pre-built @openmrs/* modules (only used at build time)
const BACKEND_URL = process.env.SIHSALUS_BACKEND_URL || 'http://hii1sc-dev.inf.pucp.edu.pe';

// Clean and recreate output directory
fs.mkdirSync(outDir, { recursive: true });

// ── Phase 1: Copy locally-built @sihsalus/* app bundles ───────────────
console.log('\n=== Phase 1: Local @sihsalus/* modules ===');
const appDirs = glob.sync('packages/apps/esm-*/dist');
const localBaseNames = new Set();

for (const distDir of appDirs) {
  const pkgJsonPath = path.join(distDir, '..', 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (pkg.private) continue;
  // Only include @sihsalus/* modules locally — @openmrs/* come from backend
  if (!pkg.name.startsWith('@sihsalus/')) continue;

  const browserField = pkg.browser || pkg.module || pkg.main;
  if (!browserField) {
    console.warn(`  SKIP ${pkg.name}: no browser/module/main field`);
    continue;
  }

  const entryFileName = path.basename(browserField);
  const entryFilePath = path.join(distDir, '..', browserField);

  if (!fs.existsSync(entryFilePath)) {
    console.warn(`  SKIP ${pkg.name}: entry bundle not found at ${browserField}`);
    continue;
  }

  fs.copyFileSync(entryFilePath, path.join(outDir, entryFileName));
  importmap.imports[pkg.name] = `./${entryFileName}`;
  localBaseNames.add(pkg.name.replace(/^@[^/]+\//, ''));

  // Copy chunk files
  for (const file of fs.readdirSync(distDir)) {
    if (file === entryFileName) continue;
    if (file.endsWith('.buildmanifest.json')) continue;
    const dest = path.join(outDir, file);
    if (fs.existsSync(dest)) continue;
    fs.copyFileSync(path.join(distDir, file), dest);
  }

  // Collect routes
  const routesPath = path.join(distDir, '..', 'src', 'routes.json');
  if (fs.existsSync(routesPath)) {
    routesRegistry[pkg.name] = {
      ...JSON.parse(fs.readFileSync(routesPath, 'utf8')),
      version: pkg.version || '0.0.0',
    };
  }

  console.log(`  OK ${pkg.name} -> ${entryFileName}`);
}

// ── Phase 2: Download @openmrs/* modules from backend ─────────────────
console.log('\n=== Phase 2: Download backend modules ===');

async function downloadBackendModules() {
  console.log(`  Fetching importmap from ${BACKEND_URL}...`);

  // Fetch backend importmap
  let backendImportmap;
  try {
    const resp = await fetch(`${BACKEND_URL}/openmrs/spa/importmap.json`);
    backendImportmap = await resp.json();
  } catch (e) {
    console.error(`  ERROR: Cannot fetch backend importmap: ${e.message}`);
    console.error('  Set SIHSALUS_BACKEND_URL to your backend server URL');
    process.exit(1);
  }

  // Fetch backend routes
  let backendRoutes = {};
  try {
    const resp = await fetch(`${BACKEND_URL}/openmrs/spa/routes.registry.json`);
    backendRoutes = await resp.json();
  } catch (e) {
    console.warn(`  WARN: Cannot fetch backend routes: ${e.message}`);
  }

  const backendEntries = Object.entries(backendImportmap.imports || {});
  console.log(`  Backend has ${backendEntries.length} modules`);

  let downloaded = 0;
  let skipped = 0;

  for (const [name, relUrl] of backendEntries) {
    const baseName = name.replace(/^@[^/]+\//, '');

    // Skip if we have a local version (e.g. @sihsalus/esm-fua-app overrides @pucp-gidis-hiisc/esm-fua-app)
    if (localBaseNames.has(baseName)) {
      skipped++;
      continue;
    }

    // Resolve the URL
    const fullUrl = relUrl.startsWith('.')
      ? `${BACKEND_URL}/openmrs/spa/${relUrl.replace(/^\.\//, '')}`
      : relUrl;

    // Download the entry bundle
    const fileName = path.basename(new URL(fullUrl).pathname);
    const destPath = path.join(outDir, fileName);

    if (!fs.existsSync(destPath)) {
      try {
        const resp = await fetch(fullUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const buffer = Buffer.from(await resp.arrayBuffer());
        fs.writeFileSync(destPath, buffer);
      } catch (e) {
        console.warn(`  WARN ${name}: download failed (${e.message})`);
        // Still add to importmap with remote URL so it can be fetched at runtime
        importmap.imports[name] = fullUrl;
        continue;
      }
    }

    importmap.imports[name] = `./${fileName}`;
    downloaded++;

    // Also download the buildmanifest to find chunk dependencies
    try {
      const manifestUrl = `${fullUrl}.buildmanifest.json`;
      const mResp = await fetch(manifestUrl);
      if (mResp.ok) {
        const manifest = await mResp.json();
        // Download chunk files listed in the manifest
        if (manifest.files) {
          for (const chunkFile of manifest.files) {
            const chunkDest = path.join(outDir, chunkFile);
            if (!fs.existsSync(chunkDest)) {
              const chunkDir = path.dirname(fullUrl);
              const chunkUrl = `${chunkDir}/${chunkFile}`;
              try {
                const cResp = await fetch(chunkUrl);
                if (cResp.ok) {
                  fs.writeFileSync(chunkDest, Buffer.from(await cResp.arrayBuffer()));
                }
              } catch { /* skip failed chunks */ }
            }
          }
        }
      }
    } catch { /* buildmanifest is optional */ }

    // Merge routes
    if (backendRoutes[name] && !routesRegistry[name]) {
      routesRegistry[name] = backendRoutes[name];
    }
  }

  console.log(`  Downloaded: ${downloaded} | Skipped (local override): ${skipped}`);
}

// ── Phase 3: Copy app-shell dist ──────────────────────────────────────
function copyAppShell() {
  console.log('\n=== Phase 3: App shell ===');
  let shellDist;
  try {
    shellDist = path.join(path.dirname(require.resolve('@openmrs/esm-app-shell/package.json')), 'dist');
  } catch {
    console.warn('  WARN: @openmrs/esm-app-shell not found');
    return;
  }

  if (fs.existsSync(shellDist)) {
    for (const file of fs.readdirSync(shellDist)) {
      const dest = path.join(outDir, file);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(path.join(shellDist, file), dest);
      }
    }
    console.log(`  OK app-shell dist copied`);
  }
}

// ── Phase 4: Write importmap.json and routes ──────────────────────────
function writeOutputs() {
  console.log('\n=== Phase 4: Write outputs ===');
  const importmapJson = JSON.stringify(importmap, null, 2);
  fs.writeFileSync(path.join(outDir, 'importmap.json'), importmapJson);

  fs.writeFileSync(
    path.join(outDir, 'routes.registry.json'),
    JSON.stringify(routesRegistry, null, 2),
  );

  // Verify no duplicate bundle filenames
  const values = Object.values(importmap.imports);
  const dupes = values.filter((v, i) => values.indexOf(v) !== i);
  if (dupes.length > 0) {
    console.error(`\n  WARNING: Duplicate bundle filenames detected!`);
    for (const dupe of [...new Set(dupes)]) {
      const apps = Object.entries(importmap.imports)
        .filter(([, v]) => v === dupe)
        .map(([k]) => k);
      console.error(`    ${dupe}: ${apps.join(', ')}`);
    }
  }

  const localCount = Object.values(importmap.imports).filter(v => v.startsWith('./')).length;
  const remoteCount = Object.keys(importmap.imports).length - localCount;
  console.log(`\n  Import map: ${localCount} local + ${remoteCount} remote = ${Object.keys(importmap.imports).length} total`);
  console.log(`  Routes: ${Object.keys(routesRegistry).length} modules`);
}

// ── Main ──────────────────────────────────────────────────────────────
(async () => {
  await downloadBackendModules();
  copyAppShell();
  writeOutputs();
  console.log('\nDone! dist/spa/ is self-contained.');
})();
