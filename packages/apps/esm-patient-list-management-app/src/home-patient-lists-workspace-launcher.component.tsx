import { Button } from '@carbon/react';
import { ListChecked } from '@carbon/react/icons';
import { launchWorkspace2 } from '@openmrs/esm-framework';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const workspaceProps = {
  detailsWorkspaceName: 'home-patient-list-details',
};

const HomePatientListsWorkspaceLauncher: React.FC = () => {
  const { t } = useTranslation();

  const openPatientListsWorkspace = useCallback(() => {
    void launchWorkspace2('home-patient-lists', workspaceProps);
  }, []);

  useEffect(() => {
    openPatientListsWorkspace();
  }, [openPatientListsWorkspace]);

  return (
    <Button kind="primary" renderIcon={ListChecked} onClick={openPatientListsWorkspace}>
      {t('openPatientLists', 'Abrir listas de pacientes')}
    </Button>
  );
};

export default HomePatientListsWorkspaceLauncher;
