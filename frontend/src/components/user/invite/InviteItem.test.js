import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InviteItem from './InviteItem';
import InviteConstants from '../../../constValues/InviteConstants';

jest.mock('axios');
jest.mock('../request/friend/FriendRequestTile', () =>
  jest.fn(() => <div>FriendRequestTile</div>),
);
jest.mock('../request/event/EventRequestTile', () =>
  jest.fn(() => <div>EventRequestTile</div>),
);

describe('InviteItem Component', () => {
  const mockFetchInvites = jest.fn();
  const mockUser = { user_id: 1 };
  const apiPrefix = '/api/';

  const renderComponent = (invite) => {
    render(
      <InviteItem
        apiPrefix={apiPrefix}
        user={mockUser}
        invite={invite}
        fetchInvites={mockFetchInvites}
      />,
    );
  };

  test('renders FriendRequestTile for new friend request invite', () => {
    const invite = {
      id: 1,
      type: InviteConstants.INVITE_TYPE_NEW_FRIEND_REQUEST,
    };
    renderComponent(invite);
    expect(screen.getByText('FriendRequestTile')).toBeInTheDocument();
  });

  test('renders EventRequestTile for event join request invite', () => {
    const invite = {
      id: 2,
      type: InviteConstants.INVITE_TYPE_EVENT_JOIN_REQUEST,
    };
    renderComponent(invite);
    expect(screen.getByText('EventRequestTile')).toBeInTheDocument();
  });

  test('renders EventRequestTile for event invite', () => {
    const invite = { id: 3, type: InviteConstants.INVITE_TYPE_EVENT };
    renderComponent(invite);
    expect(screen.getByText('EventRequestTile')).toBeInTheDocument();
  });
});
