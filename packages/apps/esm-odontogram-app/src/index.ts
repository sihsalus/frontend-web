import { getAsyncLifecycle } from '@openmrs/esm-framework';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'odontogram',
  moduleName: '@sihsalus/esm-odontogram-app',
};

export const root = getAsyncLifecycle(() => import('./root.component'), options);
