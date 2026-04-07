import '@carbon/styles/css/styles.css';
import { AppErrorBoundary } from '@sihsalus/rbac';
import React from 'react';

import App from './App';

export default function OdontogramRoot() {
  return (
    <AppErrorBoundary appName="esm-odontogram-app">
      <App />
    </AppErrorBoundary>
  );
}
