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
import EventsPage from './EventsPage';

jest.mock('axios');
// eslint-disable-next-line react/display-name
jest.mock('../../item/EventItem', () => () => <div>Mocked EventItem</div>);
// eslint-disable-next-line react/display-name
jest.mock('../../tags/EventTagsModal', () => () => (
  <div>Mocked EventTagsModal</div>
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

describe('EventsPage Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockEventData });
    axios.post.mockResolvedValue({ data: [] });
  });

  test('fetches and displays event data', async () => {
    await act(async () => {
      render(
        <Router>
          <EventsPage apiPrefix={mockApiPrefix} user={mockUser} />
        </Router>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
    });
  });

  test('displays event details when an event is clicked', async () => {
    await act(async () => {
      render(
        <Router>
          <EventsPage apiPrefix={mockApiPrefix} user={mockUser} />
        </Router>,
      );
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Event 1'));
    });

    expect(screen.getByText('Mocked EventItem')).toBeInTheDocument();
  });

  test('opens tags modal when "Choose Categories" button is clicked', async () => {
    await act(async () => {
      render(
        <Router>
          <EventsPage apiPrefix={mockApiPrefix} user={mockUser} />
        </Router>,
      );
    });

    fireEvent.click(screen.getByText('Choose Categories'));

    expect(screen.getByText('Mocked EventTagsModal')).toBeInTheDocument();
  });

  test('applies filters and updates event data', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    await act(async () => {
      render(
        <Router>
          <EventsPage apiPrefix={mockApiPrefix} user={mockUser} />
        </Router>,
      );
    });

    fireEvent.click(screen.getByText('Apply filters'));

    await waitFor(() => {
      expect(screen.getByText('NO EVENTS FOUND')).toBeInTheDocument();
    });
  });
});
