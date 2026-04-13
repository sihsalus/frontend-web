import { getDefaultsFromConfigSchema, useConfig } from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCareProgramsResponse, mockEnrolledInAllProgramsResponse, mockEnrolledProgramsResponse } from '__mocks__';
import React from 'react';
import { mockPatient, renderWithSwr, waitForLoadingToFinish } from 'test-utils';

import { type ConfigObject, configSchema } from '../config-schema';
import ProgramsDetailedSummary from './programs-detailed-summary.component';
import { usePrograms } from './programs.resource';

const mockUsePrograms = jest.mocked(usePrograms);
const mockUseConfig = jest.mocked(useConfig<ConfigObject>);

jest.mock('./programs.resource', () => ({
  usePrograms: jest.fn(),
  findLastState: jest.fn(),
}));

jest.mock('@openmrs/esm-patient-common-lib', () => {
  const originalModule = jest.requireActual('@openmrs/esm-patient-common-lib');
  return {
    ...originalModule,
    launchPatientWorkspace: jest.fn(),
  };
});

const basePrograms = {
  enrollments: [],
  isLoading: false,
  isValidating: false,
  error: null,
  activeEnrollments: [],
  availablePrograms: [],
  eligiblePrograms: [],
};

describe('ProgramsDetailedSummary', () => {
  it('renders an empty state view when the patient is not enrolled into any programs', async () => {
    mockUsePrograms.mockReturnValue({ ...basePrograms });

    renderWithSwr(<ProgramsDetailedSummary patientUuid={mockPatient.id} />);
    await waitForLoadingToFinish();

    expect(screen.getByText(/Care Programs/i)).toBeInTheDocument();
    expect(screen.getByText(/There are no program enrollments to display for this patient/)).toBeInTheDocument();
    expect(screen.getByText(/Record program enrollments/)).toBeInTheDocument();
  });

  it('renders an error state view if there is a problem fetching program enrollments', async () => {
    const error = new Error('You are not logged in');
    mockUsePrograms.mockReturnValue({ ...basePrograms, error });

    renderWithSwr(<ProgramsDetailedSummary patientUuid={mockPatient.id} />);
    await waitForLoadingToFinish();

    expect(screen.getByText(/Care Programs/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above./,
      ),
    ).toBeInTheDocument();
  });

  it('renders a detailed tabular summary of the patient program enrollments', async () => {
    const user = userEvent.setup();

    mockUsePrograms.mockReturnValue({
      ...basePrograms,
      enrollments: mockEnrolledProgramsResponse,
      activeEnrollments: mockEnrolledProgramsResponse.filter((e) => !e.dateCompleted),
      availablePrograms: mockCareProgramsResponse,
      eligiblePrograms: mockCareProgramsResponse,
    });

    renderWithSwr(<ProgramsDetailedSummary patientUuid={mockPatient.id} />);
    await waitForLoadingToFinish();

    expect(screen.getByText(/Care Programs/i)).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /active programs/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /date enrolled/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /Add/ });
    expect(addButton).toBeInTheDocument();
    const row = screen.getByRole('row', { name: /hiv care and treatment/i });
    expect(row).toBeInTheDocument();
    expect(within(row).getByRole('cell', { name: /16-Jan-2020/i })).toBeInTheDocument();
    expect(within(row).getByRole('cell', { name: /active$/i })).toBeInTheDocument();
    const actionMenuButton = within(row).getByRole('button', { name: /options$/i });
    expect(actionMenuButton).toBeInTheDocument();

    await user.click(actionMenuButton);

    expect(addButton).toBeEnabled();
    await user.click(addButton);
    expect(launchPatientWorkspace).toHaveBeenCalledWith('programs-form-workspace');

    await user.click(actionMenuButton);
    await user.click(screen.getByText('Edit'));
    expect(launchPatientWorkspace).toHaveBeenCalledWith('programs-form-workspace', {
      programEnrollmentId: mockEnrolledProgramsResponse[0].uuid,
      workspaceTitle: 'Edit program enrollment',
    });
  });

  it('renders a notification when the patient is enrolled in all available programs', async () => {
    mockUsePrograms.mockReturnValue({
      ...basePrograms,
      enrollments: mockEnrolledInAllProgramsResponse,
      activeEnrollments: mockEnrolledInAllProgramsResponse,
      availablePrograms: mockCareProgramsResponse,
      eligiblePrograms: [],
    });

    renderWithSwr(<ProgramsDetailedSummary patientUuid={mockPatient.id} />);
    await waitForLoadingToFinish();

    expect(screen.getByRole('row', { name: /hiv care and treatment/i })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /hiv differentiated care/i })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /oncology screening and diagnosis/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
    expect(screen.getByText(/enrolled in all programs/i)).toBeInTheDocument();
    expect(screen.getByText(/there are no more programs left to enroll this patient in/i)).toBeInTheDocument();
  });

  it('conditionally renders the programs status field', async () => {
    mockUsePrograms.mockReturnValue({
      ...basePrograms,
      enrollments: mockEnrolledProgramsResponse,
      activeEnrollments: mockEnrolledProgramsResponse.filter((e) => !e.dateCompleted),
      availablePrograms: mockCareProgramsResponse,
      eligiblePrograms: mockCareProgramsResponse,
    });

    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
      showProgramStatusField: true,
    });

    renderWithSwr(<ProgramsDetailedSummary patientUuid={mockPatient.id} />);
    await waitForLoadingToFinish();

    expect(screen.getByRole('columnheader', { name: /program status/i })).toBeInTheDocument();
  });
});
