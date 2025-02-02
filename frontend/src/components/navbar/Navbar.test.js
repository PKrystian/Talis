import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockApiPrefix = '/api/';
  const mockUser = { user_id: 1, name: 'John Doe', profile_image_url: '' };
  const mockResetUser = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { results: [] } });
    axios.post.mockResolvedValue({});
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders Navbar component', () => {
    render(
      <Router>
        <Navbar
          apiPrefix={mockApiPrefix}
          user={mockUser}
          userState={true}
          resetUser={mockResetUser}
          inviteCount={0}
        />
      </Router>,
    );
    expect(screen.getByText('Talis')).toBeInTheDocument();
  });

  test('handles search input', async () => {
    render(
      <Router>
        <Navbar
          apiPrefix={mockApiPrefix}
          user={mockUser}
          userState={true}
          resetUser={mockResetUser}
          inviteCount={0}
        />
      </Router>,
    );

    fireEvent.change(screen.getByPlaceholderText('Search Talis'), {
      target: { value: 'test' },
    });

    expect(screen.getByPlaceholderText('Search Talis').value).toBe('test');
  });

  test('handles search submit', async () => {
    render(
      <Router>
        <Navbar
          apiPrefix={mockApiPrefix}
          user={mockUser}
          userState={true}
          resetUser={mockResetUser}
          inviteCount={0}
        />
      </Router>,
    );

    fireEvent.change(screen.getByPlaceholderText('Search Talis'), {
      target: { value: 'test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /search/i }));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/search?query=test&filterType=&filter=&sort=rating_desc`,
    );
  });

  test('displays user dropdown', async () => {
    render(
      <Router>
        <Navbar
          apiPrefix={mockApiPrefix}
          user={mockUser}
          userState={true}
          resetUser={mockResetUser}
          inviteCount={0}
        />
      </Router>,
    );

    fireEvent.click(screen.getByAltText('User Profile'));

    expect(screen.getByText('My profile')).toBeInTheDocument();
  });
});
