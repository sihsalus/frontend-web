import { ActionMenuButton } from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import PatientListsNavButton from './patient-lists-nav-button.extension';

const mockActionMenuButton = jest.mocked(ActionMenuButton);
const mockLaunchPatientWorkspace = jest.mocked(launchPatientWorkspace);

mockActionMenuButton.mockImplementation(({ handler, label }) => <button onClick={handler}>{label}</button>);

jest.mock('@openmrs/esm-patient-common-lib', () => {
  const originalModule = jest.requireActual('@openmrs/esm-patient-common-lib');

  return {
    ...originalModule,
    launchPatientWorkspace: jest.fn(),
  };
});

test('should display the patient lists action menu button and launch the workspace', async () => {
  const user = userEvent.setup();

  render(<PatientListsNavButton />);

  const patientListsButton = screen.getByRole('button', { name: /patient lists/i });
  expect(patientListsButton).toBeInTheDocument();

  await user.click(patientListsButton);

  expect(mockLaunchPatientWorkspace).toHaveBeenCalledWith('patient-lists');
});
