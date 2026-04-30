import React from 'react';

import { type PatientIdentifierColumnConfig } from '../../config-schema';
import { type QueueEntry, type QueueTableCellComponentProps, type QueueTableColumnFunction } from '../../types';

const preferredIdentifierNames = ['DNI', 'CE', 'Pasaporte', 'PASS', 'DIE', 'CNV', 'N° Historia Clínica'];

export const queueTablePatientIdentifierColumn: QueueTableColumnFunction = (
  key,
  header,
  config: PatientIdentifierColumnConfig,
) => {
  const { identifierTypeUuid } = config;

  const getPatientIdentifier = (queueEntry: QueueEntry) => {
    const configuredIdentifier = queueEntry.patient.identifiers.find(
      (i) => i.identifierType?.uuid == identifierTypeUuid,
    );

    if (configuredIdentifier?.identifierType?.display === 'N° Historia Clínica') {
      return (
        preferredIdentifierNames
          .map((identifierName) =>
            queueEntry.patient.identifiers.find(
              (identifier) => identifier.identifierType?.display?.toLowerCase() === identifierName.toLowerCase(),
            ),
          )
          .find(Boolean)?.identifier ?? configuredIdentifier.identifier
      );
    }

    return configuredIdentifier?.identifier;
  };

  const QueueTablePatientIdentifierCell = ({ queueEntry }: QueueTableCellComponentProps) => {
    return <span>{getPatientIdentifier(queueEntry)}</span>;
  };

  return {
    key,
    header,
    CellComponent: QueueTablePatientIdentifierCell,
    getFilterableValue: getPatientIdentifier,
  };
};
