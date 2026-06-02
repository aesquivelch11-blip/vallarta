import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScreenType } from './types';
import LoginView from './components/LoginView';
import NavMenuView from './components/NavMenuView';
import FinancialReportingView from './components/FinancialReportingView';
import FinancialDeepDiveView from './components/FinancialDeepDiveView';
import CameraFeedView from './components/CameraFeedView';
import CalendarView from './components/CalendarView';
import Preloader from './components/Preloader';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [history, setHistory] = useState<ScreenType[]>(['login']);
  const [transitionStyle, setTransitionStyle] = useState<'push' | 'push_back' | 'slide_up' | 'none'>('push');
  const [hasLoaded, setHasLoaded] = useState(false);


  // Custom Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTimeoutId, setToastTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const triggerToast = (message: string) => {
    // Clear previous timeout if any
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    setToastMessage(message);
    setToastVisible(true);
    
    const id = setTimeout(() => {
      setToastVisible(false);
    }, 4000);
    setToastTimeoutId(id);
  };

  const handleNavigate = (nextScreen: ScreenType, transition: 'push' | 'push_back' | 'slide_up') => {
    setTransitionStyle(transition);
    
    // Add to history
    setHistory(prev => {
      // Avoid infinitely expanding identical lookups
      if (prev[prev.length - 1] === nextScreen) return prev;
      return [...prev, nextScreen];
    });

    setCurrentScreen(nextScreen);
  };

  const handleSignIn = () => {
    setTransitionStyle('push');
    setHistory(['login', 'nav_menu']);
    setCurrentScreen('nav_menu');
  };

  const handleCloseNavMenu = () => {
    setTransitionStyle('push_back');
    // Go to last history screen that isn't nav_menu or login
    const validHistory = history.filter(s => s !== 'nav_menu' && s !== 'login');
    const destination = validHistory.length > 0 ? validHistory[validHistory.length - 1] : 'reporting';
    
    // Reset history stack
    setHistory(['login', destination]);
    setCurrentScreen(destination);
  };

  // Select sliding variants based on requested spec transition styles
  const getVariants = () => {
    switch (transitionStyle) {
      case 'push':
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 },
        };
      case 'push_back':
        return {
          initial: { x: '-100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100%', opacity: 0 },
        };
      case 'slide_up':
        return {
          initial: { y: '100%', opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '-100%', opacity: 0 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <div key="login" className="w-full min-h-screen relative bg-[#0c0c0c]">
            <AnimatePresence mode="wait">
              {!hasLoaded ? (
                <motion.div
                  key="preloader"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 z-50"
                >
                  <Preloader onComplete={() => setHasLoaded(true)} />
                </motion.div>
              ) : (
                <motion.div
                  key="login-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full min-h-screen"
                >
                  <LoginView onSignIn={handleSignIn} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'nav_menu':
        return (
          <div key="nav_menu" className="w-full min-h-screen">
            <NavMenuView 
              onNavigate={(screen, style) => handleNavigate(screen, style)} 
              onClose={handleCloseNavMenu} 
              onNotify={triggerToast}
            />
          </div>
        );
      case 'reporting':
        return (
          <div key="reporting" className="w-full min-h-screen">
            <FinancialReportingView 
              onNavigate={(screen, style) => handleNavigate(screen, style)} 
              onNotify={triggerToast}
            />
          </div>
        );
      case 'deep_dive':
        return (
          <div key="deep_dive" className="w-full min-h-screen">
            <FinancialDeepDiveView 
              onNavigate={(screen, style) => handleNavigate(screen, style)} 
              onNotify={triggerToast}
            />
          </div>
        );
      case 'camera_expanded':
        return (
          <div key="camera_expanded" className="w-full min-h-screen">
            <CameraFeedView 
              onNavigate={(screen, style) => handleNavigate(screen, style)} 
              onNotify={triggerToast}
            />
          </div>
        );
      case 'calendar':
        return (
          <div key="calendar" className="w-full min-h-screen">
            <CalendarView 
              onNavigate={(screen, style) => handleNavigate(screen, style)} 
              onNotify={triggerToast}
            />
          </div>
        );
      default:
        return (
          <div key="default" className="w-full min-h-screen flex items-center justify-center bg-transparent">
            <p className="text-[#242424]/50 font-serif">Awaiting Authentication.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-[#242424] select-none overflow-x-hidden antialiased relative" id="app-viewport">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentScreen}
          variants={getVariants()}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full min-h-screen"
        >
          {renderActiveScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Luxury Estate Toast Banner */}
      <AnimatePresence>
        {toastVisible && toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 left-6 right-6 md:left-auto md:right-8 md:w-96 bg-[#242424] border border-[#C9B8A0]/30 p-5 shadow-2xl z-[9999] flex items-start gap-4 rounded-[2rem]"
            id="global-toast-notification"
          >
            <div className="w-2 h-2 rounded-full bg-[#C9B8A0] mt-1.5 animate-pulse shrink-0" />
            <div className="flex-grow">
              <span className="text-[10px] tracking-[0.25em] font-medium text-[#C9B8A0]/80 block uppercase mb-1 font-sans">
                Estate Concierge Bulletin
              </span>
              <p className="text-[#F5F1E8] text-xs font-light leading-relaxed tracking-wide font-sans">
                {toastMessage}
              </p>
            </div>
            <button 
              onClick={() => setToastVisible(false)}
              className="text-neutral-400 hover:text-white p-1 text-xs shrink-0 cursor-pointer font-bold leading-none"
              id="close-toast-btn"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
