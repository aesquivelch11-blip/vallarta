import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusAccent from '../../../src/components/PropertySelector/StatusAccent';

describe('StatusAccent', () => {
  it('renders with correct status class for available', () => {
    const { container } = render(<StatusAccent status="available" />);
    const accent = container.firstChild as HTMLElement;
    expect(accent).toHaveClass('ps-status-accent--available');
  });

  it('renders with correct status class for occupied', () => {
    const { container } = render(<StatusAccent status="occupied" />);
    const accent = container.firstChild as HTMLElement;
    expect(accent).toHaveClass('ps-status-accent--occupied');
  });

  it('renders with correct status class for maintenance', () => {
    const { container } = render(<StatusAccent status="maintenance" />);
    const accent = container.firstChild as HTMLElement;
    expect(accent).toHaveClass('ps-status-accent--maintenance');
  });

  it('renders with correct status class for reserved', () => {
    const { container } = render(<StatusAccent status="reserved" />);
    const accent = container.firstChild as HTMLElement;
    expect(accent).toHaveClass('ps-status-accent--reserved');
  });
});
