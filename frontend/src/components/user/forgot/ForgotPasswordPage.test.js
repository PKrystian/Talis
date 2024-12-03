import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import ForgotPasswordPage from './ForgotPasswordPage';

jest.mock('axios');

describe('ForgotPasswordPage Component', () => {
  const mockNavigate = jest.fn();
  const mockUseNavigate = jest.fn(() => mockNavigate);
  const mockUseParams = jest.fn(() => ({ token: 'test-token' }));

  jest.mock('react-router-dom', () => ({
    useNavigate: mockUseNavigate,
    useParams: mockUseParams,
  }));

  const defaultProps = {
    apiPrefix: '/api/',
    userState: false,
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({});
  });

  test('renders ForgotPasswordPage component', async () => {
    render(
      <Router>
        <ForgotPasswordPage {...defaultProps} />
      </Router>,
    );

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  test('shows error for invalid password format', async () => {
    render(
      <Router>
        <ForgotPasswordPage {...defaultProps} />
      </Router>,
    );

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'invalid' },
    });
    fireEvent.change(screen.getByLabelText('Repeat Password'), {
      target: { value: 'invalid' },
    });

    fireEvent.click(screen.getByText('Set new password'));

    await waitFor(() => {
      expect(screen.getByText('Password has wrong format')).toBeInTheDocument();
    });
  });

  test('shows error for mismatched passwords', async () => {
    render(
      <Router>
        <ForgotPasswordPage {...defaultProps} />
      </Router>,
    );

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'ValidPassword123!' },
    });
    fireEvent.change(screen.getByLabelText('Repeat Password'), {
      target: { value: 'DifferentPassword123!' },
    });

    fireEvent.click(screen.getByText('Set new password'));

    await waitFor(() => {
      expect(
        screen.getByText('Repeat Password has to match password'),
      ).toBeInTheDocument();
    });
  });
});
