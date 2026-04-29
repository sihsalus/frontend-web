import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { type ImmunizationWidgetConfigObject, type OpenmrsConcept } from '../types/fhir-immunization-domain';

export function useImmunizationsConceptSet(config: ImmunizationWidgetConfigObject) {
  const conceptRepresentation =
    'custom:(uuid,display,answers:(uuid,display),conceptMappings:(conceptReferenceTerm:(conceptSource:(name),code)))';

  const { data, isLoading } = useSWR<{ data: { results: Array<OpenmrsConcept> } }, Error>(
    `${restBaseUrl}/concept?references=${config.immunizationConceptSet}&v=${conceptRepresentation}`,
    openmrsFetch,
  );
  const conceptSet = data?.data?.results?.[0];

  // MINSA 2026 adds biologics such as VRS/Nirsevimab before every OpenMRS
  // dictionary has them in the base immunization concept set. Keep them
  // configurable here so the UI can expose them once the content package
  // provides the local concepts.
  const supplementalAnswers = config.supplementalVaccines?.map((vaccine) => ({
    uuid: vaccine.uuid,
    display: vaccine.display,
  }));
  const answersByUuid = new Map(
    [...(conceptSet?.answers ?? []), ...(supplementalAnswers ?? [])].map((answer) => [answer.uuid, answer]),
  );

  return {
    immunizationsConceptSet: {
      ...(conceptSet ?? {
        uuid: config.immunizationConceptSet,
        display: 'Configured immunizations',
      }),
      answers: Array.from(answersByUuid.values()),
    },
    isLoading,
  };
}
