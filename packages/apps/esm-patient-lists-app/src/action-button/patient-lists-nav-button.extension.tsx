import { ActionMenuButton, EventsIcon } from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

function PatientListsNavButton() {
  const { t } = useTranslation();

  const launchPatientListsWorkspace = useCallback(() => {
    launchPatientWorkspace('patient-lists');
  }, []);

  return (
    <ActionMenuButton
      getIcon={(props: ComponentProps<typeof EventsIcon>) => <EventsIcon {...props} />}
      label={t('patientLists', 'Patient lists')}
      iconDescription={t('patientLists', 'Patient lists')}
      handler={launchPatientListsWorkspace}
      type="patient-lists"
    />
  );
}

export default PatientListsNavButton;
