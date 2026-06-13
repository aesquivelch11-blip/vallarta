import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import PropertyCard from '../../../src/components/PropertySelector/PropertyCard';
import type { Property } from '../../../src/types';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
});

afterEach(cleanup);

const mockProperty: Property = {
  id: 'casa-del-sol',
  name: 'Casa del Sol',
  location: 'Marina Vallarta',
  tagline: 'Beachfront estate with private dock',
  occupancyStatus: 'available',
  pricePerNight: 15000,
  propertyType: 'Oceanfront',
  imageUrl: '/test-image.jpg',
  imageWebp: '/test-image.webp',
  images: ['/test-image.jpg'],
};

describe('PropertyCard', () => {
  it('renders property image', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="gallery" />
    );
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders property name as heading', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="gallery" />
    );
    expect(container.textContent).toContain('Casa del Sol');
  });

  it('renders property location', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="gallery" />
    );
    expect(container.textContent).toContain('Marina Vallarta');
  });

  it('does not render property type label', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="gallery" />
    );
    expect(container.textContent).not.toContain('Oceanfront');
    const typeEl = container.querySelector('.ps-card__type');
    expect(typeEl).not.toBeInTheDocument();
  });

  it('does not render tagline', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="gallery" />
    );
    expect(container.textContent).not.toContain('Beachfront estate with private dock');
    const taglineEl = container.querySelector('.ps-card__tagline');
    expect(taglineEl).not.toBeInTheDocument();
  });

  it('renders occupancy status label', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="gallery" />
    );
    expect(container.textContent).toContain('Available');
  });

  it('renders as a button with accessible label', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="gallery" />
    );
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'View Casa del Sol, Marina Vallarta');
  });

  it('handles catalog tier without tall class', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="catalog" />
    );
    const button = container.querySelector('button');
    expect(button).not.toHaveClass('ps-card--tall');
  });

  it('renders with webp source when available', () => {
    const { container } = render(
      <PropertyCard property={mockProperty} onSelect={() => {}} index={0} tier="gallery" />
    );
    const source = container.querySelector('source');
    expect(source).toBeInTheDocument();
    expect(source).toHaveAttribute('type', 'image/webp');
  });
});
