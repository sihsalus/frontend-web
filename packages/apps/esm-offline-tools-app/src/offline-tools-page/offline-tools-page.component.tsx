import { ExtensionSlot, useExtensionSlotMeta } from '@openmrs/esm-framework';
import { trimEnd } from 'lodash-es';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import type { OfflineToolsPageConfig } from '../types';

export interface OfflineToolsPageParams {
  page: string;
}

const fallbackPageSlots: Record<string, string> = {
  actions: 'offline-tools-page-offline-actions-slot',
  forms: 'offline-tools-page-forms-slot',
  patients: 'offline-tools-page-offline-patients-slot',
};

const OfflineToolsPage: React.FC = () => {
  const location = useLocation();
  const { page } = useParams();
  const basePath = trimEnd(globalThis.getOpenmrsSpaBase(), '/') + location.pathname;
  const meta = useExtensionSlotMeta<OfflineToolsPageConfig>('offline-tools-page-slot');

  const pageConfig = Object.values(meta).find((pageConfig) => pageConfig.name === page);
  const pageSlot = pageConfig?.slot ?? (page ? fallbackPageSlots[page] : undefined);

  if (!pageSlot) {
    return null;
  }

  return (
    <>
      <ExtensionSlot name="breadcrumbs-slot" />
      <ExtensionSlot key={pageSlot} name={pageSlot} state={{ basePath }} />
    </>
  );
};

export default OfflineToolsPage;
