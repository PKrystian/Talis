import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  BrowserRouter as Router,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';
import SearchPage from './SearchPage';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('SearchPage Component', () => {
  const mockNavigate = jest.fn();
  const mockUseNavigate = jest.fn(() => mockNavigate);
  const mockUseLocation = jest.fn(() => ({
    search: '?query=test&sort=rating_desc',
  }));

  useNavigate.mockImplementation(mockUseNavigate);
  useLocation.mockImplementation(mockUseLocation);

  const defaultProps = {
    apiPrefix: '/api/',
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: [
          { id: 1, name: 'Board Game 1' },
          { id: 2, name: 'Board Game 2' },
        ],
        hasMore: true,
      },
    });
  });

  test('renders SearchPage component', async () => {
    render(
      <Router>
        <SearchPage {...defaultProps} />
      </Router>,
    );

    await waitFor(() => {
      expect(
        screen.getByText((content, element) =>
          content.includes('Search Results for "test"'),
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Board Game 1')).toBeInTheDocument();
      expect(screen.getByText('Board Game 2')).toBeInTheDocument();
    });
  });

  test('handles filter application', async () => {
    render(
      <Router>
        <SearchPage {...defaultProps} />
      </Router>,
    );

    fireEvent.click(screen.getByText('Apply Filters'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('?query=test&sort=rating_desc');
    });
  });

  test('handles filter reset', async () => {
    render(
      <Router>
        <SearchPage {...defaultProps} />
      </Router>,
    );

    fireEvent.click(screen.getByText('Reset Filters'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('?query=test&sort=rating_desc');
    });
  });
});
