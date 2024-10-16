import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

const mockBoardGames = {
  'Based on your games': [
    { id: '1', name: 'Brass: Birmingham', image_url: 'image1.jpg' },
    { id: '2', name: 'Brass: Lancashire', image_url: 'image2.jpg' },
  ],
  Wishlist: [
    { id: '3', name: 'Agricola', image_url: 'image3.jpg' },
    { id: '4', name: 'Catan', image_url: 'image4.jpg' },
  ],
  'On top recently': [
    { id: '5', name: 'Gloomhaven', image_url: 'image5.jpg' },
    { id: '6', name: 'Scythe', image_url: 'image6.jpg' },
  ],
  'Best for a party': [
    { id: '7', name: 'Codenames', image_url: 'image7.jpg' },
    { id: '8', name: 'Dixit', image_url: 'image8.jpg' },
  ],
  'Best ice breaker': [
    { id: '9', name: 'The Resistance', image_url: 'image9.jpg' },
    { id: '10', name: 'One Night Ultimate Werewolf', image_url: 'image10.jpg' },
  ],
};

const categoriesNumber = 5;
const imagesNumber = 10;

describe('landingPage Component', () => {
  test('Renders landingPage with the correct container', () => {
    render(
      <MemoryRouter>
        <LandingPage boardGames={mockBoardGames} />
      </MemoryRouter>,
    );

    const container = screen.getByText('Based on your games');
    expect(container).toBeInTheDocument();
  });

  test('renders categories with icons and titles', () => {
    render(
      <MemoryRouter>
        <LandingPage boardGames={mockBoardGames} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Based on your games')).toBeInTheDocument();
    expect(screen.getByText('Wishlist')).toBeInTheDocument();
    expect(screen.getByText('On top recently')).toBeInTheDocument();
    expect(screen.getByText('Best for a party')).toBeInTheDocument();
    expect(screen.getByText('Best ice breaker')).toBeInTheDocument();

    expect(
      screen.getAllByRole('heading', { level: categoriesNumber }),
    ).toHaveLength(categoriesNumber * 2);
  });

  test('renders board games in each category', () => {
    render(
      <MemoryRouter>
        <LandingPage boardGames={mockBoardGames} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Brass: Birmingham')).toBeInTheDocument();
    expect(screen.getByText('Brass: Lancashire')).toBeInTheDocument();
    expect(screen.getByText('Agricola')).toBeInTheDocument();
    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText('Gloomhaven')).toBeInTheDocument();
    expect(screen.getByText('Scythe')).toBeInTheDocument();
    expect(screen.getByText('Codenames')).toBeInTheDocument();
    expect(screen.getByText('Dixit')).toBeInTheDocument();
    expect(screen.getByText('The Resistance')).toBeInTheDocument();
    expect(screen.getByText('One Night Ultimate Werewolf')).toBeInTheDocument();

    expect(screen.getAllByRole('img')).toHaveLength(imagesNumber);
  });
});
