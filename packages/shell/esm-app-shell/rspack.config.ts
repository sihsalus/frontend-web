import rspack, { type Configuration, type RspackPluginInstance, type Compiler, type Compilation } from '@rspack/core';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { basename, dirname, resolve } from 'path';
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import semver from 'semver';
import { removeTrailingSlash, getTimestamp } from './tools/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const { name, version, dependencies } = require('./package.json');
const sharedDependencies: string[] = require('./dependencies.json');
const frameworkVersion = require('@openmrs/esm-framework/package.json').version;

const timestamp = getTimestamp();
const productionMode = 'production';
const allowedSuffixes = ['-app', '-widgets'];
const { ModuleFederationPlugin } = rspack.container;

// ── Environment variables ──────────────────────────────────────────────
const openmrsApiUrl = removeTrailingSlash(process.env.OMRS_API_URL || '/openmrs');
const openmrsPublicPath = removeTrailingSlash(process.env.OMRS_PUBLIC_PATH || '/openmrs/spa');
const openmrsProxyTarget = process.env.OMRS_PROXY_TARGET || 'https://dev3.openmrs.org/';
const openmrsPageTitle = process.env.OMRS_PAGE_TITLE || 'OpenMRS';
const openmrsFavicon = process.env.OMRS_FAVICON || `${openmrsPublicPath}/favicon.ico`;
const openmrsEnvironment = process.env.OMRS_ENV || process.env.NODE_ENV || '';
const openmrsOffline = process.env.OMRS_OFFLINE === 'enable';
const openmrsDefaultLocale = process.env.OMRS_ESM_DEFAULT_LOCALE || 'en';
const openmrsImportmapDef = process.env.OMRS_ESM_IMPORTMAP;
const openmrsImportmapUrl = process.env.OMRS_ESM_IMPORTMAP_URL || `${openmrsPublicPath}/importmap.json`;
const openmrsRoutesDef = process.env.OMRS_ROUTES;
const openmrsRoutesUrl = process.env.OMRS_ROUTES_URL || `${openmrsPublicPath}/routes.registry.json`;
const openmrsCoreApps = process.env.OMRS_ESM_CORE_APPS_DIR || resolve(__dirname, '../../apps');
const openmrsConfigUrls = (process.env.OMRS_CONFIG_URLS || '')
  .split(';')
  .filter((url) => url.length > 0)
  .map((url) => JSON.stringify(url))
  .join(', ');
const openmrsAddCookie = process.env.OMRS_ADD_COOKIE;

const openmrsCleanBeforeBuild = (() => {
  try {
    return (
      process.env.OMRS_CLEAN_BEFORE_BUILD === undefined ||
      process.env.OMRS_CLEAN_BEFORE_BUILD?.toLowerCase() !== 'false'
    );
  } catch {
    return true;
  }
})();

// ── Helpers ────────────────────────────────────────────────────────────
function checkDirectoryExists(dirName: string | undefined): boolean {
  if (dirName) {
    try {
      return statSync(dirName).isDirectory();
    } catch {
      return false;
    }
  }
  return false;
}

function checkFileExists(filename: string): boolean {
  try {
    return statSync(filename).isFile();
  } catch {
    return false;
  }
}

function checkDirectoryHasContents(dirName: string): boolean {
  if (checkDirectoryExists(dirName)) {
    return readdirSync(dirName).length > 0;
  }
  return false;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Custom ServiceWorker plugin (replaces workbox-webpack-plugin) ─────
class ServiceWorkerPlugin implements RspackPluginInstance {
  constructor(
    private options: {
      swSrc: string;
      swDest: string;
      offline: boolean;
      additionalManifestEntries?: Array<{ url: string; revision: string | null }>;
    },
  ) {}

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise('ServiceWorkerPlugin', async (compilation) => {
      const outputPath = compilation.outputOptions.path;
      if (!outputPath) return;

      // Gather all emitted assets into a precache manifest
      const manifest: Array<{ url: string; revision: string | null }> = [];

      for (const assetName of Object.keys(compilation.assets)) {
        if (assetName.endsWith('.map') || assetName === this.options.swDest) continue;
        manifest.push({ url: assetName, revision: null });
      }

      if (this.options.additionalManifestEntries) {
        manifest.push(...this.options.additionalManifestEntries);
      }

      // Build the service worker with a child rspack compiler
      const swConfig: Configuration = {
        entry: this.options.swSrc,
        output: {
          filename: this.options.swDest,
          path: outputPath,
        },
        target: 'webworker',
        mode: compiler.options.mode,
        module: {
          rules: [{ test: /\.tsx?$/, loader: 'swc-loader' }],
        },
        resolve: {
          extensions: ['.ts', '.js'],
        },
        plugins: [
          new rspack.DefinePlugin({
            'self.__WB_MANIFEST': JSON.stringify(manifest),
          }),
        ],
      };

      await new Promise<void>((resolve, reject) => {
        rspack.rspack(swConfig, (err, stats) => {
          if (err) return reject(err);
          if (stats?.hasErrors()) {
            const errors = stats.compilation.errors;
            console.error('[ServiceWorkerPlugin] Build errors:', errors);
            return reject(new Error('Service worker build failed'));
          }
          console.log(`[ServiceWorkerPlugin] ${this.options.swDest} generated (${manifest.length} assets in manifest)`);
          resolve();
        });
      });
    });
  }
}

