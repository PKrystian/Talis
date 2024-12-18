import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';
import MetaComponent from './MetaComponent';

describe('MetaComponent', () => {
  test('renders with required props', async () => {
    render(
      <HelmetProvider>
        <MetaComponent title="Test Title" description="Test Description" />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Test Title');
      expect(document.querySelector('meta[name="description"]').content).toBe(
        'Test Description',
      );
    });
  });

  test('renders Open Graph meta tags', async () => {
    render(
      <HelmetProvider>
        <MetaComponent title="Test Title" description="Test Description" />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.querySelector('meta[property="og:title"]').content).toBe(
        'Test Title',
      );
      expect(
        document.querySelector('meta[property="og:description"]').content,
      ).toBe('Test Description');
    });
  });

  test('renders Twitter meta tags', async () => {
    render(
      <HelmetProvider>
        <MetaComponent title="Test Title" description="Test Description" />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.querySelector('meta[name="twitter:title"]').content).toBe(
        'Test Title',
      );
      expect(
        document.querySelector('meta[name="twitter:description"]').content,
      ).toBe('Test Description');
    });
  });
});
