import { ActionMenuButton, PenIcon } from '@openmrs/esm-framework';
import { useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import type { VisitNotesFormProps } from './notes/visit-notes-form.workspace';

const VisitNoteNavButton: React.FC = () => {
  const { t } = useTranslation();
  const launchVisitNotesWorkspace = useLaunchWorkspaceRequiringVisit<VisitNotesFormProps>('visit-notes-form-workspace');

  return (
    <ActionMenuButton
      getIcon={(props: ComponentProps<typeof PenIcon>) => <PenIcon {...props} />}
      label={t('visitNote', 'Visit note')}
      iconDescription={t('visitNote', 'Visit note')}
      handler={() => launchVisitNotesWorkspace({ formContext: 'creating' })}
      type="visit-note"
    />
  );
};

export default VisitNoteNavButton;
