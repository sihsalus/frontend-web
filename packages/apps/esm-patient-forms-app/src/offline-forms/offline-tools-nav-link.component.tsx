import { ConfigurableLink } from '@openmrs/esm-framework';
import React from 'react';

interface OfflineToolsNavLinkProps {
  page?: string;
  title: string;
}

void React;

export default function OfflineToolsNavLink({ page, title }: OfflineToolsNavLinkProps) {
  const openmrsSpaBasePlaceholder = ['${', 'openmrsSpaBase', '}'].join('');

  return (
    <div key={page}>
      <ConfigurableLink
        to={`${openmrsSpaBasePlaceholder}/offline-tools${page ? `/${page}` : ''}`}
        className="cds--side-nav__link"
      >
        {title}
      </ConfigurableLink>
    </div>
  );
}
