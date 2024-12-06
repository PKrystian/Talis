import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GamePage from './GamePage';

describe('GamePage Component', () => {
  const mockApiPrefix = '/api';
  const mockUser = { id: 1, name: 'John Doe' };

  test('renders GamePage component', () => {
    const { container } = render(
      <GamePage apiPrefix={mockApiPrefix} user={mockUser} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
