import { DashboardExtension, type DashboardExtensionProps, type IconId } from '@openmrs/esm-framework';
import { BrowserRouter } from 'react-router-dom';

export const createDashboardLink = (config: Omit<DashboardExtensionProps, 'icon'> & { icon?: IconId }) => () => (
  <BrowserRouter>
    <DashboardExtension path={config.path} title={config.title} basePath={config.basePath} icon={config.icon} />
  </BrowserRouter>
);