// ── Static PWA manifest (replaces webpack-pwa-manifest) ───────────────
class PwaManifestPlugin implements RspackPluginInstance {
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise('PwaManifestPlugin', async (compilation) => {
      const outputPath = compilation.outputOptions.path;
      if (!outputPath) return;

      const manifest = {
        name: 'OpenMRS',
        short_name: 'OpenMRS',
        description: 'Open source Health IT by and for the entire planet.',
        background_color: '#ffffff',
        theme_color: '#000000',
        display: 'standalone',
        start_url: openmrsPublicPath,
        icons: [96, 128, 144, 192, 256, 384, 512].map((size) => ({
          src: `${openmrsPublicPath}/logo-512.png`,
          sizes: `${size}x${size}`,
          type: 'image/png',
        })),
      };

      const outFile = resolve(outputPath, 'manifest.json');
      writeFileSync(outFile, JSON.stringify(manifest, null, 2));
      console.log('[PwaManifestPlugin] manifest.json generated');
    });
  }
}

// ── Main config ───────────────────────────────────────────────────────
export default (env: Record<string, string> = {}, argv: Record<string, string> = {}): Configuration => {
  const mode = argv.mode || process.env.NODE_ENV || productionMode;
  const outDir = mode === productionMode ? 'dist' : 'lib';
  const isProd = mode === 'production';
  const appPatterns: Array<{ from: string; to?: string }> = [];

  const coreImportmap: { imports: Record<string, string> } = { imports: {} };
  const coreRoutes: Record<string, unknown> = {};

  // Dev mode: scan apps directory for local module federation modules
  if (!isProd && checkDirectoryExists(openmrsCoreApps)) {
    readdirSync(openmrsCoreApps).forEach((dir) => {
      const appDir = resolve(openmrsCoreApps, dir);
      if (checkDirectoryExists(appDir)) {
        try {
          const { name: appName, browser } = require(resolve(appDir, 'package.json'));
          const distDir = resolve(appDir, dirname(browser));
          if (allowedSuffixes.some((suffix) => appName.endsWith(suffix))) {
            if (checkDirectoryHasContents(distDir)) {
              appPatterns.push({ from: distDir, to: dir });
              coreImportmap.imports[appName] = `./${dir}/${basename(browser)}`;
              const routesFile = resolve(distDir, 'routes.json');
              if (checkFileExists(routesFile)) {
                coreRoutes[appName] = JSON.parse(readFileSync(routesFile, 'utf8'));
              }
            }
          }
        } catch {
          // skip malformed packages
        }
      }
    });
  }

  // ── Module Federation shared config ─────────────────────────────────
  const shared = sharedDependencies.reduce(
    (obj, depName) => {
      let ver = dependencies[depName];

      if (ver) {
        if (ver.startsWith('^')) {
          ver = `${semver.parse(ver.slice(1))?.major}.x`;
        } else if (ver.startsWith('~')) {
          const sv = semver.parse(ver.slice(1));
          ver = `${sv?.major}.${sv?.minor}.x`;
        } else if (ver === 'workspace:*') {
          ver = `${semver.parse(require(`${depName}/package.json`).version)?.major}.X`;
        }
      }

      const eager = depName === 'dayjs';

      if (depName === 'swr') {
        obj['swr/_internal'] = {
          requiredVersion: ver,
          strictVersion: false,
          singleton: true,
          eager: false,
          import: 'swr/_internal',
          shareKey: 'swr/_internal',
          shareScope: 'default',
          version: require('swr/package.json').version,
        };
      } else {
        obj[depName] = {
          requiredVersion: ver ?? false,
          strictVersion: false,
          singleton: true,
          eager,
          import: depName,
          shareKey: depName,
          shareScope: 'default',
        };
      }
      return obj;
    },
    {} as Record<string, any>,
  );

  return {
    entry: resolve(__dirname, 'src/index.ts'),
    output: {
      filename: isProd ? 'openmrs.[contenthash].js' : 'openmrs.js',
      chunkFilename: '[chunkhash].js',
      path: resolve(__dirname, outDir),
      publicPath: '',
      hashFunction: 'xxhash64',
      clean: openmrsCleanBeforeBuild,
    },
    target: 'web',
    devServer: {
      compress: true,
      open: [`${openmrsPublicPath}/`.substring(1)],
      devMiddleware: { publicPath: `${openmrsPublicPath}/` },
      historyApiFallback: {
        rewrites: [
          {
            from: new RegExp(`^${escapeRegExp(openmrsPublicPath)}/.*(?!\\.(?!html).+$)`),
            to: `${openmrsPublicPath}/index.html`,
          },
        ],
      },
      proxy: [
        {
          context(path: string) {
            if (!path) return false;
            if (path.startsWith(openmrsPublicPath)) return basename(path).indexOf('.') >= 0;
            return path.startsWith(openmrsApiUrl);
          },
          target: openmrsProxyTarget,
          changeOrigin: true,
          onProxyReq(proxyReq: any) {
            if (openmrsAddCookie) {
              const origCookie = proxyReq.getHeader('cookie');
              proxyReq.setHeader('cookie', `${origCookie};${openmrsAddCookie}`);
            }
          },
          onProxyRes(proxyRes: any) {
            if (proxyRes.headers) delete proxyRes.headers['content-security-policy'];
          },
        },
      ],
      static: ['src/assets'],
    },
    watchOptions: { ignored: ['.git', 'test-results'] },
    mode: mode as 'production' | 'development' | 'none',
    devtool: isProd ? 'hidden-nosources-source-map' : 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isProd ? rspack.CssExtractRspackPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            isProd ? rspack.CssExtractRspackPlugin.loader : 'style-loader',
            'css-loader',
            { loader: 'sass-loader', options: { sassOptions: { quietDeps: true } } },
          ],
        },
        { test: /\.(woff|woff2|png)?$/, type: 'asset/resource' },
        { test: /\.(svg|html)$/, type: 'asset/source' },
        { test: /\.(j|t)sx?$/, loader: 'swc-loader' },
      ],
    },
    optimization: {
      splitChunks: { maxAsyncRequests: 3, maxInitialRequests: 1 },
      minimizer: [
        new rspack.SwcJsMinimizerRspackPlugin(),
        new rspack.LightningCssMinimizerRspackPlugin(),
      ],
    },
    resolve: {
      mainFields: ['module', 'main'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
      fallback: { http: false, stream: false, https: false, zlib: false, url: false },
      alias: {
        'lodash.debounce': 'lodash-es/debounce',
        'lodash.findlast': 'lodash-es/findLast',
        'lodash.isequal': 'lodash-es/isEqual',
        'lodash.omit': 'lodash-es/omit',
        'lodash.throttle': 'lodash-es/throttle',
        '@openmrs/esm-translations/translations': resolve(
          dirname(require.resolve('@openmrs/esm-translations/package.json')),
          'translations',
        ),
      },
    },
    plugins: [
      // HTML generation — uses HtmlWebpackPlugin (rspack-compatible)
      new HtmlWebpackPlugin({
        inject: false,
        scriptLoading: 'blocking',
        publicPath: openmrsPublicPath,
        template: resolve(__dirname, 'src/index.ejs'),
        templateParameters: {
          openmrsApiUrl,
          openmrsPublicPath,
          openmrsFavicon,
          openmrsPageTitle,
          openmrsDefaultLocale,
          openmrsImportmapDef,
          openmrsImportmapUrl,
          openmrsRoutesDef,
          openmrsRoutesUrl,
          openmrsOffline,
          openmrsEnvironment,
          openmrsConfigUrls,
          openmrsCoreImportmap: appPatterns.length > 0 && JSON.stringify(coreImportmap),
          openmrsCoreRoutes: Object.keys(coreRoutes).length > 0 && JSON.stringify(coreRoutes),
        },
      }),

      // Copy static assets
      new rspack.CopyRspackPlugin({
        patterns: [
          { from: resolve(__dirname, 'src/assets') },
          ...appPatterns,
        ],
      }),

      // Module Federation — host config
      new ModuleFederationPlugin({
        name,
        shared,
      }),

      // CSS extraction (production only)
      isProd &&
        new rspack.CssExtractRspackPlugin({
          filename: 'openmrs.[contenthash].css',
        }),

      // Define build-time constants
      new rspack.DefinePlugin({
        'process.env.BUILD_VERSION': JSON.stringify(`${version}-${timestamp}`),
        'process.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),

      // Bundle analysis (opt-in)
      new BundleAnalyzerPlugin({
        analyzerMode: env?.analyze ? 'static' : 'disabled',
      }),

      // PWA manifest
      new PwaManifestPlugin(),

      // Service worker
      new ServiceWorkerPlugin({
        swSrc: openmrsOffline
          ? resolve(__dirname, 'src/service-worker/index.ts')
          : resolve(__dirname, 'src/service-worker/noop.ts'),
        swDest: 'service-worker.js',
        offline: openmrsOffline,
        additionalManifestEntries: openmrsOffline
          ? [
              { url: openmrsImportmapUrl, revision: null },
              { url: openmrsRoutesUrl, revision: null },
            ]
          : [],
      }),
    ].filter(Boolean) as RspackPluginInstance[],
    ignoreWarnings: [/.*InjectManifest.*/],
  };
};
