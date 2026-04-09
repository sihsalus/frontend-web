import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import { useState } from 'react';

import useOdontogramDataStore from '../store/odontogramDataStore';
import type { OdontogramConfig } from '../config-schema';

interface SaveOdontogramParams {
  patientUuid: string;
  encounterUuid?: string;
}

export function useOdontogramEncounter() {
  const config = useConfig<OdontogramConfig>();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getConceptUuidForFinding = (findingId: number): string => {
    const mappedConcept = config.findingConceptUuids?.[String(findingId)]?.trim();
    if (mappedConcept) {
      return mappedConcept;
    }

    const fallbackConcept = config.findingConceptUuid?.trim();
    if (fallbackConcept) {
      return fallbackConcept;
    }

    throw new Error(
      `Missing odontogram concept mapping for finding ${findingId}. Configure findingConceptUuid or findingConceptUuids.`,
    );
  };

  const save = async ({ patientUuid, encounterUuid }: SaveOdontogramParams) => {
    setIsSaving(true);
    setError(null);

    try {
      const encounterTypeUuid = config.encounterTypeUuid?.trim();
      if (!encounterTypeUuid) {
        throw new Error('Missing required config: encounterTypeUuid');
      }

      const data = useOdontogramDataStore.getState().data;

      const obs = data.teeth
        .filter((tooth) => tooth.findings.length > 0)
        .flatMap((tooth) =>
          tooth.findings.map((finding) => ({
            concept: getConceptUuidForFinding(finding.findingId),
            value: String(tooth.toothId),
            comment: JSON.stringify({
              optionId: finding.findingId,
              subOptionId: finding.subOptionId,
              color: finding.color,
              dynamicDesign: finding.designNumber ?? null,
            }),
          })),
        );

      const url = encounterUuid ? `/ws/rest/v1/encounter/${encounterUuid}` : '/ws/rest/v1/encounter';
      const payload = {
        patient: patientUuid,
        encounterType: encounterTypeUuid,
        obs,
      };

      const response = await openmrsFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving, error };
}
