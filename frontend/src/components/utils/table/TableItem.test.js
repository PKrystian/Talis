import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableItem from './TableItem';
import { MemoryRouter } from 'react-router-dom';

const mockBoardGame = {
  id: '1',
  name: 'Gloomhaven',
  image_url: 'image1.jpg',
  accepted_by_admin: true,
  is_expansion: false,
  rating: 4.5,
  added_by: 'user1',
};

describe('TableItem Component', () => {
  test('renders TableItem with correct board game name', () => {
    render(
      <MemoryRouter>
        <TableItem boardGame={mockBoardGame} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Gloomhaven')).toBeInTheDocument();
  });

  test('renders default image if image_url is not provided', () => {
    const boardGameWithoutImage = { ...mockBoardGame, image_url: '' };
    render(
      <MemoryRouter>
        <TableItem boardGame={boardGameWithoutImage} />
      </MemoryRouter>,
    );

    const img = screen.getByAltText('Gloomhaven');
    expect(img).toHaveAttribute('src', '/static/logo512.png');
  });

  test('renders expansion icon if board game is an expansion', () => {
    const expansionBoardGame = { ...mockBoardGame, is_expansion: true };
    render(
      <MemoryRouter>
        <TableItem boardGame={expansionBoardGame} />
      </MemoryRouter>,
    );

    expect(screen.getByTitle('This game is an expansion')).toBeInTheDocument();
  });

  test('renders rating if board game has a rating', () => {
    render(
      <MemoryRouter>
        <TableItem boardGame={mockBoardGame} />
      </MemoryRouter>,
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('renders user icon if board game is added by a user', () => {
    render(
      <MemoryRouter>
        <TableItem boardGame={mockBoardGame} />
      </MemoryRouter>,
    );

    expect(
      screen.getByTitle('This game has been added by user'),
    ).toBeInTheDocument();
  });

  test('renders not accepted icon if board game is not accepted by admin', () => {
    const notAcceptedBoardGame = { ...mockBoardGame, accepted_by_admin: false };
    render(
      <MemoryRouter>
        <TableItem boardGame={notAcceptedBoardGame} />
      </MemoryRouter>,
    );

    expect(screen.getByTitle('Game not yet verified')).toBeInTheDocument();
  });
});
