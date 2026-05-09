import { getDefaultsFromConfigSchema } from '@openmrs/esm-framework';

import { esmPatientRegistrationSchema } from '../config-schema';
import { getEffectiveRegistrationConfig, peruForeignPatientIdentifierTypeUuids } from './peru-registration-config';

describe('getEffectiveRegistrationConfig', () => {
  it('adds nationality to filiation as a conditional field for foreign identifiers', () => {
    const config = getEffectiveRegistrationConfig(getDefaultsFromConfigSchema(esmPatientRegistrationSchema));

    const filiation = config.sectionDefinitions.find((section) => section.id === 'filiation');
    const nationality = config.fieldDefinitions.find((field) => field.id === 'nationality');

    expect(filiation?.fields).toContain('nationality');
    expect(nationality).toMatchObject({
      id: 'nationality',
      type: 'person attribute',
      uuid: '9b3df0a1-0c58-4f55-9868-9c38f1db1007',
      label: 'Nacionalidad',
      showIf: {
        foreignIdentifierPresent: true,
      },
    });
  });

  it('keeps CE, passport, and foreign document as foreign identifier triggers', () => {
    expect(peruForeignPatientIdentifierTypeUuids).toEqual([
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '8d793bee-c2cc-11de-8d13-0010c6dffd0f',
    ]);
  });
});
