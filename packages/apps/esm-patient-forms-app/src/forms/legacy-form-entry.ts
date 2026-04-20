import type { HtmlFormEntryForm } from '@openmrs/esm-patient-common-lib';

/**
 * Compatibility-only launch contract for legacy patient-form-entry callers.
 * New workspace2 callers should use `form` + `encounterUuid` instead.
 */
export interface LegacyFormEntryInfo {
  encounterUuid?: string;
  formUuid?: string;
  patientUuid?: string;
  visitUuid?: string;
  visitTypeUuid?: string;
  visitStartDatetime?: string;
  visitStopDatetime?: string;
  htmlForm?: HtmlFormEntryForm;
  additionalProps?: Record<string, unknown>;
}
