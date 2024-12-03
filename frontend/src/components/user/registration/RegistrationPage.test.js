import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import RegistrationPage from './RegistrationPage';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    loading: jest.fn(),
    update: jest.fn(),
  },
}));

describe('RegistrationPage Component', () => {
  const mockSetUserData = jest.fn();
  const mockSetUserState = jest.fn();
  const mockNavigate = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  const defaultProps = {
    apiPrefix: '/api/',
    userState: false,
    setUserData: mockSetUserData,
    setUserState: mockSetUserState,
  };

  test('validates repeat password matches password', () => {
    render(
      <Router>
        <RegistrationPage {...defaultProps} />
      </Router>,
    );

    const passwordInputs = screen.getAllByPlaceholderText('your password');
    const passwordInput = passwordInputs[0];
    const repeatPasswordInput = passwordInputs[1];

    fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });
    fireEvent.change(repeatPasswordInput, {
      target: { value: 'differentPassword' },
    });
    fireEvent.blur(repeatPasswordInput);

    expect(
      screen.getByText('Repeat Password has to match password'),
    ).toBeInTheDocument();
  });
  test('submits form with valid data', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        is_authenticated: true,
        username: 'testuser',
        user_id: 1,
        is_superuser: false,
        profile_image_url: '',
        cookie_consent: true,
        is_active: true,
      },
    });

    render(
      <Router>
        <RegistrationPage {...defaultProps} />
      </Router>,
    );

    fireEvent.change(screen.getByPlaceholderText('name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('surname'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('example@mail.com'), {
      target: { value: 'john.doe@example.com' },
    });

    const passwordInputs = screen.getAllByPlaceholderText('your password');
    fireEvent.change(passwordInputs[0], {
      target: { value: 'ValidPassword123' },
    });
    fireEvent.change(passwordInputs[1], {
      target: { value: 'ValidPassword123' },
    });

    fireEvent.click(screen.getByLabelText('I Accept the terms and conditions'));

    const signUpButtons = screen.getAllByText('Sign up');
    fireEvent.click(signUpButtons[1]);
  });
});
