import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserProfilePage from './UserProfilePage';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
  },
}));

describe('UserProfilePage Component', () => {
  const mockUser = {
    user_id: 1,
    is_superuser: false,
  };

  const defaultProps = {
    apiPrefix: '/api/',
    user: mockUser,
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        user_id: 2,
        first_name: 'John',
        last_name: 'Doe',
        date_joined: '2021-01-01',
        profile_image_url: null,
      },
    });

    axios.post.mockResolvedValue({
      data: {
        status: 'pending',
      },
    });
  });

  test('renders UserProfilePage component', async () => {
    render(
      <Router>
        <UserProfilePage {...defaultProps} />
      </Router>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles removing friend', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        status: 'accepted',
      },
    });

    render(
      <Router>
        <UserProfilePage {...defaultProps} />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /remove friend/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /remove friend/i }));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith('Friend removed', {
        theme: 'dark',
      });
    });
  });
});
