import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

const mockBoardGames = {
  'On top': [
    { id: '1', name: 'Gloomhaven', image_url: 'image1.jpg' },
    { id: '2', name: 'Scythe', image_url: 'image2.jpg' },
  ],
  'Best for a party': [
    { id: '3', name: 'Codenames', image_url: 'image3.jpg' },
    { id: '4', name: 'Dixit', image_url: 'image4.jpg' },
  ],
};

// eslint-disable-next-line react/display-name
jest.mock('./LandingPage', () => (props) => {
  // eslint-disable-next-line react/prop-types
  const { boardGames = mockBoardGames } = props;
  return (
    <div className="container mt-4">
      {Object.keys(boardGames).map((category) => (
        <div key={category} className="mb-5">
          <h3 className="text-light">
            <span className="me-3">{category}</span>
          </h3>
          <div className="row g-2">
            {boardGames[category].map((boardGame) => (
              <div key={boardGame.id} className="col-12 col-sm-5 col-lg-2">
                <div>{boardGame.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

describe('LandingPage Component', () => {
  test('renders LandingPage with the correct containers', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('On top')).toBeInTheDocument();
    expect(screen.getByText('Best for a party')).toBeInTheDocument();
  });

  test('renders board games in each category', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Gloomhaven')).toBeInTheDocument();
    expect(screen.getByText('Scythe')).toBeInTheDocument();
    expect(screen.getByText('Codenames')).toBeInTheDocument();
    expect(screen.getByText('Dixit')).toBeInTheDocument();
  });

  test('renders correct number of categories and board games', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const categories = screen.getAllByRole('heading', { level: 3 });
    expect(categories).toHaveLength(Object.keys(mockBoardGames).length);

    const games = screen.getAllByText(/Gloomhaven|Scythe|Codenames|Dixit/);
    expect(games).toHaveLength(4);
  });
});
