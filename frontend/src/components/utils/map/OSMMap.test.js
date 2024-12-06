import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import OSMMap from './OSMMap';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';

jest.mock('ol/Map', () => {
  return jest.fn().mockImplementation((config) => {
    const view = config.view;
    return {
      setTarget: jest.fn(),
      addLayer: jest.fn(),
      getView: jest.fn().mockReturnValue(view),
    };
  });
});

jest.mock('ol/View', () => {
  return jest.fn().mockImplementation((config) => {
    return {
      center: config.center,
      zoom: config.zoom,
    };
  });
});

describe('OSMMap Component', () => {
  const mockCoordinates = { latitude: 40.7128, longitude: -74.006 };

  test('renders OSMMap component', () => {
    const { container } = render(<OSMMap coordinates={mockCoordinates} />);
    expect(container.firstChild).toHaveStyle('height: 100%');
  });

  test('initializes map with correct coordinates', () => {
    render(<OSMMap coordinates={mockCoordinates} />);
    const mapCalls = Map.mock.calls;

    const expectedView = {
      center: fromLonLat([mockCoordinates.longitude, mockCoordinates.latitude]),
      zoom: 16,
    };

    const hasExpectedView = mapCalls.some((call) => {
      const view = call[0]?.view;
      return (
        view?.center?.[0] === expectedView.center[0] &&
        view?.center?.[1] === expectedView.center[1] &&
        view?.zoom === expectedView.zoom
      );
    });

    expect(hasExpectedView).toBe(true);
  });

  test('adds marker layer to the map', () => {
    const mockAddLayer = jest.fn();
    Map.mockImplementation((config) => {
      const view = config.view;
      return {
        setTarget: jest.fn(),
        addLayer: mockAddLayer,
        getView: jest.fn().mockReturnValue(view),
      };
    });

    render(<OSMMap coordinates={mockCoordinates} />);
    expect(mockAddLayer).toHaveBeenCalled();
  });
});
