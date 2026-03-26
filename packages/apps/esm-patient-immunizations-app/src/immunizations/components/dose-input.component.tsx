import { Dropdown, NumberInput } from '@carbon/react';
import React, { useMemo } from 'react';
import { useController, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { type ImmunizationSequenceDefinition } from '../../types/fhir-immunization-domain';

import styles from './../immunizations-form.scss';


export const DoseInput: React.FC<{
  vaccine: string;
  sequences: ImmunizationSequenceDefinition[];
  control: Control;
}> = ({ vaccine, sequences, control }) => {
  const { t } = useTranslation();
  const { field } = useController({ name: 'doseNumber', control });

  const vaccineSequences = useMemo(
    () => sequences?.find((sequence) => sequence.vaccineConceptUuid === vaccine)?.sequences || [],
    [sequences, vaccine],
  );

  return (
    <div className={styles.row}>
      {vaccineSequences.length ? (
        <Dropdown
          id="sequence"
          label={t('pleaseSelect', 'Please select')}
          titleText={t('sequence', 'Sequence')}
          items={vaccineSequences?.map((sequence) => sequence.sequenceNumber) || []}
          itemToString={(item) => vaccineSequences.find((s) => s.sequenceNumber === item)?.sequenceLabel}
          onChange={(val) => field.onChange(parseInt(val.selectedItem || 0))}
          selectedItem={field.value}
        />
      ) : (
        <NumberInput
          id="doseNumber"
          label={t('doseNumberWithinSeries', 'Dose number within series')}
          min={0}
          onChange={(event) => field.onChange(parseInt(event.target.value || 0))}
          value={field.value}
          hideSteppers={true}
        />
      )}
    </div>
  );
};
