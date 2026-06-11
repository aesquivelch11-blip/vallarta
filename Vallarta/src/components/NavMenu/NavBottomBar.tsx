import React from 'react';
import { motion } from 'motion/react';
import { ScreenType } from '../../types';

interface NavBottomItem {
  id: string;
  label: string;
  metric: string;
  screen: ScreenType;
}

interface NavBottomBarProps {
  items: NavBottomItem[];
  activeIndex: number;
  previousScreen?: ScreenType;
  onTabChange: (index: number) => void;
  onTabConfirm: (screen: ScreenType, id: string) => void;
}

export default function NavBottomBar({
  items,
  activeIndex,
  previousScreen,
  onTabChange,
  onTabConfirm,
}: NavBottomBarProps) {
  return (
    <nav
      role="tablist"
      aria-label="Navigation sections"
      className="nav-bottom-bar"
    >
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        const isCurrent = item.screen === previousScreen;

        return (
          <motion.button
            key={item.id}
            role="tab"
            id={`nav-tab-${item.id}`}
            aria-selected={isActive}
            aria-label={`Navigate to ${item.label}`}
            tabIndex={isActive ? 0 : -1}
            className="nav-bottom-tab"
            data-current={isCurrent || undefined}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            onMouseEnter={() => onTabChange(i)}
            onFocus={() => onTabChange(i)}
            onClick={() => onTabConfirm(item.screen, item.id)}
          >
            {/* Active indicator — springs between tabs */}
            {isActive && (
              <motion.div
                layoutId="nav-tab-indicator"
                className="nav-tab-indicator"
                transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              />
            )}

            <span className="nav-tab-label">{item.label}</span>
            <span className="nav-tab-metric">{item.metric}</span>

            {/* "You are here" dot */}
            {isCurrent && (
              <span className="nav-tab-current-dot" aria-hidden="true" />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
