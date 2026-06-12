import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import NavEditorialTitle from '../../src/components/NavMenu/NavEditorialTitle';

afterEach(() => {
  cleanup();
});

describe('NavEditorialTitle', () => {
  it('renders the label text', () => {
    const { container } = render(<NavEditorialTitle label="Revenue" />);
    expect(container.textContent).toContain('Revenue');
  });

  it('renders the nav-editorial-heading with nav-title-entered class', () => {
    const { container } = render(<NavEditorialTitle label="Revenue" />);
    const heading = container.querySelector('.nav-editorial-heading');
    expect(heading).not.toBeNull();
    expect(heading?.classList.contains('nav-title-entered')).toBe(true);
  });

  it('updates label text on rerender', () => {
    const { container, rerender } = render(
      <NavEditorialTitle label="Revenue" direction="next" />
    );
    rerender(<NavEditorialTitle label="Operations" direction="next" />);
    expect(container.textContent).toContain('Operations');
  });

  it('passes data-direction to wrapper', () => {
    const { container } = render(<NavEditorialTitle label="Revenue" direction="prev" />);
    const wrapper = container.querySelector('.nav-editorial-title');
    expect(wrapper?.getAttribute('data-direction')).toBe('prev');
  });

  it('does not apply filter:blur', () => {
    const { container } = render(<NavEditorialTitle label="Revenue" />);
    const heading = container.querySelector('.nav-editorial-heading');
    const style = window.getComputedStyle(heading!);
    expect(style.filter).not.toContain('blur');
  });
});
