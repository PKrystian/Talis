import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import EventRequestTile from './EventRequestTile';
import InviteConstants from '../../../../constValues/InviteConstants';

describe('EventRequestTile Component', () => {
  const mockInvite = {
    type: InviteConstants.INVITE_TYPE_EVENT,
    event: {
      id: 1,
      title: 'Event Title',
      image_url: '/path/to/event-image.jpg',
    },
    friend: {
      id: 2,
      first_name: 'John',
      last_name: 'Doe',
      profile_image_url: '/path/to/profile-image.jpg',
    },
  };
  const mockHandleInviteAction = jest.fn();

  const renderComponent = () => {
    return render(
      <Router>
        <EventRequestTile
          invite={mockInvite}
          handleInviteAction={mockHandleInviteAction}
        />
      </Router>,
    );
  };

  test('renders EventRequestTile component', () => {
    renderComponent();
    expect(
      screen.getByText('You have been invited to an event'),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Event Title front game')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText("John's avatar")).toBeInTheDocument();
  });

  test('handles event image error', () => {
    renderComponent();
    const eventImg = screen.getByAltText('Event Title front game');
    fireEvent.error(eventImg);
    expect(eventImg.src).toContain('/static/default-profile.png');
  });

  test('handles user image error', () => {
    renderComponent();
    const userImg = screen.getByAltText("John's avatar");
    fireEvent.error(userImg);
    expect(userImg.src).toContain('/static/default-profile.png');
  });

  test('handles cancel button click', () => {
    renderComponent();
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockHandleInviteAction).toHaveBeenCalledWith('rejected');
  });

  test('handles accept button click', () => {
    renderComponent();
    const acceptButton = screen.getByText('Accept');
    fireEvent.click(acceptButton);
    expect(mockHandleInviteAction).toHaveBeenCalledWith('accepted');
  });
});
