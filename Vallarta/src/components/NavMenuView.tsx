import React, { useRef, useEffect, useState } from 'react';
import { ScreenType } from '../types';
import menuImg1 from '../assets/Menu/menu-1.jpg';
import menuImg1Webp from '../assets/Menu/menu-1.webp';
import menuImg2 from '../assets/Menu/menu-2.jpg';
import menuImg2Webp from '../assets/Menu/menu-2.webp';
import menuImg3 from '../assets/Menu/menu-3.jpg';
import menuImg3Webp from '../assets/Menu/menu-3.webp';
import menuImg4 from '../assets/Menu/menu-4.jpg';
import menuImg4Webp from '../assets/Menu/menu-4.webp';

interface NavMenuViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

const menuItems = [
  { id: 'estates',    label: 'The Estates', subtitle: 'At a glance',        screen: 'reporting'       as ScreenType, index: '01', image: menuImg1, imageWebp: menuImg1Webp },
  { id: 'financial',  label: 'Revenue',     subtitle: 'This month',         screen: 'deep_dive'       as ScreenType, index: '02', image: menuImg2, imageWebp: menuImg2Webp },
  { id: 'operations', label: 'The Property', subtitle: 'Cameras & systems', screen: 'camera_expanded' as ScreenType, index: '03', image: menuImg3, imageWebp: menuImg3Webp },
  { id: 'calendar',   label: 'Calendar',    subtitle: 'Who\'s arriving',    screen: 'calendar'        as ScreenType, index: '04', image: menuImg4, imageWebp: menuImg4Webp },
];

export default function NavMenuView({ onNavigate, onClose }: NavMenuViewProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchStartY = useRef(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;

    const focusable = (): HTMLElement[] =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    focusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      const panelKeys = ['1', '2', '3', '4'];
      const keyIndex = panelKeys.indexOf(e.key);
      if (keyIndex !== -1 && keyIndex < menuItems.length) {
        e.preventDefault();
        onNavigate(menuItems[keyIndex].screen, 'push');
        return;
      }

      if (e.key !== 'Tab') return;
      const els = focusable();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 80) {
      onClose();
    }
  };

  const handleShellClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      className="relative w-full h-[100dvh] overflow-hidden"
      style={{ background: 'var(--nav-shell-bg)' }}
      onClick={handleShellClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Header ── */}
      <header
        className="nav-header absolute top-0 left-0 right-0 z-[100] flex items-center justify-between"
        style={{
          height: 'var(--nav-header-height)',
          padding: '0 44px',
        }}
      >
        <span className="nav-card__wordmark">Vallarta Estates</span>

        <button
          aria-label="Close menu"
          onClick={onClose}
          className="nav-close-btn"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="1" y1="1" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="1" x2="1" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* ── 4-panel grid ── */}
      <div className="nav-card-grid absolute inset-0 flex flex-row">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="nav-panel relative h-full overflow-hidden outline-none"
          >
            {/* Image skeleton fallback */}
            <div
              className={`nav-card__img-skeleton ${loadedImages[item.id] ? 'nav-card__img-skeleton--hidden' : ''}`}
              aria-hidden="true"
            />

            {/* Full-bleed photo */}
            <picture aria-hidden="true">
              <source srcSet={item.imageWebp} type="image/webp" />
              <img
                src={item.image}
                alt=""
                className={`nav-card__img ${loadedImages[item.id] ? 'nav-card__img--loaded' : ''}`}
                onLoad={() => handleImageLoad(item.id)}
              />
            </picture>

            {/* Dark vignette — top and bottom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 2,
                background: `
                  linear-gradient(to bottom, var(--nav-scrim-top) 0%, transparent 20%),
                  linear-gradient(to top, var(--nav-scrim-heavy) 0%, var(--nav-scrim-mid) 36%, var(--nav-scrim-light) 65%, transparent 100%)
                `,
              }}
            />

            {/* Veil — dims on sibling hover */}
            <div className="nav-card-veil" />

            {/* Gold bottom sweep line */}
            <div className="nav-card-line" />

            {/* Full-panel click target */}
            <button
              className="absolute inset-0 w-full h-full bg-transparent border-none outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
              style={{ zIndex: 5 }}
              onClick={() => onNavigate(item.screen, 'push')}
              aria-label={`Navigate to ${item.label}`}
              tabIndex={0}
            />

            {/* Bottom-anchored content */}
            <div className="nav-card-content">
              <span className="nav-card__index">
                {item.index}
              </span>

              <span className="nav-card__label">
                {item.label}
              </span>

              <span className="nav-panel__subtitle">
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
