import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CookieConsentModal from './CookieConsentModal';

jest.mock('axios');

describe('CookieConsentModal Component', () => {
  const mockApiPrefix = 'http://localhost:8000/';
  const mockUser = { user_id: 1, cookie_consent: null };
  const mockSetUser = jest.fn();

  const renderComponent = () => {
    return render(
      <CookieConsentModal
        apiPrefix={mockApiPrefix}
        user={mockUser}
        setUser={mockSetUser}
      />,
    );
  };

  test('renders CookieConsentModal component', async () => {
    axios.get.mockResolvedValue({ data: { cookie_consent: null } });
    await act(async () => {
      renderComponent();
    });
    expect(screen.getByText('Cookie Consent')).toBeInTheDocument();
  });

  test('fetches cookie consent on mount', async () => {
    axios.get.mockResolvedValue({ data: { cookie_consent: false } });
    await act(async () => {
      renderComponent();
    });
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${mockApiPrefix}check-cookie-consent/`,
        {
          params: { user_id: mockUser.user_id },
        },
      );
    });
  });

  test('shows cookie policy', async () => {
    axios.get.mockResolvedValue({ data: { cookie_consent: null } });
    await act(async () => {
      renderComponent();
    });
    fireEvent.click(screen.getByText('Cookie Policy'));
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
