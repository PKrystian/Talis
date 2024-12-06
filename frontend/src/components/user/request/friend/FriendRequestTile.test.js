import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import FriendRequestTile from './FriendRequestTile';

describe('FriendRequestTile Component', () => {
  const mockInvite = {
    friend: {
      first_name: 'John',
      profile_image_url: '/path/to/image.jpg',
    },
  };
  const mockHandleInviteAction = jest.fn();

  const renderComponent = () => {
    return render(
      <Router>
        <FriendRequestTile
          invite={mockInvite}
          handleInviteAction={mockHandleInviteAction}
        />
      </Router>,
    );
  };

  test('renders FriendRequestTile component', () => {
    renderComponent();
    expect(
      screen.getByText('You have a new friend request'),
    ).toBeInTheDocument();
    expect(screen.getByText('John John')).toBeInTheDocument();
    expect(screen.getByAltText("John's avatar")).toBeInTheDocument();
  });

  test('handles image error', () => {
    renderComponent();
    const img = screen.getByAltText("John's avatar");
    fireEvent.error(img);
    expect(img.src).toContain('/static/default-profile.png');
  });

  test('handles dismiss button click', () => {
    renderComponent();
    const button = screen.getByText('Dismiss');
    fireEvent.click(button);
    expect(mockHandleInviteAction).toHaveBeenCalledWith('dismissed');
  });
});
