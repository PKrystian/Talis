import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateEventPage from './CreateEventPage';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    loading: jest.fn(),
    update: jest.fn(),
  },
}));

const mockUser = { user_id: 1 };
const mockApiPrefix = 'http://localhost:8000/';

describe('CreateEventPage Component', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: [] });
  });

  test('renders form fields correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <CreateEventPage
            apiPrefix={mockApiPrefix}
            user={mockUser}
            userState={true}
          />
        </Router>,
      );
    });

    expect(screen.getByLabelText('Event Title')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('Street')).toBeInTheDocument();
    expect(screen.getByLabelText('ZipCode')).toBeInTheDocument();
    expect(screen.getByLabelText('Starting Date')).toBeInTheDocument();
    expect(screen.getByLabelText('BoardGames')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Players')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });
});
