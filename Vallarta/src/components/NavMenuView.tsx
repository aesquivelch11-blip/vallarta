import React, { useRef, useEffect, useState } from 'react';
import { ScreenType } from '../types';
import menuImg1 from '../assets/Menu/menu-1.webp';
import menuImg2 from '../assets/Menu/menu-2.webp';
import menuImg3 from '../assets/Menu/menu-3.webp';
import menuImg4 from '../assets/Menu/menu-4.webp';
import NavImagePanel from './NavMenu/NavImagePanel';
import NavBottomBar from './NavMenu/NavBottomBar';
import NavEditorialTitle from './NavMenu/NavEditorialTitle';

interface NavMenuViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
  previousScreen?: ScreenType;
}

// Static metrics — replace with real data via props when available
const NAV_METRICS: Record<string, string> = {
  estates: '94% · 3 alerts',
  financial: 'MXN 142K · +8%',
  operations: '2 tasks overdue',
  calendar: '3 arrivals',
  properties: '5 properties',
};

const menuItems = [
  {
    id: 'estates',
    label: 'Overview',
    screen: 'reporting' as ScreenType,
    image: menuImg1,
    imageWebp: menuImg1,
    metric: NAV_METRICS.estates,
  },
  {
    id: 'financial',
    label: 'Revenue',
    screen: 'deep_dive' as ScreenType,
    image: menuImg2,
    imageWebp: menuImg2,
    metric: NAV_METRICS.financial,
  },
  {
    id: 'operations',
    label: 'Operations',
    screen: 'camera_expanded' as ScreenType,
    image: menuImg3,
    imageWebp: menuImg3,
    metric: NAV_METRICS.operations,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    screen: 'calendar' as ScreenType,
    image: menuImg4,
    imageWebp: menuImg4,
    metric: NAV_METRICS.calendar,
  },
  {
    id: 'properties',
    label: 'Properties',
    screen: 'property_selector' as ScreenType,
    image: menuImg1,
    imageWebp: menuImg1,
    metric: NAV_METRICS.properties,
  },
];

const initialIndex = (() => {
  const lastId = sessionStorage.getItem('nav-last-panel');
  if (!lastId) return 0;
  const idx = menuItems.findIndex(m => m.id === lastId);
  return idx === -1 ? 0 : idx;
})();

export default function NavMenuView({
  onNavigate,
  onClose,
  previousScreen,
}: NavMenuViewProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Save active panel on change; announce for screen readers
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sessionStorage.setItem('nav-last-panel', menuItems[activeIndex].id);
    setLiveAnnouncement(
      `${menuItems[activeIndex].label}, ${activeIndex + 1} of ${menuItems.length}`,
    );
  }, [activeIndex]);

  // Focus trap + keyboard navigation
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;

    // Focus the active tab on mount
    const focusActiveTab = () => {
      const tabs = dialogRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs?.[activeIndex]?.focus();
    };
    focusActiveTab();

    const focusable = (): HTMLElement[] =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const walk = (dir: -1 | 1) => {
      setActiveIndex(prev => {
        const next = (prev + dir + menuItems.length) % menuItems.length;
        setTimeout(() => {
          const tabs = dialogRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
          tabs?.[next]?.focus();
        }, 0);
        return next;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onCloseRef.current(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); walk(-1); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); walk(1); return; }

      const digit = ['1', '2', '3', '4', '5'].indexOf(e.key);
      if (digit !== -1 && digit < menuItems.length) {
        e.preventDefault();
        setActiveIndex(digit);
        setTimeout(() => {
          const tabs = dialogRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
          tabs?.[digit]?.focus();
        }, 0);
        return;
      }

      if (e.key !== 'Tab') return;
      const els = focusable();
      if (!els.length) return;
      if (e.shiftKey) {
        if (document.activeElement === els[0]) { e.preventDefault(); els[els.length - 1].focus(); }
      } else {
        if (document.activeElement === els[els.length - 1]) { e.preventDefault(); els[0].focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
      prevFocusRef.current?.focus();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabConfirm = (screen: ScreenType, id: string) => {
    if (navTimeoutRef.current) return; // debounce double-tap
    sessionStorage.setItem('nav-last-panel', id);
    navTimeoutRef.current = setTimeout(() => {
      navTimeoutRef.current = null;
      onNavigate(screen, 'push');
    }, 160);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 48) return;
    setActiveIndex(prev =>
      dx < 0
        ? Math.min(prev + 1, menuItems.length - 1)
        : Math.max(prev - 1, 0),
    );
  };

  const handleShellClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      className="relative w-full"
      style={{ minHeight: '100dvh', background: 'var(--nav-shell-bg)', overflow: 'hidden' }}
      onClick={handleShellClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-bleed image with clip-path wipe */}
      <NavImagePanel items={menuItems} activeIndex={activeIndex} />

      {/* Header */}
      <header
        className="nav-header absolute top-0 left-0 right-0 flex items-center justify-between"
        style={{ height: 'var(--nav-header-height)', padding: '0 56px' }}
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

      {/* Screen-reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Film-grain texture overlay */}
      <div className="nav-grain" aria-hidden="true" />

      {/* Editorial section title */}
      <NavEditorialTitle label={menuItems[activeIndex].label} />

      {/* Bottom tab bar */}
      <NavBottomBar
        items={menuItems}
        activeIndex={activeIndex}
        previousScreen={previousScreen}
        onTabChange={setActiveIndex}
        onTabConfirm={handleTabConfirm}
      />
    </div>
  );
}
