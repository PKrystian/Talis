import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForgotPasswordModal from './LoginForgotPasswordModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('LoginForgotPasswordModal Component', () => {
  const mockApiPrefix = 'http://localhost:8000/';

  const renderComponent = (userState = false) => {
    return render(
      <Router>
        <LoginForgotPasswordModal
          apiPrefix={mockApiPrefix}
          userState={userState}
        />
      </Router>,
    );
  };

  const openModal = () => {
    const modal = screen.getByTestId('forgot-password-modal');
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
  };

  test('renders LoginForgotPasswordModal component', () => {
    renderComponent();
    openModal();
    expect(
      screen.getByRole('heading', { name: /forgot my password/i }),
    ).toBeInTheDocument();
  });

  test('submits form with valid email', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { validate: true },
    });

    renderComponent();
    openModal();
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /send reset request/i,
    });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Password reset link sent',
        expect.any(Object),
      );
    });
  });

  test('shows error on invalid email submission', async () => {
    axios.post.mockRejectedValue(new Error('Email doesnt exist'));

    renderComponent();
    openModal();
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /send reset request/i,
    });

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email doesnt exist')).toBeInTheDocument();
    });
  });
});
