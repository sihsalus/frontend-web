import {
  type Encounter,
  type Visit,
  type Workspace2DefinitionProps,
  type DefaultWorkspaceProps,
} from '@openmrs/esm-framework';

import { type HtmlFormEntryForm } from '../types';

export interface FormEntryProps {
  encounterUuid?: string;
  visitUuid?: string;
  formUuid: string;
  visitTypeUuid?: string;
  visitStartDatetime?: string;
  visitStopDatetime?: string;
  htmlForm?: HtmlFormEntryForm;
  additionalProps?: Record<string, unknown>;
}

export interface FormRendererProps {
  additionalProps?: Record<string, unknown>;
  encounterUuid?: string;
  formUuid: string;
  patientUuid: string;
  patient: fhir.Patient;
  visit?: Visit;
  visitUuid?: string;
  hideControls?: boolean;
  hidePatientBanner?: boolean;
  handlePostResponse?: (encounter?: Encounter) => void;
  preFilledQuestions?: Record<string, string>;
  launchChildWorkspace?: Workspace2DefinitionProps['launchChildWorkspace'];
  closeWorkspace?: DefaultWorkspaceProps['closeWorkspace'];
  closeWorkspaceWithSavedChanges?: () => void;
  setHasUnsavedChanges?(hasUnsavedChanges: boolean): void;
}
