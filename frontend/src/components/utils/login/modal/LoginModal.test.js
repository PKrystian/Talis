import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginModal from './LoginModal';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    loading: jest.fn(),
    update: jest.fn(),
  },
}));

describe('LoginModal Component', () => {
  const mockSetUserData = jest.fn();
  const mockSetUserState = jest.fn();
  const mockApiPrefix = 'http://localhost:8000/';

  const renderComponent = (userState = false) => {
    return render(
      <Router>
        <LoginModal
          apiPrefix={mockApiPrefix}
          setUserData={mockSetUserData}
          userState={userState}
          setUserState={mockSetUserState}
        />
      </Router>,
    );
  };

  const openModal = () => {
    const modal = screen.getByTestId('login-modal');
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
  };

  test('renders LoginModal component', () => {
    renderComponent();
    openModal();
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });
});
