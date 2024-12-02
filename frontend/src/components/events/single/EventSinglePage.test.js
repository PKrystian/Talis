import React from 'react';
import { render, act } from '@testing-library/react';
import EventSinglePage from './EventSinglePage';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('axios');

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

describe('EventSinglePage Component', () => {
  test('renders EventSinglePage and fetches event data', async () => {
    const mockEvent = {
      id: 1,
      name: 'Test Event',
      title: 'Test Event Title',
      description: 'Test Event Description',
      tags: ['tag1', 'tag2'],
      attendees: [],
      max_players: 10,
      host: {
        id: 1,
        first_name: 'Host',
        last_name: 'User',
        profile_image_url: '',
      },
      city: 'Test City',
      street: 'Test Street',
      zip_code: '12345',
      coordinates: [0, 0],
      board_games: [],
    };
    axios.get.mockResolvedValue({ data: mockEvent });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/event/1']}>
          <Routes>
            <Route
              path="/event/:event_id"
              element={
                <EventSinglePage
                  apiPrefix="http://localhost:8000/"
                  user={{ user_id: 1 }}
                />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
    });
  });
});
