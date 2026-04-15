import { ExtensionSlot, useConnectivity, usePatient } from '@openmrs/esm-framework';
import {
  clinicalFormsWorkspace,
  type DefaultPatientWorkspaceProps,
  type FormEntryProps,
  useVisitOrOfflineVisit,
} from '@openmrs/esm-patient-common-lib';
import React, { useEffect, useMemo, useState } from 'react';

interface FormEntryComponentProps extends DefaultPatientWorkspaceProps {
  mutateForm?: () => void;
  formInfo?: FormEntryProps;
  form?: { uuid: string; name?: string };
  encounterUuid?: string;
  additionalProps?: Record<string, unknown>;
  clinicalFormsWorkspaceName?: string;
}

const FormEntry: React.FC<FormEntryComponentProps> = (props) => {
  const {
    patientUuid,
    clinicalFormsWorkspaceName = clinicalFormsWorkspace,
    mutateForm,
    formInfo,
    form,
    encounterUuid: workspaceEncounterUuid,
    additionalProps: workspaceAdditionalProps,
  } = props;
  const {
    encounterUuid = workspaceEncounterUuid,
    formUuid = form?.uuid,
    visitStartDatetime,
    visitStopDatetime,
    visitTypeUuid,
    visitUuid,
    additionalProps = workspaceAdditionalProps,
  } = formInfo || {};
  const { patient } = usePatient(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const [showForm, setShowForm] = useState(true);
  const isOnline = useConnectivity();
  const state = useMemo(
    () => ({
      view: 'form',
      formUuid: formUuid ?? null,
      visitUuid: visitUuid ?? currentVisit?.uuid ?? null,
      visitTypeUuid: visitTypeUuid ?? currentVisit?.visitType?.uuid ?? null,
      visitStartDatetime: visitStartDatetime ?? currentVisit?.startDatetime ?? null,
      visitStopDatetime: visitStopDatetime ?? currentVisit?.stopDatetime ?? null,
      isOffline: !isOnline,
      patientUuid: patientUuid ?? null,
      patient,
      encounterUuid: encounterUuid ?? null,
      closeWorkspace: () => {
        if (typeof mutateForm === 'function') {
          mutateForm();
        }
        props.closeWorkspace();
      },
      closeWorkspaceWithSavedChanges: () => {
        if (typeof mutateForm === 'function') {
          mutateForm();
        }
        props.closeWorkspaceWithSavedChanges();
      },
      promptBeforeClosing: (testFcn: () => boolean) => {
        props.promptBeforeClosing(testFcn);
      },
      additionalProps,
      clinicalFormsWorkspaceName,
    }),
    [
      formUuid,
      visitUuid,
      visitTypeUuid,
      encounterUuid,
      visitStartDatetime,
      visitStopDatetime,
      currentVisit?.uuid,
      currentVisit?.visitType?.uuid,
      currentVisit?.startDatetime,
      currentVisit?.stopDatetime,
      patientUuid,
      patient,
      isOnline,
      mutateForm,
      props,
      additionalProps,
      clinicalFormsWorkspaceName,
    ],
  );

  // FIXME: This logic triggers a reload of the form when the formUuid changes. It's a workaround for the fact that the form doesn't reload when the formUuid changes.
  useEffect(() => {
    if (state.formUuid) {
      setShowForm(false);
      setTimeout(() => {
        setShowForm(true);
      });
    }
  }, [state]);

  return (
    <div>
      {showForm && state.formUuid && patientUuid && patient && <ExtensionSlot name="form-widget-slot" state={state} />}
    </div>
  );
};

export default FormEntry;
