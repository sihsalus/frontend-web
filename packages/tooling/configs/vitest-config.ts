import type { UserConfig as ViteUserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vitest/config';

import aliasPresets from './alias-presets.json';
import { createVitestAliases } from './vitest-aliases';
import sharedTestAliases from './shared-test-aliases.json';

type AliasMap = Record<string, string>;

export function defineWorkspaceVitestConfig(config: ViteUserConfig = {}) {
  return defineConfig(
    mergeConfig(
      {
        test: {
          environment: 'happy-dom',
          mockReset: true,
          globals: true,
        },
      },
      config,
    ),
  );
}

export { aliasPresets };

export function defineAppVitestConfig(
  rootDir: string,
  options: {
    aliases?: AliasMap;
    extraAliases?: Array<{ find: RegExp; replacement: string }>;
    test?: ViteUserConfig['test'];
  } = {},
) {
  const { aliases = {}, extraAliases = [], test = {} } = options;

  return defineWorkspaceVitestConfig({
    resolve: {
      alias: [
        ...extraAliases,
        ...createVitestAliases(rootDir, {
          ...Object.fromEntries(
            Object.entries(sharedTestAliases).map(([key, value]) => [key, `../../${value}`]),
          ),
          ...aliases,
        }),
      ],
    },
    test: {
      setupFiles: ['./setup-tests.ts'],
      ...test,
    },
  });
}
