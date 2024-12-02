import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteEventModal from './DeleteEventModal';

describe('DeleteEventModal Component', () => {
  const mockToggleDeleteEventModal = jest.fn();
  const mockHandleDeleteEvent = jest.fn();
  const mockEventId = { id: 1 };

  test('renders modal with correct text', () => {
    render(
      <DeleteEventModal
        toggleDeleteEventModal={mockToggleDeleteEventModal}
        handleDeleteEvent={mockHandleDeleteEvent}
        event_id={mockEventId}
      />,
    );

    expect(
      screen.getByText('Are you sure you want to delete this event?'),
    ).toBeInTheDocument();
    expect(screen.getByText('Go back')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('calls toggleDeleteEventModal when "Go back" button is clicked', () => {
    render(
      <DeleteEventModal
        toggleDeleteEventModal={mockToggleDeleteEventModal}
        handleDeleteEvent={mockHandleDeleteEvent}
        event_id={mockEventId}
      />,
    );

    fireEvent.click(screen.getByText('Go back'));
    expect(mockToggleDeleteEventModal).toHaveBeenCalled();
  });

  test('calls handleDeleteEvent when "Delete" button is clicked', () => {
    render(
      <DeleteEventModal
        toggleDeleteEventModal={mockToggleDeleteEventModal}
        handleDeleteEvent={mockHandleDeleteEvent}
        event_id={mockEventId}
      />,
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockHandleDeleteEvent).toHaveBeenCalled();
  });
});
