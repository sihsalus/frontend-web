import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

// UUID del concepto "Tipo de diagnóstico" y sus respuestas (NTS-139)
const DIAGNOSIS_TYPE_CONCEPT_UUID = '2d53d39f-c93f-4128-8f7c-1bb45b498497';
const DEFINITIVO_UUID = '2c60a8f6-1787-41be-8434-30ebeb5656ff';
const REPETITIVO_UUID = '6f653861-8469-4dfa-a0b5-2804f1cfc527';

export interface DiagnosisEntry {
  uuid: string;
  display: string;
  encounterDatetime: string;
  cie10Code: string | null;
  certainty: 'CONFIRMED' | 'PROVISIONAL';
  occurrence: 'NEW' | 'REPEAT';
  /** Tipo según NTS-139: P (Presuntivo), D (Definitivo), R (Repetido) */
  tipoNts: 'P' | 'D' | 'R';
}

interface ConceptMapping {
  display?: string;
}

interface EncounterObs {
  concept: { uuid: string };
  value?: { uuid?: string } | string;
  formFieldNamespace?: string;
  formFieldPath?: string;
}

interface EncounterDiagnosis {
  uuid: string;
  display: string;
  diagnosis: {
    coded?: { uuid?: string; display: string; mappings?: ConceptMapping[] };
    nonCoded?: string;
  };
  certainty: string;
  rank: number;
}

interface Encounter {
  uuid: string;
  encounterDatetime: string;
  diagnoses: EncounterDiagnosis[];
  obs: EncounterObs[];
}

export function useDiagnosisHistory(patientUuid: string, encounterTypeUuid: string) {
  const url =
    patientUuid && encounterTypeUuid
      ? `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}` +
        `&v=custom:(uuid,encounterDatetime,` +
        `diagnoses:(uuid,display,diagnosis:(coded:(uuid,display,mappings:(display))),certainty,rank),` +
        `obs:(concept:(uuid),value:(uuid),formFieldNamespace,formFieldPath))&limit=20`
      : null;

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: Encounter[] } }>(url, openmrsFetch);

  const diagnoses: DiagnosisEntry[] = (data?.data?.results ?? []).flatMap((encounter) => {
    // Build a map: codedUuid → tipoAnswerUuid from visit-notes tipo OBS
    const tipoMap: Record<string, string> = {};
    (encounter.obs ?? []).forEach((obs) => {
      if (
        obs.concept?.uuid === DIAGNOSIS_TYPE_CONCEPT_UUID &&
        obs.formFieldNamespace === 'visit-notes' &&
        typeof obs.formFieldPath === 'string' &&
        obs.formFieldPath.startsWith('tipo-dx-')
      ) {
        const codedUuid = obs.formFieldPath.replace('tipo-dx-', '');
        const valueUuid = typeof obs.value === 'object' && obs.value !== null ? obs.value.uuid : undefined;
        if (codedUuid && valueUuid) tipoMap[codedUuid] = valueUuid;
      }
    });

    return (encounter.diagnoses ?? []).map((dx) => {
      const mappings = dx.diagnosis?.coded?.mappings ?? [];
      const cie10Mapping = mappings.find((m: ConceptMapping) => m.display?.startsWith('ICD-10'));
      const cie10Code = cie10Mapping?.display?.split(': ')?.[1] ?? null;

      const codedUuid = dx.diagnosis?.coded?.uuid ?? '';
      const tipoUuid = tipoMap[codedUuid];

      const tipoNts: 'P' | 'D' | 'R' = tipoUuid === DEFINITIVO_UUID ? 'D' : tipoUuid === REPETITIVO_UUID ? 'R' : 'P';

      return {
        uuid: dx.uuid,
        display: dx.diagnosis?.coded?.display ?? dx.display ?? '',
        encounterDatetime: encounter.encounterDatetime,
        cie10Code,
        certainty: dx.certainty === 'CONFIRMED' ? 'CONFIRMED' : 'PROVISIONAL',
        occurrence: tipoNts === 'R' ? 'REPEAT' : 'NEW',
        tipoNts,
      };
    });
  });

  return {
    diagnoses,
    isLoading,
    error,
    mutate,
  };
}
