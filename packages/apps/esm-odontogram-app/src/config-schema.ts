import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  encounterTypeUuid: {
    _type: Type.UUID,
    _description: 'UUID of the ODONTOGRAM encounter type',
    _default: '',
  },
  findingConceptUuid: {
    _type: Type.UUID,
    _description: 'Default UUID of the concept for dental findings (fallback obs concept)',
    _default: '',
  },
  findingConceptUuids: {
    _type: Type.Object,
    _description:
      'Optional map of findingId -> concept UUID to store specific obs concept per odontogram finding',
    _default: {},
  },
};

export interface OdontogramConfig {
  encounterTypeUuid: string;
  findingConceptUuid?: string;
  findingConceptUuids?: Record<string, string>;
}
