import { Type } from '@openmrs/esm-framework';

/**
 * Esquema Nacional de Vacunación — NTS N.° 196-MINSA/DGIESP-2022
 * (RM 884-2022, modificada por RM 218-2024, RM 474-2025, RM 709-2025)
 *
 * Sequence convention: doses [1...9], boosters [11...19].
 * CIEL concept UUIDs follow the pattern {CIEL_ID}AAAAAAAAAAAAAAAAAAAAAAAAA.
 * Adjust UUIDs to match the concepts loaded on your OpenMRS server.
 */
export const configSchema = {
  immunizationConceptSet: {
    _type: Type.String,
    _default: 'CIEL:984',
    _description: 'A UUID or concept mapping which will have all the possible vaccines as set-members.',
  },
  sequenceDefinitions: {
    _type: Type.Array,
    _elements: {
      _type: Type.Object,
      vaccineConceptUuid: {
        _type: Type.UUID,
        _description: 'The UUID of the individual vaccine concept',
      },
      sequences: {
        _type: Type.Array,
        _elements: {
          _type: Type.Object,
          sequenceLabel: {
            _type: Type.String,
            _description: 'Name of the dose/booster/schedule.. This will be used as a translation key as well.',
          },
          sequenceNumber: {
            _type: Type.Number,
            _description:
              'The dose number in the vaccines. Convention for doses is [1...9] and for boosters is [11...19]',
          },
          intervalInDaysAfterPreviousDose: {
            _type: Type.Number,
            _description:
              'Days after the previous dose when this dose should be administered. Used to auto-suggest the next dose date. Omit for first doses or single-dose vaccines.',
          },
        },
      },
    },
    _description:
      'Doses/Schedules definitions for each vaccine configured if applicable. If not provided the vaccine would be treated as a vaccine without schedules',
    _default: [
      {
        vaccineConceptUuid: '886AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '782AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-RN', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '1685AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1ra Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2da Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 60 },
          { sequenceLabel: '3ra Dosis', sequenceNumber: 3, intervalInDaysAfterPreviousDose: 60 },
        ],
      },
      {
        vaccineConceptUuid: '783AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1ra Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2da Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 60 },
          { sequenceLabel: '3ra Dosis', sequenceNumber: 3, intervalInDaysAfterPreviousDose: 60 },
          { sequenceLabel: '1er Refuerzo', sequenceNumber: 11, intervalInDaysAfterPreviousDose: 365 },
          { sequenceLabel: '2do Refuerzo', sequenceNumber: 12, intervalInDaysAfterPreviousDose: 913 },
        ],
      },
      {
        vaccineConceptUuid: '83531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1ra Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2da Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 60 },
        ],
      },
      {
        vaccineConceptUuid: '162342AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1ra Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2da Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 60 },
          { sequenceLabel: 'Refuerzo', sequenceNumber: 11, intervalInDaysAfterPreviousDose: 240 },
        ],
      },
      {
        vaccineConceptUuid: '5261AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1ra Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2da Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 30 },
        ],
      },
      {
        vaccineConceptUuid: '36AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1ra Dosis', sequenceNumber: 1 },
          { sequenceLabel: 'Refuerzo', sequenceNumber: 11, intervalInDaysAfterPreviousDose: 180 },
        ],
      },
      {
        vaccineConceptUuid: '5859AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '5864AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '5857AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '781AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1er Refuerzo', sequenceNumber: 11 },
          { sequenceLabel: '2do Refuerzo', sequenceNumber: 12, intervalInDaysAfterPreviousDose: 913 },
        ],
      },
      {
        vaccineConceptUuid: '5856AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '1679AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '1680AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '1681AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '1682AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '1683AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '1684AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Unica', sequenceNumber: 1 }],
      },
      {
        vaccineConceptUuid: '162586AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1ra Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2da Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 30 },
        ],
      },
    ],
  },
};

export interface ImmunizationConfigObject {
  immunizationConceptSet: string;
  sequenceDefinitions: Array<{
    vaccineConceptUuid: string;
    sequences: Array<{
      sequenceLabel: string;
      sequenceNumber: number;
      intervalInDaysAfterPreviousDose?: number;
    }>;
  }>;
}
