import { ConfigurableLink, useConfig } from '@openmrs/esm-framework';
import React from 'react';

import type { ConfigObject } from '../../config-schema';

const specialClinicsDashboardPath = 'vih-special-clinics-dashboard';

interface GenericNavLinksProps {
  basePath: string;
}

const GenericNavLinks: React.FC<GenericNavLinksProps> = ({ basePath }) => {
  const { specialClinics } = useConfig<ConfigObject>();

  return (
    <>
      {specialClinics.map((clinic) => (
        <GenericLink key={clinic.id} title={clinic.title} path={clinic.id} basePath={basePath} />
      ))}
    </>
  );
};

export default GenericNavLinks;

const GenericLink: React.FC<{ title: string; path: string; basePath: string }> = ({ title, path, basePath }) => {
  return (
    <ConfigurableLink
      style={{ paddingLeft: '2rem' }}
      className={`cds--side-nav__link`}
      to={`${basePath}/${encodeURIComponent(specialClinicsDashboardPath)}?clinic=${path}`}
    >
      {title}
    </ConfigurableLink>
  );
};
