import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  test('renders footer content correctly', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    expect(screen.getByText('Board Game Helper')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          content.startsWith('Powered by') &&
          element.tagName.toLowerCase() === 'p',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('This project is part of engineering thesis.'),
    ).toBeInTheDocument();
    expect(screen.getByText(/© 2024 - \d{4} Talis./)).toBeInTheDocument();
    expect(screen.getByText('MIT License')).toBeInTheDocument();
  });

  test('shows "scroll to top" button when scrolled down', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    expect(
      screen.queryByRole('button', { name: /move to top/i }),
    ).not.toBeInTheDocument();

    fireEvent.scroll(window, { target: { pageYOffset: 200 } });

    expect(
      screen.getByRole('button', { name: /move to top/i }),
    ).toBeInTheDocument();
  });

  test('scrolls to top when "scroll to top" button is clicked', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    fireEvent.scroll(window, { target: { pageYOffset: 200 } });

    fireEvent.click(screen.getByRole('button', { name: /move to top/i }));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
