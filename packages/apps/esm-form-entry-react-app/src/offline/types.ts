import type { Encounter, EncounterCreate, PersonUpdate } from '../types';

export interface PatientFormSyncItemForm {
  uuid: string;
  name?: string;
  display?: string;
  version?: string;
  published?: boolean;
  retired?: boolean;
  resources?: Array<unknown>;
}

interface BasePatientFormSyncItemContent {
  _id: string;
  encounter: Partial<Encounter>;
  _payloads: {
    encounterCreate?: EncounterCreate;
    personUpdate?: PersonUpdate;
  };
}

export interface LegacyPatientFormSyncItemContent extends BasePatientFormSyncItemContent {
  formSchemaUuid: string;
  form?: never;
}

export interface CanonicalPatientFormSyncItemContent extends BasePatientFormSyncItemContent {
  form: PatientFormSyncItemForm;
  formSchemaUuid?: string;
}

export type PatientFormSyncItemContent = LegacyPatientFormSyncItemContent | CanonicalPatientFormSyncItemContent;
