import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import NavImagePanel from '../../src/components/NavMenu/NavImagePanel';

const mockItems = [
  { id: 'financial', image: '/img/revenue.jpg', imageWebp: '/img/revenue.webp', label: 'Revenue' },
  { id: 'operations', image: '/img/ops.jpg', imageWebp: '/img/ops.webp', label: 'Operations' },
  { id: 'calendar', image: '/img/cal.jpg', imageWebp: '/img/cal.webp', label: 'Calendar' },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('NavImagePanel', () => {
  it('renders the image matching activeIndex', () => {
    render(<NavImagePanel items={mockItems} activeIndex={1} />);
    const imgs = document.querySelectorAll('img');
    const visibleImgs = Array.from(imgs).filter(img => img.getAttribute('aria-hidden') !== 'true');
    expect(visibleImgs.length).toBeGreaterThanOrEqual(1);
    const mainImg = visibleImgs[0] as HTMLImageElement;
    expect(mainImg.src).toContain('/img/ops.jpg');
  });

  it('renders a loading skeleton', () => {
    const { container } = render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const skeleton = container.querySelector('.nav-img-skeleton');
    expect(skeleton).not.toBeNull();
    expect(skeleton?.classList.contains('hidden')).toBe(false);
  });

  it('hides the skeleton once the active image fires onLoad', () => {
    const { container } = render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const imgs = document.querySelectorAll('img');
    const mainImg = Array.from(imgs).find(img => img.getAttribute('aria-hidden') !== 'true')!;
    fireEvent.load(mainImg);
    const skeleton = container.querySelector('.nav-img-skeleton');
    expect(skeleton?.classList.contains('hidden')).toBe(true);
    expect(mainImg.className).toContain('loaded');
  });

  it('renders invisible preload images for inactive items', () => {
    render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const imgs = document.querySelectorAll('img');
    const hiddenImgs = Array.from(imgs).filter(img => img.style.opacity === '0');
    expect(hiddenImgs.length).toBe(2);
  });

  it('applies cinematic-grade class to the main image', () => {
    render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const imgs = document.querySelectorAll('img');
    const mainImg = Array.from(imgs).find(img => img.getAttribute('aria-hidden') !== 'true')!;
    expect(mainImg.className).toContain('cinematic-grade');
  });
});

describe('NavImagePanel — clip-path transitions', () => {
  it('applies data-direction="next" when activeIndex increases', () => {
    const { container, rerender } = render(
      <NavImagePanel items={mockItems} activeIndex={0} direction="next" />
    );
    rerender(<NavImagePanel items={mockItems} activeIndex={1} direction="next" />);
    const layers = container.querySelectorAll('.nav-image-layer');
    const entering = Array.from(layers).find(l => l.classList.contains('nav-image-entering'));
    expect(entering).not.toBeNull();
    expect(entering?.getAttribute('data-direction')).toBe('next');
  });

  it('applies data-direction="prev" when activeIndex decreases', () => {
    const { container, rerender } = render(
      <NavImagePanel items={mockItems} activeIndex={1} direction="prev" />
    );
    rerender(<NavImagePanel items={mockItems} activeIndex={0} direction="prev" />);
    const layers = container.querySelectorAll('.nav-image-layer');
    const entering = Array.from(layers).find(l => l.classList.contains('nav-image-entering'));
    expect(entering).not.toBeNull();
    expect(entering?.getAttribute('data-direction')).toBe('prev');
  });

  it('does not apply filter:blur to any image layer', () => {
    const { container } = render(<NavImagePanel items={mockItems} activeIndex={0} />);
    const layers = container.querySelectorAll('.nav-image-layer');
    layers.forEach(layer => {
      const style = window.getComputedStyle(layer);
      expect(style.filter).not.toContain('blur');
    });
  });

  it('has transition property on exiting layers', () => {
    const { container, rerender } = render(
      <NavImagePanel items={mockItems} activeIndex={0} direction="next" />
    );
    rerender(<NavImagePanel items={mockItems} activeIndex={1} direction="next" />);
    const layers = container.querySelectorAll('.nav-image-layer');
    const exiting = Array.from(layers).find(l => l.classList.contains('nav-image-exiting'));
    if (exiting) {
      const style = window.getComputedStyle(exiting);
      expect(style.transition).not.toBe('');
      expect(style.transition).not.toBe('all 0s ease 0s');
    }
  });
});
