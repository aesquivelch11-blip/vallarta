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

interface MenuItem {
  id: string; label: string; subtitle: string; screen: ScreenType;
  index: string; image: string; imageWebp: string;
}

const menuItems: MenuItem[] = [
  { id: 'estates',    label: 'The Estates', subtitle: 'At a glance',        screen: 'reporting',       index: '01', image: menuImg1, imageWebp: menuImg1Webp },
  { id: 'financial',  label: 'Revenue',     subtitle: 'This month',         screen: 'deep_dive',       index: '02', image: menuImg2, imageWebp: menuImg2Webp },
  { id: 'operations', label: 'The Property', subtitle: 'Cameras & systems', screen: 'camera_expanded', index: '03', image: menuImg3, imageWebp: menuImg3Webp },
  { id: 'calendar',   label: 'Calendar',    subtitle: 'Who\'s arriving',    screen: 'calendar',        index: '04', image: menuImg4, imageWebp: menuImg4Webp },
];

const ChevronLeft = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
    <path d="M8 1L2 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
    <path d="M2 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function NavMenuView({ onNavigate, onClose }: NavMenuViewProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const lastPanelId = sessionStorage.getItem('nav-last-panel');
  const initialIndex = (() => {
    if (lastPanelId) {
      const idx = menuItems.findIndex((item) => item.id === lastPanelId);
      return idx === -1 ? 0 : idx;
    }
    return 0;
  })();

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const hasAnimated = useRef(sessionStorage.getItem('nav-anim') === '1');
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);

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

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        walk(-1);
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        walk(1);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const current = menuItems[activeIndexRef.current];
        handlePanelClick(current.screen, current.id);
        return;
      }

      const panelKeys = ['1', '2', '3', '4'];
      const keyIndex = panelKeys.indexOf(e.key);
      if (keyIndex !== -1 && keyIndex < menuItems.length) {
        e.preventDefault();
        handlePanelClick(menuItems[keyIndex].screen, menuItems[keyIndex].id);
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

  useEffect(() => {
    const timer = setTimeout(() => sessionStorage.setItem('nav-anim', '1'), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handlePanelClick = (screen: ScreenType, id: string) => {
    if (selectedPanel) return;
    setSelectedPanel(id);
    setTimeout(() => {
      onNavigate(screen, 'push');
    }, 180);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      walk(deltaX > 0 ? -1 : 1);
      return;
    }

    if (deltaY > 80) {
      onClose();
    }
  };

  const handleShellClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const walk = (direction: -1 | 1) => {
    setActiveIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return menuItems.length - 1;
      if (next >= menuItems.length) return 0;
      return next;
    });
  };

  const goToPanel = (index: number) => {
    if (index >= 0 && index < menuItems.length) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    sessionStorage.setItem('nav-last-panel', menuItems[activeIndex].id);
  }, [activeIndex]);

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
        <span className="nav-portal__wordmark">Vallarta Estates</span>

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

      {/* ── Passageway ── */}
      <div
        className={`nav-portal-grid ${hasAnimated.current ? 'nav-portal-grid--snappy' : 'nav-portal-grid--cinematic'} absolute inset-0 flex flex-row`}
      >
        {(() => {
          const active = menuItems[activeIndex];
          const prevItem = menuItems[(activeIndex - 1 + menuItems.length) % menuItems.length];
          const nextItem = menuItems[(activeIndex + 1) % menuItems.length];

          return (
            <>
              {/* Left edge indicator — walk to previous room */}
              <button
                className="nav-portal__edge nav-portal__edge--left"
                aria-label={`Navigate to ${prevItem.label}`}
                onClick={() => handlePanelClick(prevItem.screen, prevItem.id)}
                tabIndex={0}
              >
                <span className="nav-portal__edge-chevron"><ChevronLeft /></span>
                <span className="nav-portal__edge-label">{prevItem.label}</span>
              </button>

              {/* Active panel — full-bleed */}
              <div
                key={active.id}
                className={`nav-panel nav-panel--active relative h-full overflow-hidden outline-none ${selectedPanel === active.id ? 'nav-panel--selected' : ''}`}
              >
                {/* Image skeleton fallback */}
                <div
                  className={`nav-portal__img-skeleton ${loadedImages[active.id] ? 'nav-portal__img-skeleton--hidden' : ''}`}
                  aria-hidden="true"
                />

                {/* Full-bleed photo */}
                <picture aria-hidden="true">
                  <source srcSet={active.imageWebp} type="image/webp" />
                  <img
                    src={active.image}
                    alt=""
                    className={`nav-portal__img ${loadedImages[active.id] ? 'nav-portal__img--loaded' : ''}`}
                    onLoad={() => handleImageLoad(active.id)}
                  />
                </picture>

                {/* Dark vignette — top and bottom */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    zIndex: 2,
                    background: 'linear-gradient(to bottom, var(--nav-scrim-top) 0%, transparent 20%), linear-gradient(to top, var(--nav-scrim-heavy) 0%, var(--nav-scrim-mid) 36%, var(--nav-scrim-light) 65%, transparent 100%)',
                  }}
                />

                {/* Gold bottom sweep line */}
                <div className="nav-portal-line" />

                {/* Full-panel click target */}
                <button
                  className="nav-panel__button"
                  onClick={() => handlePanelClick(active.screen, active.id)}
                  aria-label={`Navigate to ${active.label}`}
                />

                {/* Bottom-anchored content */}
                <div className="nav-portal-content">
                  <span className="nav-portal__index">{active.index}</span>
                  <span className="nav-portal__label">{active.label}</span>
                  <span className="nav-panel__subtitle">{active.subtitle}</span>
                </div>

                {/* Pagination dots */}
                <div className="nav-portal__pagination" role="tablist" aria-label="Sections">
                  {menuItems.map((item, i) => (
                    <button
                      key={item.id}
                      role="tab"
                      aria-selected={i === activeIndex}
                      aria-label={item.label}
                      className={`nav-portal__dot ${i === activeIndex ? 'nav-portal__dot--active' : ''}`}
                      onClick={() => handlePanelClick(item.screen, item.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Right edge indicator — walk to next room */}
              <button
                className="nav-portal__edge nav-portal__edge--right"
                aria-label={`Navigate to ${nextItem.label}`}
                onClick={() => handlePanelClick(nextItem.screen, nextItem.id)}
                tabIndex={0}
              >
                <span className="nav-portal__edge-label">{nextItem.label}</span>
                <span className="nav-portal__edge-chevron"><ChevronRight /></span>
              </button>
            </>
          );
        })()}
      </div>
    </div>
  );
}
