import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CollectionPage from './CollectionPage';
import axios from 'axios';

jest.mock('axios');

describe('CollectionPage Component', () => {
  const mockUser = { user_id: 1, name: 'John Doe' };
  const mockCollectionData = {
    wishlist: [
      { id: 1, name: 'Game 1', collection_created_at: '2023-01-01', rating: 4 },
    ],
    library: [
      { id: 2, name: 'Game 2', collection_created_at: '2023-01-02', rating: 5 },
    ],
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: mockCollectionData });
  });

  test('renders CollectionPage component', async () => {
    await act(async () => {
      render(<CollectionPage user={mockUser} isFriendsProfile={false} />);
    });
    expect(screen.getByText('Your wishlist')).toBeInTheDocument();
  });

  test('displays user wishlist', async () => {
    await act(async () => {
      render(<CollectionPage user={mockUser} isFriendsProfile={false} />);
    });
    expect(await screen.findByText('Game 1')).toBeInTheDocument();
  });

  test('displays user library', async () => {
    await act(async () => {
      render(<CollectionPage user={mockUser} isFriendsProfile={false} />);
    });
    fireEvent.click(screen.getByText('Library'));
    expect(await screen.findByText('Game 2')).toBeInTheDocument();
  });

  test('handles wishlist search', async () => {
    await act(async () => {
      render(<CollectionPage user={mockUser} isFriendsProfile={false} />);
    });
    fireEvent.change(
      screen.getByPlaceholderText('Search for a game in wishlist...'),
      {
        target: { value: 'Game 1' },
      },
    );
    expect(await screen.findByText('Game 1')).toBeInTheDocument();
  });

  test('handles library search', async () => {
    await act(async () => {
      render(<CollectionPage user={mockUser} isFriendsProfile={false} />);
    });
    fireEvent.click(screen.getByText('Library'));
    fireEvent.change(
      screen.getByPlaceholderText('Search for a game in library...'),
      {
        target: { value: 'Game 2' },
      },
    );
    expect(await screen.findByText('Game 2')).toBeInTheDocument();
  });

  test('handles wishlist sorting', async () => {
    await act(async () => {
      render(<CollectionPage user={mockUser} isFriendsProfile={false} />);
    });
    fireEvent.change(screen.getByDisplayValue('Newest'), {
      target: { value: 'oldest' },
    });
    expect(await screen.findByText('Game 1')).toBeInTheDocument();
  });

  test('handles library sorting', async () => {
    await act(async () => {
      render(<CollectionPage user={mockUser} isFriendsProfile={false} />);
    });
    fireEvent.click(screen.getByText('Library'));
    fireEvent.change(screen.getByDisplayValue('Newest'), {
      target: { value: 'oldest' },
    });
    expect(await screen.findByText('Game 2')).toBeInTheDocument();
  });
});
