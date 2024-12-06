import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventTagsModal from './EventTagsModal';
import { CATEGORY_LIST } from '../../../constValues/SearchConstants';

describe('EventTagsModal', () => {
  const mockToggleTagsModal = jest.fn();
  const mockSetGameTags = jest.fn();
  const mockGameTags = [CATEGORY_LIST[0]];

  beforeEach(() => {
    render(
      <EventTagsModal
        toggleTagsModal={mockToggleTagsModal}
        gameTags={mockGameTags}
        setGameTags={mockSetGameTags}
      />,
    );
  });

  test('renders modal with categories', () => {
    expect(screen.getByText('Categories:')).toBeInTheDocument();
    CATEGORY_LIST.forEach((category) => {
      expect(screen.getByLabelText(category)).toBeInTheDocument();
    });
  });

  test('checkboxes reflect gameTags state', () => {
    CATEGORY_LIST.forEach((category) => {
      const checkbox = screen.getByLabelText(category);
      if (mockGameTags.includes(category)) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }
    });
  });

  test('calls setGameTags on checkbox change', () => {
    const category = CATEGORY_LIST[1];
    const checkbox = screen.getByLabelText(category);
    fireEvent.click(checkbox);
    expect(mockSetGameTags).toHaveBeenCalledWith(expect.any(Function));
  });

  test('calls toggleTagsModal on close button click', () => {
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    expect(mockToggleTagsModal).toHaveBeenCalled();
  });
});
