import { ActionMenuButton } from '@openmrs/esm-framework';
import { useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import VisitNoteNavButton from './visit-note-nav-button.extension';

const mockActionMenuButton = jest.mocked(ActionMenuButton);
const mockUseLaunchWorkspaceRequiringVisit = useLaunchWorkspaceRequiringVisit as jest.Mock;

mockActionMenuButton.mockImplementation(({ handler, label }) => <button onClick={handler}>{label}</button>);

jest.mock('@openmrs/esm-patient-common-lib', () => {
  const originalModule = jest.requireActual('@openmrs/esm-patient-common-lib');

  return {
    ...originalModule,
    useLaunchWorkspaceRequiringVisit: jest.fn(),
  };
});

beforeEach(() => {
  mockUseLaunchWorkspaceRequiringVisit.mockReturnValue(jest.fn());
});

test('should display the visit note action menu button and launch the creating workspace', async () => {
  const user = userEvent.setup();
  const mockLaunchVisitNotesWorkspace = jest.fn();

  mockUseLaunchWorkspaceRequiringVisit.mockReturnValue(mockLaunchVisitNotesWorkspace);

  render(<VisitNoteNavButton />);

  const visitNoteButton = screen.getByRole('button', { name: /visit note/i });
  expect(visitNoteButton).toBeInTheDocument();

  await user.click(visitNoteButton);

  expect(mockUseLaunchWorkspaceRequiringVisit).toHaveBeenCalledWith('visit-notes-form-workspace');
  expect(mockLaunchVisitNotesWorkspace).toHaveBeenCalledWith({ formContext: 'creating' });
});
