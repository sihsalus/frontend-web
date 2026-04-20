import { Tile } from '@carbon/react';
import { ResponsiveWrapper, useConfig, useConnectivity, type Visit } from '@openmrs/esm-framework';
import { EmptyDataIllustration } from '@openmrs/esm-patient-common-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ConfigObject } from '../config-schema';
import { useForms } from '../hooks/use-forms';
import type { Form } from '../types';

import styles from './forms-dashboard.scss';
import FormsList from './forms-list.component';

interface FormsDashboardProps {
  handleFormOpen: (form: Form, encounterUuid?: string, handlePostResponse?: () => void) => void;
  patient: fhir.Patient;
  visitContext: Visit | null;
}

const FormsDashboard: React.FC<FormsDashboardProps> = ({ handleFormOpen, patient, visitContext }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const isOnline = useConnectivity();
  const {
    data: forms,
    error,
    mutateForms,
  } = useForms(patient.id, visitContext?.uuid, undefined, undefined, !isOnline, config.orderBy);

  const sections = useMemo(() => {
    return config.formSections?.map((formSection) => ({
      ...formSection,
      availableForms: forms?.filter((formInfo) =>
        formSection.forms.some((formConfig) => formInfo.form.uuid === formConfig || formInfo.form.name === formConfig),
      ),
    }));
  }, [config.formSections, forms]);

  if (forms?.length === 0) {
    return (
      <ResponsiveWrapper>
        <Tile className={styles.emptyState}>
          <EmptyDataIllustration />
          <p className={styles.emptyStateContent}>{t('noFormsToDisplay', 'There are no forms to display.')}</p>
        </Tile>
      </ResponsiveWrapper>
    );
  }

  return (
    <div className={styles.container}>
      {sections.length === 0 ? (
        <FormsList
          forms={forms}
          error={error}
          handleFormOpen={(form, encounterUuid) => handleFormOpen(form, encounterUuid, mutateForms)}
        />
      ) : (
        sections.map((section) => {
          return (
            <FormsList
              key={`form-section-${section.name}`}
              sectionName={section.name}
              forms={section.availableForms}
              error={error}
              handleFormOpen={(form, encounterUuid) => handleFormOpen(form, encounterUuid, mutateForms)}
            />
          );
        })
      )}
    </div>
  );
};

export default FormsDashboard;
