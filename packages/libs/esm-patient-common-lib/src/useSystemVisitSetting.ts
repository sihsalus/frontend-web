import { type FetchResponse, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

export function useSystemVisitSetting() {
  const { data, isLoading, error } = useSWRImmutable<FetchResponse<{ value: 'true' | 'false' }>, Error>(
    `${restBaseUrl}/systemsetting/visits.enabled?v=custom:(value)`,
    openmrsFetch,
  );

  const results = useMemo(
    () => ({
      systemVisitEnabled: (data?.data?.value ?? 'true').toLowerCase() === 'true',
      errorFetchingSystemVisitSetting: error,
      isLoadingSystemVisitSetting: isLoading,
    }),
    [data, isLoading, error],
  );

  return results;
}
