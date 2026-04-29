import { Type } from '@openmrs/esm-framework';

export default {
  clinicianEncounterRole: {
    _type: Type.UUID,
    _default: '240b26f9-dd88-4172-823d-4a8bfeb7841f',
    _description: 'Doctor or Nurse who is the primary provider for an encounter, and will sign the note',
  },
  visitDiagnosesConceptUuid: {
    _type: Type.ConceptUuid,
    _default: '159947AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    _description: 'The set of diagnoses that were either addressed or diagnosed during the current visit',
  },
  encounterNoteTextConceptUuid: {
    _type: Type.ConceptUuid,
    _default: '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    _description: 'Free text note field intended to capture unstructured description of the patient encounter',
  },
  encounterTypeUuid: {
    _type: Type.UUID,
    _default: 'd7151f82-c1f3-4152-a605-2f9ea7414a79',
    _description:
      'Encounter where a full or abbreviated examination is done, usually leading to a presumptive or confirmed diagnosis, recorded by the examining clinician.',
  },
  formConceptUuid: {
    _type: Type.UUID,
    _default: 'c75f120a-04ec-11e3-8780-2b40bef9a44b',
    _description: 'The UUID of the Visit Note form to be associated with visit note encounters',
  },
  // NTS-139: Tipo de diagnóstico — concepto con respuestas Presuntivo, Definitivo, Repetitivo
  diagnosisTypeConceptUuid: {
    _type: Type.UUID,
    _default: '2d53d39f-c93f-4128-8f7c-1bb45b498497',
    _description: 'UUID del concepto Tipo de diagnóstico (NTS-139). Respuestas: Presuntivo, Definitivo, Repetitivo',
  },
  diagnosisTypePresuntivoUuid: {
    _type: Type.UUID,
    _default: '4f59cf03-f888-4d34-a5dc-f24269b1945d',
    _description: 'UUID de la respuesta Presuntivo (P) del concepto Tipo de diagnóstico',
  },
  diagnosisTypeDefinitivoUuid: {
    _type: Type.UUID,
    _default: '2c60a8f6-1787-41be-8434-30ebeb5656ff',
    _description: 'UUID de la respuesta Definitivo (D) del concepto Tipo de diagnóstico',
  },
  diagnosisTypeRepetitivoUuid: {
    _type: Type.UUID,
    _default: '6f653861-8469-4dfa-a0b5-2804f1cfc527',
    _description: 'UUID de la respuesta Repetitivo (R) del concepto Tipo de diagnóstico',
  },
};

export interface VisitNoteConfigObject {
  clinicianEncounterRole: string;
  encounterNoteTextConceptUuid: string;
  encounterTypeUuid: string;
  formConceptUuid: string;
  visitDiagnosesConceptUuid: string;
  diagnosisTypeConceptUuid: string;
  diagnosisTypePresuntivoUuid: string;
  diagnosisTypeDefinitivoUuid: string;
  diagnosisTypeRepetitivoUuid: string;
}
