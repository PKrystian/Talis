import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PolicyPage from './PolicyPage';

describe('PolicyPage Component', () => {
  test('renders policy content', () => {
    render(<PolicyPage />);
    expect(screen.getByText('Policy Rules')).toBeInTheDocument();
    expect(
      screen.getByText(
        'We are committed to protecting your privacy. This policy outlines the types of personal information we collect, how we use it, and the steps we take to ensure it is protected.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Information Collection:')).toBeInTheDocument();
    expect(screen.getByText('Use of Information:')).toBeInTheDocument();
    expect(screen.getByText('Information Sharing:')).toBeInTheDocument();
    expect(screen.getByText('Data Security:')).toBeInTheDocument();
    expect(screen.getByText('Changes to This Policy:')).toBeInTheDocument();
    expect(screen.getByText('Contact Us:')).toBeInTheDocument();
  });

  test('renders cookie policy content', () => {
    render(<PolicyPage />);
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(
      screen.getByText(
        'We use cookies solely to enhance your experience on our website. Our cookies are used for user authentication during login and registration processes, as well as for saving preferences related to board games.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Here are the types of cookies we use:'),
    ).toBeInTheDocument();
    expect(screen.getByText('Essential Cookies:')).toBeInTheDocument();
    expect(screen.getByText('Session Cookies:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You can manage your cookie preferences through your browser settings. However, please note that disabling cookies may affect your ability to use certain features of our website.',
      ),
    ).toBeInTheDocument();
  });
});
