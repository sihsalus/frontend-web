import { type DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import React from 'react';

import styles from './forms-dashboard-workspace.scss';
import FormsDashboard from './forms-dashboard.component';

export default function FormsWorkspace(props: DefaultPatientWorkspaceProps) {
  return (
    <div className={styles.container}>
      <FormsDashboard {...props} />
    </div>
  );
}
