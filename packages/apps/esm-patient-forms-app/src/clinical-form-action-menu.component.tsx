import { ActionMenuButton, DocumentIcon } from '@openmrs/esm-framework';
import { clinicalFormsWorkspace, useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

const ClinicalFormActionMenu: React.FC = () => {
  const { t } = useTranslation();
  const launchFormsWorkspace = useLaunchWorkspaceRequiringVisit(clinicalFormsWorkspace);

  return (
    <ActionMenuButton
      getIcon={(props: ComponentProps<typeof DocumentIcon>) => <DocumentIcon {...props} />}
      label={t('clinicalForms', 'Clinical forms')}
      iconDescription={t('clinicalForms', 'Clinical forms')}
      handler={() => launchFormsWorkspace()}
      type="clinical-form"
    />
  );
};

export default ClinicalFormActionMenu;
