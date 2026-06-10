import { render, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DarkModeToggle from '../../../src/components/Dashboard/DarkModeToggle';

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('DarkModeToggle', () => {
  it('renders a toggle button with aria-label', () => {
    const { container } = render(<DarkModeToggle />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
  });

  it('renders Moon icon in light mode (action target)', () => {
    const { container } = render(<DarkModeToggle />);
    const svg = container.querySelector('.lucide-moon');
    expect(svg).toBeInTheDocument();
  });

  it('renders Sun icon after clicking toggle (switch to dark)', () => {
    const { container } = render(<DarkModeToggle />);
    const button = container.querySelector('button')!;
    fireEvent.click(button);
    const svg = container.querySelector('.lucide-sun');
    expect(svg).toBeInTheDocument();
  });

  it('sets data-theme="dark" on html after toggle', () => {
    render(<DarkModeToggle />);
    const button = document.querySelector('button')!;
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('sets data-theme="light" after toggling twice', () => {
    render(<DarkModeToggle />);
    const button = document.querySelector('button')!;
    fireEvent.click(button);
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('persists dark preference to localStorage', () => {
    render(<DarkModeToggle />);
    const button = document.querySelector('button')!;
    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('restores dark mode from localStorage (shows Sun to switch back)', () => {
    localStorage.setItem('theme', 'dark');
    const { container } = render(<DarkModeToggle />);
    const svg = container.querySelector('.lucide-sun');
    expect(svg).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('has dashboard-focus class for accessibility', () => {
    const { container } = render(<DarkModeToggle />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('dashboard-focus');
  });

  it('toggles between moon and sun icons when clicked (action target)', () => {
    const { container } = render(<DarkModeToggle />);
    const button = container.querySelector('button')!;
    expect(container.querySelector('.lucide-moon')).toBeInTheDocument();
    expect(container.querySelector('.lucide-sun')).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(container.querySelector('.lucide-sun')).toBeInTheDocument();
    expect(container.querySelector('.lucide-moon')).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(container.querySelector('.lucide-moon')).toBeInTheDocument();
    expect(container.querySelector('.lucide-sun')).not.toBeInTheDocument();
  });
});
