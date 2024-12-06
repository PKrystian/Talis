import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginContainer from './LoginContainer';

describe('LoginContainer Component', () => {
  const buttonClass = 'btn-primary';
  const ButtonTag = 'button';
  const children = 'Login';

  const renderComponent = () => {
    return render(
      <LoginContainer buttonClass={buttonClass} ButtonTag={ButtonTag}>
        {children}
      </LoginContainer>,
    );
  };

  test('renders LoginContainer component', () => {
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

  test('renders children correctly', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toHaveTextContent(children);
  });

  test('handles click event', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /login/i });
    fireEvent.click(button);
  });
});
