import React, { useRef, useEffect, useState } from "react";
import { ScreenType } from "../types";
import menuImg1 from "../assets/Menu/menu-1.jpg";
import menuImg1Webp from "../assets/Menu/menu-1.webp";
import menuImg2 from "../assets/Menu/menu-2.jpg";
import menuImg2Webp from "../assets/Menu/menu-2.webp";
import menuImg3 from "../assets/Menu/menu-3.jpg";
import menuImg3Webp from "../assets/Menu/menu-3.webp";
import menuImg4 from "../assets/Menu/menu-4.jpg";
import menuImg4Webp from "../assets/Menu/menu-4.webp";
import { motion, AnimatePresence } from "motion/react";

interface NavMenuViewProps {
  onNavigate: (
    screen: ScreenType,
    transitionStyle: "push" | "slide_up",
  ) => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  screen: ScreenType;
  index: string;
  image: string;
  imageWebp: string;
}

const menuItems: MenuItem[] = [
  {
    id: "estates",
    label: "The Estates",
    subtitle: "At a glance",
    screen: "reporting",
    index: "01",
    image: menuImg1,
    imageWebp: menuImg1Webp,
  },
  {
    id: "financial",
    label: "Revenue",
    subtitle: "This month",
    screen: "deep_dive",
    index: "02",
    image: menuImg2,
    imageWebp: menuImg2Webp,
  },
  {
    id: "operations",
    label: "The Property",
    subtitle: "Cameras & systems",
    screen: "camera_expanded",
    index: "03",
    image: menuImg3,
    imageWebp: menuImg3Webp,
  },
  {
    id: "calendar",
    label: "Calendar",
    subtitle: "Who's arriving",
    screen: "calendar",
    index: "04",
    image: menuImg4,
    imageWebp: menuImg4Webp,
  },
];

// ── Framer Motion variants ──

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const panelEntranceVariants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  show: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function NavMenuView({ onNavigate, onClose }: NavMenuViewProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPanelId = sessionStorage.getItem("nav-last-panel");
  const initialIndex = (() => {
    if (lastPanelId) {
      const idx = menuItems.findIndex((item) => item.id === lastPanelId);
      return idx === -1 ? 0 : idx;
    }
    return 0;
  })();

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;

    const focusable = (): HTMLElement[] =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        walk(-1);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        walk(1);
        return;
      }

      const panelKeys = ["1", "2", "3", "4"];
      const keyIndex = panelKeys.indexOf(e.key);
      if (keyIndex !== -1 && keyIndex < menuItems.length) {
        e.preventDefault();
        setActiveIndex(keyIndex);
        return;
      }

      if (e.key !== "Tab") return;
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

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
      previousFocusRef.current?.focus();
    };
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handlePanelClick = (screen: ScreenType, id: string) => {
    if (selectedPanel) return;
    setSelectedPanel(id);
    navTimeoutRef.current = setTimeout(() => {
      onNavigate(screen, "push");
    }, 180);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      if (Math.abs(deltaY) > 50) {
        walk(deltaY < 0 ? 1 : -1);
      }
      return;
    }

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

  useEffect(() => {
    sessionStorage.setItem("nav-last-panel", menuItems[activeIndex].id);
  }, [activeIndex]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      className="relative w-full h-[100dvh] overflow-hidden"
      style={{ background: "var(--nav-shell-bg)" }}
      onClick={handleShellClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Header ── */}
      <header
        className="nav-header absolute top-0 left-0 right-0 z-[100] flex items-center justify-between"
        style={{
          height: "var(--nav-header-height)",
          padding: "0 44px",
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
            <line
              x1="1"
              y1="1"
              x2="10"
              y2="10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="10"
              y1="1"
              x2="1"
              y2="10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {/* ── Panel grid ── */}
      <motion.div
        className="nav-portal-grid absolute inset-0 flex flex-row"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {menuItems.map((item, i) => (
          <motion.div
            key={item.id}
            variants={panelEntranceVariants}
            style={{ originX: 0 }}
            className={`nav-panel ${i === activeIndex ? "nav-panel--active" : "nav-panel--collapsed"} relative h-full overflow-hidden${selectedPanel === item.id ? " nav-panel--selected" : ""}`}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <button
              type="button"
              className="nav-panel__preview"
              aria-label={i === activeIndex ? `Selected ${item.label}` : `Preview ${item.label}`}
              aria-pressed={i === activeIndex}
              onFocus={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
            />

            <div
              className={`nav-portal__img-skeleton ${loadedImages[item.id] ? "nav-portal__img-skeleton--hidden" : ""}`}
              aria-hidden="true"
            />

            <picture aria-hidden="true">
              <source srcSet={item.imageWebp} type="image/webp" />
              <img
                src={item.image}
                alt=""
                className={`nav-portal__img ${loadedImages[item.id] ? "nav-portal__img--loaded" : ""}`}
                onLoad={() => handleImageLoad(item.id)}
              />
            </picture>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 2,
                background:
                  "linear-gradient(to bottom, var(--nav-scrim-top) 0%, transparent 20%), linear-gradient(to top, var(--nav-scrim-heavy) 0%, var(--nav-scrim-mid) 36%, var(--nav-scrim-light) 65%, transparent 100%)",
              }}
            />

            <div className="nav-portal-line" />

            <AnimatePresence mode="wait">
              {i === activeIndex ? (
                <motion.div
                  key="active"
                  className="nav-portal-content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.18,
                    ease: [0.16, 1, 0.3, 1],
                    exit: { duration: 0.3, delay: 0 },
                  }}
                >
                  <span className="nav-panel__status">Selected</span>
                  <span className="nav-portal__index">{item.index}</span>
                  <span className="nav-portal__label">{item.label}</span>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.38, duration: 0.3 }}
                    style={{ lineHeight: 1 }}
                  >
                    <span className="nav-panel-cta-arrow" aria-hidden="true">
                      →
                    </span>
                  </motion.div>
                  <button
                    type="button"
                    className="nav-panel__cta"
                    aria-label={`Open ${item.label}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePanelClick(item.screen, item.id);
                    }}
                  >
                    Open {item.label}
                  </button>
                  <span className="nav-panel__subtitle">{item.subtitle}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  className="nav-panel-collapsed-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
