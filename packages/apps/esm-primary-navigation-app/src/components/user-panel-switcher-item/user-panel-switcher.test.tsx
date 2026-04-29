import { type LoggedInUser, type Session, useSession } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { mockLoggedInUser } from '../../../test-utils/mocks/mock-user';

import UserPanelSwitcher from './user-panel-switcher.component';

jest.mock('@openmrs/esm-framework', () => ({
  __esModule: true,
  useSession: jest.fn(),
  UserAvatarIcon: () => null,
}));

const mockUseSession = jest.mocked(useSession);

describe('UserPanelSwitcher', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      authenticated: true,
      user: mockLoggedInUser as unknown as LoggedInUser,
    } as unknown as Session);
  });

  it('should display user name', async () => {
    render(<UserPanelSwitcher />);

    expect(await screen.findByText(/Dr Healther Morgan/i)).toBeInTheDocument();
  });
});
