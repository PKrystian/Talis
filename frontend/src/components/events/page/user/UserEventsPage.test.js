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
import { BrowserRouter as Router } from 'react-router-dom';
import UserEventsPage from './UserEventsPage';

jest.mock('axios');
// eslint-disable-next-line react/display-name
jest.mock('../../../utils/map/OSMMap', () => () => <div>Mocked OSMMap</div>);
// eslint-disable-next-line react/display-name
jest.mock('../../delete/DeleteEventModal', () => () => (
  <div>Mocked DeleteEventModal</div>
));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

const mockUser = { user_id: 1 };
const mockApiPrefix = 'http://localhost:8000/';
const mockEventData = [
  {
    id: 1,
    title: 'Event 1',
    city: 'City 1',
    attendees: [],
    max_players: 10,
    host: { id: 1 },
    board_games: [{ image_url: 'image1.jpg' }],
    coordinates: { latitude: 40.7128, longitude: -74.006 },
  },
];

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

describe('UserEventsPage Component', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: mockEventData });
  });

  test('fetches and displays event data', async () => {
    await act(async () => {
      render(
        <Router>
          <UserEventsPage apiPrefix={mockApiPrefix} user={mockUser} />
        </Router>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
    });
  });

  test.skip('displays event details when an event is clicked', async () => {
    await act(async () => {
      render(
        <Router>
          <UserEventsPage apiPrefix={mockApiPrefix} user={mockUser} />
        </Router>,
      );
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Event 1'));
    });

    expect(screen.getByText('Mocked OSMMap')).toBeInTheDocument();
  });

  test.skip('opens delete event modal when delete button is clicked', async () => {
    await act(async () => {
      render(
        <Router>
          <UserEventsPage apiPrefix={mockApiPrefix} user={mockUser} />
        </Router>,
      );
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Event 1'));
    });

    fireEvent.click(screen.getByText('Delete Event'));

    expect(screen.getByText('Mocked DeleteEventModal')).toBeInTheDocument();
  });
});
