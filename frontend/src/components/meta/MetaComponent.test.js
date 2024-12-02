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
      expect(document.querySelector('link[rel="canonical"]').href).toBe(
        'https://talis.live/',
      );
    });
  });

  test('renders with optional canonical prop', async () => {
    render(
      <HelmetProvider>
        <MetaComponent
          title="Test Title"
          description="Test Description"
          canonical="test-canonical"
        />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.querySelector('link[rel="canonical"]').href).toBe(
        'https://talis.live/test-canonical',
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
      expect(document.querySelector('meta[property="og:url"]').content).toBe(
        'https://talis.live/',
      );
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
