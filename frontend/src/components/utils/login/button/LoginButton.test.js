import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginButton from './LoginButton';

describe('LoginButton Component', () => {
  const buttonClass = 'btn-primary';
  const buttonText = 'Login';
  const ButtonTag = 'button';

  const renderComponent = () => {
    return render(
      <LoginButton
        buttonClass={buttonClass}
        buttonText={buttonText}
        ButtonTag={ButtonTag}
      />,
    );
  };

  test('renders LoginButton component', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(buttonClass);
  });

  test('has correct data attributes', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toHaveAttribute('data-bs-toggle', 'modal');
    expect(button).toHaveAttribute('data-bs-target', '#loginModal');
  });

  test('renders buttonText correctly', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toHaveTextContent(buttonText);
  });

  test('handles click event', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /login/i });
    fireEvent.click(button);
  });
});
