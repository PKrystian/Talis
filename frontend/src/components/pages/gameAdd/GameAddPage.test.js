import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import GameAddPage from './GameAddPage';

jest.mock('axios');

describe('GameAddPage Component', () => {
  const defaultProps = {
    apiPrefix: '/api/',
    user: { user_id: '123' },
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: { game_id: '1' },
    });
  });

  test('renders form elements', () => {
    render(
      <Router>
        <GameAddPage {...defaultProps} />
      </Router>,
    );
    expect(screen.getByLabelText('Name (required)')).toBeInTheDocument();
    expect(screen.getByLabelText('Year Published')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum Players')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum Players')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum Playtime')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum Playtime')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Description (required)')).toBeInTheDocument();
    expect(screen.getByLabelText('Image URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Publisher')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Expansions (IDs separated by commas)'),
    ).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    render(
      <Router>
        <GameAddPage {...defaultProps} />
      </Router>,
    );

    fireEvent.change(screen.getByLabelText('Name (required)'), {
      target: { value: 'Test Game' },
    });
    fireEvent.change(screen.getByLabelText('Description (required)'), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add Game' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${defaultProps.apiPrefix}game-add/`,
        expect.objectContaining({
          user_id: defaultProps.user.user_id,
          game_data: expect.objectContaining({
            name: 'Test Game',
            description: 'Test Description',
          }),
        }),
        expect.any(Object),
      );
    });
  });
});
