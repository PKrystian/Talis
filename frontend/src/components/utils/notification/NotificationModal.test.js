import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationModal from './NotificationModal';

const mockInvites = [
  { id: '1', name: 'Invite 1' },
  { id: '2', name: 'Invite 2' },
];

// eslint-disable-next-line react/display-name
jest.mock('../../user/invite/InviteItem', () => (props) => {
  // eslint-disable-next-line react/prop-types
  const { invite } = props;
  // eslint-disable-next-line react/prop-types
  return <div>{invite.name}</div>;
});

describe('NotificationModal Component', () => {
  test('renders NotificationModal with no notifications', () => {
    render(
      <NotificationModal
        apiPrefix="/api"
        user={{ id: 'user1' }}
        invites={[]}
        fetchInvites={jest.fn()}
      />,
    );

    expect(screen.getByText('You have no notifications')).toBeInTheDocument();
  });

  test('renders NotificationModal with invites', () => {
    render(
      <NotificationModal
        apiPrefix="/api"
        user={{ id: 'user1' }}
        invites={mockInvites}
        fetchInvites={jest.fn()}
      />,
    );

    expect(screen.getByText('Invite 1')).toBeInTheDocument();
    expect(screen.getByText('Invite 2')).toBeInTheDocument();
  });

  test('renders correct number of invites', () => {
    render(
      <NotificationModal
        apiPrefix="/api"
        user={{ id: 'user1' }}
        invites={mockInvites}
        fetchInvites={jest.fn()}
      />,
    );

    const invites = screen.getAllByText(/Invite 1|Invite 2/);
    expect(invites).toHaveLength(mockInvites.length);
  });
});
