import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountVerificationModal from './AccountVerificationModal';

describe('AccountVerificationModal Component', () => {
  const renderComponent = () => {
    return render(<AccountVerificationModal />);
  };

  test('adds class to body on mount', () => {
    renderComponent();
    expect(document.body.classList.contains('body-account-not-verified')).toBe(
      true,
    );
  });

  test('renders AccountVerificationModal component', () => {
    renderComponent();
    expect(
      screen.getByText('Account verification link has been sent to your email'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Click the link there to verify and gain access to your account',
      ),
    ).toBeInTheDocument();
  });
});
