import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import VerifyAccount from './VerifyAccount';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('VerifyAccount Component', () => {
  const mockApiPrefix = 'http://localhost:8000/';
  const mockUser = { user_id: 1, is_active: false };
  const mockNavigate = jest.fn();
  const mockToken = 'test-token';

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ token: mockToken });
  });

  const renderComponent = () => {
    return render(<VerifyAccount apiPrefix={mockApiPrefix} user={mockUser} />);
  };

  test('calls API to verify account on mount', async () => {
    axios.get.mockResolvedValue({ status: 200 });
    renderComponent();
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${mockApiPrefix}verify/${mockToken}/`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    });
  });

  test('shows success toast on successful verification', async () => {
    axios.get.mockResolvedValue({ status: 200 });
    renderComponent();
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'User account Verified. You can now login',
        {
          position: 'top-center',
          theme: 'dark',
          bodyClassName: expect.any(Function),
        },
      );
    });
  });
});
