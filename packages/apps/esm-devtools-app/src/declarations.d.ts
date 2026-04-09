import type { ImportMapOverridesApi } from './devtools/import-map-overrides.types';

declare global {
	interface Window {
		importMapOverrides: ImportMapOverridesApi;
		spaEnv?: string;
	}

	var importMapOverrides: ImportMapOverridesApi;
}

export {};
