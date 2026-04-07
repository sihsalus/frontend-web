import { openmrsFetch } from '@openmrs/esm-framework';

import type { Import } from '../types';

export { useSubscription } from '../subscription/subscription.resource';

export async function startImportWithSubscription(abortController?: AbortController) {
  const url = '/ws/rest/v1/openconceptlab/import';
  return openmrsFetch<Import>(url, {
    method: 'POST',
    body: {},
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController?.signal,
  });
}

export async function startImportWithFile(file: File, abortController?: AbortController) {
  const url = '/ws/rest/v1/openconceptlab/import';
  const formData: FormData = new FormData();
  formData.append('file', file);
  return openmrsFetch<Import>(url, {
    method: 'POST',
    body: formData,
    signal: abortController?.signal,
  });
}
