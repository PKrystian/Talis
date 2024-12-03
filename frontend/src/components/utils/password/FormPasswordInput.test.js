import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormPasswordInput from './FormPasswordInput';

const mockProps = {
  id: 'password',
  value: 'password123',
  label: 'Password',
  placeholder: 'Enter your password',
  inputError: '',
  inputErrorStyle: '',
  warningStyle: '',
  onChangeCallback: jest.fn(),
  divStyling: '',
};

describe('FormPasswordInput Component', () => {
  test('renders FormPasswordInput with correct label', () => {
    render(<FormPasswordInput {...mockProps} />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('renders input with correct placeholder', () => {
    render(<FormPasswordInput {...mockProps} />);
    expect(
      screen.getByPlaceholderText('Enter your password'),
    ).toBeInTheDocument();
  });

  test('toggles password visibility when icon is clicked', () => {
    render(<FormPasswordInput {...mockProps} />);
    const icon = screen.getByRole('button');
    const input = screen.getByLabelText('Password');

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(icon);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(icon);
    expect(input).toHaveAttribute('type', 'password');
  });

  test('calls onChangeCallback when input value changes', () => {
    render(<FormPasswordInput {...mockProps} />);
    const input = screen.getByLabelText('Password');
    fireEvent.change(input, { target: { value: 'newpassword' } });
    expect(mockProps.onChangeCallback).toHaveBeenCalled();
  });

  test('displays input error message when inputError is provided', () => {
    const errorProps = { ...mockProps, inputError: 'Password is required' };
    render(<FormPasswordInput {...errorProps} />);
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});
