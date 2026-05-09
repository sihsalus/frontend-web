import { getDefaultsFromConfigSchema, useConfig } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';

import { esmPatientRegistrationSchema, type RegistrationConfig } from '../../config-schema';
import { type Resources, ResourcesContext } from '../../offline.resources';
import { type FormValues } from '../patient-registration.types';
import { PatientRegistrationContext } from '../patient-registration-context';
import { CustomField } from './custom-field.component';

jest.mock('./person-attributes/person-attribute-field.component', () => ({
  PersonAttributeField: ({ fieldDefinition }) => (
    <div data-testid="person-attribute-field">{fieldDefinition.label}</div>
  ),
}));

const mockUseConfig = jest.mocked(useConfig<RegistrationConfig>);

const resources = {
  identifierTypes: [
    {
      fieldName: 'ce',
      format: '',
      identifierSources: [],
      isPrimary: false,
      name: 'Carné de Extranjería',
      required: false,
      uniquenessBehavior: 'UNIQUE' as const,
      uuid: '550e8400-e29b-41d4-a716-446655440002',
    },
  ],
} as Resources;

const baseContext = {
  currentPhoto: '',
  identifierTypes: [],
  inEditMode: false,
  initialFormValues: { identifiers: {} } as FormValues,
  isOffline: false,
  setCapturePhotoProps: jest.fn(),
  setFieldValue: jest.fn(),
  setInitialFormValues: jest.fn(),
  setFieldTouched: jest.fn(),
  validationSchema: null,
};

function renderCustomField(identifiers: FormValues['identifiers']) {
  return render(
    <ResourcesContext.Provider value={resources}>
      <PatientRegistrationContext.Provider
        value={{
          ...baseContext,
          values: { identifiers } as FormValues,
        }}
      >
        <CustomField name="nationality" />
      </PatientRegistrationContext.Provider>
    </ResourcesContext.Provider>,
  );
}

describe('CustomField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseConfig.mockReturnValue(getDefaultsFromConfigSchema(esmPatientRegistrationSchema));
  });

  it('hides nationality while foreign identifiers have no value', () => {
    renderCustomField({
      ce: {
        identifierTypeUuid: '550e8400-e29b-41d4-a716-446655440002',
        identifierName: 'Carné de Extranjería',
        identifierValue: '',
        initialValue: '',
        preferred: false,
        required: false,
        selectedSource: null,
      },
    });

    expect(screen.queryByTestId('person-attribute-field')).not.toBeInTheDocument();
  });

  it('shows nationality when CE has a value', () => {
    renderCustomField({
      ce: {
        identifierTypeUuid: '550e8400-e29b-41d4-a716-446655440002',
        identifierName: 'Carné de Extranjería',
        identifierValue: 'CE123456',
        initialValue: '',
        preferred: false,
        required: false,
        selectedSource: null,
      },
    });

    expect(screen.getByTestId('person-attribute-field')).toHaveTextContent('Nacionalidad');
  });

  it('does not show nationality for DNI-only registrations', () => {
    renderCustomField({
      dni: {
        identifierTypeUuid: '550e8400-e29b-41d4-a716-446655440001',
        identifierName: 'DNI',
        identifierValue: '12345678',
        initialValue: '',
        preferred: false,
        required: false,
        selectedSource: null,
      },
    });

    expect(screen.queryByTestId('person-attribute-field')).not.toBeInTheDocument();
  });
});
