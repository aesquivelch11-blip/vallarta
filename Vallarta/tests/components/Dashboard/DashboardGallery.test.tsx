import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import DashboardGallery from '../../../src/components/Dashboard/DashboardGallery';

afterEach(cleanup);

const testImages = [
  '/test-image-1.jpg',
  '/test-image-2.jpg',
  '/test-image-3.jpg',
];

describe('DashboardGallery', () => {
  it('renders the first image', () => {
    const { container } = render(
      <DashboardGallery images={testImages} propertyId="casa-del-sol" propertyName="Casa del Sol" />
    );
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image-1.jpg');
  });

  it('renders property name in title overlay', () => {
    const { container } = render(
      <DashboardGallery images={testImages} propertyId="casa-del-sol" propertyName="Casa del Sol" />
    );
    expect(container.textContent).toContain('Casa del Sol');
  });

  it('renders image counter when multiple images', () => {
    const { container } = render(
      <DashboardGallery images={testImages} propertyId="casa-del-sol" propertyName="Casa del Sol" />
    );
    expect(container.textContent).toContain('01 / 03');
  });

  it('renders empty state when no images', () => {
    const { container } = render(
      <DashboardGallery images={[]} propertyId="casa-del-sol" propertyName="Casa del Sol" />
    );
    const img = container.querySelector('img');
    expect(img).not.toBeInTheDocument();
  });

  it('renders no counter when single image', () => {
    const { container } = render(
      <DashboardGallery images={['/single.jpg']} propertyId="casa-del-sol" propertyName="Casa del Sol" />
    );
    expect(container.textContent).not.toContain('/');
  });

  it('renders dark mode overlay div', () => {
    const { container } = render(
      <DashboardGallery images={testImages} propertyId="casa-del-sol" propertyName="Casa del Sol" />
    );
    const overlay = container.querySelector('.dark-mode-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('dark mode overlay starts with opacity 0', () => {
    const { container } = render(
      <DashboardGallery images={testImages} propertyId="casa-del-sol" propertyName="Casa del Sol" />
    );
    const overlay = container.querySelector('.dark-mode-overlay') as HTMLElement;
    expect(overlay.style.opacity).toBe('0');
  });
});
