import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import SettingsPage from './SettingsPage';

jest.mock('axios');

describe('SettingsPage Component', () => {
  const mockNavigate = jest.fn();
  const mockUseNavigate = jest.fn(() => mockNavigate);

  jest.mock('react-router-dom', () => ({
    useNavigate: mockUseNavigate,
  }));

  const defaultProps = {
    apiPrefix: '/api/',
    user: {
      user_id: 1,
      profile_image_url: 'https://example.com/image.jpg',
      first_name: 'John',
      last_name: 'Doe',
      birth_date: '1990-01-01',
    },
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: defaultProps.user,
    });
  });

  test('renders SettingsPage component', async () => {
    render(
      <Router>
        <SettingsPage {...defaultProps} />
      </Router>,
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });
  });
});
