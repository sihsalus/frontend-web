import { ExtensionSlot, Workspace2, usePatient } from '@openmrs/esm-framework';
import { type PatientWorkspace2DefinitionProps } from '@openmrs/esm-patient-common-lib';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { type Form } from '../types';

import styles from './forms-dashboard-workspace.scss';
import FormsDashboard from './forms-dashboard.component';

export default function FormsWorkspace({
  launchChildWorkspace,
  groupProps: { patientUuid, patient: patientFromStore, visitContext },
}: PatientWorkspace2DefinitionProps<object, object>) {
  const { t } = useTranslation();
  const { patient } = usePatient(patientUuid);
  const resolvedPatient = patientFromStore ?? patient;

  return (
    <Workspace2 title={t('clinicalForms', 'Clinical forms')} hasUnsavedChanges={false}>
      <div className={styles.container}>
        <ExtensionSlot name="visit-context-header-slot" state={{ patientUuid }} />
        {resolvedPatient ? (
          <FormsDashboard
            patient={resolvedPatient}
            visitContext={visitContext}
            handleFormOpen={(form: Form, encounterUuid?: string, handlePostResponse?: () => void) => {
              launchChildWorkspace('patient-form-entry-workspace', {
                form,
                encounterUuid,
                handlePostResponse,
              });
            }}
          />
        ) : null}
      </div>
    </Workspace2>
  );
}
