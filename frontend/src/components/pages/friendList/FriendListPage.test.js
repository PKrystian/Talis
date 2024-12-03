import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FriendListPage from './FriendListPage';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('FriendListPage Component', () => {
  const mockApiPrefix = '/api/';
  const mockUser = { user_id: 1, name: 'John Doe' };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({});
  });

  test('renders FriendListPage component', async () => {
    await act(async () => {
      render(<FriendListPage apiPrefix={mockApiPrefix} user={mockUser} />);
    });
    expect(screen.getByText('Your Friends')).toBeInTheDocument();
  });
});
