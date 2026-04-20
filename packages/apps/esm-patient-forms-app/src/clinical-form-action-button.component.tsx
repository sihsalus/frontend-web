import { ActionMenuButton2, DocumentIcon } from '@openmrs/esm-framework';
import { type PatientChartWorkspaceActionButtonProps, useStartVisitIfNeeded } from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

const ClinicalFormActionButton: React.FC<PatientChartWorkspaceActionButtonProps> = ({
  groupProps: { patientUuid },
}) => {
  const { t } = useTranslation();
  const startVisitIfNeeded = useStartVisitIfNeeded(patientUuid);

  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof DocumentIcon>) => <DocumentIcon {...props} />}
      label={t('clinicalForms', 'Clinical forms')}
      workspaceToLaunch={{
        workspaceName: 'clinical-forms-workspace',
        workspaceProps: {},
      }}
      onBeforeWorkspaceLaunch={startVisitIfNeeded}
    />
  );
};

export default ClinicalFormActionButton;
