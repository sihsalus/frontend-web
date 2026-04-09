import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

interface FormResource {
  name?: string;
  valueReference?: string;
}

interface FormWithResourcesResponse {
  data?: {
    resources?: Array<FormResource>;
  };
}

interface ClobTranslationsResponse {
  data?: {
    translations?: Record<string, string>;
  };
}

export async function fetchBackendTranslations(
  formUuid: string,
  langCode: string,
  fallbackStrings: Record<string, string>,
): Promise<Record<string, string>> {
  try {
    const formUrl = `${restBaseUrl}/form/${formUuid}?v=full`;
    const formResponse = await openmrsFetch<FormWithResourcesResponse>(formUrl);
    const resources = formResponse.data?.resources ?? [];

    const translationResource = resources.find((r) => r.name?.endsWith(`translations_${langCode}`));

    if (!translationResource?.valueReference) return fallbackStrings;

    const clobUrl = `${restBaseUrl}/clobdata/${translationResource.valueReference}`;
    const clobResponse = await openmrsFetch<ClobTranslationsResponse>(clobUrl);
    const backendTranslations = clobResponse.data?.translations ?? {};

    // Merge only existing keys
    return Object.entries(fallbackStrings).reduce(
      (acc, [key, value]) => {
        acc[key] = backendTranslations[key] ?? value;
        return acc;
      },
      {} as Record<string, string>,
    );
  } catch (error) {
    console.error('Error fetching backend translations:', error);
    return fallbackStrings;
  }
}
