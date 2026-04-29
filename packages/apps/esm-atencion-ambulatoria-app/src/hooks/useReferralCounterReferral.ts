import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

export interface ReferralEntry {
  uuid: string;
  encounterDatetime: string;
  provider: string | null;
  // OBS values — populated once the CE-REF form maps these concepts
  referralType: string | null; // Tipo: Emergencia | Urgencia | Electiva
  referralReason: string | null; // Motivo de referencia (texto libre)
  referralDestination: string | null; // Establecimiento destino
  counterReferralResponse: string | null; // Respuesta de contrarreferencia
}

interface Obs {
  concept: { uuid: string };
  value: string | { display: string };
}

interface Encounter {
  uuid: string;
  encounterDatetime: string;
  encounterProviders: Array<{ display: string }>;
  obs: Obs[];
}

function getObsValue(obs: Obs[], conceptUuid: string | undefined): string | null {
  if (!obs || !conceptUuid) return null;
  const match = obs.find((o) => o.concept?.uuid === conceptUuid);
  if (!match) return null;
  return typeof match.value === 'string' ? match.value : (match.value?.display ?? null);
}

export function useReferralCounterReferral(
  patientUuid: string,
  encounterTypeUuid: string,
  concepts: {
    referralTypeUuid?: string;
    referralReasonUuid?: string;
    referralDestinationUuid?: string;
    counterReferralResponseUuid?: string;
  },
) {
  const url =
    patientUuid && encounterTypeUuid
      ? `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}` +
        `&v=custom:(uuid,encounterDatetime,encounterProviders:(display),obs:(concept:(uuid),value))&limit=20`
      : null;

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: Encounter[] } }>(url, openmrsFetch);

  const entries: ReferralEntry[] = (data?.data?.results ?? []).map((enc) => ({
    uuid: enc.uuid,
    encounterDatetime: enc.encounterDatetime,
    provider: enc.encounterProviders?.[0]?.display?.split(' - ')?.[0] ?? null,
    referralType: getObsValue(enc.obs, concepts.referralTypeUuid),
    referralReason: getObsValue(enc.obs, concepts.referralReasonUuid),
    referralDestination: getObsValue(enc.obs, concepts.referralDestinationUuid),
    counterReferralResponse: getObsValue(enc.obs, concepts.counterReferralResponseUuid),
  }));

  return { entries, isLoading, error, mutate };
}
