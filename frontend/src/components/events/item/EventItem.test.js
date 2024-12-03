import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import EventItem from './EventItem';

// eslint-disable-next-line react/display-name
jest.mock('../../utils/map/OSMMap', () => () => <div>Mocked OSMMap</div>);

const mockChosenEvent = {
  title: 'Event Title',
  description: 'Event Description',
  tags: ['Tag1', 'Tag2'],
  attendees: [
    {
      id: 2,
      profile_image_url: 'attendee1.jpg',
      first_name: 'John',
      last_name: 'Doe',
    },
    {
      id: 3,
      profile_image_url: 'attendee2.jpg',
      first_name: 'Jane',
      last_name: 'Doe',
    },
  ],
  max_players: 10,
  host: {
    id: 1,
    profile_image_url: 'host.jpg',
    first_name: 'Host',
    last_name: 'User',
  },
  city: 'City',
  street: 'Street',
  zip_code: '12345',
  coordinates: { latitude: 40.7128, longitude: -74.006 },
  board_games: [{ image_url: 'game1.jpg' }, { image_url: 'game2.jpg' }],
};

const mockUser = { user_id: 1 };

describe('EventItem Component', () => {
  test('renders event details', () => {
    render(
      <Router>
        <EventItem chosenEvent={mockChosenEvent} user={mockUser} />
      </Router>,
    );

    expect(screen.getByText('Event Title')).toBeInTheDocument();
    expect(screen.getByText('Event Description')).toBeInTheDocument();
    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
    expect(screen.getByText('2/10 Crew')).toBeInTheDocument();
    expect(screen.getByText('Hosted by:')).toBeInTheDocument();
    expect(screen.getByText('City Street 12345')).toBeInTheDocument();
  });

  test('renders attendees and host images', () => {
    render(
      <Router>
        <EventItem chosenEvent={mockChosenEvent} user={mockUser} />
      </Router>,
    );

    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Host User')).toBeInTheDocument();
  });

  test('renders OSMMap component with coordinates', () => {
    render(
      <Router>
        <EventItem chosenEvent={mockChosenEvent} user={mockUser} />
      </Router>,
    );

    expect(screen.getByText('Mocked OSMMap')).toBeInTheDocument();
  });

  test('renders join button if provided', () => {
    const mockJoinButton = <button>Join Event</button>;

    render(
      <Router>
        <EventItem
          chosenEvent={mockChosenEvent}
          user={mockUser}
          joinButton={mockJoinButton}
        />
      </Router>,
    );

    expect(screen.getByText('Join Event')).toBeInTheDocument();
  });
});
